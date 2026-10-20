const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const User = require('../models/User');
const { runAllTestCases } = require('../services/judge0Service');
const {
  extractHandle,
  fetchLeetCodeStats,
  fetchCodeforcesStats,
  fetchCodeChefStats,
  calculateUnifiedCodingScore,
} = require('../services/codingTrackerService');

const DEFAULT_QUESTIONS = [
  {
    id: 'q1',
    title: 'Two Sum - Target Index Finder',
    difficulty: 'Easy',
    points: 100,
    category: 'Arrays & Hashing',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer in any order (0-indexed).',
    inputFormat: 'Line 1: Array of integers separated by spaces or commas.\nLine 2: Integer target.',
    outputFormat: 'Two space-separated indices [i, j].',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    explanation: 'nums[0] + nums[1] == 2 + 7 == 9, so return [0, 1].',
    starterCode: {
      python: 'def twoSum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []',
      javascript: 'function twoSum(nums, target) {\n  // Write your solution here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}'
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isHidden: false },
      { input: '[3, 3], 6', expectedOutput: '[0, 1]', isHidden: true }
    ]
  },
  {
    id: 'q2',
    title: 'Subarray with Given Sum K',
    difficulty: 'Medium',
    points: 200,
    category: 'Prefix Sum & Hash Map',
    description: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`. A subarray is a contiguous non-empty sequence of elements within an array.',
    inputFormat: 'nums = array of integers, k = target sum integer.',
    outputFormat: 'Single integer representing count of matching contiguous subarrays.',
    constraints: '1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7',
    sampleInput: 'nums = [1, 1, 1], k = 2',
    sampleOutput: '2',
    explanation: 'Subarrays [1, 1] at indices [0, 1] and [1, 2] both sum up to 2.',
    starterCode: {
      python: 'def subarraySum(nums, k):\n    count = 0\n    curr_sum = 0\n    prefix = {0: 1}\n    for num in nums:\n        curr_sum += num\n        if curr_sum - k in prefix:\n            count += prefix[curr_sum - k]\n        prefix[curr_sum] = prefix.get(curr_sum, 0) + 1\n    return count',
      javascript: 'function subarraySum(nums, k) {\n  let count = 0, sum = 0;\n  const map = new Map([[0, 1]]);\n  for (const n of nums) {\n    sum += n;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}',
      cpp: 'int subarraySum(vector<int>& nums, int k) {\n    unordered_map<int, int> prefix{{0, 1}};\n    int sum = 0, count = 0;\n    for (int n : nums) {\n        sum += n;\n        if (prefix.count(sum - k)) count += prefix[sum - k];\n        prefix[sum]++;\n    }\n    return count;\n}',
      java: 'public int subarraySum(int[] nums, int k) {\n    int count = 0, sum = 0;\n    Map<Integer, Integer> map = new HashMap<>();\n    map.put(0, 1);\n    for (int n : nums) {\n        sum += n;\n        if (map.containsKey(sum - k)) count += map.get(sum - k);\n        map.put(sum, map.getOrDefault(sum, 0) + 1);\n    }\n    return count;\n}'
    },
    testCases: [
      { input: '[1, 1, 1], 2', expectedOutput: '2', isHidden: false },
      { input: '[1, 2, 3], 3', expectedOutput: '2', isHidden: false },
      { input: '[1, -1, 0], 0', expectedOutput: '3', isHidden: true }
    ]
  },
  {
    id: 'q3',
    title: 'Valid Parentheses & Syntax Validator',
    difficulty: 'Easy',
    points: 100,
    category: 'Stack',
    description: 'Given a string `s` containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. Open brackets must be closed by the same type of brackets, and in the correct order.',
    inputFormat: 'String s containing bracket characters.',
    outputFormat: 'Boolean true or false.',
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only \'()[]{}\'.',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    explanation: 'All opened brackets are closed with matching types in correct order.',
    starterCode: {
      python: 'def isValid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack',
      javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (const c of s) {\n    if (pairs[c]) {\n      if (stack.pop() !== pairs[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}',
      cpp: 'bool isValid(string s) {\n    stack<char> st;\n    unordered_map<char, char> pairs{{\')\', \'(\'}, {\'}\', \'{\'}, {\']\', \'[\'}};\n    for (char c : s) {\n        if (pairs.count(c)) {\n            if (st.empty() || st.top() != pairs[c]) return false;\n            st.pop();\n        } else {\n            st.push(c);\n        }\n    }\n    return st.empty();\n}',
      java: 'public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == \'(\') stack.push(\')\');\n        else if (c == \'{\') stack.push(\'}\');\n        else if (c == \'[\') stack.push(\']\');\n        else if (stack.isEmpty() || stack.pop() != c) return false;\n    }\n    return stack.isEmpty();\n}'
    },
    testCases: [
      { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
      { input: '"(]"', expectedOutput: 'false', isHidden: false },
      { input: '"{[]}"', expectedOutput: 'true', isHidden: true }
    ]
  },
  {
    id: 'q4',
    title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    points: 200,
    category: 'Dynamic Programming',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. A subarray is a contiguous part of an array.',
    inputFormat: 'Array of integers nums.',
    outputFormat: 'Single integer representing the maximum possible sum.',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    sampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    sampleOutput: '6',
    explanation: 'The subarray [4, -1, 2, 1] has the largest sum 6.',
    starterCode: {
      python: 'def maxSubArray(nums):\n    max_so_far = nums[0]\n    curr_max = nums[0]\n    for i in range(1, len(nums)):\n        curr_max = max(nums[i], curr_max + nums[i])\n        max_so_far = max(max_so_far, curr_max)\n    return max_so_far',
      javascript: 'function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currMax = Math.max(nums[i], currMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}',
      cpp: 'int maxSubArray(vector<int>& nums) {\n    int maxSoFar = nums[0], currMax = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        currMax = max(nums[i], currMax + nums[i]);\n        maxSoFar = max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}',
      java: 'public int maxSubArray(int[] nums) {\n    int maxSoFar = nums[0], currMax = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}'
    },
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6', isHidden: false },
      { input: '[1]', expectedOutput: '1', isHidden: false },
      { input: '[5, 4, -1, 7, 8]', expectedOutput: '23', isHidden: true }
    ]
  }
];

const INITIAL_INDIVIDUALS = [
  { userName: 'Rahul Verma', collegeName: 'IIT Delhi', solvedCount: 3, score: 400, solvedQuestions: ['q1', 'q2', 'q3'], lastSolvedAt: new Date(Date.now() - 15 * 60000) },
  { userName: 'Priya Sharma', collegeName: 'GLA University', solvedCount: 2, score: 300, solvedQuestions: ['q1', 'q3'], lastSolvedAt: new Date(Date.now() - 25 * 60000) },
  { userName: 'Aditya Singh', collegeName: 'BITS Pilani', solvedCount: 2, score: 300, solvedQuestions: ['q1', 'q4'], lastSolvedAt: new Date(Date.now() - 32 * 60000) },
  { userName: 'Ananya Gupta', collegeName: 'AKTU', solvedCount: 2, score: 200, solvedQuestions: ['q1', 'q3'], lastSolvedAt: new Date(Date.now() - 40 * 60000) },
  { userName: 'Siddharth Jain', collegeName: 'IIT Bombay', solvedCount: 1, score: 100, solvedQuestions: ['q1'], lastSolvedAt: new Date(Date.now() - 50 * 60000) },
  { userName: 'Neha Patel', collegeName: 'DTU', solvedCount: 1, score: 100, solvedQuestions: ['q3'], lastSolvedAt: new Date(Date.now() - 58 * 60000) },
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
  { collegeName: 'Manipal Institute of Technology', score: 310, solvedCount: 2, studentCount: 2, rankChange: '-2' },
  { collegeName: 'IIT Kanpur', score: 290, solvedCount: 1, studentCount: 1, rankChange: '0' },
];

// Helper to seed or retrieve default live contest
async function getOrSeedLiveContest() {
  let contest = await Contest.findOne({ status: 'Live' });
  if (!contest) {
    contest = await Contest.findOne({ slug: 'weekly-coding-battle-42' });
  }

  if (!contest) {
    const end = new Date();
    end.setHours(end.getHours() + 2);

    contest = await Contest.create({
      title: 'Weekly Coding Battle #42',
      slug: 'weekly-coding-battle-42',
      description: 'Data Structures and Algorithms focused inter-college battle. Solve 4 programming challenges. Scores of all students from each college aggregate directly to crown the Top College in India.',
      type: 'Coding',
      startTime: new Date(),
      endTime: end,
      rules: 'Standard algorithmic contest rules. Zero penalty for compilation errors. Solve speed and accuracy determine ranking.',
      status: 'Live',
      totalXpPool: 10000,
      questions: DEFAULT_QUESTIONS,
      leaderboard: INITIAL_INDIVIDUALS,
      collegeLeaderboard: INITIAL_COLLEGES,
    });
  } else if (!contest.questions || contest.questions.length === 0) {
    contest.questions = DEFAULT_QUESTIONS;
    if (!contest.leaderboard || contest.leaderboard.length === 0) {
      contest.leaderboard = INITIAL_INDIVIDUALS;
    }
    if (!contest.collegeLeaderboard || contest.collegeLeaderboard.length === 0) {
      contest.collegeLeaderboard = INITIAL_COLLEGES;
    }
    await contest.save();
  }

  return contest;
}

exports.list = async (req, res, next) => {
  try {
    await getOrSeedLiveContest();
    const filter = req.query.status ? { status: req.query.status } : {};
    const contests = await Contest.find(filter)
      .populate('collegeId', 'name logo')
      .sort({ startTime: -1 })
      .lean();

    const formatted = contests.map((c) => ({
      ...c,
      questionCount: c.questions ? c.questions.length : 4,
      participantCount: (c.leaderboard ? c.leaderboard.length : 0) + 1240,
      topCollege: c.collegeLeaderboard && c.collegeLeaderboard.length ? c.collegeLeaderboard[0].collegeName : 'IIT Delhi',
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    let contest;
    const { id } = req.params;

    if (id === 'live-42' || id === 'weekly-coding-battle-42') {
      contest = await getOrSeedLiveContest();
    } else if (mongoose.Types.ObjectId.isValid(id)) {
      contest = await Contest.findById(id).populate('collegeId', 'name logo');
    }

    if (!contest) {
      contest = await getOrSeedLiveContest();
    }

    // Sort leaderboards descending
    const individual = [...(contest.leaderboard || [])].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
      return new Date(a.lastSolvedAt) - new Date(b.lastSolvedAt);
    });

    const college = [...(contest.collegeLeaderboard || [])].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.solvedCount - a.solvedCount;
    });

    const response = contest.toObject();
    response.leaderboard = individual;
    response.collegeLeaderboard = college;

    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.submitSolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionId, code, language, collegeName: rawCollege, userName: rawUser } = req.body;

    if (!questionId) {
      return res.status(400).json({ message: 'questionId is required' });
    }

    let contest;
    if (id === 'live-42' || id === 'weekly-coding-battle-42') {
      contest = await getOrSeedLiveContest();
    } else if (mongoose.Types.ObjectId.isValid(id)) {
      contest = await Contest.findById(id);
    }

    if (!contest) {
      contest = await getOrSeedLiveContest();
    }

    const question = contest.questions.find((q) => q.id === questionId);
    if (!question) {
      return res.status(404).json({ message: 'Problem not found in this contest' });
    }

    // Determine user and college name
    const userName = (req.user && req.user.name) || rawUser || 'Student Coder';
    const collegeName = (req.user && req.user.collegeName) || rawCollege || 'GLA University';
    const userId = req.user ? req.user._id : null;

    // Check if user already has an entry in leaderboard
    let studentEntry = contest.leaderboard.find((entry) => {
      if (userId && entry.userId && entry.userId.toString() === userId.toString()) return true;
      return entry.userName.toLowerCase() === userName.toLowerCase() && entry.collegeName.toLowerCase() === collegeName.toLowerCase();
    });

    const isAlreadySolved = studentEntry && studentEntry.solvedQuestions.includes(questionId);

    if (isAlreadySolved) {
      return res.json({
        success: true,
        status: 'Already Solved',
        message: `You have already solved ${question.title}!`,
        pointsAwarded: 0,
        score: studentEntry.score,
        solvedCount: studentEntry.solvedCount,
        leaderboard: contest.leaderboard,
        collegeLeaderboard: contest.collegeLeaderboard,
      });
    }

    const points = question.points || 100;

    // 1. Execute all test cases (visible and hidden) via Judge0 / Sandbox execution
    const execResult = await runAllTestCases({
      code: code || '',
      language: language || 'python',
      question,
      testCases: question.testCases,
    });

    // If any test case fails, reject submission with precise diagnostics
    if (!execResult.allPassed) {
      const failedCase = execResult.results.find((r) => !r.passed) || execResult.results[0];
      const failStatus = failedCase.statusDesc || 'Wrong Answer';

      contest.submissions.push({
        userId,
        userName,
        collegeName,
        questionId,
        language: language || 'python',
        code: code || '',
        status: failStatus,
        pointsAwarded: 0,
        submittedAt: new Date(),
      });
      await contest.save();

      const failureMessage = failedCase.isHidden
        ? `Failed on hidden edge case #${failedCase.caseNum} (${failStatus}). Check constraints and edge cases.`
        : `Failed on Test Case #${failedCase.caseNum} (${failStatus}). Expected: ${failedCase.expectedOutput}, Got: ${failedCase.actualOutput}`;

      return res.json({
        success: false,
        status: failStatus,
        message: failureMessage,
        engine: execResult.engine,
        totalCases: execResult.totalCases,
        passedCases: execResult.passedCases,
        failedCaseNum: failedCase.caseNum,
        results: execResult.results.map((r) => ({
          ...r,
          input: r.isHidden ? 'Hidden test input' : r.input,
          expectedOutput: r.isHidden ? 'Hidden' : r.expectedOutput,
          actualOutput: r.isHidden && !r.passed ? 'Incorrect Output' : r.actualOutput,
        })),
        leaderboard: contest.leaderboard,
        collegeLeaderboard: contest.collegeLeaderboard,
      });
    }

    // 2. All test cases passed! Update or create individual leaderboard entry
    if (studentEntry) {
      studentEntry.score += points;
      studentEntry.solvedCount += 1;
      studentEntry.solvedQuestions.push(questionId);
      studentEntry.lastSolvedAt = new Date();
      if (collegeName) studentEntry.collegeName = collegeName;
    } else {
      contest.leaderboard.push({
        userId,
        userName,
        collegeName,
        score: points,
        solvedCount: 1,
        solvedQuestions: [questionId],
        lastSolvedAt: new Date(),
      });
    }

    // Record accepted submission
    contest.submissions.push({
      userId,
      userName,
      collegeName,
      questionId,
      language: language || 'python',
      code: code || '',
      status: 'Accepted',
      pointsAwarded: points,
      submittedAt: new Date(),
    });

    // 3. Update College Leaderboard (Inter-College Score)
    let collegeEntry = contest.collegeLeaderboard.find(
      (c) => c.collegeName.toLowerCase() === collegeName.toLowerCase()
    );

    if (collegeEntry) {
      collegeEntry.score += points;
      collegeEntry.solvedCount += 1;
      collegeEntry.lastActive = new Date();
    } else {
      contest.collegeLeaderboard.push({
        collegeName,
        score: points,
        solvedCount: 1,
        studentCount: 1,
        rankChange: '+1',
        lastActive: new Date(),
      });
    }

    // Recount student count for each college
    const collegeStudentMap = {};
    contest.leaderboard.forEach((entry) => {
      const c = entry.collegeName;
      collegeStudentMap[c] = (collegeStudentMap[c] || 0) + 1;
    });

    contest.collegeLeaderboard.forEach((c) => {
      if (collegeStudentMap[c.collegeName]) {
        c.studentCount = collegeStudentMap[c.collegeName];
      }
    });

    // 4. Sort Individual Leaderboard
    contest.leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
      return new Date(a.lastSolvedAt) - new Date(b.lastSolvedAt);
    });

    // 5. Sort College Leaderboard (Highest score and solved questions appear on top!)
    contest.collegeLeaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.solvedCount - a.solvedCount;
    });

    await contest.save();

    // Find new rankings
    const individualRank = contest.leaderboard.findIndex(
      (entry) => entry.userName.toLowerCase() === userName.toLowerCase() && entry.collegeName.toLowerCase() === collegeName.toLowerCase()
    ) + 1;

    const collegeRank = contest.collegeLeaderboard.findIndex(
      (entry) => entry.collegeName.toLowerCase() === collegeName.toLowerCase()
    ) + 1;

    res.json({
      success: true,
      status: 'Accepted',
      message: `Accepted! 🎉 You solved ${question.title}. +${points} XP awarded to you and ${collegeName}!`,
      pointsAwarded: points,
      questionId,
      individualRank,
      collegeRank,
      userName,
      collegeName,
      engine: execResult.engine,
      passedCases: execResult.passedCases,
      totalCases: execResult.totalCases,
      results: execResult.results,
      leaderboard: contest.leaderboard,
      collegeLeaderboard: contest.collegeLeaderboard,
    });
  } catch (error) {
    next(error);
  }
};

exports.runCode = async (req, res, next) => {
  try {
    const { questionId, code, language, customInput } = req.body;
    let contest = await getOrSeedLiveContest();
    const question = contest.questions.find((q) => q.id === questionId);

    if (!question) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Run against sample test cases (non-hidden) or custom input
    let testCasesToRun;
    if (customInput) {
      testCasesToRun = [{ input: customInput, expectedOutput: '', isHidden: false }];
    } else {
      testCasesToRun = (question.testCases || []).filter((tc) => !tc.isHidden);
      if (testCasesToRun.length === 0) testCasesToRun = question.testCases || [];
    }

    const execResult = await runAllTestCases({
      code: code || '',
      language: language || 'python',
      question,
      testCases: testCasesToRun,
    });

    res.json({
      success: execResult.allPassed,
      status: execResult.allPassed ? 'Passed' : 'Failed',
      language: language || 'python',
      totalCases: execResult.totalCases,
      passedCases: execResult.passedCases,
      engine: execResult.engine,
      results: execResult.results,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const contest = await getOrSeedLiveContest();
    const individual = [...contest.leaderboard].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.solvedCount - a.solvedCount;
    });

    const college = [...contest.collegeLeaderboard].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.solvedCount - a.solvedCount;
    });

    res.json({
      individualLeaderboard: individual,
      collegeLeaderboard: college,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    res.status(201).json(await Contest.create(req.body));
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-PLATFORM CODING PROFILE TRACKER (LEETCODE + CODEFORCES + CODECHEF)
// ─────────────────────────────────────────────────────────────────────────────

const SEED_CAMPUS_CODERS = [
  {
    _id: 'seed-coder-1',
    name: 'Aarav Mehta',
    collegeName: 'IIT Delhi',
    course: 'B.Tech CSE',
    year: '4th Year',
    codingProfiles: {
      handles: { leetcode: 'aarav_dsa', codeforces: 'aarav_cf', codechef: 'aarav_cc' },
      leetcode: { easy: 180, medium: 340, hard: 95, totalSolved: 615, rating: 2045, contestsAttended: 34 },
      codeforces: { rating: 1740, maxRating: 1795, rank: 'Expert', totalSolved: 410 },
      codechef: { rating: 1920, maxRating: 1965, stars: '4★', totalSolved: 230 },
      codingScore: 6789,
      totalProblemsSolved: 1255,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 25 * 60000),
    },
  },
  {
    _id: 'seed-coder-2',
    name: 'Priya Sharma',
    collegeName: 'GLA University',
    course: 'B.Tech CSE',
    year: '3rd Year',
    codingProfiles: {
      handles: { leetcode: 'priya_codes', codeforces: 'priya_gla', codechef: 'priya_star' },
      leetcode: { easy: 165, medium: 285, hard: 62, totalSolved: 512, rating: 1890, contestsAttended: 26 },
      codeforces: { rating: 1545, maxRating: 1580, rank: 'Specialist', totalSolved: 315 },
      codechef: { rating: 1785, maxRating: 1810, stars: '3★', totalSolved: 195 },
      codingScore: 5392,
      totalProblemsSolved: 1022,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 40 * 60000),
    },
  },
  {
    _id: 'seed-coder-3',
    name: 'Rohan Kulkarni',
    collegeName: 'BITS Pilani',
    course: 'B.Tech CSE',
    year: '3rd Year',
    codingProfiles: {
      handles: { leetcode: 'rohan_bits', codeforces: 'rohan_cp', codechef: 'rohan_k' },
      leetcode: { easy: 140, medium: 260, hard: 58, totalSolved: 458, rating: 1835, contestsAttended: 22 },
      codeforces: { rating: 1620, maxRating: 1650, rank: 'Expert', totalSolved: 350 },
      codechef: { rating: 1840, maxRating: 1870, stars: '4★', totalSolved: 180 },
      codingScore: 5243,
      totalProblemsSolved: 988,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 75 * 60000),
    },
  },
  {
    _id: 'seed-coder-4',
    name: 'Ananya Verma',
    collegeName: 'AKTU',
    course: 'B.Tech CSE',
    year: '3rd Year',
    codingProfiles: {
      handles: { leetcode: 'ananya_aktu', codeforces: 'ananya_v', codechef: 'ananya_cc' },
      leetcode: { easy: 155, medium: 230, hard: 42, totalSolved: 427, rating: 1760, contestsAttended: 19 },
      codeforces: { rating: 1430, maxRating: 1465, rank: 'Specialist', totalSolved: 245 },
      codechef: { rating: 1690, maxRating: 1720, stars: '3★', totalSolved: 160 },
      codingScore: 4405,
      totalProblemsSolved: 832,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 110 * 60000),
    },
  },
  {
    _id: 'seed-coder-5',
    name: 'Devansh Singh',
    collegeName: 'GLA University',
    course: 'B.Tech CSE (AI/ML)',
    year: '3rd Year',
    codingProfiles: {
      handles: { leetcode: 'devansh_gla', codeforces: 'devansh_cf', codechef: 'devansh_cc' },
      leetcode: { easy: 130, medium: 210, hard: 35, totalSolved: 375, rating: 1715, contestsAttended: 16 },
      codeforces: { rating: 1365, maxRating: 1410, rank: 'Pupil', totalSolved: 210 },
      codechef: { rating: 1625, maxRating: 1660, stars: '3★', totalSolved: 145 },
      codingScore: 3864,
      totalProblemsSolved: 730,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 140 * 60000),
    },
  },
  {
    _id: 'seed-coder-6',
    name: 'Karthik Nair',
    collegeName: 'NIT Trichy',
    course: 'B.Tech ECE',
    year: '4th Year',
    codingProfiles: {
      handles: { leetcode: 'karthik_nitt', codeforces: 'karthik_cf', codechef: 'karthik_n' },
      leetcode: { easy: 120, medium: 195, hard: 38, totalSolved: 353, rating: 1690, contestsAttended: 15 },
      codeforces: { rating: 1480, maxRating: 1510, rank: 'Specialist', totalSolved: 260 },
      codechef: { rating: 1640, maxRating: 1680, stars: '3★', totalSolved: 130 },
      codingScore: 3899,
      totalProblemsSolved: 743,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 180 * 60000),
    },
  },
  {
    _id: 'seed-coder-7',
    name: 'Sneha Gupta',
    collegeName: 'VIT',
    course: 'B.Tech IT',
    year: '2nd Year',
    codingProfiles: {
      handles: { leetcode: 'sneha_vit', codeforces: 'sneha_g', codechef: 'sneha_cc' },
      leetcode: { easy: 145, medium: 175, hard: 24, totalSolved: 344, rating: 1640, contestsAttended: 12 },
      codeforces: { rating: 1280, maxRating: 1315, rank: 'Pupil', totalSolved: 165 },
      codechef: { rating: 1540, maxRating: 1580, stars: '2★', totalSolved: 120 },
      codingScore: 3281,
      totalProblemsSolved: 629,
      isVerifiedCoder: false,
      lastSyncedAt: new Date(Date.now() - 210 * 60000),
    },
  },
  {
    _id: 'seed-coder-8',
    name: 'Vikramaditya Rao',
    collegeName: 'DTU',
    course: 'B.Tech SE',
    year: '3rd Year',
    codingProfiles: {
      handles: { leetcode: 'vikram_dtu', codeforces: 'vikram_cf', codechef: 'vikram_cc' },
      leetcode: { easy: 110, medium: 165, hard: 28, totalSolved: 303, rating: 1625, contestsAttended: 14 },
      codeforces: { rating: 1390, maxRating: 1420, rank: 'Pupil', totalSolved: 195 },
      codechef: { rating: 1590, maxRating: 1610, stars: '2★', totalSolved: 115 },
      codingScore: 3229,
      totalProblemsSolved: 613,
      isVerifiedCoder: true,
      lastSyncedAt: new Date(Date.now() - 240 * 60000),
    },
  },
];

function buildLeaderboardPayload(dbUsers, query = {}) {
  const { college, platform = 'overall', search = '' } = query;

  // Map DB users into standardized coder entries
  const realCoders = dbUsers.map((u) => ({
    _id: String(u._id),
    name: u.name,
    collegeName: u.collegeName || 'GLA University',
    course: u.course || 'B.Tech CSE',
    year: u.year || '3rd Year',
    profilePhoto: u.profilePhoto || '',
    isRealUser: true,
    codingProfiles: u.codingProfiles,
  }));

  // Combine real users with campus benchmark coders (avoiding duplicate names)
  const realNames = new Set(realCoders.map((r) => r.name.toLowerCase()));
  const combined = [
    ...realCoders,
    ...SEED_CAMPUS_CODERS.filter((s) => !realNames.has(s.name.toLowerCase())),
  ];

  // Aggregate College Standings across all coders before filtering by college
  const collegeMap = new Map();
  for (const coder of combined) {
    const cName = coder.collegeName || 'Engineering Campus';
    const cp = coder.codingProfiles || {};
    const existing = collegeMap.get(cName) || {
      collegeName: cName,
      totalScore: 0,
      totalSolved: 0,
      coderCount: 0,
      topCoder: coder.name,
      topCoderScore: 0,
    };

    const score = Number(cp.codingScore) || 0;
    existing.totalScore += score;
    existing.totalSolved += Number(cp.totalProblemsSolved) || 0;
    existing.coderCount += 1;
    if (score >= existing.topCoderScore) {
      existing.topCoderScore = score;
      existing.topCoder = coder.name;
    }
    collegeMap.set(cName, existing);
  }

  const collegeStandings = Array.from(collegeMap.values()).sort(
    (a, b) => b.totalScore - a.totalScore || b.totalSolved - a.totalSolved
  );

  // Filter coders by college & search
  let filtered = combined;
  if (college && college !== 'All') {
    filtered = filtered.filter(
      (c) => (c.collegeName || '').toLowerCase() === college.toLowerCase()
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((c) => {
      const h = c.codingProfiles?.handles || {};
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.collegeName || '').toLowerCase().includes(q) ||
        (h.leetcode || '').toLowerCase().includes(q) ||
        (h.codeforces || '').toLowerCase().includes(q) ||
        (h.codechef || '').toLowerCase().includes(q)
      );
    });
  }

  // Sort by selected platform metric
  filtered.sort((a, b) => {
    const cpA = a.codingProfiles || {};
    const cpB = b.codingProfiles || {};
    if (platform === 'leetcode') {
      const diff = (cpB.leetcode?.totalSolved || 0) - (cpA.leetcode?.totalSolved || 0);
      if (diff !== 0) return diff;
      return (cpB.leetcode?.rating || 0) - (cpA.leetcode?.rating || 0);
    }
    if (platform === 'codeforces') {
      const diff = (cpB.codeforces?.rating || 0) - (cpA.codeforces?.rating || 0);
      if (diff !== 0) return diff;
      return (cpB.codeforces?.totalSolved || 0) - (cpA.codeforces?.totalSolved || 0);
    }
    if (platform === 'codechef') {
      const diff = (cpB.codechef?.rating || 0) - (cpA.codechef?.rating || 0);
      if (diff !== 0) return diff;
      return (cpB.codechef?.totalSolved || 0) - (cpA.codechef?.totalSolved || 0);
    }
    return (cpB.codingScore || 0) - (cpA.codingScore || 0);
  });

  return {
    coders: filtered,
    collegeStandings,
  };
}

// @desc    Get Multi-Platform Coding Leaderboard (LeetCode + Codeforces + CodeChef)
// @route   GET /api/contests/coding-leaderboard
// @access  Public (Optional Auth)
exports.getCodingLeaderboard = async (req, res, next) => {
  try {
    const dbUsers = await User.find({
      'codingProfiles.codingScore': { $gt: 0 },
    })
      .select('name collegeName course year profilePhoto codingProfiles')
      .sort({ 'codingProfiles.codingScore': -1 })
      .limit(100)
      .lean();

    const { coders, collegeStandings } = buildLeaderboardPayload(dbUsers, req.query);

    let myProfile = null;
    if (req.user) {
      const currentUser = await User.findById(req.user._id).select(
        'name collegeName course year codingProfiles'
      );
      if (currentUser) {
        if (!currentUser.codingProfiles?.verificationCode) {
          const code = `NOTESX-${String(currentUser._id).slice(-4).toUpperCase()}`;
          currentUser.set('codingProfiles.verificationCode', code);
          await currentUser.save();
        }
        myProfile = currentUser.codingProfiles;
      }
    }

    res.json({
      coders,
      collegeStandings,
      myProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Link & Sync Student's Live LeetCode, Codeforces, and CodeChef Profiles
// @route   POST /api/contests/coding-profile/sync
// @access  Private
exports.syncCodingProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in to link and sync your coding profiles.' });
    }

    const { leetcode = '', codeforces = '', codechef = '', collegeName } = req.body;

    const cleanLc = extractHandle(leetcode, 'leetcode');
    const cleanCf = extractHandle(codeforces, 'codeforces');
    const cleanCc = extractHandle(codechef, 'codechef');

    if (!cleanLc && !cleanCf && !cleanCc) {
      return res.status(400).json({
        message: 'Please provide at least one handle (LeetCode, Codeforces, or CodeChef) to sync.',
      });
    }

    const userDoc = await User.findById(req.user._id);
    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verificationCode =
      userDoc.codingProfiles?.verificationCode ||
      `NOTESX-${String(userDoc._id).slice(-4).toUpperCase()}`;

    // Fetch all provided platforms in parallel
    const [lcStats, cfStats, ccStats] = await Promise.all([
      cleanLc ? fetchLeetCodeStats(cleanLc) : Promise.resolve(null),
      cleanCf ? fetchCodeforcesStats(cleanCf) : Promise.resolve(null),
      cleanCc ? fetchCodeChefStats(cleanCc) : Promise.resolve(null),
    ]);

    const leetcodeData = lcStats
      ? {
          easy: lcStats.easy,
          medium: lcStats.medium,
          hard: lcStats.hard,
          totalSolved: lcStats.totalSolved,
          rating: lcStats.rating,
          contestsAttended: lcStats.contestsAttended,
          globalRanking: lcStats.globalRanking,
        }
      : { easy: 0, medium: 0, hard: 0, totalSolved: 0, rating: 0, contestsAttended: 0, globalRanking: 0 };

    const codeforcesData = cfStats
      ? {
          rating: cfStats.rating,
          maxRating: cfStats.maxRating,
          rank: cfStats.rank,
          totalSolved: cfStats.totalSolved,
        }
      : { rating: 0, maxRating: 0, rank: 'Unrated', totalSolved: 0 };

    const codechefData = ccStats
      ? {
          rating: ccStats.rating,
          maxRating: ccStats.maxRating,
          stars: ccStats.stars,
          totalSolved: ccStats.totalSolved,
        }
      : { rating: 0, maxRating: 0, stars: '1★', totalSolved: 0 };

    const { codingScore, totalProblemsSolved } = calculateUnifiedCodingScore({
      leetcode: leetcodeData,
      codeforces: codeforcesData,
      codechef: codechefData,
    });

    // Check if the user placed their verificationCode in their LeetCode or Codeforces bio/name
    const combinedBio = `${lcStats?.bioText || ''} ${cfStats?.bioText || ''}`.toUpperCase();
    const isVerifiedCoder =
      Boolean(userDoc.codingProfiles?.isVerifiedCoder) ||
      (verificationCode && combinedBio.includes(verificationCode.toUpperCase()));

    const wasFirstSync = !userDoc.codingProfiles?.lastSyncedAt;

    if (collegeName && collegeName.trim()) {
      userDoc.collegeName = collegeName.trim();
    }

    userDoc.codingProfiles = {
      handles: {
        leetcode: lcStats?.handle || cleanLc,
        codeforces: cfStats?.handle || cleanCf,
        codechef: ccStats?.handle || cleanCc,
      },
      leetcode: leetcodeData,
      codeforces: codeforcesData,
      codechef: codechefData,
      codingScore,
      totalProblemsSolved,
      verificationCode,
      isVerifiedCoder,
      lastSyncedAt: new Date(),
    };

    if (wasFirstSync) {
      userDoc.reputation = (userDoc.reputation || 0) + 25;
    }

    await userDoc.save();

    // Re-query updated leaderboard so the student immediately sees their live rank
    const dbUsers = await User.find({
      'codingProfiles.codingScore': { $gt: 0 },
    })
      .select('name collegeName course year profilePhoto codingProfiles')
      .sort({ 'codingProfiles.codingScore': -1 })
      .limit(100)
      .lean();

    const { coders, collegeStandings } = buildLeaderboardPayload(dbUsers, {});

    const myRank =
      coders.findIndex((c) => String(c._id) === String(userDoc._id)) + 1;

    res.json({
      message: `Successfully synced your coding profiles! Your NOTESX Coding Score is ${codingScore.toLocaleString()} pts (${totalProblemsSolved} total problems solved).`,
      myProfile: userDoc.codingProfiles,
      myRank: myRank > 0 ? myRank : 1,
      coders,
      collegeStandings,
    });
  } catch (error) {
    next(error);
  }
};


