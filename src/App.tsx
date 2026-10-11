import React, { useState, useEffect, useRef, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { vibeXApi, User } from './services/api';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Boundary error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-zinc-950 text-white min-h-screen font-sans border-t-4 border-rose-500">
          <h2 className="text-rose-500 font-bold text-base">Application Workspace Recovered</h2>
          <pre className="bg-zinc-900 p-4 mt-2 rounded border border-zinc-800 text-xs font-mono">{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 px-4 py-2 rounded text-xs font-bold">Reload Workspace</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Icons = {
  Terminal: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Check: () => <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>,
  Cross: () => <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>,
  Alert: () => <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  Play: () => <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Bot: () => <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Send: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Diff: () => <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>,
  Grip: () => (
    <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="6" cy="4" r="1.2" /><circle cx="10" cy="4" r="1.2" />
      <circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="8" r="1.2" />
      <circle cx="6" cy="12" r="1.2" /><circle cx="10" cy="12" r="1.2" />
    </svg>
  )
};

export default function App() {
  return (
    <ErrorBoundary>
      <VibeXPlatform />
    </ErrorBoundary>
  );
}

function VibeXPlatform() {
  // Real User & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vibe_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authRole, setAuthRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Session & View State
  const [candidateView, setCandidateView] = useState<'home' | 'workspace'>('home');
  const [recruiterView, setRecruiterView] = useState<'overview' | 'dossier'>('overview');
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [activeAssessment, setActiveAssessment] = useState<any>(null);

  // Recruiter Pipeline State
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Workspace Code & Execution State
  const [code, setCode] = useState('');
  const [lastTestedCode, setLastTestedCode] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // AI Chat & Diff Staging State
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "👋 AI Pair Programmer active. Ask me to scaffold defensive schema guards or fix precision edge cases." }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [stagedDiff, setStagedDiff] = useState<any | null>(null);

  // Layout Resizer State
  const [chatWidth, setChatWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isCodeStale = lastTestedCode !== null && code !== lastTestedCode;
  const passedTestsCount = testResults.filter(t => t.passed).length;

  // Sync logged in user to localStorage
  const handleSetUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem('vibe_user', JSON.stringify(user));
    else localStorage.removeItem('vibe_user');
  };

  // Draggable slider logic
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const newW = bounds.right - e.clientX;
    if (newW >= 300 && newW <= bounds.width - 400) setChatWidth(newW);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Load recruiter pipeline on view switch
  useEffect(() => {
    if (currentUser?.role === 'recruiter') {
      vibeXApi.getRecruiterPipeline().then(data => {
        if (data.pipeline) setPipelineData(data.pipeline);
      }).catch(console.error);
    }
  }, [currentUser, recruiterView]);

  // --------------------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // --------------------------------------------------------------------------
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        const res = await vibeXApi.register(authName, authEmail, authPassword, authRole);
        if (res.error) throw new Error(res.error);
        handleSetUser(res.user);
      } else {
        const res = await vibeXApi.login(authEmail, authPassword);
        if (res.error) throw new Error(res.error);
        handleSetUser(res.user);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // CANDIDATE WORKSPACE HANDLERS
  // --------------------------------------------------------------------------
  const handleStartAssessment = async () => {
    if (!currentUser) return;
    try {
      const res = await vibeXApi.startSession(currentUser.id, currentUser.name, 'task-iot-stream');
      if (res.session && res.assessment) {
        setActiveSessionId(res.session.id);
        setActiveAssessment(res.assessment);
        setCode(res.session.current_code || res.assessment.starter_code);
        setLastTestedCode(res.session.current_code);
        setTestResults(res.assessment.tests.map((t: any) => ({ ...t, passed: false, actual: "Not run" })));
        setCandidateView('workspace');
      }
    } catch (err) {
      console.error("Failed to launch session:", err);
    }
  };

  const handleRunTests = async () => {
    setIsExecuting(true);
    try {
      const res = await vibeXApi.runTests(activeSessionId, code, 'task-iot-stream');
      setTestResults(res.results || []);
      setLastTestedCode(code);
    } catch (err) {
      console.error("Test run failed:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSendPrompt = async (explicitPrompt?: string) => {
    const q = explicitPrompt || promptInput;
    if (!q.trim() || isAiThinking) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setPromptInput('');
    setIsAiThinking(true);

    const failed = testResults.filter(t => !t.passed).map(t => t.id);
    const res = await vibeXApi.askCoach(activeSessionId, q, code, failed);

    // Contextual diff staging
    let diff: any = null;
    const lower = q.toLowerCase();
    if (lower.includes("precision") || lower.includes("float") || lower.includes("average")) {
      diff = {
        summary: "Constrain average to 2 decimal places using Number((sum / len).toFixed(2))",
        codeSnippet: `export function computeWindowAverages(readings) {\n  if (!readings || readings.length === 0) return 0;\n  const sum = readings.reduce((acc, curr) => acc + curr, 0);\n  return Number((sum / readings.length).toFixed(2));\n}`,
        linesAdded: 3,
        linesRemoved: 1
      };
    } else if (lower.includes("guard") || lower.includes("parse") || lower.includes("validation")) {
      diff = {
        summary: "Enforce defensive validation guards throwing explicit Error on missing fields",
        codeSnippet: `export function parseEvent(rawJson) {\n  const data = JSON.parse(rawJson);\n  if (!data.sensorId || data.reading === undefined) {\n    throw new Error("Invalid telemetry schema: missing sensorId or reading");\n  }\n  return data;\n}`,
        linesAdded: 4,
        linesRemoved: 1
      };
    }

    setChatLog(prev => [...prev, { sender: 'ai', text: res.guidance }]);
    if (diff) setStagedDiff(diff);
    setIsAiThinking(false);
  };

  const handleApplyDiff = (diff: any) => {
    setCode(prev => {
      const match = diff.codeSnippet.match(/function\s+(\w+)/);
      if (match && prev.includes(match[1])) {
        const regex = new RegExp(`export function ${match[1]}\\([\\s\\S]*?\\n\\}`, 'm');
        return prev.replace(regex, diff.codeSnippet.trim());
      }
      return prev + "\n\n" + diff.codeSnippet;
    });
    setStagedDiff(null);
  };

  const handleSubmitAssessment = async () => {
    if (!activeSessionId) return;
    try {
      await vibeXApi.submitAssessment(activeSessionId, code);
      setIsSubmitted(true);
      setCandidateView('home');
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const handleInspectDossier = async (sessionId: string) => {
    try {
      const res = await vibeXApi.getReport(sessionId);
      setSelectedReport(res.report);
      setRecruiterView('dossier');
    } catch (err) {
      console.error("Failed to load dossier:", err);
    }
  };

  // ==========================================================================
  // VIEW 1: AUTHENTICATION & REGISTRATION SCREEN (IF NOT LOGGED IN)
  // ==========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans selection:bg-blue-600">
        <header className="h-16 px-8 flex items-center justify-between border-b border-zinc-900">
          <div className="flex items-center space-x-3">
            <span className="bg-white text-black font-black px-2.5 py-1 rounded text-xs tracking-wider">vibeX</span>
            <span className="text-xs text-zinc-500 font-medium">iMocha IM-01 Benchmark</span>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 py-10 w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-white">
              {authMode === 'register' ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-xs text-zinc-400">
              {authMode === 'register' ? "Select your role to access your dedicated studio." : "Sign in to access your assessment workspace."}
            </p>
          </div>

          {/* Role Selection Tabs for Registration */}
          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthRole('candidate')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${authRole === 'candidate' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
                <Icons.Terminal />
                <span>Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthRole('recruiter')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${authRole === 'recruiter' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
                <Icons.Briefcase />
                <span>Recruiter</span>
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-400 text-xs font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="e.g. Chetan Shakhapure"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white transition ${authRole === 'candidate' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'} disabled:opacity-50`}>
              {authLoading ? "Processing..." : authMode === 'register' ? `Register as ${authRole}` : "Sign In"}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); setAuthError(''); }}
              className="text-xs text-zinc-500 hover:text-white transition">
              {authMode === 'register' ? "Already have an account? Sign in" : "Need an account? Register here"}
            </button>
          </div>
        </main>

        <footer className="h-14 px-8 flex items-center justify-between border-t border-zinc-900 text-xs text-zinc-600">
          <span>VectorX Platform</span>
          <span>PostgreSQL + NVIDIA NIM Powered</span>
        </footer>
      </div>
    );
  }

  // ==========================================================================
  // VIEW 2: CANDIDATE STUDIO (WHEN LOGGED IN AS CANDIDATE)
  // ==========================================================================
  if (currentUser.role === 'candidate') {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
        {/* Candidate Navigation Header */}
        <header className="h-14 border-b border-zinc-900 px-6 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="bg-white text-black font-black px-2 py-0.5 rounded text-xs tracking-wider">vibeX</span>
            <span className="text-xs font-semibold text-zinc-400">Candidate Studio</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => setCandidateView('home')}
              className={`px-3 py-1 rounded transition ${candidateView === 'home' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>
              Assigned Tasks
            </button>
            <div className="flex items-center space-x-2 pl-3 border-l border-zinc-800">
              <span className="text-zinc-400 text-xs font-medium">{currentUser.name}</span>
              <button
                onClick={() => handleSetUser(null)}
                className="text-[11px] text-zinc-500 hover:text-rose-400 transition">
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {candidateView === 'home' ? (
          <main className="flex-1 max-w-4xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white">Welcome back, {currentUser.name}</h1>
              <p className="text-xs text-zinc-400">Your assigned benchmark tasks are ready for evaluation.</p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Real-Time Telemetry Stream Processor</h3>
                  <div className="text-xs text-zinc-500 mt-1 flex items-center space-x-2">
                    <span>30 Mins</span>
                    <span>•</span>
                    <span>Mid-Senior Level</span>
                    <span>•</span>
                    <span className="text-blue-400">AI Assistance Permitted</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${isSubmitted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {isSubmitted ? 'Submitted' : 'Ready'}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Implement defensive JSON stream parsing, 2-decimal arithmetic floating rolling averages, and anomaly deviation detection.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleStartAssessment}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm">
                  {isSubmitted ? "Review Submitted Workspace" : "Launch Coding Workspace"}
                </button>
              </div>
            </div>
          </main>
        ) : (
          <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
            {/* Main Code Editor & Sandbox */}
            <div className="flex-1 flex flex-col min-w-0 bg-black">
              <div className="h-10 border-b border-zinc-900 px-4 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs text-zinc-400 font-bold">processor.js</span>
                  {isCodeStale ? (
                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-medium border border-amber-500/20">
                      ● Unverified Modifications
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                      ● {passedTestsCount}/4 Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunTests}
                    disabled={isExecuting}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-bold flex items-center space-x-1.5 transition">
                    <Icons.Play />
                    <span>{isExecuting ? "Executing..." : "Run Tests"}</span>
                  </button>
                  <button
                    onClick={handleSubmitAssessment}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold transition">
                    {isSubmitted ? "Submitted ✓" : "Submit Assessment"}
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-xs leading-relaxed bg-black text-zinc-100 focus:outline-none resize-none border-none"
                spellCheck={false}
              />

              {/* Bottom Test Results */}
              <div className="h-44 border-t border-zinc-900 bg-zinc-950 p-3 flex flex-col overflow-hidden text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-900">
                  <span className="font-bold text-white">Isolated Sandbox Assertions (1500ms Timeout)</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{passedTestsCount}/4 Passed</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5">
                  {testResults.map((t, idx) => (
                    <div key={idx} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${t.passed ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-rose-950/20 border-rose-900/40 text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {t.passed ? <Icons.Check /> : <Icons.Cross />}
                        <span>{t.description || t.name}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold">{t.actual}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Draggable Divider */}
            <div
              onMouseDown={() => setIsDragging(true)}
              className={`w-2 hover:w-2.5 active:w-2.5 cursor-col-resize relative flex items-center justify-center transition-all z-20 select-none ${isDragging ? 'bg-blue-600' : 'bg-zinc-900'}`}>
              <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <Icons.Grip />
              </div>
            </div>

            {/* Right AI Assistant & Staging */}
            <div style={{ width: `${chatWidth}px` }} className="shrink-0 flex flex-col bg-zinc-950 border-l border-zinc-900">
              <div className="h-10 border-b border-zinc-900 px-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  <Icons.Bot />
                  <span>AI Pair Programmer</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px]">
                  <button onClick={() => setChatWidth(320)} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">S</button>
                  <button onClick={() => setChatWidth(420)} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">M</button>
                  <button onClick={() => setChatWidth(600)} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">L</button>
                </div>
              </div>

              <div className="p-2 border-b border-zinc-900 flex gap-1 flex-wrap">
                <button onClick={() => handleSendPrompt("Scaffold schema guard for missing sensorId")} className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 hover:border-blue-500 text-zinc-300">
                  ⚡ Guard Missing Fields
                </button>
                <button onClick={() => handleSendPrompt("Fix floating point precision to 2 decimal places")} className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 hover:border-blue-500 text-zinc-300">
                  ⚡ 2-Decimal Float Fix
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                {chatLog.map((m, i) => (
                  <div key={i} className={`p-3 rounded-xl border leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white border-blue-600 ml-4' : 'bg-zinc-900 border-zinc-800 mr-2 text-zinc-200'}`}>
                    <div>{m.text}</div>
                  </div>
                ))}
                {isAiThinking && <div className="text-[11px] text-blue-500 italic">Querying NVIDIA NIM...</div>}

                {/* Staged Diff Proposal */}
                {stagedDiff && (
                  <div className="p-3 rounded-xl border-2 border-blue-500/80 bg-blue-950/20 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                      <span className="flex items-center space-x-1.5">
                        <Icons.Diff />
                        <span>Proposed Code Diff</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">+{stagedDiff.linesAdded} / -{stagedDiff.linesRemoved}</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">{stagedDiff.summary}</p>
                    <div className="bg-black text-zinc-200 p-2 rounded border border-zinc-800 font-mono text-[10px] max-h-32 overflow-x-auto whitespace-pre">
                      {stagedDiff.codeSnippet}
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => handleApplyDiff(stagedDiff)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded text-xs transition">
                        Accept & Merge
                      </button>
                      <button
                        onClick={() => setStagedDiff(null)}
                        className="px-3 py-1.5 rounded border border-zinc-700 text-xs font-semibold hover:bg-zinc-800 text-zinc-300">
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-zinc-900 flex items-center space-x-2 bg-zinc-950">
                <input
                  type="text"
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="Ask AI pair programmer..."
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button onClick={() => handleSendPrompt()} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg">
                  <Icons.Send />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================================
  // VIEW 3: RECRUITER PORTAL (WHEN LOGGED IN AS RECRUITER)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans">
      <header className="h-14 border-b border-zinc-200 bg-white px-8 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-600 text-white font-black px-2 py-0.5 rounded text-xs tracking-wider">vibeX</span>
          <span className="font-bold text-sm text-zinc-800">Recruiter Intelligence Hub</span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <button
            onClick={() => setRecruiterView('overview')}
            className={`px-3 py-1 rounded-lg font-bold transition ${recruiterView === 'overview' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
            Pipeline
          </button>
          <div className="flex items-center space-x-2 pl-3 border-l border-zinc-200">
            <span className="text-zinc-600 text-xs font-medium">{currentUser.name}</span>
            <button onClick={() => handleSetUser(null)} className="text-[11px] text-zinc-500 hover:text-rose-600">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {recruiterView === 'overview' ? (
        <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl font-black text-zinc-900">Candidate Evaluation Pipeline</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Live submissions stored in Neon PostgreSQL database.</p>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 font-bold text-xs text-zinc-500 uppercase tracking-wider">
              Recent Submissions
            </div>
            <div className="divide-y divide-zinc-200 text-xs">
              {pipelineData.length === 0 ? (
                <div className="p-6 text-center text-zinc-400">No candidate submissions recorded in database yet.</div>
              ) : (
                pipelineData.map(item => (
                  <div key={item.session_id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
                    <div>
                      <div className="font-bold text-zinc-900 text-sm">{item.candidate_name}</div>
                      <div className="text-zinc-500 text-[11px]">{item.task_title} • Status: {item.status}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'submitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {item.status === 'submitted' ? `Passed (${item.tests_passed}/${item.total_tests})` : 'In Progress'}
                      </span>
                      {item.status === 'submitted' && (
                        <button
                          onClick={() => handleInspectDossier(item.session_id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition">
                          Inspect Dossier
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      ) : (
        /* Recruiter 3-Tier Dossier View */
        <main className="flex-1 max-w-4xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
          <button onClick={() => setRecruiterView('overview')} className="text-xs text-blue-600 font-bold hover:underline">
            ← Back to Pipeline
          </button>

          {selectedReport && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Candidate Assessment Report</span>
                  <h1 className="text-2xl font-black text-zinc-900 mt-0.5">{selectedReport.candidate_name}</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">{selectedReport.task_title}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Evaluated Verdict</span>
                  <span className="text-lg font-black text-emerald-600">{selectedReport.verdict}</span>
                </div>
              </div>

              {/* 3-Tier Evidence */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm border-l-4 border-l-blue-600 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Tier 1: Observed Facts (Raw Telemetry)</span>
                  <p className="text-xs text-zinc-600">Tests Verified: {selectedReport.observed_facts.testsPassed} assertions green</p>
                  <p className="text-xs text-zinc-600">AI Queries Dispatched: {selectedReport.observed_facts.aiQueriesDispatched}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm border-l-4 border-l-purple-600 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Tier 2: Evidence Interpretation</span>
                  <p className="text-xs text-zinc-600">Code Scrutiny: {selectedReport.interpretations.codeScrutiny}</p>
                  <p className="text-xs text-zinc-600">Defensive Validation: {selectedReport.interpretations.defensiveValidation}</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm border-l-4 border-l-emerald-600 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Tier 3: Rubric Judgment</span>
                  <p className="text-xs text-zinc-700 leading-relaxed">{selectedReport.rubric_evaluation}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
