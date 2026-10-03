export const gatePracticeQuestions = [
  {
    id: "pyq_ds_1",
    subjectId: "programming-data-structures",
    topicId: "pds-trees",
    question: "Consider a complete binary tree with 7 nodes. Both traversals visit the left child before the right child. Let A denote the set of the first 3 nodes visited by breadth-first search (BFS) from the root, and B the set of the first 3 nodes visited by depth-first search (DFS) from the root. What is |A ∩ B|?",
    options: ["1", "2", "3", "0"],
    correctAnswer: "2",
    explanation: "BFS visits the root, then its left and right children: A = {1, 2, 3}. DFS visits the root, its left child, then that child's left child: B = {1, 2, 4}. Their intersection is {1, 2}, so |A ∩ B| = 2.",
    marks: 2
  },
  {
    id: "pyq_algo_1",
    subjectId: "algorithms",
    topicId: "algo-analysis",
    question: "Which one of the following is true? Let f(n) = n log n and g(n) = n^(1.5).",
    options: ["f(n) = O(g(n))", "g(n) = O(f(n))", "f(n) = Θ(g(n))", "f(n) = Ω(g(n))"],
    correctAnswer: "f(n) = O(g(n))",
    explanation: "n log n grows slower than n^1.5 because log n grows slower than n^0.5. Hence, f(n) = O(g(n)) is true.",
    marks: 1
  },
  {
    id: "pyq_os_1",
    subjectId: "operating-systems",
    topicId: "os-processes",
    question: "Consider a system with 3 processes that share 4 instances of the same resource type. Each process can request a maximum of K instances. Resource instances can be requested and released only one at a time. The largest value of K that will always avoid deadlock is:",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    explanation: "To guarantee no deadlock, the total maximum need minus the total number of processes must be strictly less than the total resources: N * (K - 1) < R. Here N=3, R=4. So 3(K - 1) < 4 => 3K - 3 < 4 => 3K < 7 => K = 2.",
    marks: 2
  },
  {
    id: "pyq_dbms_1",
    subjectId: "databases",
    topicId: "dbms-sql",
    question: "Which of the following is NOT a superkey in a relational schema with attributes V, W, X, Y, Z and primary key VY?",
    options: ["VXYZ", "VWXZ", "VWXY", "VWXYZ"],
    correctAnswer: "VWXZ",
    explanation: "A superkey must contain the primary key. The primary key is VY. 'VWXZ' does not contain Y, hence it does not contain the primary key VY. So VWXZ cannot be a superkey.",
    marks: 1
  },
  {
    id: "pyq_cn_1",
    subjectId: "computer-networks",
    topicId: "net-ip-addressing",
    question: "In an IPv4 datagram, the M bit is 0, the value of HLEN is 10, the value of total length is 400 and the fragment offset value is 300. The position of the datagram, the sequence numbers of the first and the last bytes of the payload, respectively are:",
    options: [
      "Last fragment, 2400 and 2789", 
      "First fragment, 2400 and 2759", 
      "Last fragment, 2400 and 2759", 
      "Middle fragment, 300 and 689"
    ],
    correctAnswer: "Last fragment, 2400 and 2759",
    explanation: "M=0 means More Fragments bit is 0, so it's the last fragment. HLEN=10 means header length is 10 * 4 = 40 bytes. Payload length = Total Length (400) - Header Length (40) = 360 bytes. Fragment offset = 300, which is in 8-byte blocks, so the first byte is 300 * 8 = 2400. The last byte is 2400 + 360 - 1 = 2759.",
    marks: 2
  },
  {
    id: "pyq_toc_1",
    subjectId: "theory-of-computation",
    topicId: "toc-regular-languages",
    question: "Which of the following regular expressions represents the language: the set of all binary strings having two consecutive 0s and two consecutive 1s?",
    options: [
      "(0+1)* 0011 (0+1)* + (0+1)* 1100 (0+1)*",
      "(0+1)* (00(0+1)*11 + 11(0+1)*00) (0+1)*",
      "(0+1)* 00 (0+1)* + (0+1)* 11 (0+1)*",
      "00 (0+1)* 11 + 11 (0+1)* 00"
    ],
    correctAnswer: "(0+1)* (00(0+1)*11 + 11(0+1)*00) (0+1)*",
    explanation: "The string must contain both '00' and '11'. They can appear in either order, with any characters in between, before, or after. Option B explicitly covers both '00...11' and '11...00'.",
    marks: 2
  },
  {
    id: "pyq_math_1",
    subjectId: "engineering-mathematics",
    topicId: "math-linear-algebra",
    question: "The value of x for which the matrix [ [x, 1], [1, x] ] has zero as an eigenvalue is",
    options: ["1", "-1", "0", "1 or -1"],
    correctAnswer: "1 or -1",
    explanation: "A matrix has a zero eigenvalue if and only if its determinant is zero. Determinant = x*x - 1 = 0 => x^2 = 1 => x = 1 or -1.",
    marks: 1
  },
  {
    id: "pyq_dl_1",
    subjectId: "digital-logic",
    topicId: "logic-boolean-algebra",
    question: "The minterm expansion of f(P,Q,R) = PQ + QR' + PR' is:",
    options: [
      "m2 + m4 + m6 + m7",
      "m0 + m1 + m3 + m5",
      "m4 + m5 + m6 + m7",
      "m2 + m3 + m4 + m5"
    ],
    correctAnswer: "m2 + m4 + m6 + m7",
    explanation: "PQ = PQR + PQR'. QR' = PQR' + P'QR'. PR' = PQR' + PQ'R'. Combining them: PQR(7) + PQR'(6) + P'QR'(2) + PQ'R'(4). So m2, m4, m6, m7.",
    marks: 2
  },
  {
    id: "pyq_ds_2",
    subjectId: "programming-data-structures",
    topicId: "pds-arrays-lists",
    question: "Consider an array A = [10, 20, 30, 40, 50]. The number of comparisons made by binary search to find 40 is:",
    options: ["1", "2", "3", "4"],
    correctAnswer: "2",
    explanation: "Mid = (0 + 4)/2 = 2. A[2] = 30. 40 > 30, search right half [40, 50]. Mid = (3 + 4)/2 = 3. A[3] = 40. Found in 2 comparisons.",
    marks: 1
  },
  {
    id: "pyq_algo_2",
    subjectId: "algorithms",
    topicId: "algo-graphs",
    question: "In a directed acyclic graph with n vertices and m edges, what is the time complexity to find the longest path between any two vertices?",
    options: ["O(n log n)", "O(n + m)", "O(n^2)", "NP-Hard"],
    correctAnswer: "O(n + m)",
    explanation: "For a DAG, we can use topological sorting which takes O(n + m) time, then relax the edges in topological order to find the longest path in O(n + m).",
    marks: 1
  }
];
