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
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const candidateModels = [primaryModel, 'gemini-3.8-flash', 'gemini-2.0-flash'];
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
 * Primary entry point for 24/7 AI Study Tutor
 */
exports.ask = async (req, res, next) => {
  try {
    const prompt = String(req.body.message || req.body.prompt || '').trim();
    if (!prompt) {
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

    const contextSummary = [
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

// Exposed for unit tests and route backwards compatibility
exports.matchNavigationFromPrompt = matchNavigationFromPrompt;
exports.normalizeNavigation = normalizeNavigation;
exports.SITE_PAGES = SITE_PAGES;
exports.FREE_DAILY_LIMIT = FREE_DAILY_LIMIT;
exports.isUserPro = isUserPro;
