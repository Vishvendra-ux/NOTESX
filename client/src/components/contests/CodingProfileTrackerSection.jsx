import { useState, useEffect, useContext } from 'react';
import {
  RefreshCw, ExternalLink, CheckCircle2, Sparkles,
  Building2, Search, ShieldCheck, Copy, Check, AlertCircle
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { contestService } from '../../services/api';

const COLLEGES_LIST = [
  'All',
  'GLA University',
  'IIT Delhi',
  'BITS Pilani',
  'AKTU',
  'NIT Trichy',
  'DTU',
  'VIT',
  'IIT Bombay',
];

export default function CodingProfileTrackerSection() {
  const { user } = useContext(AuthContext);

  // Leaderboard state
  const [coders, setCoders] = useState([]);
  const [collegeStandings, setCollegeStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeView, setActiveView] = useState('overall'); // 'overall' | 'leetcode' | 'codeforces' | 'codechef' | 'colleges'
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // User's Coding Profile Form State
  const [myProfile, setMyProfile] = useState(null);
  const [leetcodeInput, setLeetcodeInput] = useState('');
  const [codeforcesInput, setCodeforcesInput] = useState('');
  const [codechefInput, setCodechefInput] = useState('');
  const [collegeInput, setCollegeInput] = useState(user?.collegeName || 'GLA University');
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load leaderboard on mount and filter changes
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await contestService.getCodingLeaderboard({
          college: collegeFilter !== 'All' ? collegeFilter : undefined,
          platform: activeView === 'colleges' ? 'overall' : activeView,
          search: searchQuery.trim() || undefined,
        });
        if (!isMounted) return;
        setCoders(res.data?.coders || []);
        setCollegeStandings(res.data?.collegeStandings || []);
        if (res.data?.myProfile) {
          setMyProfile(res.data.myProfile);
          const h = res.data.myProfile.handles || {};
          setLeetcodeInput((prev) => prev || h.leetcode || '');
          setCodeforcesInput((prev) => prev || h.codeforces || '');
          setCodechefInput((prev) => prev || h.codechef || '');
        }
      } catch (err) {
        console.error('Failed to load coding leaderboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [collegeFilter, activeView, searchQuery]);

  const handleSyncProfiles = async (e) => {
    e.preventDefault();
    if (!user) {
      setSyncFeedback({
        type: 'error',
        text: 'Please log in to link your LeetCode, Codeforces, and CodeChef profiles.',
      });
      return;
    }

    if (!leetcodeInput.trim() && !codeforcesInput.trim() && !codechefInput.trim()) {
      setSyncFeedback({
        type: 'error',
        text: 'Enter at least one username (LeetCode, Codeforces, or CodeChef) to sync.',
      });
      return;
    }

    try {
      setSyncing(true);
      setSyncFeedback(null);
      const res = await contestService.syncCodingProfile({
        leetcode: leetcodeInput.trim(),
        codeforces: codeforcesInput.trim(),
        codechef: codechefInput.trim(),
        collegeName: collegeInput,
      });

      if (res.data?.myProfile) {
        setMyProfile(res.data.myProfile);
      }
      if (res.data?.coders) {
        setCoders(res.data.coders);
      }
      if (res.data?.collegeStandings) {
        setCollegeStandings(res.data.collegeStandings);
      }

      setSyncFeedback({
        type: 'success',
        text: res.data?.message || 'Profiles synced! Your live rank has been updated.',
      });
    } catch (err) {
      setSyncFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to sync coding profiles. Check your usernames and try again.',
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleCopyVerifyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mb-12 space-y-6">
      {/* ── Top Card: Connect & Sync LeetCode, Codeforces, CodeChef ── */}
      <div className="rounded-3xl border border-indigo-200/80 dark:border-slate-800 bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              <span>Live Multi-Platform Coding Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Track LeetCode, Codeforces &amp; CodeChef in One Leaderboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Link your coding handles below. NOTESX fetches your real solved counts and contest ratings to calculate your unified <b>Coding Score</b> and rank you across your college and India.
            </p>
          </div>

          {myProfile?.codingScore > 0 && (
            <div className="flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-lg shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">
                  Your Unified Score
                </span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  {Number(myProfile.codingScore || 0).toLocaleString()} pts
                </span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  Total Solved
                </span>
                <span className="text-xl font-black text-emerald-400">
                  {myProfile.totalProblemsSolved || 0} Qs
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Handle Input Form */}
        <form onSubmit={handleSyncProfiles} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              🟡 LeetCode Username
            </label>
            <input
              type="text"
              value={leetcodeInput}
              onChange={(e) => setLeetcodeInput(e.target.value)}
              placeholder="e.g. aarav_dsa"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">
              🔵 Codeforces Handle
            </label>
            <input
              type="text"
              value={codeforcesInput}
              onChange={(e) => setCodeforcesInput(e.target.value)}
              placeholder="e.g. tourist / priya_gla"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-orange-300 mb-1">
              🟤 CodeChef Handle
            </label>
            <input
              type="text"
              value={codechefInput}
              onChange={(e) => setCodechefInput(e.target.value)}
              placeholder="e.g. rohan_k"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              🏛️ Your College
            </label>
            <input
              type="text"
              value={collegeInput}
              onChange={(e) => setCollegeInput(e.target.value)}
              placeholder="e.g. GLA University"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={syncing}
              className="w-full h-[38px] btn-primary rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Syncing Live APIs...' : 'Sync Live Stats'}</span>
            </button>
          </div>
        </form>

        {/* Feedback Banner */}
        {syncFeedback && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold border ${
              syncFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {syncFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{syncFeedback.text}</span>
          </div>
        )}

        {/* User's Synced Platform Breakdown Cards */}
        {myProfile?.codingScore > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* LeetCode Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-amber-600">🟡 LeetCode</span>
                <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200">
                  Rating: {myProfile.leetcode?.rating || 'Unrated'}
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white mb-2">
                {myProfile.leetcode?.totalSolved || 0} <span className="text-xs font-semibold text-slate-500">Solved</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  E: {myProfile.leetcode?.easy || 0}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                  M: {myProfile.leetcode?.medium || 0}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                  H: {myProfile.leetcode?.hard || 0}
                </span>
              </div>
            </div>

            {/* Codeforces Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-blue-600">🔵 Codeforces</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold">
                  {myProfile.codeforces?.rank || 'Unrated'}
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {myProfile.codeforces?.rating || 0}{' '}
                <span className="text-xs font-semibold text-slate-500">
                  (Max: {myProfile.codeforces?.maxRating || 0})
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                {myProfile.codeforces?.totalSolved || 0} Unique Problems Accepted
              </p>
            </div>

            {/* CodeChef Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-amber-800 dark:text-amber-400">🟤 CodeChef</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-black">
                  {myProfile.codechef?.stars || '1★'}
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {myProfile.codechef?.rating || 0}{' '}
                <span className="text-xs font-semibold text-slate-500">
                  (Max: {myProfile.codechef?.maxRating || 0})
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                {myProfile.codechef?.totalSolved || 0} Problems Solved
              </p>
            </div>

            {/* Ownership Verification Card */}
            <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <ShieldCheck size={14} />
                  {myProfile.isVerifiedCoder ? 'Verified Handle ✅' : 'Verify Ownership'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 my-1.5 leading-snug">
                {myProfile.isVerifiedCoder
                  ? 'Your coding handles are verified for official campus placements & rankings!'
                  : 'Add this code to your LeetCode Bio or CF First Name & click Sync to get the Verified badge:'}
              </p>
              {myProfile.verificationCode && !myProfile.isVerifiedCoder && (
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-indigo-200">
                  <code className="text-xs font-black text-indigo-700 dark:text-indigo-300">
                    {myProfile.verificationCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopyVerifyCode(myProfile.verificationCode)}
                    className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Unified Leaderboard Controls & Table ── */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Platform View Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'overall', label: '🏆 Unified Rank' },
              { id: 'leetcode', label: '🟡 LeetCode' },
              { id: 'codeforces', label: '🔵 Codeforces' },
              { id: 'codechef', label: '🟤 CodeChef' },
              { id: 'colleges', label: '🏛️ Top Colleges' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveView(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  activeView === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Filters: College Select & Student Search */}
          {activeView !== 'colleges' && (
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
                <Building2 size={14} className="text-indigo-600 shrink-0" />
                <select
                  value={collegeFilter}
                  onChange={(e) => setCollegeFilter(e.target.value)}
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer"
                >
                  {COLLEGES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Colleges (National)' : c}
                    </option>
                  ))}
                </select>
              </div>

              {user?.collegeName && (
                <button
                  type="button"
                  onClick={() =>
                    setCollegeFilter(collegeFilter === user.collegeName ? 'All' : user.collegeName)
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    collegeFilter === user.collegeName
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  My Campus Only
                </button>
              )}

              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or handle..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* View A: College Aggregate Standings */}
        {activeView === 'colleges' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Rank</th>
                  <th className="py-3.5 px-5">College / University</th>
                  <th className="py-3.5 px-5">Active Tracked Coders</th>
                  <th className="py-3.5 px-5">Top Campus Coder</th>
                  <th className="py-3.5 px-5">Total Problems Solved</th>
                  <th className="py-3.5 px-5 text-right">Aggregate Coding Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {collegeStandings.map((col, idx) => {
                  const rank = idx + 1;
                  const isMyCollege =
                    user?.collegeName &&
                    col.collegeName.toLowerCase() === user.collegeName.toLowerCase();

                  return (
                    <tr
                      key={col.collegeName}
                      className={`transition ${
                        isMyCollege
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/30'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex w-7 h-7 rounded-lg items-center justify-center font-black text-xs ${
                            rank === 1
                              ? 'bg-amber-400 text-slate-950'
                              : rank === 2
                              ? 'bg-slate-300 text-slate-900'
                              : rank === 3
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-extrabold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{col.collegeName}</span>
                          {rank === 1 && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">
                              👑 #1 Campus
                            </span>
                          )}
                          {isMyCollege && (
                            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-black text-indigo-700">
                              Your College
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-300">
                        {col.coderCount} {col.coderCount === 1 ? 'Student' : 'Students'}
                      </td>
                      <td className="py-4 px-5 font-bold text-indigo-600 dark:text-indigo-400">
                        {col.topCoder}
                      </td>
                      <td className="py-4 px-5 font-bold text-emerald-600">
                        {Number(col.totalSolved || 0).toLocaleString()} Solved
                      </td>
                      <td className="py-4 px-5 text-right font-black font-mono text-slate-900 dark:text-white">
                        {Number(col.totalScore || 0).toLocaleString()} pts
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* View B: Student Multi-Platform Coding Leaderboard Table */
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-xs font-bold text-slate-500">
                Loading live multi-platform coding standings...
              </div>
            ) : coders.length === 0 ? (
              <div className="p-10 text-center text-xs font-semibold text-slate-500">
                No coders found for this filter. Link your handles above to claim Rank #1!
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-5">Rank</th>
                    <th className="py-3.5 px-4 sm:px-5">Student &amp; Campus</th>
                    <th className="py-3.5 px-4 sm:px-5">🟡 LeetCode (E / M / H)</th>
                    <th className="py-3.5 px-4 sm:px-5">🔵 Codeforces</th>
                    <th className="py-3.5 px-4 sm:px-5">🟤 CodeChef</th>
                    <th className="py-3.5 px-4 sm:px-5">Total Solved</th>
                    <th className="py-3.5 px-4 sm:px-5 text-right">NOTESX Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {coders.map((coder, idx) => {
                    const rank = idx + 1;
                    const cp = coder.codingProfiles || {};
                    const handles = cp.handles || {};
                    const lc = cp.leetcode || {};
                    const cf = cp.codeforces || {};
                    const cc = cp.codechef || {};
                    const isMe =
                      user &&
                      (String(coder._id) === String(user._id) ||
                        coder.name?.toLowerCase() === user.name?.toLowerCase());

                    return (
                      <tr
                        key={coder._id || idx}
                        className={`transition ${
                          isMe
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-l-4 border-indigo-600'
                            : rank === 1
                            ? 'bg-amber-50/40 dark:bg-amber-950/10'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 sm:px-5">
                          <span
                            className={`inline-flex w-7 h-7 rounded-lg items-center justify-center font-black text-xs ${
                              rank === 1
                                ? 'bg-amber-400 text-slate-950 shadow-2xs'
                                : rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : rank === 3
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {rank}
                          </span>
                        </td>

                        {/* Student & Campus */}
                        <td className="py-4 px-4 sm:px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                              {(coder.name || 'S')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                                  {coder.name}
                                </span>
                                {cp.isVerifiedCoder && (
                                  <ShieldCheck
                                    size={14}
                                    className="text-emerald-600 shrink-0"
                                    title="Verified Handle Owner"
                                  />
                                )}
                                {isMe && (
                                  <span className="rounded bg-indigo-600 text-white px-1.5 py-0.2 text-[10px] font-black">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Building2 size={11} className="text-slate-400" />
                                <span>{coder.collegeName}</span>
                                {coder.year && <span>• {coder.year}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* LeetCode Stats */}
                        <td className="py-4 px-4 sm:px-5">
                          {handles.leetcode ? (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <a
                                  href={`https://leetcode.com/u/${handles.leetcode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-extrabold text-slate-800 dark:text-slate-200 hover:text-indigo-600 inline-flex items-center gap-1"
                                >
                                  <span>@{handles.leetcode}</span>
                                  <ExternalLink size={10} />
                                </a>
                                {lc.rating > 0 && (
                                  <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[10px] font-black">
                                    {lc.rating}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-bold">
                                <span className="text-slate-700 dark:text-slate-300 font-extrabold mr-1">
                                  {lc.totalSolved || 0} Solved:
                                </span>
                                <span className="text-emerald-600">{lc.easy || 0}E</span>
                                <span>/</span>
                                <span className="text-amber-600">{lc.medium || 0}M</span>
                                <span>/</span>
                                <span className="text-rose-600">{lc.hard || 0}H</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not linked</span>
                          )}
                        </td>

                        {/* Codeforces Stats */}
                        <td className="py-4 px-4 sm:px-5">
                          {handles.codeforces ? (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <a
                                  href={`https://codeforces.com/profile/${handles.codeforces}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-extrabold text-slate-800 dark:text-slate-200 hover:text-blue-600 inline-flex items-center gap-1"
                                >
                                  <span>@{handles.codeforces}</span>
                                  <ExternalLink size={10} />
                                </a>
                                <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.2 text-[10px] font-extrabold">
                                  {cf.rank || 'Rated'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-semibold">
                                Rating: <b className="text-slate-800 dark:text-slate-200">{cf.rating || 0}</b> •{' '}
                                {cf.totalSolved || 0} Solved
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not linked</span>
                          )}
                        </td>

                        {/* CodeChef Stats */}
                        <td className="py-4 px-4 sm:px-5">
                          {handles.codechef ? (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <a
                                  href={`https://www.codechef.com/users/${handles.codechef}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-extrabold text-slate-800 dark:text-slate-200 hover:text-amber-700 inline-flex items-center gap-1"
                                >
                                  <span>@{handles.codechef}</span>
                                  <ExternalLink size={10} />
                                </a>
                                <span className="rounded bg-amber-100 text-amber-900 px-1.5 py-0.2 text-[10px] font-black">
                                  {cc.stars || '1★'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-semibold">
                                Rating: <b className="text-slate-800 dark:text-slate-200">{cc.rating || 0}</b> •{' '}
                                {cc.totalSolved || 0} Solved
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Not linked</span>
                          )}
                        </td>

                        {/* Total Problems Solved */}
                        <td className="py-4 px-4 sm:px-5">
                          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                            {cp.totalProblemsSolved || 0}
                          </span>
                        </td>

                        {/* Unified Coding Score */}
                        <td className="py-4 px-4 sm:px-5 text-right">
                          <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400">
                            {Number(cp.codingScore || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 block">pts</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
