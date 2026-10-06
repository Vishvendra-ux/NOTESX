import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Trophy, Flame, Target, BookOpen, MessageSquare, Code, Edit3, Award, 
  X, Check, Save, Globe, ExternalLink, Building2, GraduationCap, User, Sparkles, AlertCircle,
  FileText, UploadCloud, Trash2, Eye
} from 'lucide-react';
import { api } from '../services/api';

export default function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Computer Science student passionate about coding and problem solving.');
  const [collegeName, setCollegeName] = useState(user?.collegeName || 'GLA University');
  const [course, setCourse] = useState(user?.course || 'B.Tech CSE');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [semester, setSemester] = useState(user?.semester || 'Semester 5');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');

  // Keep form state synced with user context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || 'Computer Science student passionate about coding and problem solving.');
      setCollegeName(user.collegeName || 'GLA University');
      setCourse(user.course || 'B.Tech CSE');
      setYear(user.year || '3rd Year');
      setSemester(user.semester || 'Semester 5');
      setGithub(user.github || '');
      setLinkedin(user.linkedin || '');
      setProfilePhoto(user.profilePhoto || '');
    }
  }, [user]);

  const handleResumeUpload = async (file) => {
    if (!file) return;

    setIsUploadingResume(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data) {
        if (setUser) setUser(res.data);
        setSuccessMsg('Resume uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to remove your resume?')) return;
    try {
      const res = await api.delete('/users/resume');
      if (res.data) {
        if (setUser) setUser(res.data);
        setSuccessMsg('Resume removed.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg('Failed to delete resume.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const profileData = { name, bio, collegeName, course, year, semester, github, linkedin, profilePhoto };

    try {
      const res = await api.put('/users/profile', profileData);

      if (res.data) {
        if (setUser) setUser(res.data);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const achievements = [
    { name: 'Top 1% Contributor', icon: <Trophy className="text-yellow-500" />, desc: 'Earned 10,000+ reputation' },
    { name: 'Problem Solver', icon: <MessageSquare className="text-blue-500" />, desc: 'Answered 50+ doubts' },
    { name: '30 Day Streak', icon: <Flame className="text-orange-500" />, desc: 'Logged in for 30 days' },
    { name: 'GATE Challenger', icon: <Target className="text-red-500" />, desc: 'Completed 20 mock tests' },
    { name: 'Notes Hero', icon: <BookOpen className="text-emerald-500" />, desc: 'Notes downloaded 1000+ times' },
  ];

  return (
    <div className="animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* Success Notification Banner */}
      {successMsg && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-800 shadow-sm animate-slide-up">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Cover & Profile Section */}
      <div className="glass-card overflow-hidden mb-8 border border-slate-200 shadow-md">
        <div className="h-44 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 mix-blend-overlay"></div>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-xl text-white transition shadow-sm cursor-pointer"
            title="Edit Profile"
            aria-label="Edit Profile"
          >
            <Edit3 size={18} />
          </button>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pt-2 pb-1 mb-6">
            <div className="relative group shrink-0 -mt-16 sm:-mt-20">
              <div className="w-32 h-32 rounded-2xl bg-indigo-600 border-4 border-white shadow-xl flex items-center justify-center text-5xl font-extrabold text-white relative z-10 overflow-hidden">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.charAt(0).toUpperCase() : 'S'
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-1 right-1 z-20 p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-600 text-white shadow-lg transition opacity-90 group-hover:opacity-100"
                title="Edit Profile"
              >
                <Edit3 size={14} />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1 pt-2 sm:pt-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.name || 'Student Name'}</h1>
                {user?.role === 'admin' && (
                  <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-extrabold text-indigo-700">
                    👑 Admin
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                @{user?.email ? user.email.split('@')[0] : 'student'} • {user?.collegeName || 'GLA University'}, {user?.course || 'B.Tech CSE'} ({user?.year || '3rd Year'})
              </p>
            </div>
            <div className="pb-2 flex items-center gap-3">
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
              <button onClick={logout} className="btn-secondary text-xs py-2 px-4">
                Sign Out
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reputation</p>
              <p className="text-2xl font-black text-indigo-600">{user?.reputation || 12450}</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Global Rank</p>
              <p className="text-2xl font-black text-purple-600">#4,281</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Answers</p>
              <p className="text-2xl font-black text-emerald-600">142</p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Streak</p>
              <p className="text-2xl font-black text-orange-500 flex items-center gap-1">14 <Flame size={20} /></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Achievements */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Achievements Board</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((ach, i) => (
              <div key={i} className="glass-card p-4 flex gap-4 hover:-translate-y-1 transition-transform cursor-default">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{ach.name}</h3>
                  <p className="text-xs text-slate-500">{ach.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Locked Achievement */}
            <div className="glass-card p-4 flex gap-4 opacity-50 grayscale cursor-not-allowed">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                <Award className="text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">Grandmaster</h3>
                <p className="text-xs text-slate-500">Reach top 100 globally</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-900 mb-3">About Me</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {user?.bio || 'Passionate about algorithms and system design. Currently building full-stack projects on CampusSphere.'}
            </p>
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <Building2 size={15} className="text-indigo-600" />
                <span className="font-semibold">{user?.collegeName || 'GLA University'}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={15} className="text-violet-600" />
                <span className="font-semibold">{user?.course || 'B.Tech CSE'} ({user?.year || '3rd Year'})</span>
              </div>
              {user?.github && (
                <a href={user.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline">
                  <Globe size={15} /> <span>GitHub Profile</span>
                </a>
              )}
              {user?.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <ExternalLink size={15} /> <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          </div>

          {/* Student Resume Card */}
          <div className="glass-card p-5 border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText size={17} />
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Student Resume</h3>
              </div>
              {user?.resume && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <Check size={12} /> Uploaded
                </span>
              )}
            </div>

            {user?.resume ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <FileText className="text-indigo-600 shrink-0" size={22} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {user.resumeOriginalName || 'Student_Resume.pdf'}
                    </p>
                    <p className="text-[10px] text-slate-500">PDF / Document File</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={user.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-primary py-2 px-3 text-xs flex items-center justify-center gap-1.5 font-bold"
                  >
                    <Eye size={14} /> View / Download
                  </a>
                  <label className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer transition" title="Replace Resume">
                    <UploadCloud size={16} />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleResumeUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  <button
                    onClick={handleDeleteResume}
                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                    title="Delete Resume"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Upload your resume (PDF/DOCX) to share with campus recruiters and peers.
                </p>
                <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold cursor-pointer transition">
                  <UploadCloud size={16} />
                  <span>{isUploadingResume ? 'Uploading Resume...' : 'Upload Student Resume'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    disabled={isUploadingResume}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleResumeUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-900 mb-3">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Answered a doubt in OS</p>
                  <p className="text-[10px] text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Scored 85% in GATE Mock 4</p>
                  <p className="text-[10px] text-slate-500">Yesterday</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Uploaded notes for DBMS Normalization</p>
                  <p className="text-[10px] text-slate-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl animate-slide-up relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Edit3 size={16} /></span>
                <h3 className="text-lg font-bold text-slate-900">Edit Student Profile</h3>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                <AlertCircle size={15} /> <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo Image URL (Optional)</label>
                <input
                  type="url"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About Me / Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none resize-none"
                  placeholder="Share a short bio..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Program</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech CSE"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  >
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                    <option>Semester 3</option>
                    <option>Semester 4</option>
                    <option>Semester 5</option>
                    <option>Semester 6</option>
                    <option>Semester 7</option>
                    <option>Semester 8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile Link</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile Link</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Resume Upload Field */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Resume (PDF / DOCX / TXT)</label>
                {user?.resume ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={16} className="text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 truncate">{user.resumeOriginalName || 'Student_Resume.pdf'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={user.resume} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">
                        View
                      </a>
                      <button type="button" onClick={handleDeleteResume} className="text-xs font-bold text-rose-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 text-xs font-bold cursor-pointer transition">
                    <UploadCloud size={16} />
                    <span>{isUploadingResume ? 'Uploading Resume...' : 'Upload Resume File (PDF, DOCX)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      disabled={isUploadingResume}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleResumeUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Profile'} <Save size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
