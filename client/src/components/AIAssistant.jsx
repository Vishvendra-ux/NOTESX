import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, FileText, ArrowRight, Loader2, RotateCcw, Compass, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/api';

const STARTER_PROMPTS = [
  'Explain Process Synchronization in OS',
  'How does Banker’s Algorithm prevent deadlocks?',
  'Difference between 3NF and BCNF in DBMS',
  'How do I upload and share notes on NOTESX?'
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi! I'm your **NOTESX Study & Docs Assistant**.\n\nAsk me any concept question, algorithm, or ask how to find specific lecture notes and documents on your campus platform!",
      isBot: true,
      matchedDocs: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendPrompt = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = { text: query, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await aiService.ask({ message: query });
      setMessages(prev => [
        ...prev,
        {
          text: data.message || "Here's what I found from your course notes.",
          isBot: true,
          matchedDocs: data.matchedDocs || [],
          matchedRoadmap: data.matchedRoadmap || null,
          provider: data.provider
        }
      ]);
    } catch (err) {
      console.error('Failed to get answer from AI service:', err);
      setMessages(prev => [
        ...prev,
        {
          text: "I encountered an issue connecting to the knowledge base. Please check your internet or try asking again in a moment.",
          isBot: true,
          matchedDocs: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  const handleResetChat = () => {
    setMessages([
      {
        text: "👋 Chat reset! Ask me any study question or ask about lecture notes in your college curriculum.",
        isBot: true,
        matchedDocs: []
      }
    ]);
  };

  // Helper to render bold text and linebreaks safely
  const renderFormattedText = (rawText) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((para, pIdx) => {
      // Handle markdown headers ###
      if (para.startsWith('### ')) {
        return (
          <h4 key={pIdx} className="font-bold text-slate-900 mt-2 mb-1 text-sm border-b border-slate-100 pb-1">
            {para.replace('### ', '')}
          </h4>
        );
      }
      if (para.startsWith('#### ')) {
        return (
          <h5 key={pIdx} className="font-semibold text-slate-800 mt-1.5 mb-1 text-xs">
            {para.replace('#### ', '')}
          </h5>
        );
      }

      // Handle bullet lists
      if (para.includes('\n- ') || para.startsWith('- ')) {
        const lines = para.split('\n');
        return (
          <ul key={pIdx} className="list-disc pl-4 space-y-1 my-1.5 text-xs leading-relaxed text-slate-700">
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^-\s+/, '');
              return <li key={lIdx} dangerouslySetInnerHTML={{ __html: formatBold(cleaned) }} />;
            })}
          </ul>
        );
      }

      return (
        <p 
          key={pIdx} 
          className="my-1 text-xs leading-relaxed text-slate-700" 
          dangerouslySetInnerHTML={{ __html: formatBold(para) }} 
        />
      );
    });
  };

  const formatBold = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-indigo-700">$1</code>');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Learning Assistant"
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <Bot size={24} className="sm:hidden" aria-hidden="true" />
        <Bot size={28} className="hidden sm:block" aria-hidden="true" />
      </button>

      {/* Floating Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 flex justify-between items-center text-white shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-white/15">
                <Sparkles size={16} className="text-yellow-300" />
              </span>
              <div>
                <h3 className="text-sm font-bold leading-tight">NOTESX AI Assistant</h3>
                <span className="text-[10px] text-indigo-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected to verified campus docs
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleResetChat} 
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.isBot ? 'items-start' : 'items-end'}`}>
                <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs ${
                  msg.isBot 
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                }`}>
                  {msg.isBot ? (
                    <div>{renderFormattedText(msg.text)}</div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {/* Referenced Notes & Docs Citations */}
                {msg.isBot && msg.matchedDocs && msg.matchedDocs.length > 0 && (
                  <div className="mt-2.5 max-w-[92%] w-full space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <FileText size={12} className="text-indigo-600" />
                      Referenced Documents in NOTESX ({msg.matchedDocs.length})
                    </p>
                    <div className="grid gap-1.5">
                      {msg.matchedDocs.map((doc) => (
                        <Link
                          key={doc.id}
                          to="/notes"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl border border-indigo-100 bg-white hover:border-indigo-300 hover:shadow-sm transition-all group"
                        >
                          <div className="min-w-0 pr-2">
                            <b className="block text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                              {doc.title}
                            </b>
                            <span className="text-[10px] text-slate-500">
                              {doc.subject} • {doc.unit} • {doc.college}
                            </span>
                          </div>
                          <span className="shrink-0 text-indigo-600 text-[11px] font-bold inline-flex items-center gap-0.5">
                            View <ArrowRight size={11} className="transition group-hover:translate-x-0.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Roadmap Card */}
                {msg.isBot && msg.matchedRoadmap && (
                  <div className="mt-2 max-w-[92%] w-full">
                    <Link
                      to={`/roadmaps/${msg.matchedRoadmap.slug || msg.matchedRoadmap.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <Compass size={16} className="text-blue-600 shrink-0" />
                        <div>
                          <b className="block text-xs text-blue-950 font-bold group-hover:text-blue-700">
                            Roadmap: {msg.matchedRoadmap.title}
                          </b>
                          <span className="text-[10px] text-blue-700">Open interactive milestone learning path</span>
                        </div>
                      </div>
                      <ExternalLink size={12} className="text-blue-600" />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2 p-3 max-w-[70%] rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm text-xs text-slate-500">
                <Loader2 size={15} className="animate-spin text-indigo-600" />
                <span>Reading course documents & notes...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 2 && !loading && (
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200/80 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendPrompt(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a concept, formula, or notes..." 
                disabled={loading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60"
              />
              <button 
                type="submit" 
                className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
