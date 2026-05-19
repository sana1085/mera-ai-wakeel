import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, 
  Send, 
  User, 
  ShieldCheck, 
  FileText, 
  Search, 
  Menu, 
  X, 
  MessageSquare, 
  Gavel, 
  MapPin, 
  Download,
  Phone,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Message, LegalTemplate, Advocate } from './types';

const TEMPLATES: LegalTemplate[] = [
  { id: '1', name: '15-day Demand Notice', price: 250, description: 'Standard legal notice for recovery or breach.' },
  { id: '2', name: 'Landlord-Tenant Agreement', price: 500, description: 'Provincial act compliant rental contract.' },
  { id: '3', name: 'Consumer Court Complaint', price: 300, description: 'Formal petition for consumer rights violation.' },
];

const ADVOCATES: Advocate[] = [
  { id: '1', name: 'Adv. Ahmed Khan', specialty: 'Criminal Law', city: 'Karachi' },
  { id: '2', name: 'Adv. Sara Asif', specialty: 'Family & Civil', city: 'Lahore' },
  { id: '3', name: 'Adv. Bilal Sheikh', specialty: 'Property Law', city: 'Islamabad' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to reach server');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "An error occurred. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdfdfd] text-slate-900 font-sans overflow-hidden">
      {/* Header: Institutional & Secure */}
      <header className="h-16 bg-pakistan-green text-white flex items-center justify-between px-6 border-b-2 border-pakistan-gold shrink-0 shadow-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
            <div className="text-pakistan-green font-bold text-xl">MAW</div>
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none">Mera AI Wakeel</h1>
            <p className="text-[10px] text-emerald-100 uppercase tracking-widest mt-1">Pakistani Legal Navigation System</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex bg-[#005c34] rounded p-1 text-[11px] font-medium border border-emerald-700/30">
            <span className="px-3 py-1 bg-white text-pakistan-green rounded shadow-sm">English</span>
            <span className="px-3 py-1 text-emerald-100">Urdu</span>
            <span className="px-3 py-1 text-emerald-100">Roman Urdu</span>
          </div>
          <div className="h-8 w-px bg-emerald-700 mx-2"></div>
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold">Protocol v2.1</p>
            <p className="text-[10px] text-emerald-200">Status: Procedural Audit</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-emerald-700 rounded-md"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Context & Categories */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ x: -256, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -256, opacity: 0 }}
              className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4 shrink-0 overflow-y-auto"
            >
              <div className="mb-6">
                <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Active Categories</h2>
                <nav className="space-y-1">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 rounded border-l-4 border-pakistan-green text-[13px] font-medium cursor-pointer">
                    <MapPin size={14} className="text-pakistan-green" />
                    <span>Rented Premises</span>
                  </div>
                  {[
                    { icon: <User size={14} />, label: 'Family Law' },
                    { icon: <ShieldCheck size={14} />, label: 'Consumer Rights' },
                    { icon: <Gavel size={14} />, label: 'Criminal (PPC)' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 text-slate-600 hover:bg-slate-100 rounded text-[13px] transition-colors cursor-pointer group">
                      <span className="group-hover:text-pakistan-green transition-colors">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="mb-8">
                <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} /> Legal Templates
                </h2>
                <div className="space-y-3">
                  {TEMPLATES.map((t) => (
                    <div key={t.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-pakistan-green/30 transition-all group">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[11px] font-bold text-slate-800 leading-tight">{t.name}</h3>
                        <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-pakistan-green">Rs. {t.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mb-2">{t.description}</p>
                      <button className="w-full py-1.5 text-[9px] font-bold uppercase tracking-wider bg-pakistan-green text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Download Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                  <h3 className="text-orange-800 text-[11px] font-bold uppercase mb-1 flex items-center gap-1">
                    <ShieldCheck size={12} /> PECA 2016
                  </h3>
                  <p className="text-[10px] text-orange-700 leading-relaxed">
                    Protect your privacy. Avoid sharing your CNIC, bank details, or home address.
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Consultation Panel: High Density Workflow */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="max-w-xl mx-auto mt-12 text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-pakistan-green border border-emerald-100">
                  <Gavel size={24} />
                </div>
                <h2 className="text-xl font-serif italic text-slate-800 mb-2">Institutional Consultation Area</h2>
                <p className="text-[12px] text-slate-500 leading-relaxed max-w-sm mx-auto mb-8">
                  Present your legal query to the RAG system for procedural mapping and statute retrieval.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {[
                    "Mera landlord mjhe nikal rha hai without notice.",
                    "Consumer court mein complaint kaisey karein?",
                    "Meher ki payment ka kya law hai?",
                    "F.I.R lodge krwaane ka treeka."
                  ].map((prompt, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(prompt)}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:border-pakistan-green/30 hover:bg-white transition-all flex items-center gap-2"
                    >
                      <MessageSquare size={14} className="text-pakistan-green shrink-0" />
                      <span className="line-clamp-1">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === 'user' ? 'justify-start' : 'justify-start'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-slate-200' : 'bg-pakistan-green'
                }`}>
                  {m.role === 'user' ? (
                    <span className="text-[10px] font-bold text-slate-600 uppercase">You</span>
                  ) : (
                    <Scale size={14} className="text-white" />
                  )}
                </div>
                <div className={`flex-1 max-w-2xl ${
                  m.role === 'user' 
                  ? 'bg-slate-50 p-4 rounded-lg border border-slate-100 italic text-slate-800 text-[13px]' 
                  : 'space-y-4'
                }`}>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* We simulate the high density breakdown by styling the assistant response components if possible, 
                          but since content is markdown from AI, we rely on markdown-body styles updated in CSS */}
                      <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm">
                        <div className="markdown-body">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-pakistan-green flex items-center justify-center shrink-0">
                  <Scale size={14} className="text-white animate-pulse" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-48 bg-slate-100 animate-pulse rounded" />
                  <div className="h-4 w-64 bg-slate-100 animate-pulse rounded" />
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">RAG Mapping...</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">Statute Retrieval...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 p-2 pl-4 rounded-lg border border-slate-200 focus-within:border-pakistan-green/30 focus-within:bg-white transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Submit query for legal mapping (English, Urdu, Roman Urdu)..."
                className="flex-1 bg-transparent border-none focus:outline-none py-2 resize-none text-[13px] max-h-32"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-pakistan-green text-white rounded hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-center mt-3 gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Live: RAG Connected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PECA 2016 Compliant</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Quick Actions & Help */}
        <aside className="w-64 bg-slate-50 border-l border-slate-200 p-4 shrink-0 hidden xl:flex flex-col overflow-y-auto">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Tools</h2>
          <div className="space-y-2 mb-6">
            {[
              { icon: '📄', label: 'Draft Stamp Paper' },
              { icon: '⚖️', label: 'Court Fee Calculator' },
              { icon: '📍', label: 'Find Nearest Katcheri' },
            ].map((tool, idx) => (
              <button key={idx} className="w-full text-left p-2.5 text-[12px] border border-slate-200 rounded bg-white hover:border-pakistan-green transition-colors flex items-center gap-2 shadow-sm">
                <span>{tool.icon}</span>
                <span className="font-medium">{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Term Glossary</h2>
            <div className="space-y-2">
              {[
                { term: 'Katcheri', def: 'District Court complex where legal matters are adjudicated.' },
                { term: 'Meher', def: 'Mandatory payment in Islamic marriage from groom to bride.' },
                { term: 'F.I.R', def: 'First Information Report; initial document for police investigation.' }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-pakistan-green underline decoration-pakistan-gold/30">{item.term}</p>
                  <p className="text-[9px] text-slate-500 italic mt-0.5">{item.def}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Verified Advocates</h2>
            <div className="space-y-3">
              {ADVOCATES.map((a) => (
                <div key={a.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex gap-3 shadow-sm items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-pakistan-green border border-emerald-100 shrink-0">
                    <User size={14} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-800 leading-tight">{a.name}</h3>
                    <p className="text-[9px] text-slate-500">{a.specialty}</p>
                    <p className="text-[9px] text-pakistan-green font-medium flex items-center gap-1">
                      <MapPin size={8} /> {a.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto text-center pt-8">
             <div className="bg-slate-900 text-white rounded p-3 text-[10px] font-medium border border-slate-800">
               <p className="text-pakistan-gold uppercase font-bold tracking-tighter mb-1">Human Lead Gen</p>
               <p className="text-slate-300 leading-tight">Request formal consultation in 24 hours.</p>
               <button className="mt-2 w-full py-1 bg-pakistan-gold text-pakistan-green font-bold rounded">Connect</button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
