import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, BookOpen, ListChecks, Lightbulb, Route, BarChart3, Plus, FileText, ArrowRight, Loader2, Compass, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/api';

const actions = [
  [BookOpen, 'Explain Process Synchronization', 'Break Peterson’s algorithm and semaphores into steps'],
  [ListChecks, 'Banker’s Algorithm Example', 'Safe state matrices and deadlock avoidance'],
  [Lightbulb, 'BCNF vs 3NF Normalization', 'Key differences and dependency preservation'],
  [Route, 'AI / ML Career Roadmap', 'Milestones, math foundations, and project specs'],
  [BarChart3, 'CPU Scheduling Gantt Charts', 'SJF, FCFS, and Round Robin calculations'],
  [Compass, 'Cache Memory & Virtual Addressing', 'Direct-mapped vs associative cache and page tables']
];

const recentTopics = [
  'Process Synchronization & Semaphores',
  'Deadlock Detection & Banker Algorithm',
  'DBMS Normalization 1NF to BCNF',
  'CPU Scheduling Gantt Charts',
  'Virtual Memory & Page Replacement LRU'
];

export default function AIAssistantPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendQuery = async (queryText) => {
    const query = (queryText || text).trim();
    if (!query || loading) return;

    setMessages(prev => [...prev, { user: true, text: query }]);
    setText('');
    setLoading(true);

    try {
      const { data } = await aiService.ask({ message: query });
      setMessages(prev => [
        ...prev,
        {
          user: false,
          text: data.message,
          matchedDocs: data.matchedDocs || [],
          matchedRoadmap: data.matchedRoadmap || null,
          provider: data.provider
        }
      ]);
    } catch (err) {
      console.error('Error querying AI assistant:', err);
      setMessages(prev => [
        ...prev,
        {
          user: false,
          text: "I couldn't retrieve an answer right now. Please ensure the backend server is running and try again.",
          matchedDocs: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(text);
  };

  const escapeHtml = (str) => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatBold = (str) => {
    const escaped = escapeHtml(str);
    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-700 font-semibold">$1</code>');
  };

  const renderContent = (rawText) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      if (para.startsWith('### ')) {
        return (
          <h3 key={pIdx} className="font-bold text-slate-900 mt-3 mb-1.5 text-base border-b border-slate-100 pb-1">
            {para.replace('### ', '')}
          </h3>
        );
      }
      if (para.startsWith('#### ')) {
        return (
          <h4 key={pIdx} className="font-semibold text-slate-800 mt-2.5 mb-1 text-sm">
            {para.replace('#### ', '')}
          </h4>
        );
      }
      if (para.includes('\n- ') || para.startsWith('- ')) {
        const lines = para.split('\n');
        return (
          <ul key={pIdx} className="list-disc pl-5 space-y-1 my-2 text-sm leading-relaxed text-slate-700">
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^-\s+/, '');
              return <li key={lIdx} dangerouslySetInnerHTML={{ __html: formatBold(cleaned) }} />;
            })}
          </ul>
        );
      }
      return (
        <p key={pIdx} className="my-1.5 text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: formatBold(para) }} />
      );
    });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 pb-12 lg:grid-cols-[290px_1fr]">
      {/* Sidebar */}
      <aside className="rounded-2xl bg-slate-950 p-5 text-white h-fit">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500 shadow-md shadow-indigo-500/30">
            <Sparkles size={18} />
          </span>
          <div>
            <b className="text-sm block">Study Intelligence</b>
            <p className="text-xs text-slate-400">Grounded in verified docs</p>
          </div>
        </div>

        <button 
          onClick={() => setMessages([])}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/15 transition-colors cursor-pointer"
        >
          <Plus size={16} /> New learning session
        </button>

        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Popular Study Topics</p>
          <div className="mt-3 space-y-2">
            {recentTopics.map((item) => (
              <button
                key={item}
                onClick={() => handleSendQuery(item)}
                className="group flex w-full items-center justify-between gap-2.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-left text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="truncate">{item}</span>
                </span>
                <ChevronRight size={14} className="shrink-0 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat View */}
      <section className="min-h-[640px] flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <header className="border-b border-slate-100 px-6 py-5 shrink-0 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-indigo-600">Document Q&A & Support Agent</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-[-.04em] text-slate-900">Learn faster with your campus notes.</h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live RAG Engine
          </span>
        </header>

        {/* Conversation Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 ? (
            <div>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Choose a starter topic below or ask about any concept, algorithm, or past question from your curriculum. Answers are directly matched with course notes uploaded on NOTESX.
              </p>
              <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {actions.map(([Icon, title, desc]) => (
                  <button
                    key={title}
                    onClick={() => handleSendQuery(title)}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xs group cursor-pointer"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:scale-105">
                      <Icon size={17} />
                    </span>
                    <div>
                      <b className="block text-sm text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">{title}</b>
                      <small className="mt-1 block text-xs text-slate-500 leading-relaxed">{desc}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, i) => (
                <div key={i} className={`flex flex-col ${message.user ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                    message.user 
                      ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10' 
                      : 'border border-slate-200 bg-slate-50/70 text-slate-800 shadow-2xs'
                  }`}>
                    {message.user ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div>{renderContent(message.text)}</div>
                    )}
                  </div>

                  {/* Matched Documents Citation Cards */}
                  {!message.user && message.matchedDocs && message.matchedDocs.length > 0 && (
                    <div className="mt-3 max-w-[85%] w-full">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={14} className="text-indigo-600" />
                        Referenced Study Documents in NOTESX:
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {message.matchedDocs.map((doc) => (
                          <Link
                            key={doc.id}
                            to="/notes"
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm transition-all group"
                          >
                            <div className="min-w-0 pr-2">
                              <b className="block text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {doc.title}
                              </b>
                              <span className="text-[11px] text-slate-500">
                                {doc.subject} • {doc.unit}
                              </span>
                            </div>
                            <span className="shrink-0 text-indigo-600 text-xs font-bold inline-flex items-center gap-0.5">
                              Open <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Roadmap link */}
                  {!message.user && message.matchedRoadmap && (
                    <div className="mt-2.5 max-w-[85%] w-full">
                      <Link
                        to={`/roadmaps/${message.matchedRoadmap.slug || message.matchedRoadmap.id}`}
                        className="flex items-center justify-between p-3 rounded-xl border border-blue-200 bg-blue-50/70 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <Compass size={16} className="text-blue-600 shrink-0" />
                          <span className="text-xs font-bold text-blue-950">
                            Roadmap: {message.matchedRoadmap.title}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-blue-600 inline-flex items-center gap-0.5">
                          View Roadmap <ArrowRight size={12} />
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 p-4 max-w-[60%] rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Loader2 size={16} className="animate-spin text-indigo-600" />
              <span>Analyzing curriculum documentation and course notes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleFormSubmit} className="border-t border-slate-200/80 p-4 sm:p-5 bg-gradient-to-b from-white to-slate-50/70 shrink-0">
          <div className="relative flex items-center gap-2 rounded-2xl border-2 border-indigo-200/80 bg-white p-2 shadow-lg shadow-indigo-950/5 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
            <span className="pl-2 text-indigo-600 shrink-0">
              <Sparkles size={18} />
            </span>
            <input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm font-medium outline-none placeholder-slate-400 text-slate-900" 
              placeholder="Ask anything about course notes, algorithms, or exam syllabus..."
              aria-label="Ask study assistant question"
            />
            <button 
              type="submit"
              disabled={!text.trim() || loading}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" 
              aria-label="Send message"
            >
              <span>Ask</span>
              <Send size={15} />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span>Powered by NOTESX verified campus documents</span>
            <span className="hidden sm:inline">Press Enter ↵ to ask</span>
          </div>
        </form>
      </section>
    </div>
  );
}
