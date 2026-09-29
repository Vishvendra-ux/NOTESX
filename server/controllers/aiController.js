const Note = require('../models/Note');
const Roadmap = require('../models/Roadmap');
const Doubt = require('../models/Doubt');
const Subject = require('../models/Subject');

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
 * Call Google Gemini API if API key is provided in environment
 */
async function callGeminiIfAvailable(prompt, contextText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const systemPrompt = `You are NOTESX AI Study & Support Agent. Your purpose is to answer students' academic and platform questions based on the documentation, course syllabus, and study notes provided in the context below.
Provide clear, structured, and pedagogical responses with:
1. A direct conceptual definition and explanation.
2. Step-by-step algorithms, mechanisms, or formulas where applicable.
3. Explicit references to the available NOTESX notes or documents in the context.
4. Keep the tone friendly, academic, and practical.

Context from NOTESX Knowledge Base & Documents:
${contextText}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nStudent Question: "${prompt}"` }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000
        }
      })
    });

    if (!res.ok) {
      console.warn('Gemini API returned error status:', res.status);
      return null;
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local doc engine:', err.message);
    return null;
  }
}

/**
 * Synthesize a rich academic explanation using matched documents
 */
function generateLocalDocAnswer(prompt, matchedNotes, matchedRoadmap, matchedDoubt) {
  const cleanPrompt = prompt.trim();
  const lowerPrompt = cleanPrompt.toLowerCase();

  // 1. General Platform Support & Navigation questions
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

  // 2. Answering based on Matched Notes from the database
  if (matchedNotes && matchedNotes.length > 0) {
    const primaryNote = matchedNotes[0];
    const relatedNotesList = matchedNotes.map((n, i) => `**${i + 1}. ${n.title}** (${n.subject} • ${n.unit} • ${n.college})`).join('\n');

    let conceptualElaboration = '';

    // Add subject-specific deep dive based on topic
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

  // 3. Answering based on Matched Roadmap
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

  // 4. Fallback for broader questions
  return `### Study Guidance: ${cleanPrompt}

To understand this topic thoroughly for your university examinations and engineering interviews:
1. **Define Core Theory**: Break the concept down into its fundamental definition and core components.
2. **Review Examples**: Test the concept with a small, concrete trace (e.g., Gantt charts, relation matrices, or trace tables).
3. **Solve Previous Year Questions**: Practice questions from standard university papers or GATE.

You can search and filter community-uploaded lecture notes across 47+ engineering branches in our **[Notes Directory](/notes)**.`;
}

/**
 * Controller endpoint: POST /api/ai/chat
 */
exports.ask = async (req, res, next) => {
  try {
    const prompt = String(req.body.message || req.body.prompt || '').trim();
    if (!prompt) {
      return res.status(400).json({ message: 'A question or prompt is required.' });
    }

    const keywords = extractKeywords(prompt);
    const regexPattern = keywords.length > 0 ? keywords.join('|') : prompt;
    const keywordRegex = new RegExp(regexPattern, 'i');

    // 1. Parallel search in Notes, Roadmaps, and Doubts
    const [matchedNotes, matchedRoadmaps, matchedDoubts] = await Promise.all([
      Note.find({
        status: 'approved',
        $or: [
          { title: { $regex: keywordRegex } },
          { description: { $regex: keywordRegex } },
          { topic: { $regex: keywordRegex } },
          { subject: { $regex: keywordRegex } },
          { tags: { $in: keywords.map(k => new RegExp(`^${k}`, 'i')) } }
        ]
      })
      .select('title description subject unit topic college fileUrl fileType ratingAverage downloadCount tags')
      .sort({ ratingAverage: -1, downloadCount: -1 })
      .limit(4),

      Roadmap.findOne({
        $or: [
          { title: { $regex: keywordRegex } },
          { category: { $regex: keywordRegex } },
          { tags: { $in: keywords.map(k => new RegExp(`^${k}`, 'i')) } }
        ]
      }).select('title category description stages slug'),

      Doubt.find({
        $or: [
          { title: { $regex: keywordRegex } },
          { subject: { $regex: keywordRegex } },
          { tags: { $in: keywords.map(k => new RegExp(`^${k}`, 'i')) } }
        ]
      })
      .select('title subject isResolved upvoteCount')
      .limit(3)
    ]);

    // Format docs for citations in response
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

    // Prepare context block for LLM / Engine
    const contextSummary = [
      matchedNotes.length ? `Matching Notes:\n${matchedNotes.map(n => `- Title: "${n.title}", Subject: ${n.subject}, Unit: ${n.unit}, Description: ${n.description}`).join('\n')}` : '',
      matchedRoadmaps ? `Matching Career Roadmap: "${matchedRoadmaps.title}" (${matchedRoadmaps.domain})\nDescription: ${matchedRoadmaps.description}` : '',
      matchedDoubts.length ? `Related Questions: ${matchedDoubts.map(d => `"${d.title}" (${d.subject})`).join(', ')}` : ''
    ].filter(Boolean).join('\n\n');

    // 2. Attempt Google Gemini call if configured
    let aiResponse = await callGeminiIfAvailable(prompt, contextSummary);
    let provider = 'gemini';

    // 3. Fallback to Local Document-Grounded Synthesis
    if (!aiResponse) {
      aiResponse = generateLocalDocAnswer(prompt, matchedNotes, matchedRoadmaps, matchedDoubts[0]);
      provider = 'notesx-docs';
    }

    return res.json({
      message: aiResponse,
      matchedDocs: formattedDocs,
      matchedRoadmap: matchedRoadmaps ? {
        id: String(matchedRoadmaps._id),
        title: matchedRoadmaps.title,
        domain: matchedRoadmaps.domain,
        slug: matchedRoadmaps.slug
      } : null,
      provider
    });
  } catch (error) {
    console.error('Error in aiController.ask:', error);
    next(error);
  }
};
