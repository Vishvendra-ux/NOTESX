import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI learning assistant. How can I help you with your studies today?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { text: input, isBot: false }];
    setMessages(newMessages);
    setInput("");
    
    // Mock bot response
    setTimeout(() => {
      setMessages([...newMessages, { 
        text: "That's a great question about Operating Systems. Let me explain it with an analogy...", 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-xl shadow-primary-500/40 flex items-center justify-center hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Bot size={28} />
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[500px] max-h-[80vh] glass-card shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-up border-primary-500/30">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-300" />
              <h3 className="font-bold">AI Learning Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.isBot 
                    ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm' 
                    : 'bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-500/20'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..." 
                className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
              <button 
                type="submit" 
                className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shrink-0 hover:bg-primary-700 transition-colors shadow-md shadow-primary-500/20 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

