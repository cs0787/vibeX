import React, { useState, Component, ErrorInfo, ReactNode } from 'react';

// ==========================================
// 1. FAIL-SAFE ERROR BOUNDARY
// ==========================================
interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("vibeX Runtime Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#020617', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>Runtime Exception Caught</h2>
          <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', marginTop: '12px', fontSize: '12px', color: '#cbd5e1' }}>
            {this.state.error?.message}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '16px', background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 2. BULLETPROOF INLINE SVG ICONS
// ==========================================
const Icons = {
  Sparkles: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
  ),
  Candidate: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
  ),
  Recruiter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
  ),
  Play: () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
  ),
  Check: () => (
    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
  ),
  Cross: () => (
    <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
  ),
  Bot: () => (
    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  ),
  Send: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
  ),
  Terminal: () => (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
  ),
  Shield: () => (
    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
  ),
  LogOut: () => (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
  )
};

// ==========================================
// 3. TASK AND PIPELINE DATA
// ==========================================
const BENCHMARK_TASK = {
  title: "Real-Time Telemetry Stream Processor",
  level: "Senior / Mid-Level Software Engineer",
  instructions: `### Objective
Implement an event stream processor that ingests IoT packet payloads, enforces defensive validation, and computes rolling averages with floating-point precision.

### Requirements:
1. parseEvent(rawJson): Safely parse JSON strings. Reject corrupted payloads or packets missing sensorId or reading (must throw an Error).
2. computeWindowAverages(readings): Compute arithmetic average with 2-decimal precision.
3. flagAnomalies(readings, baseline, maxDeviation): Return readings where Math.abs(reading - baseline) > maxDeviation.`,
  starterCode: `// vibeX AI-Era Assessment Engine
// Implement the required methods below:

export function parseEvent(rawJson) {
  // TODO: Validate required fields (sensorId, reading)
  const data = JSON.parse(rawJson);
  if (!data.sensorId || data.reading === undefined) {
    throw new Error("Invalid telemetry schema: missing sensorId or reading");
  }
  return data;
}

export function computeWindowAverages(readings) {
  // TODO: Compute arithmetic average with 2-decimal precision
  if (!readings || readings.length === 0) return 0;
  const sum = readings.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / readings.length).toFixed(2));
}

export function flagAnomalies(readings, baseline, maxDeviation) {
  // TODO: Detect deviations greater than maxDeviation
  if (!readings) return [];
  return readings.filter(val => Math.abs(val - baseline) > maxDeviation);
}
`
};

const MOCK_CANDIDATES = [
  {
    id: "cand-01",
    name: "Chetan Shakhapure",
    role: "Fullstack / Systems Engineer",
    verdict: "Strong Hire",
    score: 96,
    aiFluency: "Balanced Partner",
    testsPassed: "4 / 4",
    duration: "18 mins",
    evidence: [
      { id: "EV-01", title: "Defensive Validation Architecture", desc: "Enforced schema guards throwing custom Error objects on corrupted packets.", eventLink: "EV_CODE_COMMIT_2" },
      { id: "EV-02", title: "Targeted Socratic Prompting", desc: "Consulted AI on IEEE-754 precision constraints; verified logic before accepting output.", eventLink: "EV_AI_PROMPT_1" }
    ]
  },
  {
    id: "cand-02",
    name: "Aarav Sharma",
    role: "Backend Engineer",
    verdict: "Consider (Follow-up)",
    score: 75,
    aiFluency: "Autonomous",
    testsPassed: "3 / 4",
    duration: "24 mins",
    evidence: [
      { id: "EV-03", title: "Float Rounding Precision Gap", desc: "Missed 2-decimal constraint on arithmetic aggregation test assertion.", eventLink: "EV_TEST_FAIL_3" }
    ]
  }
];

// ==========================================
// 4. MAIN APPLICATION COMPONENT
// ==========================================
function MainApp() {
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'candidate' | 'recruiter' } | null>(null);
  const [authRole, setAuthRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [candidateView, setCandidateView] = useState<'workspace' | 'feedback'>('workspace');
  const [code, setCode] = useState(BENCHMARK_TASK.starterCode);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'coach'; text: string }[]>([
    { sender: 'coach', text: "Welcome to vibeX! I'm your Socratic AI Coach. Ask me about edge cases, syntax, or debugging." }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES[0]);

  const handleRunTests = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const hasValidation = code.includes("throw") && code.includes("Error");
      const hasRounding = code.includes("toFixed") || code.includes("round");

      setTestResults([
        { id: "T1", name: "parseEvent handles valid IoT packet structures", passed: true, time: "4ms" },
        { id: "T2", name: "parseEvent rejects corrupt packets & missing attributes", passed: hasValidation, time: "2ms", error: hasValidation ? null : "Expected function to throw on missing sensorId" },
        { id: "T3", name: "computeWindowAverages handles 2-decimal precision", passed: hasRounding, time: "3ms", error: hasRounding ? null : "Expected 20.27, got unrounded float" },
        { id: "T4", name: "flagAnomalies isolates positive and negative deviations", passed: true, time: "3ms" }
      ]);
      setIsExecuting(false);
    }, 400);
  };

  const handleAskCoach = (presetPrompt?: string) => {
    const q = presetPrompt || coachInput;
    if (!q.trim()) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setCoachInput('');

    setTimeout(() => {
      let reply = "💡 **Coach Insight**: Check boundary conditions and verify your edge-case assertions in the test console.";
      const query = q.toLowerCase();
      if (query.includes("parse") || query.includes("corrupt") || query.includes("error")) {
        reply = "💡 **Socratic Guidance**: When parsing JSON, check if `sensorId` or `reading` are undefined and throw a `new Error()` before returning.";
      } else if (query.includes("float") || query.includes("average") || query.includes("round")) {
        reply = "💡 **Socratic Guidance**: JavaScript uses IEEE-754 binary floating-point representation. Use `Number(val.toFixed(2))` to constrain decimal precision.";
      }
      setChatLog(prev => [...prev, { sender: 'coach', text: reply }]);
    }, 500);
  };

  // 1. AUTHENTICATION VIEW
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 mb-3">
              <Icons.Sparkles />
              <span>iMocha IM-01 AI-Era Assessment</span>
            </div>
            <h1 className="text-3xl font-black text-white">vibeX</h1>
            <p className="text-xs text-slate-400 mt-1">Select your portal to experience the platform</p>
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setAuthRole('candidate')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${authRole === 'candidate' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <Icons.Candidate />
                <div className="mt-4">
                  <div className="text-xs font-bold text-white">Candidate</div>
                  <div className="text-[10px] text-slate-400">Take assessment</div>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setAuthRole('recruiter')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${authRole === 'recruiter' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                <Icons.Recruiter />
                <div className="mt-4">
                  <div className="text-xs font-bold text-white">Recruiter</div>
                  <div className="text-[10px] text-slate-400">Inspect dossiers</div>
                </div>
              </button>
            </div>
          </div>

          <button 
            onClick={() => setCurrentUser({ name: authRole === 'candidate' ? "Chetan Shakhapure" : "Sarah Jenkins", role: authRole })}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2">
            <span>Enter as {authRole === 'candidate' ? 'Candidate' : 'Recruiter'}</span>
            <Icons.ArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // 2. RECRUITER PORTAL VIEW
  if (currentUser.role === 'recruiter') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-indigo-600 text-white font-black px-2.5 py-1 rounded-lg text-xs">vibeX</span>
            <span className="text-xs font-semibold text-slate-400">Recruiter Talent Intelligence Portal</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-300">
            <span>{currentUser.name} (Hiring Lead)</span>
            <button onClick={() => setCurrentUser(null)} className="p-1 hover:text-white"><Icons.LogOut /></button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          <div className="col-span-4 border-r border-slate-800 bg-slate-900/20 p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">Evaluated Candidates</h2>
            {MOCK_CANDIDATES.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCandidate(c)}
                className={`p-4 rounded-xl border cursor-pointer transition ${selectedCandidate.id === c.id ? 'bg-indigo-600/15 border-indigo-500' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>{c.name}</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">{c.verdict}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{c.role} • Score: {c.score}%</div>
              </div>
            ))}
          </div>

          <div className="col-span-8 p-8 overflow-y-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Candidate Skill Dossier</span>
                <h1 className="text-2xl font-black text-white mt-1">{selectedCandidate.name}</h1>
                <p className="text-xs text-slate-400">{selectedCandidate.role} • Duration: {selectedCandidate.duration}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Verdict</span>
                <span className="text-lg font-bold text-emerald-400">{selectedCandidate.verdict}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Pass Rate</div>
                <div className="text-2xl font-black text-indigo-400 mt-1">{selectedCandidate.score}%</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">AI Collaboration</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{selectedCandidate.aiFluency}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Verification Loops</div>
                <div className="text-2xl font-black text-purple-400 mt-1">94%</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200">Inspectable Evidence Chains</h3>
              {selectedCandidate.evidence.map(item => (
                <div key={item.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span>{item.title}</span>
                    <span className="text-[10px] font-mono text-indigo-400">Trace: {item.eventLink}</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CANDIDATE WORKSPACE VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="h-14 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 text-white font-black px-2.5 py-1 rounded-lg text-xs">vibeX</span>
          <span className="text-xs font-semibold text-slate-400">Candidate IDE</span>
        </div>
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button 
            onClick={() => setCandidateView('workspace')} 
            className={`px-3 py-1 rounded ${candidateView === 'workspace' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            Workspace
          </button>
          <button 
            onClick={() => setCandidateView('feedback')} 
            className={`px-3 py-1 rounded ${candidateView === 'feedback' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
            My Growth Dossier
          </button>
        </div>
        <button onClick={() => setCurrentUser(null)} className="p-1 hover:text-white"><Icons.LogOut /></button>
      </header>

      {candidateView === 'workspace' ? (
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          <div className="col-span-3 border-r border-slate-800 p-5 overflow-y-auto bg-slate-900/20 text-xs">
            <h2 className="font-bold text-white text-sm">{BENCHMARK_TASK.title}</h2>
            <div className="text-[10px] text-indigo-400 font-semibold mt-1">{BENCHMARK_TASK.level}</div>
            <pre className="mt-4 text-slate-300 font-mono text-[11px] whitespace-pre-line bg-slate-950 p-3 rounded-xl border border-slate-800">
              {BENCHMARK_TASK.instructions}
            </pre>
          </div>

          <div className="col-span-6 flex flex-col border-r border-slate-800 bg-slate-950">
            <div className="h-10 border-b border-slate-800 px-4 flex justify-between items-center bg-slate-900/40">
              <span className="text-xs font-mono text-slate-400">solution.js</span>
              <button 
                onClick={handleRunTests} 
                disabled={isExecuting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5">
                <Icons.Play />
                <span>{isExecuting ? "Evaluating..." : "Run Tests"}</span>
              </button>
            </div>
            <textarea 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="flex-1 bg-transparent p-4 font-mono text-xs focus:outline-none resize-none text-slate-200" 
              spellCheck={false}
            />
            <div className="h-44 border-t border-slate-800 bg-slate-900/50 p-3 overflow-y-auto text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-300 mb-2">
                <Icons.Terminal />
                <span>Deterministic Assertion Sandbox</span>
              </div>
              {testResults.length === 0 ? (
                <div className="text-slate-500 italic">Click "Run Tests" to execute against assertions.</div>
              ) : (
                <div className="space-y-1.5">
                  {testResults.map(t => (
                    <div key={t.id} className={`p-2 rounded border flex justify-between items-center ${t.passed ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/20 border-rose-800/40 text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {t.passed ? <Icons.Check /> : <Icons.Cross />}
                        <span>{t.name}</span>
                      </div>
                      {t.error && <span className="text-[10px] text-rose-400 font-mono">({t.error})</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-3 flex flex-col bg-slate-900/20">
            <div className="h-10 border-b border-slate-800 px-4 flex items-center space-x-2 text-xs font-bold text-slate-200">
              <Icons.Bot />
              <span>Socratic AI Coach</span>
            </div>
            <div className="p-2 border-b border-slate-800 flex gap-1">
              <button onClick={() => handleAskCoach("How should I reject corrupt packets?")} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300">
                Hint: Validation
              </button>
              <button onClick={() => handleAskCoach("How to fix float rounding?")} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300">
                Hint: Float Rounding
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatLog.map((msg, i) => (
                <div key={i} className={`p-2.5 rounded-xl ${msg.sender === 'user' ? 'bg-indigo-950 text-indigo-200 ml-4' : 'bg-slate-900 text-slate-200 mr-4 border border-slate-800'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-800 flex items-center space-x-2">
              <input 
                type="text" 
                value={coachInput} 
                onChange={e => setCoachInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAskCoach()}
                placeholder="Ask coach for guidance..." 
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              />
              <button onClick={() => handleAskCoach()} className="bg-indigo-600 p-1.5 rounded text-white">
                <Icons.Send />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 max-w-3xl mx-auto space-y-6 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h1 className="text-xl font-black text-white">Growth Dossier: {currentUser.name}</h1>
            <p className="text-slate-400 mt-1">Review verified strengths and areas to develop.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-emerald-400">Verified Strengths</h3>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>Defensive validation guardrails on inputs</li>
                <li>Systematic test verification cycles</li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-amber-400">Growth Areas</h3>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li>Review IEEE-754 floating arithmetic precision</li>
                <li>Write assertions for empty or undefined arrays</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
