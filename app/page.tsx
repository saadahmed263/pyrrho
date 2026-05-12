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

  const totalPrimaryQuestions = data ? data.modules.reduce((sum: number, mod: any) => sum + mod.questions.length, 0) : 0;

  if (showSplash) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050505] text-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#97144d]/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-xl space-y-8 animate-in fade-in zoom-in duration-700 relative z-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold text-white tracking-tight">Pyrrho</h1>
            <p className="text-[#97144d] font-medium tracking-wide text-sm uppercase">Behavioral Psych Engine</p>
            <p className="text-xs italic text-gray-500 mt-4 border-l border-gray-800 pl-4 py-1">
              "Nothing is more one thing than another." — Named after Pyrrho of Elis, the father of skepticism who believed in suspending judgment to find clarity.
            </p>
          </div>
          
          <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl">
            <p className="text-sm text-gray-300 leading-relaxed">
              Pyrrho acts as a skeptic to strip bias from your project brief. It extracts hard variables and outputs a critical-incident interview guide designed to bypass post-rationalization.
            </p>
            
            <div className="space-y-5">
              {[
                { title: "Dump Raw Notes", desc: "Paste messy assumptions and field observations." },
                { title: "Isolate Variables", desc: "Define exactly who, where, and what is failing." },
                { title: "Build the Guide", desc: "Generate behavioral probes and observational tasks." }
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full border border-gray-700 bg-black/50 text-[10px] flex items-center justify-center font-bold text-gray-400 shrink-0 mt-0.5">{i+1}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setShowSplash(false)}
            className="w-full py-4 bg-[#97144d] text-white font-semibold rounded-xl hover:bg-[#7a0f3d] transition-all shadow-[0_0_20px_rgba(151,20,77,0.3)]"
          >
            Initialize Engine
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-gray-200 font-sans p-4 md:p-12 relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-[#97144d]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10 animate-in fade-in duration-500">
        
       <header className="relative z-50 border-b border-white/10 pb-6 flex justify-between items-end">
          <div className="flex items-center gap-3">
            {/* The Skeptic's Lens Logo */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#97144d] rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute inset-1 border border-[#97144d]/50 rounded-full"></div>
              <div className="w-3 h-3 bg-[#97144d] rounded-full shadow-[0_0_15px_rgba(151,20,77,1)]"></div>
              {/* Refraction glint */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/80 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white tracking-tight leading-none">Pyrrho</h1>
              <p className="text-[10px] text-[#97144d] uppercase tracking-[0.2em] font-bold mt-1.5">Skeptic Engine</p>
            </div>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest pb-1">Active Session</span>
        </header>
        
        {!data ? (
          <div className="space-y-6">
            <div className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-6 space-y-4 shadow-xl">
              <div className="space-y-4">
                <label className="text-sm font-medium text-white block">Research Context</label>
                <div className="space-y-2 border-l-2 border-[#97144d] pl-4">
                  <p className="text-xs text-gray-400">Context checklist:</p>
                  <ul className="text-[11px] text-gray-500 space-y-0.5">
                    <li className="flex items-center gap-2">• Target User Role</li>
                    <li className="flex items-center gap-2">• Physical/Digital Environment</li>
                    <li className="flex items-center gap-2">• Observed or Suspected Friction</li>
                  </ul>
                </div>
              </div>
              
              <textarea 
                className="w-full h-56 bg-black/40 border border-white/10 rounded-lg p-5 text-gray-200 focus:outline-none focus:border-[#97144d] focus:ring-1 focus:ring-[#97144d] transition-all resize-none"
                placeholder="Ex: We are observing logistics managers in a warehouse setting. They are using the handheld scanner to log inventory but seem to be skipping steps when the wifi drops, leading to data mismatches..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !context.trim()}
              className="w-full py-4 bg-[#97144d] text-white font-semibold rounded-xl hover:bg-[#7a0f3d] disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(151,20,77,0.2)]"
            >
              {loading ? 'Synthesizing...' : 'Extract & Generate Guide'}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
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

            <div className="bg-[#97144d]/10 border border-[#97144d]/30 rounded-xl p-5">
               <h2 className="text-[10px] text-[#97144d] uppercase tracking-widest mb-1 font-bold">Assumption Check</h2>
               <p className="text-xs text-gray-400 mb-3 tracking-wide">Pyrrho detected a potential bias in your context:</p>
               <p className="text-sm font-medium text-gray-200 italic leading-relaxed">"{data.blind_spot}"</p>
            </div>

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

            <div className="space-y-10">
              {data.modules.map((mod: any, i: number) => (
                <section key={i} className="space-y-4">
                  <h2 className="text-xl font-medium text-white border-b border-white/10 pb-2">{mod.theme}</h2>
                  <div className="space-y-4">
                    {mod.questions.map((q: any, j: number) => (
                      <div key={j} className="bg-[#121212]/60 backdrop-blur-xl border border-white/5 rounded-xl p-5 shadow-md">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Psychology: {q.rationale}</p>
                        <p className="text-lg text-gray-100 font-medium mb-4">{q.primary}</p>
                        
                        <div className="flex flex-col md:flex-row gap-3 mt-4">
                          <div className="flex-1 bg-black/40 rounded-lg p-4 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold italic">If off-track</p>
                            <ul className="space-y-1">
                              {q.off_track?.map((pt: string, k: number) => (
                                <li key={k} className="text-xs text-gray-400 pl-2 border-l border-gray-700">{pt}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex-1 bg-white/5 rounded-lg p-4 border border-white/5">
                            <p className="text-[10px] text-white uppercase tracking-widest mb-2 font-bold italic">To dig deeper</p>
                            <ul className="space-y-1">
                              {q.follow_ups?.map((pt: string, k: number) => (
                                <li key={k} className="text-xs text-gray-300 pl-2 border-l border-[#97144d]">{pt}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <button 
                onClick={exportToCSV}
                className="w-full py-4 bg-[#97144d] text-white font-semibold rounded-xl hover:bg-[#7a0f3d] transition-all"
              >
                Download Field Guide (CSV)
              </button>
              <button 
                onClick={() => { setData(null); setContext(''); }} 
                className="w-full py-4 bg-transparent border border-white/10 text-gray-400 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Reset Engine
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}