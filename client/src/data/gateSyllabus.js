import {
  Activity, Atom, Binary, BrainCircuit, Code2, Cpu, Database, Layers3, Network, Sparkles, Terminal,
} from 'lucide-react';

const topic = (id, title, minutes, goal, concepts) => ({ id, title, minutes, goal, concepts });

export const gateSubjects = [
  {
    id: 'engineering-mathematics', name: 'Engineering Mathematics', short: 'Maths', icon: BrainCircuit, color: 'violet', phase: 'Build foundations', note: 'The logic behind every great solution.',
    topics: [
      topic('math-discrete', 'Discrete mathematics', 90, 'Use formal reasoning to model finite structures and prove properties.', ['Propositional and predicate logic', 'Sets, relations and functions', 'Partial orders and lattices', 'Monoids and groups']),
      topic('math-graphs', 'Graph theory', 75, 'Represent relationships as graphs and reason about their connectivity and structure.', ['Graph terminology and representations', 'Connectivity and connected components', 'Matchings and colouring', 'Trees and graph properties']),
      topic('math-combinatorics', 'Combinatorics and recurrence relations', 75, 'Count discrete arrangements and solve recurrence-based counting problems.', ['Counting principles and permutations', 'Recurrence relations', 'Generating functions', 'Counting with constraints']),
      topic('math-linear-algebra', 'Linear algebra', 80, 'Solve systems and reason about eigenvalues and eigenvectors.', ['Matrices and determinants', 'Systems of linear equations', 'Eigenvalues and eigenvectors', 'LU decomposition']),
      topic('math-calculus', 'Calculus', 75, 'Analyze functions and compute limits, derivatives and integrals.', ['Limits, continuity and differentiability', 'Mean value theorems', 'Single-variable maxima and minima', 'Definite and indefinite integration']),
      topic('math-probability', 'Probability and statistics', 90, 'Quantify uncertainty and summarize the behavior of random variables.', ['Conditional probability, independence and Bayes theorem', 'Discrete and continuous random variables', 'Uniform, normal, exponential, Poisson and binomial distributions', 'Mean, median, mode, variance and standard deviation']),
    ],
  },
  {
    id: 'digital-logic', name: 'Digital Logic', short: 'Logic', icon: Binary, color: 'amber', phase: 'Build foundations', note: 'Turn bits into building blocks.',
    topics: [
      topic('logic-number-systems', 'Number systems and arithmetic', 65, 'Move confidently between representations and reason about finite-width arithmetic.', ['Binary, octal, decimal and hexadecimal conversions', 'Signed numbers, complements and overflow', 'Fixed-point and floating-point representation', 'Binary addition and subtraction']),
      topic('logic-boolean-algebra', 'Boolean algebra and minimization', 75, 'Simplify logic functions using the techniques named in the GATE syllabus.', ['Boolean algebra identities and De Morgan laws', 'Algebraic minimization', 'Karnaugh maps with don’t-care conditions', 'Tabular minimization method']),
      topic('logic-combinational', 'Combinational circuits', 80, 'Build output functions from gates and standard combinational blocks.', ['Multiplexers, decoders and encoders', 'Adders, subtractors and comparators', 'Parity generators and checkers', 'Hazards and propagation delay']),
      topic('logic-sequential', 'Sequential circuits', 90, 'Analyze state, timing and transitions in synchronous circuits.', ['Latches and flip-flops', 'Setup time, hold time and clocking', 'Counters, registers and shift registers', 'Finite-state machine design and state minimization']),
    ],
  },
  {
    id: 'computer-organization', name: 'Computer Organization & Architecture', short: 'COA', icon: Cpu, color: 'blue', phase: 'Build foundations', note: 'See what happens beneath the code.',
    topics: [
      topic('coa-instructions', 'Instruction set and addressing modes', 75, 'Trace instructions and calculate effective addresses for common addressing modes.', ['Instruction set and instruction formats', 'Addressing modes and effective addresses', 'Operand and address calculation', 'Instruction execution examples']),
      topic('coa-datapath', 'ALU and control unit design', 75, 'Follow data through the ALU and compare the two control-unit designs in the syllabus.', ['Arithmetic and logic unit design', 'Datapath and register transfers', 'Hardwired control unit', 'Microprogrammed control unit']),
      topic('coa-pipeline', 'Instruction pipelining and hazards', 90, 'Calculate pipeline behavior and identify hazards in an instruction stream.', ['Instruction pipeline stages', 'Pipeline speedup and throughput', 'Structural, data and control hazards', 'Forwarding and stalls']),
      topic('coa-memory', 'Memory interfacing and cache mapping', 100, 'Understand memory hierarchy performance and calculate cache mapping behavior.', ['Memory interfacing and hierarchy', 'Memory hierarchy performance', 'Direct, associative and set-associative cache mapping', 'Cache hit, miss and access-time calculations']),
      topic('coa-io', 'I/O interfaces, interrupts and DMA', 65, 'Compare interrupt-driven I/O with direct memory access.', ['I/O interface and data transfer', 'Interrupts and interrupt handling', 'Direct memory access', 'I/O transfer examples']),
    ],
  },
  {
    id: 'programming-data-structures', name: 'Programming & Data Structures', short: 'PDS', icon: Code2, color: 'emerald', phase: 'Core computing', note: 'Write it well. Structure it better.',
    topics: [
      topic('pds-c-programming', 'C programming and memory', 85, 'Trace C programs precisely, including pointer and storage behavior.', ['Types, operators, control flow and functions', 'Pointers, arrays and pointer arithmetic', 'Structures, unions and dynamic allocation', 'Scope, lifetime and recursion traces']),
      topic('pds-recursion', 'Recursion', 65, 'Translate recursive definitions into correct base cases and call traces.', ['Recurrence relations from code', 'Call stack and activation records', 'Tree recursion and backtracking', 'Recursion versus iteration']),
      topic('pds-arrays-lists', 'Arrays and linked lists', 75, 'Choose and manipulate sequential and linked representations.', ['Array operations and complexity', 'Singly and doubly linked lists', 'Circular lists and pointer updates', 'Sparse matrices and polynomial lists']),
      topic('pds-stacks-queues', 'Stacks and queues', 65, 'Apply linear ADTs to expression processing and scheduling problems.', ['Stack operations and expression conversion', 'Infix, prefix and postfix evaluation', 'Circular queues and deques', 'Applications: parsing, DFS and buffering']),
      topic('pds-trees', 'Trees and binary search trees', 85, 'Traverse trees and analyze search, insertion and deletion behavior.', ['Tree terminology and traversals', 'Binary search tree operations', 'Balanced trees and height', 'Threaded trees and expression trees']),
      topic('pds-heaps-graphs', 'Binary heaps and graphs', 90, 'Use priority structures and graph representations effectively.', ['Binary heaps and priority queues', 'Heap operations and array representation', 'Adjacency lists and matrices', 'Graph representation basics']),
    ],
  },
  {
    id: 'algorithms', name: 'Algorithms', short: 'Algo', icon: Layers3, color: 'rose', phase: 'Core computing', note: 'Find the elegant path to an answer.',
    topics: [
      topic('algo-analysis', 'Algorithm analysis', 80, 'Compare algorithms using asymptotic bounds and recurrence analysis.', ['Big O, Ω and Θ notation', 'Best, average and worst case', 'Recurrence trees and Master theorem', 'Amortized analysis']),
      topic('algo-search-sort', 'Searching and sorting', 85, 'Know the guarantees, costs and trade-offs of core search and sort algorithms.', ['Linear and binary search', 'Merge sort, quicksort and heapsort', 'Counting, radix and bucket sort', 'Worst-case time and space comparisons']),
      topic('algo-hashing', 'Hashing', 70, 'Choose hash functions and resolve collisions while tracking expected and worst-case cost.', ['Hash functions and table design', 'Chaining and open addressing', 'Linear and quadratic probing', 'Collision behavior and complexity']),
      topic('algo-divide-conquer', 'Divide and conquer', 65, 'Design algorithms by splitting a problem and combining subproblem results.', ['Recurrence formulation', 'Merge sort and binary search patterns', 'Closest pair and matrix multiplication ideas', 'Correctness by induction']),
      topic('algo-greedy', 'Greedy algorithms', 70, 'Recognize when local choices lead to a globally optimal solution.', ['Exchange arguments and cut property', 'Activity selection and interval scheduling', 'Huffman coding', 'Minimum spanning trees: Prim and Kruskal']),
      topic('algo-dynamic-programming', 'Dynamic programming', 95, 'Build state definitions, recurrences and reconstruction for optimization problems.', ['Overlapping subproblems and optimal substructure', 'Memoization and tabulation', 'Knapsack, sequence and matrix-chain patterns', 'State design and solution reconstruction']),
      topic('algo-graphs', 'Graph algorithms', 100, 'Select the right traversal, shortest-path or connectivity algorithm.', ['BFS, DFS, topological sorting and DAGs', 'Dijkstra, Bellman–Ford and Floyd–Warshall', 'Disjoint sets and spanning trees', 'Strongly connected components and articulation points']),
    ],
  },
  {
    id: 'theory-of-computation', name: 'Theory of Computation', short: 'TOC', icon: Atom, color: 'cyan', phase: 'Core computing', note: 'Explore the limits of computation.',
    topics: [
      topic('toc-finite-automata', 'Finite automata', 85, 'Model regular languages and convert between equivalent finite-state forms.', ['DFA and NFA design', 'NFA to DFA subset construction', 'DFA minimization', 'Product automata and equivalence']),
      topic('toc-regular-languages', 'Regular expressions and languages', 75, 'Connect regular expressions, automata and closure properties.', ['Regular expressions and precedence', 'Regex to automaton conversions', 'Closure under union, concatenation and star', 'Pumping lemma for regular languages']),
      topic('toc-context-free', 'Context-free grammars', 90, 'Describe nested structure and simplify grammars without changing their language.', ['CFG derivations and parse trees', 'Ambiguity and parse structure', 'Grammar simplification and normal forms', 'Pumping lemma for context-free languages']),
      topic('toc-pda', 'Pushdown automata', 70, 'Use stack memory to recognize context-free languages.', ['PDA configurations and transitions', 'Acceptance by final state or empty stack', 'PDA and CFG equivalence', 'Deterministic versus nondeterministic PDA']),
      topic('toc-turing', 'Turing machines and decidability', 100, 'Reason about computation models, recognizable languages and decision procedures.', ['Turing machine configurations', 'Decidable and recognizable languages', 'Variants and Church–Turing thesis', 'Universal Turing machine']),
      topic('toc-undecidability', 'Undecidability and reductions', 85, 'Prove limits of computation by mapping known hard problems.', ['Diagonalization and self-reference', 'Halting problem', 'Mapping reductions', 'Rice theorem and classic undecidable problems']),
    ],
  },
  {
    id: 'compiler-design', name: 'Compiler Design', short: 'Compiler', icon: Terminal, color: 'orange', phase: 'Core computing', note: 'Follow a language from source to machine.',
    topics: [
      topic('compiler-lexical', 'Lexical analysis', 75, 'Convert character streams into tokens using regular-language techniques.', ['Tokens, lexemes and patterns', 'Regular expressions and finite automata', 'Longest match and lexical errors', 'Symbol tables and input buffering']),
      topic('compiler-parsing', 'Parsing and syntax analysis', 100, 'Determine whether token sequences fit a grammar and construct parse structure.', ['FIRST and FOLLOW sets', 'LL(1) parsing tables and conflicts', 'LR(0), SLR, CLR and LALR items', 'Shift-reduce and reduce-reduce conflicts']),
      topic('compiler-syntax-directed', 'Syntax-directed translation', 75, 'Attach meaning and intermediate actions to grammatical structure.', ['Syntax-directed definitions', 'Synthesized and inherited attributes', 'Type checking and conversion', 'Translation schemes']),
      topic('compiler-runtime', 'Runtime environments', 70, 'Model storage and access for procedures, recursion and nested scopes.', ['Activation records and calling sequences', 'Static and dynamic scope', 'Parameter passing methods', 'Heap, stack and garbage collection basics']),
      topic('compiler-intermediate', 'Intermediate code generation', 75, 'Represent program operations in a form suitable for optimization.', ['Three-address code', 'Quadruples, triples and indirect triples', 'Control-flow graphs', 'Boolean expressions and backpatching']),
      topic('compiler-optimization', 'Local optimization and data-flow analysis', 90, 'Apply the local optimizations and data-flow analyses listed in the GATE syllabus.', ['Basic blocks and local optimization', 'Constant propagation', 'Liveness analysis', 'Common subexpression elimination']),
    ],
  },
  {
    id: 'operating-systems', name: 'Operating Systems', short: 'OS', icon: Activity, color: 'indigo', phase: 'Systems', note: 'Make sense of the machine multitasking.',
    topics: [
      topic('os-processes', 'Processes and threads', 85, 'Explain process state, context switches and concurrency at the execution level.', ['Process states and process control blocks', 'Context switching and system calls', 'Threads and multithreading models', 'Inter-process communication']),
      topic('os-scheduling', 'CPU scheduling', 85, 'Evaluate scheduling policies using waiting, turnaround and response time.', ['FCFS, SJF and shortest remaining time', 'Priority and round-robin scheduling', 'Multilevel feedback queues', 'Preemption and scheduling metrics']),
      topic('os-synchronization', 'Synchronization', 100, 'Prevent race conditions and reason about concurrent execution.', ['Critical sections and atomicity', 'Mutexes, semaphores and monitors', 'Producer-consumer, readers-writers and dining philosophers', 'Condition variables and classic pitfalls']),
      topic('os-deadlocks', 'Deadlocks', 75, 'Detect, prevent or avoid deadlock using resource-allocation models.', ['Necessary conditions for deadlock', 'Resource allocation graphs', 'Banker’s algorithm', 'Detection, prevention and recovery']),
      topic('os-memory', 'Memory management', 90, 'Translate addresses and compare contiguous and paged allocation.', ['Address binding and relocation', 'Paging, segmentation and page tables', 'TLB and effective access time', 'Internal and external fragmentation']),
      topic('os-virtual-memory', 'Virtual memory', 90, 'Analyze demand paging, replacement policies and working-set behavior.', ['Page faults and demand paging', 'FIFO, LRU, optimal and clock replacement', 'Thrashing and working sets', 'Copy-on-write and memory mapped files']),
      topic('os-files-io', 'File systems and I/O', 85, 'Understand file allocation, directory structures and device scheduling.', ['File access methods and metadata', 'Contiguous, linked and indexed allocation', 'Free-space management and inodes', 'Disk scheduling and I/O buffering']),
    ],
  },
  {
    id: 'databases', name: 'Databases', short: 'DBMS', icon: Database, color: 'purple', phase: 'Systems', note: 'Design data that stays useful.',
    topics: [
      topic('dbms-er-relational', 'ER and relational models', 75, 'Map conceptual data requirements into a well-formed relational schema.', ['Entities, attributes and relationship constraints', 'Weak entities and ER-to-relational mapping', 'Keys and integrity constraints', 'Relational model and schema design']),
      topic('dbms-sql', 'SQL and relational algebra', 95, 'Translate data questions into precise algebraic and SQL expressions.', ['Selection, projection, joins and set operations', 'Nested queries, aggregation and NULL', 'Tuple and domain relational calculus', 'SQL constraints, views and triggers']),
      topic('dbms-functional-dependencies', 'Functional dependencies', 70, 'Use dependencies to identify keys and reason about redundancy.', ['Attribute closure and candidate keys', 'Armstrong’s axioms', 'Minimal covers', 'Lossless join and dependency preservation']),
      topic('dbms-normalization', 'Normalization', 85, 'Decompose relations to reduce anomalies while preserving useful properties.', ['1NF, 2NF and 3NF', 'BCNF decomposition', 'Lossless decomposition tests', 'Update, insertion and deletion anomalies']),
      topic('dbms-storage-indexing', 'Storage and indexing', 85, 'Estimate access cost and select appropriate file and index structures.', ['Disk blocks and record organization', 'Primary, secondary and clustered indexes', 'B and B+ trees', 'Hashing and index cost calculations']),
      topic('dbms-transactions', 'Transactions and concurrency', 100, 'Analyze schedules for serializability and recoverability.', ['ACID properties and transaction states', 'Conflict and view serializability', 'Precedence graphs', 'Locking, two-phase locking and timestamp ordering']),
    ],
  },
  {
    id: 'computer-networks', name: 'Computer Networks', short: 'Networks', icon: Network, color: 'teal', phase: 'Systems', note: 'Trace the journey from one packet to another.',
    topics: [
      topic('net-fundamentals', 'Layering, switching and performance', 75, 'Compare network layers, switching types and their performance metrics.', ['Principles of layering', 'Circuit, packet and virtual-circuit switching', 'Network performance metrics', 'Delay, throughput and bandwidth-delay product']),
      topic('net-link-layer', 'Data link layer and Ethernet', 85, 'Understand error detection, medium access and Ethernet behavior.', ['Framing and error detection', 'Medium access control', 'Ethernet operation', 'Ethernet bridging']),
      topic('net-routing', 'Distance-vector and link-state routing', 85, 'Trace route updates and shortest paths for the two routing approaches in the syllabus.', ['Shortest-path routing', 'Distance-vector routing', 'Link-state routing', 'Routing table examples']),
      topic('net-ip-addressing', 'IPv4, fragmentation, CIDR and NAT', 100, 'Calculate IPv4 fragmentation and CIDR ranges and explain network address translation.', ['IPv4 addressing and header fields', 'Fragmentation and reassembly', 'CIDR notation and prefix calculations', 'Network Address Translation (NAT)']),
      topic('net-transport', 'TCP flow control, congestion and sockets', 100, 'Analyze TCP flow and congestion control and understand the socket API.', ['TCP segments and connection basics', 'Flow control and sliding windows', 'Congestion control behavior', 'Socket API and client-server calls']),
      topic('net-application', 'DNS and HTTP', 75, 'Trace name resolution and the request-response flow of HTTP.', ['DNS hierarchy, lookup and caching', 'HTTP request and response structure', 'Persistent and non-persistent HTTP', 'Web communication examples']),
    ],
  },
  {
    id: 'general-aptitude', name: 'General Aptitude', short: 'Aptitude', icon: Sparkles, color: 'pink', phase: 'Every week', note: 'A few focused minutes make a difference.',
    topics: [
      topic('ga-verbal', 'Verbal aptitude', 45, 'Improve accuracy in English grammar, vocabulary and reading tasks.', ['Tenses, articles, adjectives, prepositions and conjunctions', 'Verb-noun agreement and other parts of speech', 'Words, idioms and phrases in context', 'Reading comprehension and narrative sequencing']),
      topic('ga-quantitative', 'Quantitative aptitude', 60, 'Build speed with data interpretation, numerical computation and estimation.', ['Bar graphs, pie charts, plots, maps and tables', 'Ratios, percentages, powers, exponents and logarithms', 'Permutations, combinations, series, mensuration and geometry', 'Elementary statistics and probability']),
      topic('ga-analytical', 'Analytical aptitude', 50, 'Structure information and draw valid conclusions from reasoning problems.', ['Deduction and induction', 'Analogies', 'Numerical relations', 'Numerical reasoning']),
      topic('ga-spatial', 'Spatial aptitude', 35, 'Visualize the shape transformations and patterns in the GATE aptitude syllabus.', ['Translation, rotation, scaling and mirroring', 'Assembling and grouping shapes', 'Paper folding and cutting', 'Patterns in two and three dimensions']),
    ],
  },
];

export const gatePhases = ['All subjects', 'Build foundations', 'Core computing', 'Systems', 'Every week'];
export const gateTopicCount = gateSubjects.reduce((total, subject) => total + subject.topics.length, 0);
