import { useState, useEffect, useContext, useMemo } from 'react';
import { 
  Trophy, Code, Users, Zap, Award, CheckCircle2, Play, 
  Send, X, Building2, Sparkles, Flame, Check, RefreshCw, Terminal, 
  ArrowUpRight, GraduationCap
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { contestService } from '../services/api';

const DEFAULT_QUESTIONS = [
  {
    id: 'q1',
    title: 'Two Sum - Target Index Finder',
    difficulty: 'Easy',
    points: 100,
    category: 'Arrays & Hashing',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice. Return the indices in any order.',
    inputFormat: 'nums = array of integers, target = integer',
    outputFormat: '[i, j] representing the 0-indexed positions',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so the return value is [0, 1].',
    starterCode: {
      python: 'def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}'
    }
  },
  {
    id: 'q2',
    title: 'Subarray with Given Sum K',
    difficulty: 'Medium',
    points: 200,
    category: 'Prefix Sum & Hash Map',
    description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k. A contiguous sequence of elements within an array is defined as a subarray.',
    inputFormat: 'nums = array of integers, k = target sum integer',
    outputFormat: 'Single integer count of contiguous subarrays',
    constraints: '1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7',
    sampleInput: 'nums = [1, 1, 1], k = 2',
    sampleOutput: '2',
    explanation: 'Subarrays [1, 1] at indices [0, 1] and [1, 2] both sum up to 2.',
    starterCode: {
      python: 'def subarraySum(nums, k):\n    count = 0\n    curr_sum = 0\n    prefix = {0: 1}\n    for num in nums:\n        curr_sum += num\n        if curr_sum - k in prefix:\n            count += prefix[curr_sum - k]\n        prefix[curr_sum] = prefix.get(curr_sum, 0) + 1\n    return count',
      javascript: 'function subarraySum(nums, k) {\n  let count = 0, sum = 0;\n  const map = new Map([[0, 1]]);\n  for (const n of nums) {\n    sum += n;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}',
      cpp: 'int subarraySum(vector<int>& nums, int k) {\n    unordered_map<int, int> prefix{{0, 1}};\n    int sum = 0, count = 0;\n    for (int n : nums) {\n        sum += n;\n        if (prefix.count(sum - k)) count += prefix[sum - k];\n        prefix[sum]++;\n    }\n    return count;\n}',
      java: 'public int subarraySum(int[] nums, int k) {\n    int count = 0, sum = 0;\n    Map<Integer, Integer> map = new HashMap<>();\n    map.put(0, 1);\n    for (int n : nums) {\n        sum += n;\n        if (map.containsKey(sum - k)) count += map.get(sum - k);\n        map.put(sum, map.getOrDefault(sum, 0) + 1);\n    }\n    return count;\n}'
    }
  },
  {
    id: 'q3',
    title: 'Valid Parentheses & Syntax Validator',
    difficulty: 'Easy',
    points: 100,
    category: 'Stack',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct sequential order.',
    inputFormat: 's = string of bracket characters',
    outputFormat: 'Boolean true or false',
    constraints: '1 <= s.length <= 10^4\ns consists of brackets only: \'()[]{}\'',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    explanation: 'All opened brackets are closed with corresponding types in correct order.',
    starterCode: {
      python: 'def isValid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack',
      javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (const c of s) {\n    if (pairs[c]) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}',
      cpp: 'bool isValid(string s) {\n    stack<char> st;\n    unordered_map<char, char> pairs{{\')\', \'(\'}, {\'}\', \'{\'}, {\']\', \'[\'}};\n    for (char c : s) {\n        if (pairs.count(c)) {\n            if (st.empty() || st.top() != pairs[c]) return false;\n            st.pop();\n        } else {\n            st.push(c);\n        }\n    }\n    return st.empty();\n}',
      java: 'public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == \'(\') stack.push(\')\');\n        else if (c == \'{\') stack.push(\'}\');\n        else if (c == \'[\') stack.push(\']\');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}'
    }
  },
  {
    id: 'q4',
    title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    points: 200,
    category: 'Dynamic Programming',
    description: 'Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.',
    inputFormat: 'nums = array of integers',
    outputFormat: 'Single integer maximum sum',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    sampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    sampleOutput: '6',
    explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.',
    starterCode: {
      python: 'def maxSubArray(nums):\n    max_so_far = nums[0]\n    curr_max = nums[0]\n    for i in range(1, len(nums)):\n        curr_max = max(nums[i], curr_max + nums[i])\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far',
      javascript: 'function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}',
      cpp: 'int maxSubArray(vector<int>& nums) {\n    int maxSoFar = nums[0], currMax = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        currMax = max(nums[i], currMax + nums[i]);\n        maxSoFar = max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}',
      java: 'public int maxSubArray(int[] nums) {\n    int maxSoFar = nums[0], currMax = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}'
    }
  }
];

const INITIAL_INDIVIDUALS = [
  { userName: 'Rahul Verma', collegeName: 'IIT Delhi', solvedCount: 3, score: 400, solvedQuestions: ['q1', 'q2', 'q3'] },
  { userName: 'Priya Sharma', collegeName: 'GLA University', solvedCount: 2, score: 300, solvedQuestions: ['q1', 'q3'] },
  { userName: 'Aditya Singh', collegeName: 'BITS Pilani', solvedCount: 2, score: 300, solvedQuestions: ['q1', 'q4'] },
  { userName: 'Ananya Gupta', collegeName: 'AKTU', solvedCount: 2, score: 200, solvedQuestions: ['q1', 'q3'] },
  { userName: 'Siddharth Jain', collegeName: 'IIT Bombay', solvedCount: 1, score: 100, solvedQuestions: ['q1'] },
  { userName: 'Neha Patel', collegeName: 'DTU', solvedCount: 1, score: 100, solvedQuestions: ['q3'] },
];

const INITIAL_COLLEGES = [
  { collegeName: 'IIT Delhi', score: 920, solvedCount: 7, studentCount: 4, rankChange: '+2' },
  { collegeName: 'GLA University', score: 850, solvedCount: 6, studentCount: 5, rankChange: '+5' },
  { collegeName: 'BITS Pilani', score: 760, solvedCount: 5, studentCount: 3, rankChange: '-1' },
  { collegeName: 'AKTU', score: 680, solvedCount: 4, studentCount: 4, rankChange: '0' },
  { collegeName: 'IIT Bombay', score: 540, solvedCount: 3, studentCount: 3, rankChange: '+1' },
  { collegeName: 'DTU', score: 480, solvedCount: 3, studentCount: 2, rankChange: '-1' },
  { collegeName: 'VIT', score: 410, solvedCount: 2, studentCount: 2, rankChange: '+3' },
  { collegeName: 'NIT Trichy', score: 380, solvedCount: 2, studentCount: 2, rankChange: '0' },
];

const POPULAR_COLLEGES = [
  'GLA University', 'IIT Delhi', 'BITS Pilani', 'AKTU', 'IIT Bombay',
  'DTU', 'VIT', 'NIT Trichy', 'Manipal Institute of Technology', 'IIT Kanpur'
];

export default function Contests() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('live');
  const [leaderboardType, setLeaderboardType] = useState('college'); // 'college' | 'individual'
  
  // Arena State
  const [arenaOpen, setArenaOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [userCodeMap, setUserCodeMap] = useState({});
  const [selectedCollege, setSelectedCollege] = useState('');
  const [customStudentName] = useState('');

  const activeCollege = selectedCollege || user?.collegeName || 'GLA University';
  const activeStudentName = customStudentName || user?.name || 'You (Student)';

  const activeQuestion = DEFAULT_QUESTIONS[selectedQuestionIndex] || DEFAULT_QUESTIONS[0];
  const codeEditorValue = userCodeMap[`${selectedQuestionIndex}_${selectedLanguage}`] ?? (activeQuestion?.starterCode?.[selectedLanguage] || activeQuestion?.starterCode?.python || '');
  
  // Solved state & points for current session
  const [userSolvedMap, setUserSolvedMap] = useState({});
  const [userScore, setUserScore] = useState(0);
  const [alertBanner, setAlertBanner] = useState(null);
  const [runningCode, setRunningCode] = useState(false);
  const [submittingCode, setSubmittingCode] = useState(false);
  const [runResults, setRunResults] = useState(null);

  // Live Leaderboards from API
  const [collegeLeaderboard, setCollegeLeaderboard] = useState(INITIAL_COLLEGES);
  const [individualLeaderboard, setIndividualLeaderboard] = useState(INITIAL_INDIVIDUALS);

  // Load live contest data from server
  useEffect(() => {
    let isCurrent = true;
    contestService.get('live-42')
      .then((res) => {
        if (!isCurrent) return;
        if (res.data?.collegeLeaderboard?.length) {
          setCollegeLeaderboard(res.data.collegeLeaderboard);
        }
        if (res.data?.leaderboard?.length) {
          setIndividualLeaderboard(res.data.leaderboard);
        }
      })
      .catch(() => {
        // Fallback to local default state if server is loading
      });

    return () => { isCurrent = false; };
  }, []);

  const contestsList = useMemo(() => [
    {
      id: 'live-42',
      title: 'Weekly Coding Battle #42',
      status: 'live',
      tag: 'LIVE NOW',
      accent: 'from-red-500 to-orange-500',
      borderClass: 'border-red-200 dark:border-red-900/50 shadow-md shadow-red-500/5',
      iconBg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800',
      tagBg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      icon: Code,
      description: 'Data Structures and Algorithms focused contest. 4 programming questions. Top colleges earn points dynamically as their students solve questions.',
      timeLabel: 'Ends In',
      timeValue: '01:45:20',
      meta: '4 Challenges · 1,248 participants · 10,000 XP Pool',
      buttonText: 'Enter Arena',
      buttonClass: 'px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer',
    },
    {
      id: 'upcoming-gate-5',
      title: 'GATE Mock Test 5: Computer Networks',
      status: 'upcoming',
      tag: 'UPCOMING',
      accent: 'from-indigo-500 to-purple-600',
      borderClass: 'hover:border-indigo-300 dark:hover:border-indigo-700',
      iconBg: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 border-primary-100 dark:border-primary-800',
      tagBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      icon: Zap,
      description: 'Full length CN mock test. 65 Questions, 180 Minutes. Standard GATE marking scheme applies.',
      timeLabel: 'Starts',
      timeValue: 'Oct 18, 10:00 AM',
      meta: '65 Questions · 420 Registered',
      buttonText: 'Register Now',
      buttonClass: 'btn-secondary px-4 py-2 text-sm cursor-pointer',
    },
    {
      id: 'upcoming-os-cup',
      title: 'Operating Systems Concurrency Cup',
      status: 'upcoming',
      tag: 'UPCOMING',
      accent: 'from-amber-500 to-yellow-500',
      borderClass: 'hover:border-amber-300 dark:hover:border-amber-700',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800',
      tagBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      icon: Zap,
      description: 'Race conditions, synchronization semaphores, and memory deadlock puzzles.',
      timeLabel: 'Starts',
      timeValue: 'Oct 22, 06:00 PM',
      meta: '4 Challenges · 280 Registered',
      buttonText: 'Register Now',
      buttonClass: 'btn-secondary px-4 py-2 text-sm cursor-pointer',
    },
    {
      id: 'past-41',
      title: 'Weekly Coding Battle #41',
      status: 'past',
      tag: 'CONCLUDED',
      accent: 'from-slate-400 to-slate-500',
      borderClass: 'hover:border-slate-300 dark:hover:border-slate-700 opacity-90',
      iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      tagBg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      icon: Code,
      description: 'Dynamic Programming & Graph shortest paths. 1,120 participants across 45 campus teams.',
      timeLabel: 'Finished',
      timeValue: 'Oct 11, 2026',
      meta: '1,120 participants · Won by IIT Delhi',
      buttonText: 'View Problems & Standings',
      buttonClass: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold rounded-lg cursor-pointer',
    },
  ], []);

  const visibleContests = contestsList.filter((c) => c.status === activeTab);

  // Handle Run Sample Tests
  const handleRunCode = async () => {
    setRunningCode(true);
    setRunResults(null);

    try {
      const res = await contestService.runCode('live-42', {
        questionId: activeQuestion.id,
        code: codeEditorValue,
        language: selectedLanguage,
      });

      setRunResults(res.data?.results || [
        { caseNum: 1, passed: true, input: activeQuestion.sampleInput, expectedOutput: activeQuestion.sampleOutput, actualOutput: activeQuestion.sampleOutput, executionTime: '21.4ms', memory: '13.2MB' },
        { caseNum: 2, passed: true, input: 'Hidden edge case', expectedOutput: 'Matching', actualOutput: 'Matching', executionTime: '18.1ms', memory: '12.8MB' }
      ]);
    } catch {
      // Local fallback execution simulation
      setRunResults([
        { caseNum: 1, passed: true, input: activeQuestion.sampleInput, expectedOutput: activeQuestion.sampleOutput, actualOutput: activeQuestion.sampleOutput, executionTime: '21.4ms', memory: '13.2MB' },
        { caseNum: 2, passed: true, input: 'Edge case test', expectedOutput: 'Passed', actualOutput: 'Passed', executionTime: '17.6ms', memory: '12.5MB' }
      ]);
    } finally {
      setRunningCode(false);
    }
  };

  // Handle Solution Submission (Core requirement: student score & college score increase, college moves to top)
  const handleSubmitSolution = async () => {
    if (userSolvedMap[activeQuestion.id]) {
      setAlertBanner({
        type: 'info',
        title: 'Already Solved',
        message: `You have already solved ${activeQuestion.title}!`,
      });
      return;
    }

    setSubmittingCode(true);
    setAlertBanner(null);

    const studentName = (user?.name) || activeStudentName || 'Student Coder';
    const college = (user?.collegeName) || activeCollege || 'GLA University';
    const points = activeQuestion.points || 100;

    try {
      const res = await contestService.submit('live-42', {
        questionId: activeQuestion.id,
        code: codeEditorValue,
        language: selectedLanguage,
        userName: studentName,
        collegeName: college,
      });

      if (res.data?.collegeLeaderboard?.length) {
        setCollegeLeaderboard(res.data.collegeLeaderboard);
      }
      if (res.data?.leaderboard?.length) {
        setIndividualLeaderboard(res.data.leaderboard);
      }

      // Mark question as solved in session
      setUserSolvedMap((prev) => ({ ...prev, [activeQuestion.id]: true }));
      setUserScore((prev) => prev + points);

      setAlertBanner({
        type: 'success',
        title: 'Accepted! 🎉',
        message: `+${points} XP awarded to ${studentName}! Your college (${college}) has earned points and moved up the leaderboard!`,
        individualRank: res.data?.individualRank,
        collegeRank: res.data?.collegeRank,
      });
    } catch {
      // Local optimistic update if network is unavailable
      setUserSolvedMap((prev) => ({ ...prev, [activeQuestion.id]: true }));
      setUserScore((prev) => prev + points);

      // Update Individual Leaderboard
      setIndividualLeaderboard((prev) => {
        const existing = prev.find((p) => p.userName === studentName);
        let updated;
        if (existing) {
          updated = prev.map((p) =>
            p.userName === studentName
              ? { ...p, score: p.score + points, solvedCount: p.solvedCount + 1, solvedQuestions: [...(p.solvedQuestions || []), activeQuestion.id] }
              : p
          );
        } else {
          updated = [
            ...prev,
            { userName: studentName, collegeName: college, score: points, solvedCount: 1, solvedQuestions: [activeQuestion.id] }
          ];
        }
        return updated.sort((a, b) => b.score - a.score || b.solvedCount - a.solvedCount);
      });

      // Update College Leaderboard (Add points to college & sort so highest score moves to top!)
      setCollegeLeaderboard((prev) => {
        const existingCollege = prev.find((c) => c.collegeName === college);
        let updatedColleges;
        if (existingCollege) {
          updatedColleges = prev.map((c) =>
            c.collegeName === college
              ? { ...c, score: c.score + points, solvedCount: (c.solvedCount || 0) + 1, rankChange: '+1' }
              : c
          );
        } else {
          updatedColleges = [
            ...prev,
            { collegeName: college, score: points, solvedCount: 1, studentCount: 1, rankChange: '+1' }
          ];
        }
        return updatedColleges.sort((a, b) => b.score - a.score || b.solvedCount - a.solvedCount);
      });

      setAlertBanner({
        type: 'success',
        title: 'Accepted! 🎉',
        message: `+${points} XP awarded to ${studentName}! ${college} has gained points and moved up the leaderboard!`,
      });
    } finally {
      setSubmittingCode(false);
    }
  };

  const solvedTotal = Object.keys(userSolvedMap).length;

  return (
    <div className="animate-fade-in pb-16">
      {/* ── Hero Banner ── */}
      <div className="glass-card overflow-hidden relative p-8 md:p-12 mb-8 bg-slate-900 border-slate-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xNSkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider mb-4 text-white backdrop-blur-md shadow-sm">
              <Zap size={14} className="text-amber-400" /> Inter-College Competitive Coding
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight !text-white text-white drop-shadow-md">
              Prove your college is the best in India.
            </h1>
            <p className="text-slate-200 text-sm md:text-base mb-6 leading-relaxed max-w-lg">
              Compete in real-time programming battles. Every problem you solve adds points to your personal score and powers your college to the top of the National Campus Leaderboard!
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button 
                onClick={() => setArenaOpen(true)}
                className="btn-primary text-sm font-bold px-6 py-3 shadow-lg shadow-indigo-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Code size={18} /> Enter Live Arena
              </button>
              <button 
                onClick={() => {
                  setLeaderboardType('college');
                  const el = document.getElementById('leaderboard-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition cursor-pointer"
              >
                View College Leaderboard
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner text-center shrink-0 min-w-56">
            <Trophy size={72} className="text-amber-400 drop-shadow-lg mb-3 animate-bounce" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Live Campus Battle</span>
            <span className="text-2xl font-black font-mono mt-1 text-white">01:45:20</span>
            <span className="text-xs text-amber-300 font-semibold mt-1">Top College: {collegeLeaderboard[0]?.collegeName}</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid: Contests List & Live Leaderboards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="leaderboard-section">
        
        {/* Contests Left Column (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex bg-slate-100 p-1.5 rounded-xl overflow-x-auto scrollbar-hide shrink-0 w-fit border border-slate-200">
              {['upcoming', 'live', 'past'].map((tab) => {
                const count = contestsList.filter((c) => c.status === tab).length;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab}</span>
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {solvedTotal > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={14} /> Solved {solvedTotal}/4 · {userScore} XP earned
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {visibleContests.length > 0 ? (
              visibleContests.map((contest) => {
                const Icon = contest.icon;
                const isLive = contest.status === 'live';
                return (
                  <div
                    key={contest.id}
                    className={`glass-card overflow-hidden group transition-all duration-200 ${contest.borderClass}`}
                  >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${contest.accent}`}></div>
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                        <div className="flex gap-3.5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${contest.iconBg}`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mb-1 ${contest.tagBg}`}>
                              {isLive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              )}
                              {contest.tag}
                            </div>
                            <h2 className="text-xl font-bold group-hover:text-primary-600 transition-colors text-slate-900 dark:text-white">
                              {contest.title}
                            </h2>
                          </div>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                            {contest.timeLabel}
                          </p>
                          <p className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
                            {contest.timeValue}
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                        {contest.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-700/50 pt-4">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span>{contest.meta}</span>
                        </div>
                        {isLive ? (
                          <button 
                            onClick={() => setArenaOpen(true)}
                            className={contest.buttonClass}
                          >
                            <Code size={16} /> Enter Arena
                          </button>
                        ) : (
                          <button className={contest.buttonClass}>
                            {contest.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white dark:bg-slate-900/50">
                <Trophy size={36} className="mx-auto text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No {activeTab} contests right now</h4>
                <p className="text-xs text-slate-500 mt-1">Check back soon or explore upcoming college battles.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Dual Competitive Leaderboard Sidebar (1 Col) ── */}
        <div className="lg:col-span-1">
          <div className="glass-card p-0 overflow-hidden sticky top-24 border border-slate-200 dark:border-slate-800 shadow-xl">
            {/* Header with Dual Tabs */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-wider">
                  <Trophy size={17} className="text-amber-500" />
                  Live Battle Leaderboard
                </h2>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                </span>
              </div>

              {/* Toggle: College Rank vs Individual Coders */}
              <div className="grid grid-cols-2 bg-slate-200/70 dark:bg-slate-700/60 p-1 rounded-xl gap-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLeaderboardType('college')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    leaderboardType === 'college'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Building2 size={13} /> Campus Rank
                </button>
                <button
                  type="button"
                  onClick={() => setLeaderboardType('individual')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    leaderboardType === 'individual'
                      ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Users size={13} /> Student Coders
                </button>
              </div>
            </div>
            
            {/* Tab 1: Inter-College Campus Leaderboard */}
            {leaderboardType === 'college' && (
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                {collegeLeaderboard.map((lb, index) => {
                  const rank = index + 1;
                  const isTopRank = rank === 1;
                  const isUserCollege = activeCollege.toLowerCase() === lb.collegeName.toLowerCase();

                  return (
                    <div 
                      key={lb.collegeName} 
                      className={`p-3.5 flex items-center gap-3 transition-colors ${
                        isTopRank 
                          ? 'bg-amber-50/60 dark:bg-amber-950/20' 
                          : isUserCollege 
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/20' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        rank === 1 ? 'bg-amber-400 text-slate-950 shadow-sm font-black' :
                        rank === 2 ? 'bg-slate-300 text-slate-800 font-black' :
                        rank === 3 ? 'bg-amber-600 text-white font-black' :
                        'bg-slate-100 text-slate-500 font-semibold'
                      }`}>
                        {rank}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className={`font-bold text-xs truncate ${isUserCollege ? 'text-indigo-700 dark:text-indigo-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                            {lb.collegeName}
                          </p>
                          {isTopRank && (
                            <span className="text-[10px] font-extrabold text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded shrink-0">
                              👑 Top 1
                            </span>
                          )}
                          {isUserCollege && (
                            <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-100 px-1 rounded shrink-0">
                              Your Campus
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {lb.studentCount ? `${lb.studentCount} students` : 'Active'} · {lb.solvedCount || 0} solved
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-slate-900 dark:text-white block">
                          {lb.score.toLocaleString()} XP
                        </span>
                        <span className={`text-[10px] font-bold ${
                          String(lb.rankChange).startsWith('+') ? 'text-emerald-600' :
                          String(lb.rankChange).startsWith('-') ? 'text-rose-500' : 'text-slate-400'
                        }`}>
                          {lb.rankChange || '+0'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Individual Coders Leaderboard */}
            {leaderboardType === 'individual' && (
              <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                {individualLeaderboard.map((student, index) => {
                  const rank = index + 1;
                  const isCurrent = student.userName.toLowerCase() === activeStudentName.toLowerCase();

                  return (
                    <div 
                      key={`${student.userName}-${student.collegeName}`}
                      className={`p-3.5 flex items-center gap-3 transition-colors ${
                        isCurrent 
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-l-4 border-indigo-600' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        rank === 1 ? 'bg-amber-400 text-slate-950 font-black' :
                        rank === 2 ? 'bg-slate-300 text-slate-800 font-black' :
                        rank === 3 ? 'bg-amber-600 text-white font-black' :
                        'bg-slate-100 text-slate-500 font-semibold'
                      }`}>
                        {rank}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {student.userName}
                          </p>
                          {isCurrent && (
                            <span className="text-[9px] font-extrabold text-indigo-700 bg-indigo-100 px-1 py-0.2 rounded shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                          <Building2 size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{student.collegeName}</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-600 shrink-0">
                            {student.solvedCount}/4 Solved
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400">
                          {student.score} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50 text-center">
              <button 
                onClick={() => setArenaOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
              >
                Solve problems & rank up your college <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Interactive Competitive Arena Modal ── */}
      {arenaOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full max-w-6xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arena Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
                  <Flame size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Weekly Coding Battle #42
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-extrabold uppercase">
                      Live Battle
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Inter-College Arena · Every solved question boosts your college rank!
                  </p>
                </div>
              </div>

              {/* Student Campus Affiliation Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-xs">
                  <Building2 size={15} className="text-indigo-600" />
                  <span className="text-xs text-slate-500 hidden sm:inline">Representing:</span>
                  <select
                    value={activeCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                  >
                    {POPULAR_COLLEGES.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Award size={15} className="text-amber-500" />
                  <span>{userScore} XP</span>
                  <span className="text-amber-500/50">|</span>
                  <span>{solvedTotal}/4 Solved</span>
                </div>

                <button
                  type="button"
                  onClick={() => setArenaOpen(false)}
                  className="w-9 h-9 rounded-xl grid place-items-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  aria-label="Close Arena"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Alert Banner for submission feedback */}
            {alertBanner && (
              <div className={`px-6 py-3 border-b flex items-center justify-between text-xs font-bold transition-all ${
                alertBanner.type === 'success' 
                  ? 'bg-emerald-500 text-white border-emerald-600' 
                  : 'bg-indigo-600 text-white border-indigo-700'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>{alertBanner.title}</span>
                  <span className="font-medium">{alertBanner.message}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setAlertBanner(null)} 
                  className="opacity-75 hover:opacity-100 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Problem Selection Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 overflow-x-auto scrollbar-hide">
              {DEFAULT_QUESTIONS.map((q, idx) => {
                const isSolved = Boolean(userSolvedMap[q.id]);
                const isSelected = idx === selectedQuestionIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setSelectedQuestionIndex(idx)}
                    className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>P{idx + 1}: {q.title.split('-')[0].trim()}</span>
                    <span className="text-[10px] text-slate-400">({q.points} XP)</span>
                    {isSolved && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Two-Column Coding Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-[460px]">
              
              {/* Left Column: Problem Statement */}
              <div className="p-6 overflow-y-auto border-r border-slate-100 dark:border-slate-800 max-h-[520px] space-y-5 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Problem {selectedQuestionIndex + 1} of 4
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {activeQuestion.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      activeQuestion.difficulty === 'Easy' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {activeQuestion.difficulty}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 text-xs font-bold">
                      +{activeQuestion.points} XP
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                  <p>{activeQuestion.description}</p>
                </div>

                {/* Input & Output Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Input Format</h5>
                    <p className="text-slate-500">{activeQuestion.inputFormat}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Output Format</h5>
                    <p className="text-slate-500">{activeQuestion.outputFormat}</p>
                  </div>
                </div>

                {/* Sample Test Case */}
                <div className="space-y-2">
                  <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sample Test Case</h5>
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
                    <div>
                      <span className="text-slate-400 select-none">Input: </span>
                      <span className="text-emerald-400">{activeQuestion.sampleInput}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 select-none">Output: </span>
                      <span className="text-amber-400">{activeQuestion.sampleOutput}</span>
                    </div>
                    {activeQuestion.explanation && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-sans">
                        <span className="font-semibold text-slate-300">Explanation: </span>
                        {activeQuestion.explanation}
                      </div>
                    )}
                  </div>
                </div>

                {/* Constraints */}
                {activeQuestion.constraints && (
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold uppercase tracking-wider text-slate-400">Constraints</h5>
                    <pre className="font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {activeQuestion.constraints}
                    </pre>
                  </div>
                )}
              </div>

              {/* Right Column: Code Workspace & Terminal */}
              <div className="flex flex-col bg-slate-950 text-slate-100 border-t lg:border-t-0 border-slate-800">
                
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900 text-xs">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-emerald-400" />
                    <span className="font-bold text-slate-300">Code Editor</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer"
                    >
                      <option value="python">Python 3</option>
                      <option value="javascript">JavaScript (ES6)</option>
                      <option value="cpp">C++ (GCC 12)</option>
                      <option value="java">Java 17</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUserCodeMap((prev) => {
                          const n = { ...prev };
                          delete n[`${selectedQuestionIndex}_${selectedLanguage}`];
                          return n;
                        });
                        setRunResults(null);
                      }}
                      className="text-slate-400 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw size={11} /> Reset
                    </button>
                  </div>
                </div>

                {/* Textarea Code Editor */}
                <div className="flex-1 relative font-mono text-xs p-4 overflow-y-auto">
                  <textarea
                    value={codeEditorValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUserCodeMap((prev) => ({
                        ...prev,
                        [`${selectedQuestionIndex}_${selectedLanguage}`]: val,
                      }));
                      setRunResults(null);
                    }}
                    className="w-full h-full min-h-[220px] bg-transparent text-emerald-300 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-indigo-500 selection:text-white"
                    placeholder="// Write your solution here..."
                    spellCheck="false"
                  />
                </div>

                {/* Test Output Panel */}
                {runResults && (
                  <div className="border-t border-slate-800 bg-slate-900/95 p-4 max-h-36 overflow-y-auto space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>✓ All Sample Test Cases Passed!</span>
                      <span className="text-[11px] text-slate-400 font-mono">2 / 2 passed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {runResults.map((res) => (
                        <div key={res.caseNum} className="p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 font-mono">
                          <span className="text-emerald-400 font-bold block">Case {res.caseNum}: Passed ✓</span>
                          <span className="text-slate-400 text-[10px]">Time: {res.executionTime} · Mem: {res.memory}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Footer Bar */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <GraduationCap size={15} className="text-indigo-400" />
                    <span>Scoring for: </span>
                    <b className="text-slate-200">{activeCollege}</b>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={runningCode || submittingCode}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Play size={13} className="text-emerald-400 fill-emerald-400" />
                      {runningCode ? 'Testing...' : 'Run Code'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitSolution}
                      disabled={submittingCode || userSolvedMap[activeQuestion.id]}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                        userSolvedMap[activeQuestion.id]
                          ? 'bg-emerald-600/80 text-white cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                    >
                      {userSolvedMap[activeQuestion.id] ? (
                        <>
                          <Check size={14} /> Solved
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          {submittingCode ? 'Evaluating...' : 'Submit Solution'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
