const { GoogleGenAI, Type } = require('@google/genai');
const Note = require('../models/Note');
const Roadmap = require('../models/Roadmap');
const Doubt = require('../models/Doubt');
const AiUsage = require('../models/AiUsage');
const User = require('../models/User');
const escapeRegex = require('../utils/escapeRegex');

// Daily free tier limit
const FREE_DAILY_LIMIT = 15;

/**
 * Return YYYY-MM-DD string in UTC
 */
function getUtcDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Return timestamp of next midnight UTC
 */
function getNextResetUtc() {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow.toISOString();
}

/**
 * Check if a user has active Pro status
 */
function isUserPro(user) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (!user.isPro) return false;
  if (user.proExpiresAt && new Date(user.proExpiresAt) < new Date()) {
    return false;
  }
  return true;
}

// Stop words to filter out for cleaner keyword extraction
const STOP_WORDS = new Set([
  'what', 'is', 'the', 'how', 'does', 'do', 'can', 'you', 'explain', 'tell', 'me', 'about',
  'where', 'find', 'which', 'who', 'whom', 'this', 'that', 'with', 'from', 'into', 'for',
  'and', 'or', 'in', 'on', 'at', 'to', 'a', 'an', 'are', 'was', 'were', 'will', 'would',
  'give', 'show', 'notes', 'doc', 'docs', 'document', 'documents', 'please', 'help', 'need'
]);

/**
 * Extract meaningful search keywords from natural language prompt
 */
function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Catalog of real NOTESX destinations the assistant may navigate to.
 */
const SITE_PAGES = [
  { path: '/notes', name: 'Notes Directory', description: 'Browse and search all approved lecture notes and PDFs, filterable by subject, unit and college.' },
  { path: '/notes/upload', name: 'Upload Notes', description: 'Upload and share study material or PDFs with your college.' },
  { path: '/gate', name: 'GATE Preparation', description: 'GATE syllabus progress tracker organised by subject and topic.' },
  { path: '/gate/tests', name: 'GATE Test Series', description: 'Take or create timed GATE mock and practice tests.' },
  { path: '/gate/questions', name: 'GATE PYQ Discussion', description: 'Previous-year GATE questions with student explanations.' },
  { path: '/doubts', name: 'Doubt Forum', description: 'Ask academic doubts and get answers from other students.' },
  { path: '/doubts/ask', name: 'Ask a Doubt', description: 'Post a new question to the doubt forum.' },
  { path: '/jobs', name: 'Job & Internship Portal', description: 'Browse jobs and internships, filterable by role, work mode and batch.' },
  { path: '/roadmaps', name: 'Career Roadmaps', description: 'Interactive skill and career roadmaps like AI/ML, web dev and more.' },
  { path: '/colleges', name: 'College Communities', description: 'Community pages and member directories per college.' },
  { path: '/contests', name: 'Coding Contests', description: 'Coding contests and competitive programming challenges.' },
  { path: '/leaderboard', name: 'Leaderboard', description: 'Ranking of top contributors on the platform.' },
  { path: '/build-together', name: 'Build Together', description: 'Find teammates and collaborate on student projects.' },
  { path: '/games', name: 'Learning Games', description: 'Educational and multiplayer games to play with friends.' },
  { path: '/profile', name: 'My Profile', description: 'Your profile, uploads, bookmarks and account settings.' }
];

const SITE_PAGE_PATHS = new Set(SITE_PAGES.map(p => p.path));

/**
 * Validate/normalize a navigation suggestion coming from the LLM
 */
function normalizeNavigation(navigation) {
  if (!navigation || typeof navigation !== 'object') return null;
  const path = String(navigation.path || '');
  if (!SITE_PAGE_PATHS.has(path)) return null;
  const page = SITE_PAGES.find(p => p.path === path);
  return {
    path,
    label: String(navigation.label || page.name).slice(0, 80),
    reason: String(navigation.reason || '').slice(0, 160)
  };
}

/**
 * Deterministic keyword router fallback
 */
const NAV_RULES = [
  { path: '/notes/upload', patterns: ['upload', 'share my', 'contribute'] },
  { path: '/gate/tests', patterns: ['gate test', 'mock test', 'practice test', 'test series'] },
  { path: '/gate/questions', patterns: ['pyq', 'previous year'] },
  { path: '/gate', patterns: ['gate', 'syllabus tracker'] },
  { path: '/jobs', patterns: ['job', 'internship', 'placement', 'fresher', 'hiring', 'recruit'] },
  { path: '/doubts/ask', patterns: ['ask a question', 'post a doubt', 'ask my doubt'] },
  { path: '/doubts', patterns: ['doubt', 'question forum'] },
  { path: '/roadmaps', patterns: ['roadmap', 'career path', 'learning path'] },
  { path: '/contests', patterns: ['contest', 'competitive programming'] },
  { path: '/leaderboard', patterns: ['leaderboard', 'ranking'] },
  { path: '/colleges', patterns: ['college', 'community', 'campus'] },
  { path: '/build-together', patterns: ['build together', 'teammate', 'team up', 'collaborate', 'project partner'] },
  { path: '/games', patterns: ['game', 'play'] },
  { path: '/profile', patterns: ['my profile', 'my account', 'settings'] },
  { path: '/notes', patterns: ['note', 'pdf', 'lecture', 'study material'] }
];

function matchNavigationFromPrompt(prompt) {
  const lower = String(prompt).toLowerCase();
  const rule = NAV_RULES.find(r => r.patterns.some(p => lower.includes(p)));
  if (!rule) return null;
  const page = SITE_PAGES.find(p => p.path === rule.path);
  return { path: rule.path, label: page.name, reason: 'Matched from your question' };
}

/**
 * Singleton Gemini client using official @google/genai SDK
 */
let genAiClient = null;
function getGenAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
  }
  return genAiClient;
}

/**
 * Call Gemini 2.5 Flash using official @google/genai SDK
 * Falls back to 3.8-flash or 2.0-flash if model name differs
 */
async function callGeminiIfAvailable(prompt, contextText) {
  const ai = getGenAiClient();
  if (!ai) return null;

  const systemPrompt = `You are NOTESX AI Study & Support Agent, a 24/7 intelligent academic tutor for university engineering students.
Your purpose is to answer students' academic, coding, math, and platform questions based on verified curriculum documentation and course syllabus notes provided in the context below.

Formatting & Pedagogical Requirements:
1. Provide a direct conceptual definition and pedagogical explanation.
2. Provide step-by-step mechanisms, algorithms, or formulas where applicable.
3. Keep the tone encouraging, academic, and practical. Use markdown headings (###) and bullet lists.
4. If applicable, recommend the single best NOTESX page from the catalog for the student to visit (e.g. upload notes, practice GATE tests, find internships). Otherwise set navigation to null.

NOTESX page catalog:
${SITE_PAGES.map(p => `- ${p.path} — ${p.name}: ${p.description}`).join('\n')}

Curriculum Context from NOTESX:
${contextText}`;

  // Candidate models to try in order
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const candidateModels = [primaryModel, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'];
  const uniqueModels = [...new Set(candidateModels)];

  for (const model of uniqueModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Student Question: "${prompt}"`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
          responseJsonSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description: 'Detailed, step-by-step academic answer and explanation in markdown format.'
              },
              navigation: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  path: { type: Type.STRING },
                  label: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['path', 'label', 'reason']
              }
            },
            required: ['answer']
          }
        }
      });

      const rawText = response.text;
      if (!rawText) continue;

      try {
        const parsed = JSON.parse(rawText);
        if (typeof parsed.answer === 'string' && parsed.answer.trim()) {
          return {
            answer: parsed.answer,
            navigation: normalizeNavigation(parsed.navigation),
            modelUsed: model,
            tokensUsed: response.usageMetadata?.totalTokenCount || 0
          };
        }
      } catch {
        // Plain text fallback if JSON parsing failed
        return {
          answer: rawText,
          navigation: null,
          modelUsed: model,
          tokensUsed: response.usageMetadata?.totalTokenCount || 0
        };
      }
    } catch (err) {
      console.warn(`Gemini model ${model} call error:`, err.message);
      // Try next model if available
    }
  }

  return null;
}

/**
 * Local Document-Grounded Academic Synthesis (Fallback Engine)
 */
function generateLocalDocAnswer(prompt, matchedNotes, matchedRoadmap, matchedDoubt) {
  const cleanPrompt = prompt.trim();
  const lowerPrompt = cleanPrompt.toLowerCase();

  if (lowerPrompt.includes('upload note') || lowerPrompt.includes('share note') || lowerPrompt.includes('how to upload')) {
    return `### How to Upload & Share Notes on NOTESX
To share your study materials with fellow students:
1. Log in to your account and click **"Upload Notes"** in the top navigation or visit \`/notes/upload\`.
2. Fill in the required metadata: **Course, Branch, Year, Semester, and Subject**.
3. Select the **Unit & Topic** (e.g., *Unit 3 - Deadlocks*).
4. Attach your PDF document (up to 25MB) and add descriptive tags.
5. Once submitted, your note is immediately published to your college and subject directory for peer review and downloads!`;
  }

  if (lowerPrompt.includes('job') || lowerPrompt.includes('internship') || lowerPrompt.includes('fresher')) {
    return `### Finding Internships & Jobs on NOTESX
You can browse verified job and internship openings on the **[College Job Portal](/jobs)**:
- Filter by role type (**Full-time, Summer Internship, Graduate Trainee**).
- Filter by work mode (**Remote, Hybrid, Onsite**) and graduating batch (**2024, 2025, 2026**).
- Use **"Easy Apply"** to apply directly with your profile resume, or click through to the official company careers portal.`;
  }

  if (lowerPrompt.includes('gate') || lowerPrompt.includes('gate test') || lowerPrompt.includes('test series')) {
    return `### GATE Preparation on NOTESX
Prepare systematically with our **[GATE Suite](/gate)**:
- **Interactive Syllabus Tracker**: Monitor topic-by-topic completion across Engineering Math, DSA, OS, DBMS, Networks, and Digital Logic.
- **Custom Test Builder**: Create timed practice tests filtered by subject, topic, and difficulty level.
- **GateOverflow Discussion Forum**: Discuss previous year questions and review student explanations at **[/doubts](/doubts)**.`;
  }

  if (matchedNotes && matchedNotes.length > 0) {
    const primaryNote = matchedNotes[0];
    const relatedNotesList = matchedNotes.map((n, i) => `**${i + 1}. ${n.title}** (${n.subject} • ${n.unit} • ${n.college})`).join('\n');

    let conceptualElaboration = '';

    if (lowerPrompt.includes('synchronization') || lowerPrompt.includes('peterson') || lowerPrompt.includes('semaphore') || lowerPrompt.includes('critical section')) {
      conceptualElaboration = `
#### Core Principles of Process Synchronization:
- **Critical Section Problem**: A region of code accessing shared resources that cannot be executed concurrently by multiple processes.
- **Three Essential Criteria**:
  1. **Mutual Exclusion**: If process $P_i$ is executing in its critical section, no other processes can enter.
  2. **Progress**: If no process is executing in its critical section, only processes wishing to enter can participate in deciding who enters next.
  3. **Bounded Waiting**: There must be a bound on the number of times other processes are allowed to enter their critical sections after a process has made a request.
- **Peterson's Algorithm**: A software-based dual-process solution using two variables: \`boolean flag[2]\` (readiness) and \`int turn\` (whose turn it is).
- **Semaphores**: Synchronization tools with atomic operations \`wait()\` (or \`P()\`) to decrement and \`signal()\` (or \`V()\`) to increment.`;
    } else if (lowerPrompt.includes('deadlock') || lowerPrompt.includes('banker')) {
      conceptualElaboration = `
#### Deadlock Conditions & Banker's Algorithm:
- **Four Coffman Conditions**: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.
- **Banker's Algorithm Matrices**:
  - \`Allocation[n][m]\`: Resources currently allocated to each process.
  - \`Max[n][m]\`: Maximum demand of each process.
  - \`Need[n][m] = Max - Allocation\`: Remaining resources needed to finish.
  - \`Available[m]\`: Free resources in the system.
- **Safety Algorithm**: Evaluates if there exists a safe sequence $<P_1, P_2, \\dots, P_n>$ such that for each $P_i$, $Need_i \\le Available$.`;
    } else if (lowerPrompt.includes('normalization') || lowerPrompt.includes('bcnf') || lowerPrompt.includes('normal form') || lowerPrompt.includes('3nf')) {
      conceptualElaboration = `
#### Relational Database Normalization Summary:
- **1NF**: Atomic attribute values; eliminates repeating groups and composite arrays.
- **2NF**: In 1NF and no non-prime attribute is partially dependent on any candidate key (eliminates partial dependency).
- **3NF**: In 2NF and no non-prime attribute is transitively dependent on any candidate key ($X \\to Y$ must have $X$ as superkey or $Y$ as prime attribute).
- **BCNF (Boyce-Codd NF)**: Stricter than 3NF. For every non-trivial functional dependency $X \\to Y$, $X$ must be a superkey.`;
    } else if (lowerPrompt.includes('schedule') || lowerPrompt.includes('gantt') || lowerPrompt.includes('round robin') || lowerPrompt.includes('sjf')) {
      conceptualElaboration = `
#### CPU Scheduling Overview:
- **FCFS**: First-Come, First-Served (non-preemptive, susceptible to the *Convoy Effect*).
- **SJF / SRTF**: Shortest Job First gives provably minimal average waiting time.
- **Round Robin (RR)**: Preemptive scheduling designed for timesharing using fixed time quantum ($q$).
- **Key Metrics**:
  - $\\text{Turnaround Time (TAT)} = \\text{Completion Time} - \\text{Arrival Time}$
  - $\\text{Waiting Time (WT)} = \\text{TAT} - \\text{Burst Time}$.`;
    } else if (lowerPrompt.includes('page') || lowerPrompt.includes('paging') || lowerPrompt.includes('virtual memory') || lowerPrompt.includes('lru')) {
      conceptualElaboration = `
#### Virtual Memory & Page Replacement:
- **Paging**: Non-contiguous memory allocation dividing physical memory into fixed frames and logical memory into pages.
- **TLB (Translation Lookaside Buffer)**: High-speed hardware cache holding recently translated page-to-frame mappings.
- **Page Fault**: Interrupt generated when a requested page is not currently mapped into main physical memory.
- **Algorithms**: FIFO (susceptible to Belady's Anomaly), LRU (Least Recently Used), and Optimal (clairvoyant benchmark).`;
    }

    return `### Answer from NOTESX Knowledge Base & Course Notes

Based on **${primaryNote.subject}** (${primaryNote.unit}) notes uploaded by **${primaryNote.college}**:

${primaryNote.description}
${conceptualElaboration}

---
### 📚 Verified Documents Available in NotesX:
${relatedNotesList}

*Tip: You can click the referenced note cards below to read and download the complete PDF lecture notes.*`;
  }

  if (matchedRoadmap) {
    const stagesPreview = (matchedRoadmap.stages || [])
      .slice(0, 4)
      .map((s, i) => `**Stage ${i + 1}: ${s.title}** (${s.level || 'Step'}) — ${(s.nodes || []).map(n => n.title).slice(0, 4).join(', ')}`)
      .join('\n');

    return `### Career & Skill Roadmap: ${matchedRoadmap.title} (${matchedRoadmap.category || 'Engineering'})

${matchedRoadmap.description}

#### Core Learning Stages:
${stagesPreview}

Explore the interactive milestone checklist, verified documentation links, and capstone project specs at **[/roadmaps/${matchedRoadmap.slug || matchedRoadmap._id}](/roadmaps/${matchedRoadmap.slug || matchedRoadmap._id})**.`;
  }

  return `### Study Guidance: ${cleanPrompt}

To understand this topic thoroughly for your university examinations and engineering interviews:
1. **Define Core Theory**: Break the concept down into its fundamental definition and core components.
2. **Review Examples**: Test the concept with a small, concrete trace (e.g., Gantt charts, relation matrices, or trace tables).
3. **Solve Previous Year Questions**: Practice questions from standard university papers or GATE.

You can search and filter community-uploaded lecture notes across 47+ engineering branches in our **[Notes Directory](/notes)**.`;
}

/**
 * Rich Note-Grounded Copilot Fallback (used when Gemini API is offline or rate-limited)
 */
function generateNoteCopilotFallback(mode, prompt, note) {
  const title = note?.title || 'Lecture Notes';
  const subject = note?.subjectId?.name || note?.subject || 'Engineering Subject';
  const unit = note?.unit || 'Core Unit';
  const topic = note?.topic || title;
  const desc = note?.description || `Core university concepts, derivations, and exam topics for ${subject} (${unit}).`;
  const tags = Array.isArray(note?.tags) && note.tags.length > 0 ? note.tags.join(', ') : `${subject}, ${unit}`;

  if (mode === 'summary') {
    return `### ✨ Hinglish Exam Revision Sheet: ${title}
**Subject:** ${subject} • **${unit}** • **Topic:** ${topic}

#### 1. Easy Hinglish Concept Breakdown (Samajhne ka Asaan Tarika)
- **Basic Idea Kya Hai?**: Yeh topic (**${topic}**) ${subject} ke **${unit}** ka sabse scoring part hai. Exam mein isका core purpose system efficiency, correctness, aur resource management ko optimize karna hota hai.
- **Note Overview**: ${desc}
- **Yaad Rakhne Ki Trick**: Jab bhi exam mein **${topic}** par question aaye, sabse pehle *Definition*, phir *Block Diagram / Flowchart*, aur last mein *2 Advantages + 1 Limitation* zaroor likho—isse examiner full marks deta hai.

#### 2. Key Bullet Points for Last-Minute Revision
- **Core Mechanism**: Understand the input-state-output flow of ${topic} within ${subject}.
- **Key Keywords to Underline in Exam**: \`${tags}\`.
- **Standard Formula / Complexity / Rule**: Always state the governing equation, time/space trade-off, or state transition condition clearly in a box.
- **Common Exam Trap**: Students often confuse theoretical definitions with practical implementation—always include 1 concrete numerical or diagram example!`;
  }

  if (mode === 'viva') {
    return `### 🎯 Top 10 Viva & Short-Answer Questions: ${title}
**Subject:** ${subject} (${unit})

1. **Q1: Define ${topic} in one crisp sentence for viva.**
   - **Ans:** Within ${subject}, **${topic}** is a core mechanism in ${unit} used to structure, control, and optimize system execution and theoretical modeling.
2. **Q2: Why do we need ${topic} in ${subject}?**
   - **Ans:** Without it, the system suffers from inefficiency, uncoordinated state transitions, or higher computational overhead.
3. **Q3: What are the key components covered in "${title}"?**
   - **Ans:** ${desc}
4. **Q4: What is the primary trade-off or limitation of this approach?**
   - **Ans:** Balancing implementation complexity/overhead against throughput, response time, or memory utilization.
5. **Q5: Where is ${topic} practically used in real-world engineering?**
   - **Ans:** Used in production operating kernels, database engines, compilers, or high-scale distributed architectures depending on the layer of ${subject}.
6. **Q6: How does ${unit} connect to the rest of the ${subject} syllabus?**
   - **Ans:** It builds on foundational primitives from earlier units and directly feeds into advanced optimization and design topics.
7. **Q7: Name the top keywords an external examiner listens for on this topic.**
   - **Ans:** Key terms include: *${tags}*.
8. **Q8: Can we optimize the standard approach of ${topic}?**
   - **Ans:** Yes—by caching frequent lookups, reducing contention/bottlenecks, or applying heuristic approximations.
9. **Q9: What diagram or table should you draw if asked about ${topic} on the whiteboard?**
   - **Ans:** Always draw the architecture state flow or step-by-step trace table showing Initial State $\\to$ Transition $\\to$ Final Output.
10. **Q10: What is the #1 mistake students make in viva on this topic?**
    - **Ans:** Memorizing the definition without knowing *why* it is preferred over simpler alternatives.`;
  }

  if (mode === 'analogy') {
    return `### 🧠 Real-Life Analogy & Intuitive Breakdown: ${title}
**Subject:** ${subject} • **${unit}**

#### 1. The Real-World Analogy (Imagine a Busy Railway Junction / Restaurant Kitchen)
Think of **${subject}** as managing a massive, high-speed **Indian Railway Junction** or a **busy cloud kitchen during peak dinner hours**:
- **The Problem**: Hundreds of requests (trains/orders) arrive simultaneously with limited tracks/chefs (system resources).
- **How "${topic}" Solves It**: Just like a smart station master uses signaling rules and priority tracks so no two trains collide and VIP trains pass smoothly, **${topic}** organizes ${unit} operations systematically.
- **Note Context**: ${desc}

#### 2. Mapping the Analogy to Technical Exam Terms
| Real-Life Element | Technical Equivalent in ${subject} |
| :--- | :--- |
| Station Master / Rulebook | Control Logic of **${topic}** |
| Incoming Trains / Orders | Input Processes, Queries, or Signals |
| Railway Tracks / Stoves | Shared System Resources & Memory |
| Smooth On-Time Departure | Optimal Throughput & Correct Output |

#### 3. Takeaway for Your Exam
Whenever you get stuck writing the theory of **${topic}**, picture this real-life flow first, then translate each step into technical terminology (*${tags}*).`;
  }

  if (mode === 'university_questions') {
    return `### 📝 5 Likely 10-Mark University Exam Questions: ${title}
**Subject:** ${subject} (${unit})

#### Q1. Explain the architecture, working principle, and significance of **${topic}** in detail with a neat diagram. *(10 Marks)*
- **How to Write for 10/10 Marks:**
  1. **1-Paragraph Formal Definition** (2 Marks)
  2. **Labeled Block / State Diagram** (3 Marks)
  3. **Step-by-Step Working Algorithm / Flow** (3 Marks)
  4. **Advantages, Disadvantages & Applications** (2 Marks)

#### Q2. Compare and contrast the primary approaches in **${unit}** with respect to performance, overhead, and real-world suitability. *(10 Marks)*
- **Scoring Tip:** Draw a 5-point comparison table with columns: *Parameter, Approach A, Approach B, Best Use-Case*. Examiners love tabular comparisons!

#### Q3. Solve a step-by-step trace / numerical problem based on **${title}** and justify each intermediate state. *(10 Marks)*
- **Scoring Tip:** Write the formula first, show every intermediate table step clearly, and put the final answer in a highlighted box.

#### Q4. What are the classic bottlenecks or failure conditions in **${topic}**? Discuss standard prevention and recovery mechanisms. *(10 Marks)*
- **Scoring Tip:** Reference core syllabus keywords (*${tags}*) and provide a concrete counter-example.

#### Q5. Write short notes on: (a) Core primitives of ${unit}, and (b) Practical applications of ${title}. *(5 + 5 = 10 Marks)*
- **Scoring Tip:** Keep each short note to 1.5 pages with bullet points and 1 mini-diagram each.`;
  }

  return `### 📚 Note Copilot Answer: ${title} (${subject})

Based on the note **"${title}"** (${unit} • ${topic}):
> ${desc}

#### Key Explanation for "${prompt}":
1. **Core Concept**: In **${subject}** (${unit}), this concept revolves around **${topic}** and its key attributes (*${tags}*).
2. **Mechanism & Application**: Ensure you connect the theoretical definition with a step-by-step trace or block diagram when answering in semester exams or technical interviews.
3. **Exam Tip**: Review the uploaded PDF above for complete handwritten derivations and solved university examples.`;
}

/**
 * Controller endpoint: GET /api/ai/quota or /api/ai-assistant/quota
 * Returns student's remaining daily AI questions
 */
exports.getQuota = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to view AI quota' });
    }

    const isPro = isUserPro(req.user);
    const today = getUtcDateString();
    const usage = await AiUsage.findOne({ user: req.user._id, date: today });
    const questionCount = usage ? usage.questionCount : 0;

    const limit = isPro ? null : FREE_DAILY_LIMIT;
    const remaining = isPro ? null : Math.max(0, FREE_DAILY_LIMIT - questionCount);

    return res.json({
      isPro,
      limit,
      used: questionCount,
      remaining,
      resetsAt: getNextResetUtc()
    });
  } catch (error) {
    console.error('Error in aiAssistantController.getQuota:', error);
    next(error);
  }
};

/**
 * Controller endpoint: POST /api/ai/chat or /api/ai-assistant/chat
 * Primary entry point for 24/7 AI Study Tutor & Note-Grounded Exam Copilot
 */
exports.ask = async (req, res, next) => {
  try {
    const rawPrompt = String(req.body.message || req.body.prompt || '').trim();
    const mode = String(req.body.mode || '').trim(); // 'summary' | 'viva' | 'analogy' | 'university_questions' | 'custom'
    const noteId = req.body.noteId;
    const clientNoteContext = req.body.noteContext;

    if (!rawPrompt && !mode) {
      return res.status(400).json({ message: 'A question or prompt is required.' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Please log in to chat with the 24/7 AI Tutor and track your daily questions.' });
    }

    const isPro = isUserPro(req.user);
    const today = getUtcDateString();

    // 1. Enforce Per-Student Daily Rate Limit Quota
    const currentUsage = await AiUsage.findOne({ user: req.user._id, date: today });
    const currentCount = currentUsage ? currentUsage.questionCount : 0;

    if (!isPro && currentCount >= FREE_DAILY_LIMIT) {
      return res.status(429).json({
        message: `Daily free AI study quota reached (${FREE_DAILY_LIMIT}/${FREE_DAILY_LIMIT} questions used today). Quota resets at midnight UTC. Upgrade to NOTESX Pro for unlimited questions!`,
        quota: {
          isPro: false,
          limit: FREE_DAILY_LIMIT,
          used: currentCount,
          remaining: 0,
          resetsAt: getNextResetUtc()
        }
      });
    }

    // 1b. If called from inside NoteViewerModal with a specific note, resolve the active note context
    let activeNote = null;
    if (noteId) {
      try {
        activeNote = await Note.findById(noteId).populate('subjectId', 'name').lean();
      } catch {
        activeNote = null;
      }
    }
    if (!activeNote && clientNoteContext && typeof clientNoteContext === 'object') {
      activeNote = clientNoteContext;
    }

    // Build mode-specific prompt if invoked from Note Copilot
    let prompt = rawPrompt;
    if (activeNote) {
      const noteSubject = activeNote.subjectId?.name || activeNote.subject || 'Engineering';
      const noteUnit = activeNote.unit || 'Unit';
      const noteTopic = activeNote.topic || activeNote.title || '';
      if (mode === 'summary') {
        prompt = `Create a student-friendly Hinglish (mix of easy Hindi + English technical terms) Exam Revision Summary for the note "${activeNote.title}" in subject ${noteSubject} (${noteUnit}, Topic: ${noteTopic}). Include: 1) Easy Hinglish concept explanation, 2) Key bullet points & formulas to remember, 3) Exam writing tips to score full marks.`;
      } else if (mode === 'viva') {
        prompt = `Generate 10 high-probability Viva & Short-Answer Exam Questions with concise model answers based on the note "${activeNote.title}" in subject ${noteSubject} (${noteUnit}, Topic: ${noteTopic}).`;
      } else if (mode === 'analogy') {
        prompt = `Explain the core concepts of "${activeNote.title}" (${noteSubject}, ${noteUnit}, Topic: ${noteTopic}) using a relatable real-life Indian analogy (like railway junctions, cricket, kitchen, or traffic) and map the analogy back to exact technical exam terms.`;
      } else if (mode === 'university_questions') {
        prompt = `Generate 5 likely 10-Mark University Semester Exam Questions for "${activeNote.title}" (${noteSubject}, ${noteUnit}, Topic: ${noteTopic}) along with the exact answer structure, headings, and diagram suggestions a student should write to score 10/10 marks.`;
      } else if (rawPrompt) {
        prompt = `Regarding the study note "${activeNote.title}" in ${noteSubject} (${noteUnit}, Topic: ${noteTopic}): ${rawPrompt}`;
      }
    }

    // 2. Parallel search in Notes, Roadmaps, and Doubts for grounded RAG context
    const keywords = extractKeywords(prompt);
    const regexPattern = keywords.length > 0 ? keywords.map(escapeRegex).join('|') : escapeRegex(prompt);
    const keywordRegex = new RegExp(regexPattern, 'i');

    const [matchedNotes, matchedRoadmaps, matchedDoubts] = await Promise.all([
      Note.find({
        status: 'approved',
        $or: [
          { title: { $regex: keywordRegex } },
          { description: { $regex: keywordRegex } },
          { topic: { $regex: keywordRegex } },
          { subject: { $regex: keywordRegex } },
          { tags: { $in: keywords.map(k => new RegExp(`^${escapeRegex(k)}`, 'i')) } }
        ]
      })
      .select('title description subject unit topic college fileUrl fileType ratingAverage downloadCount tags')
      .sort({ ratingAverage: -1, downloadCount: -1 })
      .limit(4),

      Roadmap.findOne({
        $or: [
          { title: { $regex: keywordRegex } },
          { category: { $regex: keywordRegex } },
          { tags: { $in: keywords.map(k => new RegExp(`^${escapeRegex(k)}`, 'i')) } }
        ]
      }).select('title category description stages slug'),

      Doubt.find({
        $or: [
          { title: { $regex: keywordRegex } },
          { subjectName: { $regex: keywordRegex } },
          { topic: { $regex: keywordRegex } },
          { tags: { $in: keywords.map(k => new RegExp(`^${escapeRegex(k)}`, 'i')) } }
        ]
      })
      .select('title subjectName topic hasAcceptedAnswer upvotes')
      .limit(3)
    ]);

    const formattedDocs = matchedNotes.map(n => ({
      id: String(n._id),
      title: n.title,
      subject: n.subject,
      unit: n.unit,
      topic: n.topic,
      college: n.college,
      fileUrl: n.fileUrl,
      rating: n.ratingAverage,
      downloads: n.downloadCount
    }));

    const activeNoteContextStr = activeNote
      ? `ACTIVE STUDY NOTE OPENED BY STUDENT:\n- Title: "${activeNote.title}"\n- Subject: ${activeNote.subjectId?.name || activeNote.subject || 'N/A'}\n- Unit: ${activeNote.unit || 'N/A'}\n- Topic: ${activeNote.topic || 'N/A'}\n- Description: ${activeNote.description || 'N/A'}\n- Tags: ${Array.isArray(activeNote.tags) ? activeNote.tags.join(', ') : ''}`
      : '';

    const contextSummary = [
      activeNoteContextStr,
      matchedNotes.length ? `Matching Notes:\n${matchedNotes.map(n => `- Title: "${n.title}", Subject: ${n.subject}, Unit: ${n.unit}, Description: ${n.description}`).join('\n')}` : '',
      matchedRoadmaps ? `Matching Career Roadmap: "${matchedRoadmaps.title}" (${matchedRoadmaps.category})\nDescription: ${matchedRoadmaps.description}` : '',
      matchedDoubts.length ? `Related Questions: ${matchedDoubts.map(d => `"${d.title}" (${d.subjectName || 'General'})`).join(', ')}` : ''
    ].filter(Boolean).join('\n\n');

    // 3. Connect to Real Gemini 2.5 Flash via @google/genai SDK
    let geminiResult = await callGeminiIfAvailable(prompt, contextSummary);
    let aiResponse;
    let provider;
    let tokensUsed = 0;

    if (geminiResult) {
      aiResponse = geminiResult.answer;
      provider = geminiResult.modelUsed || 'gemini-2.5-flash';
      tokensUsed = geminiResult.tokensUsed || 0;
    } else if (activeNote) {
      aiResponse = generateNoteCopilotFallback(mode || 'custom', rawPrompt || prompt, activeNote);
      provider = 'notesx-note-copilot';
    } else {
      aiResponse = generateLocalDocAnswer(prompt, matchedNotes, matchedRoadmaps, matchedDoubts[0]);
      provider = 'notesx-docs';
    }

    // 4. Atomically increment student's daily question count
    const updatedUsage = await AiUsage.findOneAndUpdate(
      { user: req.user._id, date: today },
      {
        $inc: { questionCount: 1, tokensUsed },
        $set: { lastPromptAt: new Date() }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const newCount = updatedUsage.questionCount;
    const remainingCount = isPro ? null : Math.max(0, FREE_DAILY_LIMIT - newCount);

    // 5. Intelligent navigation routing
    const navigation = (geminiResult && geminiResult.navigation) || matchNavigationFromPrompt(prompt);

    return res.json({
      message: aiResponse,
      navigation,
      matchedDocs: formattedDocs,
      matchedRoadmap: matchedRoadmaps ? {
        id: String(matchedRoadmaps._id),
        title: matchedRoadmaps.title,
        category: matchedRoadmaps.category,
        slug: matchedRoadmaps.slug
      } : null,
      provider,
      quota: {
        isPro,
        limit: isPro ? null : FREE_DAILY_LIMIT,
        used: newCount,
        remaining: remainingCount,
        resetsAt: getNextResetUtc()
      }
    });
  } catch (error) {
    console.error('Error in aiAssistantController.ask:', error);
    next(error);
  }
};

/**
 * Ensure the system "NOTESX AI Tutor" user exists in MongoDB so AI-generated
 * Doubt answers populate `answererId` cleanly across all views.
 */
let cachedAiTutorUser = null;
async function ensureAiTutorUser() {
  if (cachedAiTutorUser) return cachedAiTutorUser;
  const email = 'ai-tutor@notesx.in';
  let botUser = await User.findOne({ email });
  if (!botUser) {
    botUser = await User.create({
      name: 'NOTESX AI Tutor ✨',
      email,
      password: 'ai_system_account_no_login_' + Date.now(),
      role: 'moderator',
      bio: '24/7 AI Academic First Responder powered by Google Gemini & NOTESX Verified Syllabus Engine.',
      collegeName: 'NOTESX Academic Engine',
      course: 'AI Tutor • GATE & University Specialist',
      reputation: 9999,
      badges: ['AI Verified Tutor', '24/7 Instant Responder', 'GATE & University Expert'],
      isVerified: true,
      isPro: true
    });
  }
  cachedAiTutorUser = botUser;
  return botUser;
}

/**
 * Generate a comprehensive, step-by-step academic solution for a Doubt
 * using Gemini (or rich structured fallback if Gemini is unavailable).
 */
async function generateDoubtAiSolution(doubt) {
  const optionsText = Array.isArray(doubt.options) && doubt.options.length > 0
    ? `\nOptions:\n${doubt.options.map(o => `(${o.label}) ${o.text}`).join('\n')}`
    : '';
  const officialKeyText = doubt.correctOption ? `\nOfficial Answer Key (if known): ${doubt.correctOption}` : '';

  const doubtPrompt = `Solve this academic/engineering doubt step-by-step for a student:
Title: ${doubt.title}
Subject: ${doubt.subjectName || 'Computer Science / Engineering'}
Topic: ${doubt.topic || 'Core Concept'}
Exam Category: ${doubt.examCategory || 'GATE / University'} (${doubt.questionType || 'General'}, ${doubt.marks || 2} Marks)
Question Description:
${doubt.description}${optionsText}${officialKeyText}

Provide:
1. **Direct Answer / Verdict** at the top.
2. **Step-by-Step Derivation / Conceptual Explanation** (use clear markdown headings, formulas, and bullet points).
3. **Why Other Options Are Incorrect** (if MCQ/MSQ) or **Key Exam Takeaway & Pitfalls to Avoid**.`;

  const contextText = `Doubt Subject: ${doubt.subjectName || 'Engineering'}, Topic: ${doubt.topic || 'General'}, Tags: ${(doubt.tags || []).join(', ')}`;

  const geminiResult = await callGeminiIfAvailable(doubtPrompt, contextText);
  if (geminiResult && geminiResult.answer) {
    return {
      content: `> 🤖 **NOTESX AI Instant First Response** *(Verified Syllabus & GATE Engine — Peer reviews and additional human solutions are welcome!)*\n\n${geminiResult.answer}`,
      aiModel: geminiResult.modelUsed || 'gemini-2.5-flash'
    };
  }

  // Structured deterministic fallback if Gemini API is unreachable
  const keyBanner = doubt.correctOption
    ? `**Verified Answer Key:** Option **(${doubt.correctOption})**\n\n`
    : '';

  const fallbackContent = `> 🤖 **NOTESX AI Instant First Response** *(Automated Academic Breakdown — Peer reviews and additional human solutions are welcome!)*

### 1. Concept Overview (${doubt.subjectName || 'Engineering'} ${doubt.topic ? `• ${doubt.topic}` : ''})
${keyBanner}This question tests core principles from **${doubt.subjectName || 'Computer Science'}** (${doubt.examCategory || 'University / GATE'}).

### 2. Step-by-Step Solution Strategy
1. **Identify Given Parameters**: Carefully extract the constraints and preconditions stated in *"${doubt.title}"*.
2. **Apply Governing Principle**:
   - Formulate the state transition, recurrence, or system property relevant to **${doubt.topic || doubt.subjectName || 'the topic'}**.
   - Trace the execution on a small test case or verify boundary conditions.
${Array.isArray(doubt.options) && doubt.options.length > 0 ? `3. **Eliminate Invalid Options**:\n${doubt.options.map(o => `   - **Option (${o.label})**: Evaluate "${o.text}" against the core invariant.${doubt.correctOption === o.label ? ' ✅ *(Matches required condition)*' : ''}`).join('\n')}` : '3. **Structure for Full Marks**: Write the formal definition first, include a labeled diagram or trace table, and state the final time/space or performance conclusion clearly.'}

### 3. Exam Tip & Common Pitfall
- Always double-check base cases, units, and edge conditions before finalizing your answer in **${doubt.examCategory || 'the exam'}**.`;

  return {
    content: fallbackContent,
    aiModel: 'notesx-academic-engine'
  };
}

// Exposed for unit tests and route backwards compatibility
exports.matchNavigationFromPrompt = matchNavigationFromPrompt;
exports.normalizeNavigation = normalizeNavigation;
exports.SITE_PAGES = SITE_PAGES;
exports.FREE_DAILY_LIMIT = FREE_DAILY_LIMIT;
exports.isUserPro = isUserPro;
exports.ensureAiTutorUser = ensureAiTutorUser;
exports.generateDoubtAiSolution = generateDoubtAiSolution;


