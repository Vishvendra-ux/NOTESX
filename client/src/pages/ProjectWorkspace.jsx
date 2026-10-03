import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { buildTogetherService } from '../services/api';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, Users, ShieldCheck, Ticket } from 'lucide-react';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch project and messages
    const fetchData = async () => {
      try {
        const [projectRes, messagesRes] = await Promise.all([
          buildTogetherService.get(id),
          buildTogetherService.getMessages(id)
        ]);

        const p = projectRes.data;
        if (!p.isMember && !p.isCreator && user?.role !== 'admin') {
          setError('You are not a confirmed member of this project.');
          setLoading(false);
          return;
        }

        setProject(p);
        setMessages(messagesRes.data || []);

        // Initialize Socket.io
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
        const token = localStorage.getItem('token');
        socketRef.current = io(socketUrl, {
          auth: { token }
        });

        socketRef.current.emit('join_project', id);

        socketRef.current.on('receive_message', (message) => {
          setMessages((prev) => [...prev, message]);
        });

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project workspace');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [id, user]);

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

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (loading) {
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
              <ShieldCheck size={12} /> Team Workspace
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
