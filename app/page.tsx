'use client';
import { useState } from 'react';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null); 
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Server crashed: ${res.status}`);
      setData(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Engine failure.");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    let csv = "Theme,Psychology/Intent,Primary Question,If Off-Track,To Dig Deeper\n";
    data.modules.forEach((mod: any) => {
      mod.questions.forEach((q: any) => {
        const offTrack = q.off_track ? q.off_track.join(" | ") : "N/A";
        const followUps = q.follow_ups ? q.follow_ups.join(" | ") : "N/A";
        const clean = (str: string) => `"${str.replace(/"/g, '""')}"`;
        csv += `${clean(mod.theme)},${clean(q.rationale)},${clean(q.primary)},${clean(offTrack)},${clean(followUps)}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pyrrho_field_guide.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Dynamically count ONLY the primary questions
  const totalPrimaryQuestions = data ? data.modules.reduce((sum: number, mod: any) => sum + mod.questions.length, 0) : 0;

  if (showSplash) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050505] text-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#97144d]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-xl space-y-8 animate-in fade-in zoom-in duration-700 relative z-10">
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">Pyrrho</h1>
            <p className="text-[#97144d] font-medium tracking-wide text-sm uppercase">Behavioral Psych Engine</p>
          </div>
          
          <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl">
            <p className="text-sm text-gray-300 leading-relaxed">
              Stop poisoning your own research with leading questions. Pyrrho acts as a skeptic. It forces you to cross-examine your own project brief, extracts the hard variables, and outputs a critical-incident interview guide.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full border border-gray-700 bg-black/50 text-xs flex items-center justify-center font-bold text-gray-400 shrink-0 mt-0.5">1</div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Dump Raw Notes</h3>
                  <p className="text-xs text-gray-500 mt-1">Paste your messy assumptions and field observations.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full border border-gray-700 bg-black/50 text-xs flex items-center justify-center font-bold text-gray-400 shrink-0 mt-0.5">2</div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Isolate Variables</h3>
                  <p className="text-xs text-gray-500 mt-1">Forces you to define exactly who, where, and what is failing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full border border-gray-700 bg-black/50 text-xs flex items-center justify-center font-bold text-gray-400 shrink-0 mt-0.5">3</div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Build the Guide</h3>
                  <p className="text-xs text-gray-500 mt-1">Generates behavioral probes and observational tasks.</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowSplash(false)}
            className="w-full py-4 bg-[#97144d] text-white font-semibold rounded-xl hover:bg-[#7a0f3d] transition-all shadow-[0_0_20px_rgba(151,20,77,0.3)]"
          >
            Boot Pyrrho
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-gray-200 font-sans p-4 md:p-12 relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-[#97144d]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
        
        <header className="border-b border-white/10 pb-6 flex justify-between items-end">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Pyrrho</h1>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Active Session</span>
        </header>
        
        {errorMsg && (
          <div className="p-4 bg-red-950/40 backdrop-blur-md border border-red-900 text-red-400 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {!data ? (
          <div className="space-y-6">
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-4 shadow-xl">
              <div>
                <label className="text-sm font-medium text-white block mb-3">Research Context</label>
                <div className="flex flex-col gap-1 mb-5 border-l-2 border-[#97144d] pl-4">
                  <p className="text-xs text-gray-400 mb-1">Ensure your context explicitly states:</p>
                  <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                    <li>The target user role</li>
                    <li>The specific environment or system</li>
                    <li>The friction point you suspect</li>
                  </ul>
                </div>
              </div>
              
              <textarea 
                className="w-full h-56 bg-black/40 border border-white/10 rounded-lg p-5 text-gray-200 focus:outline-none focus:border-[#97144d] focus:ring-1 focus:ring-[#97144d] transition-all resize-none"
                placeholder="We are studying the pain points of bank staff. We suspect the main friction is the slow load times of the Cust 360 dashboard when they are talking to customers..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !context.trim()}
              className="w-full py-4 bg-[#97144d] text-white font-semibold rounded-xl hover:bg-[#7a0f3d] disabled:opacity-40 disabled:hover:bg-[#97144d] transition-all shadow-[0_0_20px_rgba(151,20,77,0.2)]"
            >
              {loading ? 'Synthesizing...' : 'Extract & Generate Guide'}
            </button>
          </div>
        ) : (
          
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* PHASE 1: GUARDRAILS */}
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-5 shadow-lg">
              <h2 className="text-[10px] text-[#97144d] uppercase tracking-widest mb-4 font-bold border-b border-white/5 pb-2">Phase 1: Extracted Variables</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.guardrails).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{key}</p>
                    <p className="text-sm font-medium text-gray-200">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ASSUMPTION CHECK */}
            <div className="bg-[#97144d]/10 border border-[#97144d]/30 rounded-xl p-5 shadow-inner">
               <h2 className="text-[10px] text-[#97144d] uppercase tracking-widest mb-1 font-bold">Assumption Check</h2>
               <p className="text-xs text-[#97144d]/70 mb-3">Pyrrho detected a potential bias in your context:</p>
               <p className="text-sm font-medium text-gray-200 italic">"{data.blind_spot}"</p>
            </div>

            {/* META BAR */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Est. Time</p>
                  <p className="text-lg font-medium text-white">{data.meta.estimated_time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Primary Questions</p>
                  <p className="text-lg font-medium text-white">{totalPrimaryQuestions}</p>
                </div>
              </div>
            </div>

            {/* PHASE 2: MODULES */}
            <div className="space-y-10">
              {data.modules.map((mod: any, i: number) => (
                <section key={i} className="space-y-4">
                  <h2 className="text-xl font-medium text-white border-b border-white/10 pb-2">{mod.theme}</h2>
                  
                  <div className="space-y-4">
                    {mod.questions.map((q: any, j: number) => (
                      <div key={j} className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-5 shadow-md">
                        <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide">Intent: {q.rationale}</p>
                        <p className="text-lg text-gray-100 font-medium mb-4">{q.primary}</p>
                        
                        <div className="flex flex-col md:flex-row gap-3 mt-4">
                          {q.off_track && q.off_track.length > 0 && (
                            <div className="flex-1 bg-black/40 rounded-lg p-4 border border-white/5">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">If they go off-track</p>
                              <ul className="space-y-1">
                                {q.off_track.map((pt: string, k: number) => (
                                  <li key={k} className="text-xs text-gray-500 pl-2 border-l border-gray-700">{pt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {q.follow_ups && q.follow_ups.length > 0 && (
                            <div className="flex-1 bg-[#97144d]/10 rounded-lg p-4 border border-[#97144d]/20">
                              <p className="text-[10px] text-[#97144d] uppercase tracking-widest mb-2 font-bold">To dig deeper</p>
                              <ul className="space-y-1">
                                {q.follow_ups.map((pt: string, k: number) => (
                                  <li key={k} className="text-xs text-gray-300 pl-2 border-l border-[#97144d]/40">{pt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <button 
                onClick={exportToCSV}
                className="w-full py-4 bg-[#97144d] text-white font-semibold rounded-xl hover:bg-[#7a0f3d] transition-all shadow-[0_0_15px_rgba(151,20,77,0.2)]"
              >
                Download CSV (For Google Sheets)
              </button>
              <button 
                onClick={() => {
                  setData(null);
                  setContext('');
                }} 
                className="w-full py-4 bg-transparent border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Restart
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}