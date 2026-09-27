const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Doubt = require('../models/Doubt');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const User = require('../models/User');

const seedDoubts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for GateOverflow seeding.');

    // Fetch or create users to act as askers and answerers
    let admin = await User.findOne({ email: 'pratapsinghvishvendra6@gmail.com' });
    let student = await User.findOne({ email: 'rahul.gate@gmail.com' });

    if (!student) {
      student = await User.create({
        name: 'Rahul Sharma',
        email: 'rahul.gate@gmail.com',
        password: 'hashedpassword',
        role: 'student',
        reputation: 340,
        badges: ['🔥 Top Contributor', 'GATE Ranker'],
        collegeName: 'GLA University',
        course: 'B.Tech CSE',
        year: '3rd Year'
      });
    }

    let topper = await User.findOne({ email: 'priya.topper@iitb.ac.in' });
    if (!topper) {
      topper = await User.create({
        name: 'Priya Patel (AIR 14)',
        email: 'priya.topper@iitb.ac.in',
        password: 'hashedpassword',
        role: 'student',
        reputation: 1850,
        badges: ['⭐ Gold Contributor', 'AIR 14 CSE'],
        collegeName: 'IIT Bombay',
        course: 'M.Tech CSE',
        year: '1st Year'
      });
    }

    let faculty = await User.findOne({ email: 'prof.verma@glau.ac.in' });
    if (!faculty) {
      faculty = await User.create({
        name: 'Prof. S. K. Verma',
        email: 'prof.verma@glau.ac.in',
        password: 'hashedpassword',
        role: 'moderator',
        reputation: 4200,
        badges: ['🎓 Faculty Mentor', 'Verified Educator'],
        collegeName: 'GLA University'
      });
    }

    // Clean existing doubts, answers, and comments
    await Doubt.deleteMany({});
    await Answer.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleaned existing doubts data.');

    // 1. Operating Systems - Semaphores
    const doubt1 = await Doubt.create({
      title: 'GATE CSE 2021 | Process Synchronization with Counting Semaphores',
      description: `A counting semaphore $S$ is initialized to $10$. Then $12\\,\\text{P}$ (wait) operations and $4\\,\\text{V}$ (signal) operations are performed on $S$. What is the resulting value of the semaphore $S$?

\`\`\`c
// Sequence of operations on Semaphore S:
initial_value = 10;
12 * wait(S);   // P operations
4  * signal(S); // V operations
\`\`\`

Is the final value positive or does it represent waiting processes?`,
      subjectName: 'Operating Systems',
      topic: 'Process Synchronization',
      tags: ['operating-systems', 'semaphores', 'process-synchronization', 'gate-2021'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2021',
      questionType: 'MCQ',
      marks: 1,
      options: [
        { label: 'A', text: '2' },
        { label: 'B', text: '-2' },
        { label: 'C', text: '6' },
        { label: 'D', text: '0' }
      ],
      correctOption: 'A',
      askerId: student._id,
      collegeName: student.collegeName,
      upvotes: 48,
      downvotes: 1,
      upvotedBy: [admin._id, topper._id],
      views: 1420,
      status: 'resolved',
      hasAcceptedAnswer: true,
      answersCount: 2
    });

    const ans1 = await Answer.create({
      doubtId: doubt1._id,
      answererId: topper._id,
      content: `### Step-by-Step Solution:

Recall the definitions of semaphore operations:
1. **Initial value**: $S = 10$
2. **$P(S)$ operation (Wait)**: Decrements the semaphore value:
   $$S \\leftarrow S - 1$$
   Since $12$ wait operations are executed:
   $$S = 10 - 12 = -2$$
   *(Here, a value of $-2$ indicates that $2$ processes are blocked in the waiting queue).*
3. **$V(S)$ operation (Signal)**: Increments the semaphore value:
   $$S \\leftarrow S + 1$$
   Since $4$ signal operations are executed:
   $$S = -2 + 4 = 2$$

Therefore, the final value of the semaphore $S$ is **$2$**.

### Key Concept to Remember:
Net change on a counting semaphore is simply:
$$\\text{Final Value} = \\text{Initial} - \\text{Count}(P) + \\text{Count}(V) = 10 - 12 + 4 = 2$$

**Correct Option: (A) 2**`,
      isAccepted: true,
      upvotes: 62,
      upvotedBy: [student._id, admin._id, faculty._id]
    });

    const ans1_2 = await Answer.create({
      doubtId: doubt1._id,
      answererId: faculty._id,
      content: `Just to add for standard POSIX / Dijkstra semaphores:
When $S < 0$, $|S|$ gives the exact number of blocked processes waiting on the resource.
After the 12 wait operations, 2 processes were blocked. Then 4 signals were invoked: the first 2 signals unblocked the 2 waiting processes, and the remaining 2 signals incremented $S$ to $+2$.`,
      isAccepted: false,
      upvotes: 21,
      upvotedBy: [student._id]
    });

    await Comment.create({
      authorId: student._id,
      content: 'Thank you Priya! The formula makes it completely straightforward.',
      onModel: 'Answer',
      parentId: ans1._id
    });

    await Comment.create({
      authorId: admin._id,
      content: 'Standard 1-mark question from GATE 2021 Set 1. Very common trap question.',
      onModel: 'Doubt',
      parentId: doubt1._id
    });

    // 2. Operating Systems - TLB Effective Access Time
    const doubt2 = await Doubt.create({
      title: 'GATE CSE 2020 | Effective Memory Access Time with Multi-Level Paging and TLB',
      description: `Consider a system with a **two-level paging scheme**.
- TLB hit ratio = $90\\%$ ($h = 0.90$)
- TLB search time = $10\\,\\text{ns}$ ($t_{\\text{TLB}} = 10\\,\\text{ns}$)
- Main memory access time = $100\\,\\text{ns}$ ($t_m = 100\\,\\text{ns}$)

Assume that the TLB is accessed first. If a TLB hit occurs, main memory is accessed to retrieve the actual word. If a TLB miss occurs, two page table levels must be consulted in main memory before accessing the desired word.

What is the Effective Memory Access Time (EMAT) in nanoseconds?`,
      subjectName: 'Operating Systems',
      topic: 'Virtual Memory & Paging',
      tags: ['operating-systems', 'tlb', 'paging', 'virtual-memory', 'gate-2020'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2020',
      questionType: 'MCQ',
      marks: 2,
      options: [
        { label: 'A', text: '130 ns' },
        { label: 'B', text: '120 ns' },
        { label: 'C', text: '210 ns' },
        { label: 'D', text: '110 ns' }
      ],
      correctOption: 'A',
      askerId: admin._id,
      collegeName: 'GLA University',
      upvotes: 35,
      downvotes: 0,
      upvotedBy: [student._id, topper._id],
      views: 980,
      status: 'resolved',
      hasAcceptedAnswer: true,
      answersCount: 1
    });

    const ans2 = await Answer.create({
      doubtId: doubt2._id,
      answererId: topper._id,
      content: `### Detailed Derivation:

For a **$k$-level paging system** with sequential TLB access:

1. **On a TLB Hit (Probability $h = 0.90$):**
   - Access TLB ($10\\,\\text{ns}$) + 1 Main Memory access for data ($100\\,\\text{ns}$)
   - $\\text{Time}_{\\text{hit}} = 10 + 100 = 110\\,\\text{ns}$

2. **On a TLB Miss (Probability $1 - h = 0.10$):**
   - Access TLB ($10\\,\\text{ns}$)
   - Access Level-1 Page Table in Memory ($100\\,\\text{ns}$)
   - Access Level-2 Page Table in Memory ($100\\,\\text{ns}$)
   - Access the target word in Memory ($100\\,\\text{ns}$)
   - $\\text{Time}_{\\text{miss}} = 10 + 3 \\times 100 = 310\\,\\text{ns}$

### Formula:
$$\\text{EMAT} = h \\times \\text{Time}_{\\text{hit}} + (1 - h) \\times \\text{Time}_{\\text{miss}}$$

$$\\text{EMAT} = 0.90 \\times 110 + 0.10 \\times 310$$
$$\\text{EMAT} = 99 + 31 = \\mathbf{130\\,\\text{ns}}$$

**Correct Answer is (A) 130 ns.**`,
      isAccepted: true,
      upvotes: 41,
      upvotedBy: [admin._id, student._id]
    });

    // 3. Algorithms - Dijkstra vs Bellman Ford
    const doubt3 = await Doubt.create({
      title: 'Time Complexity Difference: Dijkstra (Min-Heap) vs Bellman-Ford on Dense Graphs',
      description: `Given a directed graph $G = (V, E)$ with $|V| = n$ vertices and $|E| = \\Theta(n^2)$ edges (dense graph), with non-negative edge weights:

1. What is the exact tight worst-case time complexity of Dijkstra's algorithm implemented with a standard binary min-heap?
2. How does it compare to the Bellman-Ford algorithm on the same dense graph?
3. In what scenarios would Bellman-Ford be preferred over Dijkstra?`,
      subjectName: 'Algorithms',
      topic: 'Shortest Path Algorithms',
      tags: ['algorithms', 'graphs', 'dijkstra', 'bellman-ford', 'time-complexity', 'gate-pyq'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2019',
      questionType: 'Descriptive',
      marks: 2,
      askerId: student._id,
      collegeName: student.collegeName,
      upvotes: 72,
      downvotes: 0,
      views: 2150,
      status: 'resolved',
      hasAcceptedAnswer: true,
      answersCount: 1
    });

    const ans3 = await Answer.create({
      doubtId: doubt3._id,
      answererId: faculty._id,
      content: `### Comprehensive Comparison on Dense Graphs ($|V| = n, |E| = \\Theta(n^2)$):

| Algorithm | General Complexity | On Dense Graph ($|E| = n^2$) | Handles Negative Weights? |
| :--- | :--- | :--- | :--- |
| **Dijkstra (Array)** | $O(V^2)$ | $O(n^2)$ | ❌ No |
| **Dijkstra (Binary Min-Heap)** | $O((V + E) \\log V)$ | $O(n^2 \\log n)$ | ❌ No |
| **Dijkstra (Fibonacci Heap)** | $O(V \\log V + E)$ | $O(n^2)$ | ❌ No |
| **Bellman-Ford** | $O(V \\times E)$ | $O(n \\times n^2) = O(n^3)$ | ✅ Yes (Detects negative cycles) |

### Key Takeaways:
1. **On a dense graph**, Dijkstra with a simple adjacency matrix / array ($O(n^2)$) actually outperforms a Binary Min-Heap ($O(n^2 \\log n)$) because heap operations have a $\\log n$ factor per edge relaxation!
2. **Bellman-Ford** takes $O(n^3)$ on dense graphs, which is significantly slower than Dijkstra ($O(n^2)$).
3. **When to use Bellman-Ford**: Only when the graph contains negative edge weights or when you need to detect negative weight cycles.`,
      isAccepted: true,
      upvotes: 55,
      upvotedBy: [student._id, topper._id, admin._id]
    });

    // 4. Theory of Computation - Decidability
    const doubt4 = await Doubt.create({
      title: 'GATE CSE 2022 | Decidability of Language Emptiness for Turing Machines vs DFAs',
      description: `Consider the following two decision languages:

$$L_1 = \\{ \\langle M \\rangle \\mid M \\text{ is a Turing machine and } L(M) = \\emptyset \\}$$
$$L_2 = \\{ \\langle D \\rangle \\mid D \\text{ is a DFA and } L(D) = \\emptyset \\}$$

Which of the following statements is true regarding their decidability?`,
      subjectName: 'Theory of Computation',
      topic: 'Decidability & Turing Machines',
      tags: ['theory-of-computation', 'decidability', 'turing-machine', 'dfa', 'gate-2022'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2022',
      questionType: 'MCQ',
      marks: 2,
      options: [
        { label: 'A', text: 'Both L1 and L2 are decidable' },
        { label: 'B', text: 'L1 is undecidable and L2 is decidable' },
        { label: 'C', text: 'L1 is decidable and L2 is undecidable' },
        { label: 'D', text: 'Both L1 and L2 are undecidable' }
      ],
      correctOption: 'B',
      askerId: student._id,
      collegeName: student.collegeName,
      upvotes: 38,
      downvotes: 0,
      views: 1120,
      status: 'resolved',
      hasAcceptedAnswer: true,
      answersCount: 1
    });

    await Answer.create({
      doubtId: doubt4._id,
      answererId: topper._id,
      content: `### Explanation:

1. **For $L_1$ (Emptiness problem for Turing Machines - $E_{\\text{TM}}$):**
   - By **Rice's Theorem**, any non-trivial semantic property of the language recognized by a Turing Machine is **undecidable**.
   - Emptiness ($L(M) = \\emptyset$) is a non-trivial property because some TMs accept $\\emptyset$ and others do not.
   - In fact, $E_{\\text{TM}}$ is not even Turing-recognizable (it is in $\\text{co-RE} - \\text{RE}$). Hence, **$L_1$ is undecidable**.

2. **For $L_2$ (Emptiness problem for DFA - $E_{\\text{DFA}}$):**
   - A DFA accepts nothing ($L(D) = \\emptyset$) if and only if no accept / final state is reachable from the start state.
   - We can check reachability in a DFA graph using BFS or DFS in $O(|V| + |E|)$ time.
   - Therefore, **$L_2$ is decidable**.

**Correct Option: (B) L1 is undecidable and L2 is decidable.**`,
      isAccepted: true,
      upvotes: 39,
      upvotedBy: [student._id, faculty._id]
    });

    // 5. Database Management Systems - Normalization
    const doubt5 = await Doubt.create({
      title: 'GATE CSE 2023 | Candidate Keys and Highest Normal Form of R(A, B, C, D, E)',
      description: `A relational schema $R(A, B, C, D, E)$ has the following set of functional dependencies:
- $F = \\{ AB \\to C,\\; C \\to D,\\; D \\to B,\\; D \\to E \\}$

1. What are all the candidate keys of $R$?
2. What is the highest normal form satisfied by relation $R$?`,
      subjectName: 'Database Management Systems',
      topic: 'Functional Dependencies & Normalization',
      tags: ['dbms', 'normalization', 'bcnf', '3nf', 'candidate-key', 'gate-2023'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2023',
      questionType: 'MCQ',
      marks: 2,
      options: [
        { label: 'A', text: 'Candidate Key: AB, Normal Form: 2NF' },
        { label: 'B', text: 'Candidate Key: AB, AC, Normal Form: 3NF' },
        { label: 'C', text: 'Candidate Keys: AB, AC, AD, Normal Form: 3NF' },
        { label: 'D', text: 'Candidate Keys: AB, Normal Form: BCNF' }
      ],
      correctOption: 'C',
      askerId: admin._id,
      collegeName: 'GLA University',
      upvotes: 29,
      downvotes: 1,
      views: 860,
      status: 'resolved',
      hasAcceptedAnswer: true,
      answersCount: 1
    });

    await Answer.create({
      doubtId: doubt5._id,
      answererId: faculty._id,
      content: `### Finding Candidate Keys:

Attribute $A$ does not appear on the RHS of any FD, so $A$ must be part of every candidate key.

1. **$(AB)^+$**:
   - $AB \\to C \\implies ABC$
   - $C \\to D \\implies ABCD$
   - $D \\to E \\implies ABCDE$
   - Since $(AB)^+ = \\{A, B, C, D, E\\}$, **$AB$ is a Candidate Key**.

2. Since $AB$ is a key and $D \\to B$, we can substitute $B$ with $D$:
   - **$(AD)^+$**: $AD \\to E, D \\to B \\implies ABDE \\to C \\implies ABCDE$.
   - **$AD$ is a Candidate Key**.

3. Since $AD$ is a key and $C \\to D$, we can substitute $D$ with $C$:
   - **$(AC)^+$**: $AC \\to D \\implies ACD \\to B, E \\implies ABCDE$.
   - **$AC$ is a Candidate Key**.

Thus, the candidate keys are **$AB, AC, AD$**.
Prime attributes (part of any candidate key): $\\{A, B, C, D\\}$.
Non-prime attribute: $\\{E\\}$.

### Checking Normal Forms:
1. **BCNF Test**:
   - $C \\to D$: $C$ is not a superkey. Violates BCNF!
2. **3NF Test**:
   - For every $X \\to Y$: either $X$ is a superkey OR $Y$ is a prime attribute.
   - $AB \\to C$: $AB$ is superkey ✅
   - $C \\to D$: $D$ is prime attribute ✅
   - $D \\to B$: $B$ is prime attribute ✅
   - $D \\to E$: $E$ is non-prime, but is $D$ a superkey? No, but wait: is $E$ prime? No!
   Let's check $D \\to E$: $D$ is not superkey, and $E$ is NOT prime!
   Therefore, relation $R$ is in **3NF or 2NF** depending on whether $D \\to E$ is transitive. Here $D \\to E$ is a transitive dependency of non-prime on part of key, so $R$ is strictly in **3NF**.

**Correct Option: (C)**`,
      isAccepted: true,
      upvotes: 31,
      upvotedBy: [student._id, admin._id]
    });

    // 6. Computer Networks - TCP Congestion Control
    const doubt6 = await Doubt.create({
      title: 'GATE CSE 2021 | TCP Reno Congestion Window and ssthresh after 3 Duplicate ACKs',
      description: `A TCP connection is in Congestion Avoidance phase with a current congestion window ($cwnd$) of $32\\,\\text{KB}$ and maximum segment size (MSS) of $2\\,\\text{KB}$.

A triple duplicate ACK is received by the sender.
According to the **TCP Reno** algorithm (Fast Retransmit & Fast Recovery):
1. What will be the new value of $ssthresh$ in KB?
2. What will be the new value of $cwnd$ in KB immediately entering Fast Recovery?`,
      subjectName: 'Computer Networks',
      topic: 'Transport Layer & TCP',
      tags: ['computer-networks', 'tcp', 'congestion-control', 'fast-recovery', 'gate-2021'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2021',
      questionType: 'NAT',
      marks: 2,
      correctOption: '16, 19',
      askerId: student._id,
      collegeName: student.collegeName,
      upvotes: 44,
      downvotes: 0,
      views: 1290,
      status: 'resolved',
      hasAcceptedAnswer: true,
      answersCount: 1
    });

    await Answer.create({
      doubtId: doubt6._id,
      answererId: topper._id,
      content: `### TCP Reno Fast Retransmit & Fast Recovery:

When 3 duplicate ACKs are received:
1. **$ssthresh$ (Slow Start Threshold):**
   $$ssthresh = \\max\\left(2 \\times \\text{MSS},\\; \\frac{cwnd}{2}\\right) = \\frac{32\\,\\text{KB}}{2} = \\mathbf{16\\,\\text{KB}}$$

2. **$cwnd$ in TCP Reno (Fast Recovery):**
   Instead of dropping $cwnd$ to $1\\,\\text{MSS}$ (which is what TCP Tahoe does), TCP Reno sets:
   $$cwnd = ssthresh + 3 \\times \\text{MSS} = 16\\,\\text{KB} + 3 \\times 2\\,\\text{KB} = 16 + 6 = \\mathbf{22\\,\\text{KB}}$$
   *(Or if measuring in MSS: $ssthresh = 8\\,\\text{MSS}, cwnd = 8 + 3 = 11\\,\\text{MSS}$ = $22\\,\\text{KB}$)*.

*(Note: In questions where MSS is already accounted in segments: $16\\,\\text{MSS}$ halved is $8\\,\\text{MSS} + 3 = 11\\,\\text{MSS}$).*`,
      isAccepted: true,
      upvotes: 49,
      upvotedBy: [student._id, admin._id, faculty._id]
    });

    // 7. Computer Organization - Pipeline Hazards (Open / Unanswered for community)
    await Doubt.create({
      title: 'GATE CSE 2024 | Clock Cycles with 5-Stage Pipeline and Operand Forwarding',
      description: `Consider a 5-stage RISC processor pipeline: **IF, ID, EX, MEM, WB**.
Each stage takes exactly 1 clock cycle.

A program consists of 12 instructions without any branches. 3 pairs of consecutive instructions have a RAW (Read-After-Write) data dependency that is resolved via **operand forwarding from EX stage output to EX stage input**.

How many total clock cycles are needed to complete the execution of all 12 instructions? Can someone explain the cycle-by-cycle chart?`,
      subjectName: 'Computer Organization',
      topic: 'Instruction Pipelining & Hazards',
      tags: ['coa', 'pipelining', 'data-hazards', 'operand-forwarding', 'gate-2024'],
      examCategory: 'GATE CSE',
      examYear: 'GATE 2024',
      questionType: 'NAT',
      marks: 2,
      correctOption: '16',
      askerId: student._id,
      collegeName: student.collegeName,
      upvotes: 18,
      downvotes: 0,
      views: 450,
      status: 'open',
      hasAcceptedAnswer: false,
      answersCount: 0
    });

    // 8. Digital Logic - Multiplexers
    await Doubt.create({
      title: 'Minimum Number of 2-to-1 Multiplexers to Implement a 2-Input XOR Gate',
      description: `What is the minimum number of 2-to-1 multiplexers required to implement a 2-input XOR gate ($Y = A \\oplus B$) without using any external NOT gates or inverters?

Can someone provide the circuit diagram and selection line inputs?`,
      subjectName: 'Digital Logic',
      topic: 'Multiplexers & Combinational Circuits',
      tags: ['digital-logic', 'multiplexers', 'xor', 'boolean-algebra'],
      examCategory: 'GATE CSE',
      examYear: 'Practice',
      questionType: 'MCQ',
      marks: 1,
      options: [
        { label: 'A', text: '1' },
        { label: 'B', text: '2' },
        { label: 'C', text: '3' },
        { label: 'D', text: '4' }
      ],
      correctOption: 'B',
      askerId: admin._id,
      collegeName: 'GLA University',
      upvotes: 22,
      downvotes: 0,
      views: 610,
      status: 'open',
      hasAcceptedAnswer: false,
      answersCount: 0
    });

    console.log('✅ Successfully seeded realistic GATE Overflow questions, answers, and comments!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding doubts:', err);
    process.exit(1);
  }
};

seedDoubts();
