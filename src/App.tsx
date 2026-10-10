import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { vibeXApi } from './services/api';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("vibeX Error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white text-zinc-900 min-h-screen font-sans border-t-4 border-red-500">
          <h2 className="text-red-600 font-bold text-lg">Application Notice</h2>
          <pre className="bg-zinc-100 p-4 mt-2 rounded border border-zinc-200 text-xs font-mono">{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()} className="mt-4 bg-zinc-900 text-white px-4 py-2 rounded text-xs font-semibold">Reload Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Icons = {
  Sun: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Database: () => <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1.5 3 8 3s8-1 8-3V7M4 7c0 2 1.5 3 8 3s8-1 8-3M4 7c0-2 1.5-3 8-3s8 1 8 3m0 5c0 2-1.5 3-8 3s-8-1-8-3" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
  Candidate: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>,
  Recruiter: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Play: () => <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Check: () => <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Cross: () => <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Bot: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Send: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Settings: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  LogOut: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
};

const STARTER_CODE = `// vibeX AI-Era Assessment Engine
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
`;

function MainApp() {
  // Theme State: 'light' is the clean default requested
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);

  // Authentication State with Neon
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; role: 'candidate' | 'recruiter' } | null>(null);
  const [authRole, setAuthRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('chetan@vibex.dev');
  const [passwordInput, setPasswordInput] = useState('demo123');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Assessment Workspace
  const [candidateView, setCandidateView] = useState<'workspace' | 'feedback'>('workspace');
  const [code, setCode] = useState(STARTER_CODE);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'coach'; text: string }[]>([
    { sender: 'coach', text: "Hello! I'm your Socratic AI Coach powered by NVIDIA NIM. Ask me about schema verification, float precision, or edge cases." }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Recruiter Dossiers
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    vibeXApi.getCandidates().then(data => {
      setCandidates(data);
      if (data.length > 0) setSelectedCandidate(data[0]);
    });
  }, []);

  // Theme Helpers
  const isLight = theme === 'light';
  const bgClass = isLight ? 'bg-white text-zinc-900' : 'bg-zinc-950 text-zinc-100';
  const cardBg = isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/60 border-zinc-800';
  const panelBg = isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/30 border-zinc-800';
  const textMuted = isLight ? 'text-zinc-500' : 'text-zinc-400';
  const borderSubtle = isLight ? 'border-zinc-200' : 'border-zinc-800';

  // Neon Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        const user = await vibeXApi.signup(nameInput || "Developer", emailInput, passwordInput, authRole);
        setCurrentUser(user);
      } else {
        const user = await vibeXApi.login(emailInput, passwordInput);
        setCurrentUser(user);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRunTests = async () => {
    setIsExecuting(true);
    const data = await vibeXApi.runTests("session-id", code);
    setTestResults(data.results || []);
    setIsExecuting(false);
  };

  const handleAskCoach = async (explicitText?: string) => {
    const q = explicitText || coachInput;
    if (!q.trim()) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setCoachInput('');
    setIsCoachThinking(true);

    const failed = testResults.filter(t => !t.passed).map(t => t.id);
    const res = await vibeXApi.askCoach("session-id", q, code, failed);

    setChatLog(prev => [...prev, { sender: 'coach', text: res.guidance }]);
    setIsCoachThinking(false);
  };

  // ==========================================
  // VIEW 1: NEON AUTHENTICATION GATEWAY
  // ==========================================
  if (!currentUser) {
    return (
      <div className={`min-h-screen ${bgClass} flex flex-col justify-center items-center p-6 font-sans transition-colors duration-200`}>
        {/* Top Header with Theme Switcher */}
        <div className="absolute top-6 right-6 flex items-center space-x-2">
          <button 
            onClick={() => setTheme(isLight ? 'dark' : 'light')} 
            className={`p-2 rounded-lg border ${borderSubtle} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300`}
            title="Toggle theme">
            {isLight ? <Icons.Moon /> : <Icons.Sun />}
          </button>
        </div>

        <div className={`max-w-md w-full ${cardBg} border rounded-2xl p-8 transition-colors`}>
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 mb-3">
              <Icons.Database />
              <span>Neon PostgreSQL Auth Active</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">vibeX</h1>
            <p className={`text-xs ${textMuted} mt-1`}>iMocha IM-01 AI-Era Skills Assessment</p>
          </div>

          {/* Login / Signup Switcher */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
            <button 
              type="button"
              onClick={() => setAuthMode('login')} 
              className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition ${authMode === 'login' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-400'}`}>
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => setAuthMode('signup')} 
              className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition ${authMode === 'signup' ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white' : 'border-transparent text-zinc-400'}`}>
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-zinc-700 dark:text-zinc-300">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={nameInput} 
                    onChange={e => setNameInput(e.target.value)} 
                    placeholder="e.g. Chetan Shakhapure"
                    className={`w-full px-3 py-2 text-xs rounded-lg border ${borderSubtle} bg-transparent focus:outline-none focus:border-blue-600`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-zinc-700 dark:text-zinc-300">Select Persona</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setAuthRole('candidate')} 
                      className={`p-3 rounded-lg border text-left transition flex items-center space-x-2 ${authRole === 'candidate' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-bold' : `${borderSubtle} text-zinc-500`}`}>
                      <Icons.Candidate />
                      <span className="text-xs">Candidate</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAuthRole('recruiter')} 
                      className={`p-3 rounded-lg border text-left transition flex items-center space-x-2 ${authRole === 'recruiter' ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-bold' : `${borderSubtle} text-zinc-500`}`}>
                      <Icons.Recruiter />
                      <span className="text-xs">Recruiter</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-zinc-700 dark:text-zinc-300">Email Address</label>
              <input 
                type="email" 
                required 
                value={emailInput} 
                onChange={e => setEmailInput(e.target.value)} 
                placeholder="name@company.com"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${borderSubtle} bg-transparent focus:outline-none focus:border-blue-600`}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider block mb-1 text-zinc-700 dark:text-zinc-300">Password</label>
              <input 
                type="password" 
                required 
                value={passwordInput} 
                onChange={e => setPasswordInput(e.target.value)} 
                placeholder="••••••••"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${borderSubtle} bg-transparent focus:outline-none focus:border-blue-600`}
              />
            </div>

            {authError && (
              <div className="text-xs text-rose-600 font-medium">{authError}</div>
            )}

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold py-2.5 rounded-lg text-xs transition">
              {authLoading ? "Authenticating with Neon..." : authMode === 'signup' ? "Create Account" : "Sign In to Workspace"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 flex justify-between">
            <span>Demo: chetan@vibex.dev</span>
            <button 
              type="button"
              onClick={() => { setEmailInput('sarah@recruiter.com'); setPasswordInput('demo123'); }}
              className="text-blue-600 hover:underline">
              Try Recruiter Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: RECRUITER TALENT INTELLIGENCE
  // ==========================================
  if (currentUser.role === 'recruiter') {
    return (
      <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors`}>
        {/* Recruiter Header */}
        <header className={`h-14 border-b ${borderSubtle} ${panelBg} px-6 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black px-2.5 py-1 rounded text-xs">vibeX</span>
            <span className="text-xs font-semibold text-zinc-500">Recruiter Talent Intelligence Portal</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{currentUser.name} (Hiring Lead)</span>
            <button onClick={() => setTheme(isLight ? 'dark' : 'light')} className={`p-1.5 rounded border ${borderSubtle}`} title="Toggle theme">
              {isLight ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            <button onClick={() => setCurrentUser(null)} className="p-1.5 hover:text-rose-600 transition" title="Log out">
              <Icons.LogOut />
            </button>
          </div>
        </header>

        {/* Recruiter Workspace Split */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left Candidate List */}
          <div className={`col-span-4 border-r ${borderSubtle} p-5 space-y-3 ${panelBg}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Evaluated Candidates</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300">
                {candidates.length} Dossiers
              </span>
            </div>

            {candidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCandidate(c)}
                className={`p-4 rounded-xl border cursor-pointer transition ${selectedCandidate?.id === c.id ? 'border-zinc-900 bg-white dark:border-white dark:bg-zinc-900 shadow-sm' : `${borderSubtle} bg-transparent hover:border-zinc-400`}`}>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900 dark:text-white">
                  <span>{c.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {c.verdict}
                  </span>
                </div>
                <div className={`text-[11px] ${textMuted} mt-1`}>{c.role} • Score: {c.score}%</div>
              </div>
            ))}
          </div>

          {/* Right Candidate Dossier */}
          <div className="col-span-8 p-8 overflow-y-auto space-y-6">
            {selectedCandidate && (
              <>
                <div className={`${cardBg} border rounded-2xl p-6 flex justify-between items-center`}>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Candidate Dossier</span>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">{selectedCandidate.name}</h1>
                    <p className={`text-xs ${textMuted}`}>{selectedCandidate.role} • Assessment Duration: {selectedCandidate.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] ${textMuted} uppercase font-semibold block`}>Verdict</span>
                    <span className="text-lg font-bold text-emerald-600">{selectedCandidate.verdict}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className={`${cardBg} border p-4 rounded-xl`}>
                    <div className={`text-xs ${textMuted}`}>Deterministic Pass Rate</div>
                    <div className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{selectedCandidate.score}%</div>
                  </div>
                  <div className={`${cardBg} border p-4 rounded-xl`}>
                    <div className={`text-xs ${textMuted}`}>AI Fluency Persona</div>
                    <div className="text-xl font-bold text-blue-600 mt-1">{selectedCandidate.aiFluency}</div>
                  </div>
                  <div className={`${cardBg} border p-4 rounded-xl`}>
                    <div className={`text-xs ${textMuted}`}>Verification Loops</div>
                    <div className="text-3xl font-black text-emerald-600 mt-1">94%</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Anchored Telemetry Evidence Chains</h3>
                  {selectedCandidate.evidence?.map((item: any) => (
                    <div key={item.id} className={`${cardBg} border p-4 rounded-xl space-y-1`}>
                      <div className="flex justify-between items-center text-xs font-bold text-zinc-900 dark:text-white">
                        <span className="flex items-center space-x-1.5">
                          <Icons.Check />
                          <span>{item.title}</span>
                        </span>
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          Trace: {item.eventLink}
                        </span>
                      </div>
                      <p className={`text-xs ${textMuted} leading-relaxed`}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-xl border ${borderSubtle} ${panelBg} text-xs text-zinc-600 dark:text-zinc-400 flex items-start space-x-2`}>
                  <Icons.Sparkles />
                  <div>
                    <strong>iMocha Fairness Guarantee</strong>: Prompt count and raw token quantity are explicitly excluded from scoring. Assessment evaluates verified test outcomes and critical reasoning.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MINIMALIST CANDIDATE WORKSPACE
  // ==========================================
  return (
    <div className={`min-h-screen ${bgClass} flex flex-col font-sans transition-colors`}>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-sm w-full ${cardBg} border rounded-2xl p-6 shadow-xl space-y-4`}>
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Settings & Preferences</h3>
              <button onClick={() => setShowSettings(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><Icons.Cross /></button>
            </div>
            
            <div>
              <label className="text-xs font-semibold block mb-2 text-zinc-700 dark:text-zinc-300">Interface Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setTheme('light')} 
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-2 ${isLight ? 'border-zinc-900 bg-zinc-100 dark:border-white font-bold' : borderSubtle}`}>
                  <Icons.Sun />
                  <span>Light Clean</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')} 
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center space-x-2 ${!isLight ? 'border-zinc-900 bg-zinc-800 text-white font-bold' : borderSubtle}`}>
                  <Icons.Moon />
                  <span>Dark Studio</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
              Authenticated via <strong>Neon PostgreSQL</strong> as {currentUser.email}
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className={`h-14 border-b ${borderSubtle} ${panelBg} px-6 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black px-2.5 py-1 rounded text-xs">vibeX</span>
          <span className="text-xs font-semibold text-zinc-500">Candidate IDE</span>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center p-1 rounded-lg border ${borderSubtle} ${cardBg} text-xs`}>
          <button 
            onClick={() => setCandidateView('workspace')} 
            className={`px-3 py-1 rounded font-semibold transition ${candidateView === 'workspace' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}>
            Workspace
          </button>
          <button 
            onClick={() => setCandidateView('feedback')} 
            className={`px-3 py-1 rounded font-semibold transition ${candidateView === 'feedback' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}>
            Growth Dossier
          </button>
        </div>

        {/* Actions & Settings */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowSettings(true)}
            className={`p-1.5 rounded border ${borderSubtle} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition`}
            title="Settings">
            <Icons.Settings />
          </button>
          <button 
            onClick={() => setCandidateView('feedback')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
            Submit Solution
          </button>
          <button 
            onClick={() => setCurrentUser(null)} 
            className="p-1.5 hover:text-rose-600 transition" 
            title="Sign out">
            <Icons.LogOut />
          </button>
        </div>
      </header>

      {/* Candidate Split IDE */}
      {candidateView === 'workspace' ? (
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left Drawer: Benchmark Task */}
          <div className={`col-span-3 border-r ${borderSubtle} p-5 overflow-y-auto ${panelBg} text-xs`}>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Benchmark Task</span>
            <h2 className="font-bold text-zinc-900 dark:text-white text-sm mt-0.5">Real-Time Telemetry Stream Processor</h2>
            <div className="text-[10px] text-zinc-500 font-semibold mt-1">Mid-Senior Software Engineer</div>
            
            <div className={`mt-4 ${cardBg} border p-4 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300`}>
              {`Requirements:
1. parseEvent(rawJson): Safely parse JSON strings. Reject corrupted payloads or packets missing sensorId or reading (throw Error).
2. computeWindowAverages(readings): Compute arithmetic average with 2-decimal precision.
3. flagAnomalies(readings, baseline, maxDeviation): Return readings where Math.abs(reading - baseline) > maxDeviation.`}
            </div>
          </div>

          {/* Middle: Code Editor & Test Console */}
          <div className={`col-span-6 flex flex-col border-r ${borderSubtle} ${isLight ? 'bg-white' : 'bg-zinc-950'}`}>
            <div className={`h-10 border-b ${borderSubtle} px-4 flex justify-between items-center ${panelBg}`}>
              <span className="text-xs font-mono text-zinc-500">processor.js</span>
              <button 
                onClick={handleRunTests} 
                disabled={isExecuting}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center space-x-1.5 transition">
                <Icons.Play />
                <span>{isExecuting ? "Executing..." : "Run Tests"}</span>
              </button>
            </div>

            <textarea 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className={`flex-1 bg-transparent p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`} 
              spellCheck={false}
            />

            {/* Test Console */}
            <div className={`h-48 border-t ${borderSubtle} ${panelBg} p-3 overflow-y-auto text-xs`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">Deterministic Assertion Sandbox</span>
                <span className={`text-[11px] ${textMuted}`}>
                  {testResults.length > 0 && `${testResults.filter(t => t.passed).length}/${testResults.length} Passed`}
                </span>
              </div>

              {testResults.length === 0 ? (
                <div className={`text-center ${textMuted} italic mt-6`}>Click "Run Tests" to execute against assertions.</div>
              ) : (
                <div className="space-y-1.5">
                  {testResults.map(t => (
                    <div key={t.id} className={`p-2 rounded-lg border flex justify-between items-center ${t.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {t.passed ? <Icons.Check /> : <Icons.Cross />}
                        <span className="font-semibold text-xs">{t.description || t.name}</span>
                      </div>
                      <span className="text-[10px] font-mono">{t.actual}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Drawer: Socratic AI Coach */}
          <div className={`col-span-3 flex flex-col ${panelBg}`}>
            <div className={`h-10 border-b ${borderSubtle} px-4 flex items-center space-x-2 text-xs font-bold text-zinc-900 dark:text-white`}>
              <Icons.Bot />
              <span>Socratic AI Coach</span>
            </div>

            <div className={`p-2 border-b ${borderSubtle} flex gap-1 flex-wrap`}>
              <button 
                onClick={() => handleAskCoach("How should I reject corrupt packets in parseEvent?")} 
                className={`text-[10px] ${cardBg} border px-2 py-1 rounded font-medium hover:border-zinc-400 transition`}>
                Hint: Validation Guard
              </button>
              <button 
                onClick={() => handleAskCoach("Why does floating point math fail on computeWindowAverages?")} 
                className={`text-[10px] ${cardBg} border px-2 py-1 rounded font-medium hover:border-zinc-400 transition`}>
                Hint: Float Rounding
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {chatLog.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl border leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white border-blue-600 ml-4 font-medium' : `${cardBg} mr-4 text-zinc-800 dark:text-zinc-200`}`}>
                  {msg.text}
                </div>
              ))}
              {isCoachThinking && <div className="text-[11px] text-blue-600 italic">Consulting NVIDIA NIM...</div>}
            </div>

            <div className={`p-3 border-t ${borderSubtle} flex items-center space-x-2`}>
              <input 
                type="text" 
                value={coachInput} 
                onChange={e => setCoachInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAskCoach()} 
                placeholder="Ask coach for guidance..." 
                className={`flex-1 ${cardBg} border rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600`}
              />
              <button onClick={() => handleAskCoach()} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 p-1.5 rounded-lg hover:opacity-90 transition">
                <Icons.Send />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Candidate Feedback Tab */
        <div className="flex-1 p-8 max-w-3xl mx-auto space-y-6 text-xs">
          <div className={`${cardBg} border p-6 rounded-2xl`}>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Candidate Growth Dossier</span>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">Hello, {currentUser.name}</h1>
            <p className={`mt-2 ${textMuted} leading-relaxed`}>Your assessment submission has been evaluated deterministically. Review your demonstrated strengths and growth suggestions below.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardBg} border p-5 rounded-xl space-y-2`}>
              <h3 className="font-bold text-emerald-600 flex items-center space-x-1.5 text-sm">
                <Icons.Check />
                <span>Verified Strengths</span>
              </h3>
              <ul className={`list-disc pl-4 space-y-1.5 ${textMuted}`}>
                <li>Defensive validation guardrails on inputs</li>
                <li>Systematic test verification cycles</li>
                <li>Targeted Socratic queries rather than blind copy-pasting</li>
              </ul>
            </div>

            <div className={`${cardBg} border p-5 rounded-xl space-y-2`}>
              <h3 className="font-bold text-blue-600 flex items-center space-x-1.5 text-sm">
                <Icons.Sparkles />
                <span>Actionable Growth Areas</span>
              </h3>
              <ul className={`list-disc pl-4 space-y-1.5 ${textMuted}`}>
                <li>Review IEEE-754 floating arithmetic precision patterns</li>
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
