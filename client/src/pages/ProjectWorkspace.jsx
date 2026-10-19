import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { buildTogetherService } from '../services/api';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, Users, ShieldCheck, Ticket } from 'lucide-react';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSavingDemo, setIsSavingDemo] = useState(false);
  const [demoError, setDemoError] = useState('');
  const [demoNotice, setDemoNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    if (!user) {
      return undefined;
    }

    // Fetch project and messages, then join the project's real-time room
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectRes, messagesRes] = await Promise.all([
          buildTogetherService.get(id),
          buildTogetherService.getMessages(id)
        ]);

        if (isCancelled) return;

        const p = projectRes.data;
        if (!p.isMember && !p.isCreator && user?.role !== 'admin') {
          setError('You are not a confirmed member of this project.');
          setLoading(false);
          return;
        }

        setProject(p);
        setDemoUrl(p.demoUrl || '');
        setGithubUrl(p.githubUrl || '');
        setMessages(messagesRes.data || []);

        // Initialize Socket.io — same-origin in production, localhost in dev
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '')
          || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:5001' : '/');
        const token = localStorage.getItem('token');
        const socket = io(socketUrl, {
          auth: { token }
        });
        socketRef.current = socket;

        socket.emit('join_project', id);

        socket.on('receive_message', (message) => {
          setMessages((prev) => [...prev, message]);
        });

        socket.on('project_error', (err) => {
          setError(err?.message || 'Unable to join this project workspace in real time.');
        });
      } catch (err) {
        if (!isCancelled) {
          setError(err.response?.data?.message || 'Failed to load project workspace');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Disconnect on unmount or when id/user changes
    return () => {
      isCancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [id, user, authLoading]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !user) return;

    const messageData = {
      projectId: id,
      senderId: user._id || user.id,
      senderName: user.name,
      senderAvatar: user.profilePhoto || '',
      text: newMessage.trim(),
    };

    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  const handlePublishDemo = async (e) => {
    e.preventDefault();
    if (!project?.isCreator) return;
    setIsSavingDemo(true);
    setDemoError('');
    setDemoNotice('');
    try {
      const response = await buildTogetherService.publishDemo(id, { demoUrl, githubUrl });
      setProject(response.data.project);
      setDemoUrl(response.data.project.demoUrl || '');
      setGithubUrl(response.data.project.githubUrl || '');
      setDemoNotice('Demo and repository saved. The project is marked complete.');
    } catch (err) {
      setDemoError(err.response?.data?.message || 'Could not save the project outcome. Please try again.');
    } finally {
      setIsSavingDemo(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <ShieldCheck size={48} className="mx-auto text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h2>
          <p className="text-slate-600 mb-6">Please log in to access this project team workspace.</p>
          <Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <ShieldCheck size={48} className="mx-auto text-rose-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link to="/build-together" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-[calc(100vh-68px)]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/build-together" className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 line-clamp-1">{project.title}</h1>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> {project.status === 'Completed' ? 'Demo published' : 'Team Workspace'}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {project.members.map((m, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs" title={m.name}>
              {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full rounded-full object-cover"/> : m.name.charAt(0)}
            </div>
          ))}
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1.5">
            <Users size={14} /> {project.members.length} Members
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="w-full sm:w-64 lg:w-80 bg-white border-r border-slate-200 shrink-0 overflow-y-auto hidden sm:block">
          <div className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Project Details</h3>
            <p className="text-sm font-semibold text-slate-900 mb-2">{project.tagline}</p>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">{project.description}</p>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1"><Ticket size={14}/> Seats</h4>
                <div className="space-y-2">
                  {project.bookingSlots?.map((slot, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{slot.roleTitle}</p>
                      <p className={`text-[10px] font-bold mt-1 ${slot.status === 'reserved' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                        {slot.status === 'reserved' ? `Filled by ${slot.filledBy?.name || 'Someone'}` : 'Available'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {(project.demoUrl || project.githubUrl) && (
            <section className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 bg-emerald-50 px-4 py-3 sm:px-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">Project outcome</p>
                <p className="mt-0.5 text-xs text-emerald-900">Demo and project repository</p>
              </div>
              <div className="flex gap-2">
                {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800">Open demo</a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-100">Repository / README</a>}
              </div>
            </section>
          )}

          {project.isCreator && (
            <form onSubmit={handlePublishDemo} className="grid gap-2 border-b border-slate-200 bg-white p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:px-6">
              <label className="text-xs font-bold text-slate-700">
                Working demo URL
                <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://your-demo.example" required maxLength={2048} className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-indigo-500" />
              </label>
              <label className="text-xs font-bold text-slate-700">
                GitHub repository or README URL
                <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/you/project" required maxLength={2048} className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-indigo-500" />
              </label>
              <button type="submit" disabled={isSavingDemo} className="h-10 rounded-lg bg-indigo-600 px-4 text-xs font-extrabold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isSavingDemo ? 'Saving…' : project.status === 'Completed' ? 'Update outcome' : 'Publish final demo'}
              </button>
              {(demoError || demoNotice) && <p role={demoError ? 'alert' : 'status'} className={`text-xs sm:col-span-3 ${demoError ? 'text-rose-700' : 'text-emerald-700'}`}>{demoError || demoNotice}</p>}
              {!project.demoUrl && <p className="text-[11px] text-slate-500 sm:col-span-3">Publishing marks the project complete and requires at least one approved teammate.</p>}
            </form>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-2xl">👋</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">Welcome to the Team Chat!</p>
                <p className="text-xs max-w-xs">Say hello to your teammates and start collaborating.</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.sender === (user._id || user.id);
                return (
                  <div key={idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                       {msg.senderAvatar ? <img src={msg.senderAvatar} alt={msg.senderName} className="w-full h-full rounded-full object-cover"/> : <span className="text-xs font-bold text-indigo-700">{msg.senderName?.charAt(0)}</span>}
                    </div>
                    <div className={`max-w-[75%] sm:max-w-md flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-700">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message your team..."
                className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-600 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl disabled:opacity-50 transition cursor-pointer"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
