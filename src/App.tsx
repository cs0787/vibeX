import React, { useState, useEffect, useRef, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { vibeXApi, User } from './services/api';

// ============================================================================
// ERROR BOUNDARY
// ============================================================================
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Workspace boundary error:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-zinc-950 text-zinc-200 min-h-screen font-mono text-xs flex flex-col justify-center items-center">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Workspace Session Recovered</span>
            </div>
            <pre className="text-zinc-400 bg-zinc-950 p-3 rounded border border-zinc-800 overflow-x-auto text-[11px]">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-zinc-100 text-zinc-900 font-bold py-2 rounded text-xs hover:bg-white transition">
              Reload Environment
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// SYSTEM SVG ICONS
// ============================================================================
const Icons = {
  Sun: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Play: () => <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Check: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Cross: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Alert: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Bot: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/></svg>,
  Send: () => <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Diff: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"/></svg>,
  FileCode: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/></svg>,
  Clock: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Shield: () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Sliders: () => <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  Grip: () => (
    <svg className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 transition" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4" r="1.2" /><circle cx="11" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" /><circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" /><circle cx="11" cy="12" r="1.2" />
    </svg>
  )
};

// ============================================================================
// AUTO-RECONSTRUCTING MARKDOWN PARSER COMPONENT
// ============================================================================
function FormattedMessage({ text, onStageCode }: { text: string; onStageCode?: (codeSnippet: string) => void }) {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-[11px] leading-relaxed select-text">
      {parts.map((part, pIdx) => {
        if (part.startsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const lang = lines[0].match(/^[a-zA-Z]+/)?.[0] || 'javascript';
          const codeBody = lines[0].match(/^[a-zA-Z]+$/) ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <div key={pIdx} className="my-2 rounded border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-[10px]">
              <div className="bg-zinc-900/90 px-2.5 py-1 flex items-center justify-between border-b border-zinc-800 text-zinc-400">
                <span className="uppercase text-[9px] font-bold tracking-wider">{lang}</span>
                {onStageCode && (
                  <button
                    onClick={() => onStageCode(codeBody)}
                    className="text-blue-400 hover:text-blue-300 font-bold transition flex items-center space-x-1">
                    <Icons.Diff/>
                    <span>Stage Patch</span>
                  </button>
                )}
              </div>
              <pre className="p-2.5 overflow-x-auto text-emerald-400 bg-zinc-950 leading-normal whitespace-pre font-mono">
                {codeBody}
              </pre>
            </div>
          );
        }

        const normalized = part
          .replace(/\\n/g, '\n')
          .replace(/\s*(###\s*[^#*]+)/g, '\n$1\n')
          .replace(/\s*(\*\s+[^*#]+)/g, '\n$1');

        const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);

        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              if (line.startsWith('###')) {
                const heading = line.replace(/^###\s*/, '').trim();
                return (
                  <div key={lIdx} className="font-mono text-[11px] font-bold text-zinc-100 pt-2 pb-0.5 border-b border-zinc-800/80 flex items-center space-x-1.5">
                    <span className="text-blue-400">#</span>
                    <span>{heading}</span>
                  </div>
                );
              }

              if (line.startsWith('*') || line.startsWith('-')) {
                const content = line.replace(/^(\*|-)\s*/, '').trim();
                return (
                  <div key={lIdx} className="flex items-start space-x-2 pl-1.5 py-0.5">
                    <span className="text-blue-400 font-bold leading-none mt-1">•</span>
                    <span className="text-zinc-300 leading-snug">
                      {renderInlineTokens(content)}
                    </span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="text-zinc-300 leading-relaxed">
                  {renderInlineTokens(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function renderInlineTokens(str: string) {
  const tokens = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((t, i) => {
    if (t.startsWith('`') && t.endsWith('`')) {
      return (
        <code key={i} className="font-mono text-[10px] bg-zinc-800 text-blue-300 px-1 py-0.5 rounded border border-zinc-700/60 font-semibold">
          {t.slice(1, -1)}
        </code>
      );
    }
    if (t.startsWith('**') && t.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-zinc-100">
          {t.slice(2, -2)}
        </strong>
      );
    }
    return t;
  });
}

// ============================================================================
// BENCHMARK TASK DEFINITION
// ============================================================================
const DEFAULT_TASK = {
  id: "task-iot-stream",
  title: "Real-Time Telemetry Stream Processor",
  category: "Stream Ingestion Engine",
  level: "Senior L4",
  durationMinutes: 30,
  description: "Implement high-throughput stream sanitation for inbound IoT payloads: enforce schema contracts, execute arithmetic rolling window calculations with 2-decimal constraints, and flag anomalous variances.",
  specifications: [
    { method: "parseEvent(rawJson)", requirement: "Safely parse incoming JSON string. Throw custom Error if sensorId is missing or reading is undefined." },
    { method: "computeWindowAverages(readings)", requirement: "Compute arithmetic mean of array; round strictly to 2 decimal places returning primitive Number." },
    { method: "flagAnomalies(readings, baseline, maxDeviation)", requirement: "Filter and return values where Math.abs(reading - baseline) strictly exceeds maxDeviation." }
  ],
  starterCode: `// vibeX Runtime Engine
// Implement the required methods according to the specification:

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
`,
  tests: [
    { id: "T1", description: "parseEvent parses valid payload", latency: "2ms", passed: true, expected: "Valid Object", actual: "PASS" },
    { id: "T2", description: "parseEvent rejects corrupt payload & missing schema", latency: "3ms", passed: true, expected: "Throw Error", actual: "PASS" },
    { id: "T3", description: "computeWindowAverages handles 2-decimal precision", latency: "4ms", passed: true, expected: "20.46 (Number)", actual: "PASS" },
    { id: "T4", description: "flagAnomalies isolates positive and negative deviations", latency: "2ms", passed: true, expected: "[50, 100]", actual: "PASS" }
  ]
};

export default function App() {
  return (
    <ErrorBoundary>
      <VibeXPlatform/>
    </ErrorBoundary>
  );
}

function VibeXPlatform() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vibe_theme') as 'light' | 'dark') || 'dark';
  });
  const isDark = theme === 'dark';
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('vibe_theme', next);
  };

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

  const [candidateView, setCandidateView] = useState<'home' | 'workspace'>('home');
  const [recruiterView, setRecruiterView] = useState<'overview' | 'dossier'>('overview');
  const [isLaunching, setIsLaunching] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-live-01');
  const [isSpecOpen, setIsSpecOpen] = useState(true);

  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const [code, setCode] = useState(DEFAULT_TASK.starterCode);
  const [lastTestedCode, setLastTestedCode] = useState<string | null>(DEFAULT_TASK.starterCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>(DEFAULT_TASK.tests);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sliders and Layout Controls
  const [chatWidth, setChatWidth] = useState<number>(420);
  const [aiAssistanceLevel, setAiAssistanceLevel] = useState<number>(2);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([
    {
      sender: 'ai',
      text: "### 🔍 Analysis\n* AI Pair Programmer connected via NVIDIA NIM (`meta/llama-3.1-70b-instruct`).\n\n### 💡 Mode Active\n* **Balanced Architect:** Diagnosing schema guards, checking rolling statistics, and staging unified code diffs.",
      timestamp: "10:14:02"
    }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [stagedDiff, setStagedDiff] = useState<any | null>(null);

  const isCodeStale = lastTestedCode !== null && code !== lastTestedCode;
  const passedTestsCount = testResults.filter(t => t.passed).length;
  const totalTestsCount = testResults.length;

  const handleSetUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) localStorage.setItem('vibe_user', JSON.stringify(user));
    else localStorage.removeItem('vibe_user');
  };

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

  useEffect(() => {
    if (currentUser?.role === 'recruiter') {
      vibeXApi.getRecruiterPipeline().then(data => {
        if (data.pipeline) setPipelineData(data.pipeline);
      }).catch(console.error);
    }
  }, [currentUser, recruiterView]);

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
      setAuthError(err.message || "Authentication credentials rejected.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStartAssessment = async () => {
    setIsLaunching(true);
    try {
      const res = await vibeXApi.startSession(
        currentUser?.id || "anon",
        currentUser?.name || "Candidate",
        'task-iot-stream'
      );
      if (res?.session) {
        setActiveSessionId(res.session.id);
        if (res.session.current_code) {
          setCode(res.session.current_code);
          setLastTestedCode(res.session.current_code);
        }
        if (res.assessment?.tests) {
          setTestResults(res.assessment.tests);
        }
      }
    } catch (err) {
      setActiveSessionId(`session-${Date.now()}`);
    } finally {
      setIsLaunching(false);
      setCandidateView('workspace');
    }
  };

  const handleRunTests = async () => {
    setIsExecuting(true);
    try {
      const res = await vibeXApi.runTests(activeSessionId, code, 'task-iot-stream');
      if (res.results?.length) {
        setTestResults(res.results);
      }
      setLastTestedCode(code);
    } catch (err) {
      console.error("Test execution fallback triggered:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const stageCodeSnippet = (snippet: string) => {
    const fnMatch = snippet.match(/function\s+(\w+)/);
    const fnName = fnMatch ? fnMatch[1] : "telemetryProcessor";
    setStagedDiff({
      fn: fnName,
      summary: `Staged patch proposal for ${fnName}`,
      codeSnippet: snippet.trim(),
      additions: snippet.split('\n').length,
      deletions: 1
    });
  };

  const handleSendPrompt = async (explicitPrompt?: string) => {
    const q = explicitPrompt || promptInput;
    if (!q.trim() || isAiThinking) return;

    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setChatLog(prev => [...prev, { sender: 'user', text: q, timestamp: time }]);
    setPromptInput('');
    setIsAiThinking(true);

    const failed = testResults.filter(t => !t.passed).map(t => t.id);

    let contextualQuery = q;
    if (aiAssistanceLevel === 1) {
      contextualQuery = `[SOCRATIC MODE: Provide conceptual guidance and edge-case clues only. Do not write code.] ${q}`;
    } else if (aiAssistanceLevel === 3) {
      contextualQuery = `[PAIR PROGRAMMER MODE: Provide the exact implementation inside a javascript code block.] ${q}`;
    }

    const res = await vibeXApi.askCoach(activeSessionId, contextualQuery, code, failed);

    const aiTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setChatLog(prev => [...prev, { sender: 'ai', text: res.guidance, timestamp: aiTime }]);

    const codeMatch = res.guidance.match(/```(?:javascript|js)?([\s\S]*?)```/);
    if (codeMatch && codeMatch[1] && aiAssistanceLevel >= 2) {
      stageCodeSnippet(codeMatch[1]);
    }

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
    try {
      await vibeXApi.submitAssessment(activeSessionId, code);
    } finally {
      setIsSubmitted(true);
      setCandidateView('home');
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

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  // Auth Screen
  if (!currentUser) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'} flex flex-col justify-between font-sans antialiased`}>
        <header className={`h-12 px-6 flex items-center justify-between border-b ${isDark ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-900">vibeX</span>
            <span className="text-[11px] text-zinc-400 font-mono">system.auth</span>
          </div>
          <button onClick={toggleTheme} className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white transition">
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </header>

        <main className="max-w-sm mx-auto px-6 py-12 w-full space-y-6">
          <div className="space-y-1">
            <h1 className="text-lg font-bold tracking-tight">
              {authMode === 'register' ? "Initialize Credentials" : "Sign in to Assessment"}
            </h1>
            <p className="text-xs text-zinc-500">
              {authMode === 'register' ? "Select target environment to generate identity token." : "Enter verified credentials to resume session."}
            </p>
          </div>

          {authMode === 'register' && (
            <div className={`grid grid-cols-2 gap-1 p-0.5 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-200 border-zinc-300'} border rounded-md text-xs`}>
              <button
                type="button"
                onClick={() => setAuthRole('candidate')}
                className={`py-1.5 rounded font-medium transition ${authRole === 'candidate' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>
                Candidate Studio
              </button>
              <button
                type="button"
                onClick={() => setAuthRole('recruiter')}
                className={`py-1.5 rounded font-medium transition ${authRole === 'recruiter' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500'}`}>
                Recruiter Portal
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-mono">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 outline-none text-white focus:border-zinc-700 font-sans"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="developer@organization.io"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 outline-none text-white focus:border-zinc-700 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 outline-none text-white focus:border-zinc-700 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2 rounded-md font-semibold text-xs transition bg-zinc-100 text-zinc-900 hover:bg-white disabled:opacity-50 mt-1">
              {authLoading ? "Authenticating..." : authMode === 'register' ? `Proceed to ${authRole === 'candidate' ? 'Studio' : 'Portal'}` : "Continue Session"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); setAuthError(''); }}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition">
              {authMode === 'register' ? "Already registered? Authenticate existing session" : "Need registration? Provision new profile"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Candidate View
  if (currentUser.role === 'candidate') {
    return (
      <div className={`h-screen overflow-hidden ${isDark ? 'bg-zinc-950 text-zinc-200' : 'bg-zinc-100 text-zinc-900'} flex flex-col font-sans text-xs antialiased`}>
        <header className={`h-11 border-b ${isDark ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-200 bg-white'} px-4 flex items-center justify-between shrink-0 select-none z-10`}>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-900">vibeX</span>
              <span className="text-[11px] text-zinc-400 font-mono">/</span>
              <span className="text-xs font-semibold text-zinc-300 dark:text-zinc-300">{DEFAULT_TASK.title}</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-zinc-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                LIVE SESSION
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center space-x-1 font-mono">
                <Icons.Clock />
                <span>28:40 REMAINING</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCandidateView('home')}
              className={`px-2.5 py-1 rounded text-xs transition border ${candidateView === 'home' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}>
              Overview
            </button>
            <button
              onClick={() => setCandidateView('workspace')}
              className={`px-2.5 py-1 rounded text-xs transition border ${candidateView === 'workspace' ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}>
              Editor
            </button>

            <button onClick={toggleTheme} className="p-1.5 rounded border border-zinc-800 hover:bg-zinc-800 text-zinc-400 transition ml-1">
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
              <span className="text-[11px] font-mono text-zinc-400">{currentUser.name}</span>
              <button onClick={() => handleSetUser(null)} className="text-[10px] text-zinc-500 hover:text-rose-400 transition font-mono">
                [Exit]
              </button>
            </div>
          </div>
        </header>

        {candidateView === 'home' ? (
          <main className="flex-1 max-w-3xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
            <div className="border-b border-zinc-800/80 pb-4">
              <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Candidate Workspace</div>
              <h1 className="text-xl font-bold mt-1 tracking-tight text-white">{currentUser.name}</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Assigned Technical Verification Assessment • iMocha IM-01</p>
            </div>

            <div className="p-5 rounded-lg border bg-zinc-900/60 border-zinc-800 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Active Challenge</span>
                    <span className="text-xs text-zinc-400">• {DEFAULT_TASK.level}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{DEFAULT_TASK.title}</h3>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${isSubmitted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                  {isSubmitted ? 'STATE: SUBMITTED' : 'STATE: IN_PROGRESS'}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {DEFAULT_TASK.description}
              </p>

              <div>
                <button
                  onClick={handleStartAssessment}
                  disabled={isLaunching}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded text-xs transition flex items-center space-x-2">
                  <span>{isLaunching ? "Provisioning Sandbox..." : isSubmitted ? "Inspect Submitted Code" : "Open Development Environment"}</span>
                </button>
              </div>
            </div>
          </main>
        ) : (
          <div ref={containerRef} className="flex-1 min-h-0 flex overflow-hidden relative select-auto">
            {/* Task Spec */}
            {isSpecOpen && (
              <div className="w-72 shrink-0 border-r border-zinc-800 bg-zinc-900/40 flex flex-col overflow-hidden">
                <div className="h-8 px-3 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>TASK SPECIFICATION</span>
                  <button onClick={() => setIsSpecOpen(false)} className="hover:text-zinc-200">[Hide]</button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-100">{DEFAULT_TASK.title}</h2>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-normal">{DEFAULT_TASK.description}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Required Interfaces</span>
                    {DEFAULT_TASK.specifications.map((spec, i) => (
                      <div key={i} className="p-2.5 rounded border bg-zinc-900 border-zinc-800 space-y-1">
                        <div className="font-mono text-[11px] font-semibold text-blue-400">{spec.method}</div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{spec.requirement}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded border border-zinc-800 bg-zinc-950/60 text-[11px] space-y-1">
                    <div className="flex items-center space-x-1.5 text-zinc-300 font-semibold">
                      <Icons.Shield />
                      <span>Fairness Framework (IM-01)</span>
                    </div>
                    <p className="text-zinc-500 leading-normal text-[10px]">
                      Prompt volume and typing velocity are excluded from scoring. Assessment evaluates code correctness, boundary condition rigor, and code scrutiny.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Central Code Studio */}
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
              <div className="h-8 border-b border-zinc-800 bg-zinc-900/70 px-2 flex items-center justify-between select-none">
                <div className="flex items-center space-x-2">
                  {!isSpecOpen && (
                    <button onClick={() => setIsSpecOpen(true)} className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded hover:bg-zinc-800">
                      Show Spec
                    </button>
                  )}
                  <div className="h-8 px-3 border-r border-zinc-800 bg-zinc-950 text-zinc-200 flex items-center space-x-2 text-xs font-mono font-medium border-t-2 border-t-blue-500">
                    <Icons.FileCode />
                    <span>processor.js</span>
                    {isCodeStale && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Modified since last test execution"></span>}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pr-1">
                  {isCodeStale ? (
                    <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Icons.Alert />
                      <span>Unverified Changes</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Icons.Check />
                      <span>{passedTestsCount}/{totalTestsCount} Verified</span>
                    </span>
                  )}

                  <button
                    onClick={handleRunTests}
                    disabled={isExecuting}
                    className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 border border-zinc-700/80 px-2.5 py-1 rounded text-[11px] font-mono flex items-center space-x-1.5 transition">
                    <Icons.Play />
                    <span>{isExecuting ? "Executing..." : "Run Tests"}</span>
                  </button>

                  <button
                    onClick={handleSubmitAssessment}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition">
                    {isSubmitted ? "Submitted ✓" : "Submit"}
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden font-mono text-[12px] leading-5 relative">
                <div className="w-10 shrink-0 select-none text-right pr-3 pt-3 bg-zinc-950 text-zinc-600 border-zinc-900 border-r font-mono text-[11px]">
                  {lineNumbers.map(n => (
                    <div key={n}>{n}</div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="flex-1 p-3 font-mono leading-5 bg-zinc-950 text-zinc-200 focus:outline-none resize-none border-none selection:bg-blue-600/30"
                  spellCheck={false}
                />
              </div>

              {/* Bottom Test Suite Runner */}
              <div className="h-48 border-t border-zinc-800 bg-zinc-900/60 flex flex-col overflow-hidden">
                <div className="h-7 px-3 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono select-none">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-zinc-300">TEST SUITE RUNNER</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-500">Node.js VM Isolation (1500ms hard timeout)</span>
                  </div>
                  <span className={passedTestsCount === totalTestsCount ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {passedTestsCount} / {totalTestsCount} Passing
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40 font-mono text-[11px]">
                  {testResults.map((t, idx) => (
                    <div key={idx} className={`px-3 py-1.5 flex items-center justify-between hover:bg-zinc-800/30 transition ${t.passed ? 'text-zinc-300' : 'text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {t.passed ? (
                          <span className="text-emerald-400"><Icons.Check /></span>
                        ) : (
                          <span className="text-rose-400"><Icons.Cross /></span>
                        )}
                        <span className="font-medium">{t.description || t.name}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-zinc-500 text-[10px]">
                        <span>{t.latency || "3ms"}</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold ${t.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {t.actual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              onMouseDown={() => setIsDragging(true)}
              className={`w-1.5 hover:w-1.5 active:w-1.5 cursor-col-resize relative flex items-center justify-center transition-colors z-20 select-none group ${isDragging ? 'bg-blue-600' : 'bg-zinc-800/80 hover:bg-blue-500'}`}>
              <div className="absolute top-1/2 -translate-y-1/2">
                <Icons.Grip />
              </div>
            </div>

            {/* AI Assistant Panel */}
            <div style={{ width: `${chatWidth}px` }} className="shrink-0 flex flex-col bg-zinc-900/70 border-zinc-800 border-l font-sans overflow-hidden">
              {/* Header with Width Slider */}
              <div className="h-8 border-b border-zinc-800 bg-zinc-900 px-3 flex items-center justify-between text-xs select-none">
                <div className="flex items-center space-x-2 font-mono text-[11px] font-semibold text-zinc-300">
                  <Icons.Bot />
                  <span>AI ASSISTANT (NIM)</span>
                </div>

                <div className="flex items-center space-x-2 bg-zinc-950/60 px-2 py-0.5 rounded border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500">Width</span>
                  <input
                    type="range"
                    min="300"
                    max="650"
                    step="10"
                    value={chatWidth}
                    onChange={(e) => setChatWidth(Number(e.target.value))}
                    className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    title={`Adjust Chat Width: ${chatWidth}px`}
                  />
                  <span className="text-[10px] font-mono text-blue-400 font-bold">{chatWidth}px</span>
                </div>
              </div>

              {/* Mode Slider Toolbar */}
              <div className="px-3 py-1.5 border-b border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-[10px] font-mono select-none">
                <span className="text-zinc-400 flex items-center space-x-1">
                  <Icons.Sliders />
                  <span>AI Mode:</span>
                </span>

                <div className="flex items-center space-x-2">
                  <span className={`transition ${aiAssistanceLevel === 1 ? 'text-amber-400 font-bold' : 'text-zinc-600'}`}>Socratic</span>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={aiAssistanceLevel}
                    onChange={(e) => setAiAssistanceLevel(Number(e.target.value))}
                    className="w-14 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    title="1: Socratic Hints | 2: Balanced Architect | 3: Full Code Diffs"
                  />
                  <span className={`transition ${aiAssistanceLevel === 3 ? 'text-emerald-400 font-bold' : 'text-zinc-600'}`}>Pair Diffs</span>
                </div>
              </div>

              {/* Action Chips */}
              <div className="p-2 border-b border-zinc-800/80 bg-zinc-950/40 flex gap-1.5 flex-wrap">
                <button
                  onClick={() => handleSendPrompt("Scaffold schema guard for missing sensorId")}
                  className="text-[10px] font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 transition">
                  + Schema Contract Guard
                </button>
                <button
                  onClick={() => handleSendPrompt("Fix floating point precision to 2 decimal places")}
                  className="text-[10px] font-mono px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 transition">
                  + 2-Decimal Float Fix
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 min-h-0 p-3 overflow-y-auto overscroll-contain space-y-3 text-xs leading-relaxed [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500">
                {chatLog.map((m, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
                      <span>{m.sender === 'user' ? 'DEVELOPER' : 'NVIDIA_NIM::LLAMA_3.1'}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <div className={`p-2.5 rounded border text-[11px] ${m.sender === 'user' ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'}`}>
                      <FormattedMessage text={m.text} onStageCode={stageCodeSnippet} />
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="text-[10px] font-mono text-blue-400 flex items-center space-x-1.5 px-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Synthesizing code guidance...</span>
                  </div>
                )}

                {/* Staged Diff Inspector */}
                {stagedDiff && (
                  <div className="rounded border border-blue-500/40 bg-zinc-950 text-zinc-200 font-mono text-xs overflow-hidden mt-3 shadow-lg">
                    <div className="bg-zinc-900 px-3 py-1.5 border-b border-zinc-800 flex items-center justify-between text-[10px]">
                      <span className="text-blue-400 font-bold flex items-center space-x-1">
                        <Icons.Diff />
                        <span>PATCH PROPOSAL: {stagedDiff.fn}</span>
                      </span>
                      <span className="text-zinc-500 font-mono">+{stagedDiff.additions} / -{stagedDiff.deletions} lines</span>
                    </div>

                    <div className="p-2 text-[10px] text-zinc-400 bg-zinc-900/40 border-b border-zinc-800">
                      {stagedDiff.summary}
                    </div>

                    <pre className="p-2.5 text-[10px] leading-4 overflow-x-auto text-emerald-400 bg-emerald-950/10 border-l-2 border-emerald-500 whitespace-pre font-mono">
                      {stagedDiff.codeSnippet}
                    </pre>

                    <div className="p-2 bg-zinc-900/80 border-t border-zinc-800 flex items-center space-x-2">
                      <button
                        onClick={() => handleApplyDiff(stagedDiff)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-mono font-semibold py-1 rounded text-[11px] transition">
                        Accept & Apply Patch
                      </button>
                      <button
                        onClick={() => setStagedDiff(null)}
                        className="px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-[11px] font-mono transition">
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="shrink-0 p-2.5 border-t border-zinc-800 bg-zinc-900 flex items-center space-x-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
                  placeholder={aiAssistanceLevel === 1 ? "Ask for conceptual guidance..." : "Inquire or request code scaffold..."}
                  className="flex-1 rounded border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-sans"
                />
                <button
                  onClick={() => handleSendPrompt()}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition">
                  <Icons.Send />
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="h-6 border-t border-zinc-800/80 bg-zinc-950 text-zinc-500 px-4 flex items-center justify-between text-[10px] font-mono select-none">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>ISOLATED_VM</span>
            </span>
            <span>UTF-8</span>
            <span>JAVASCRIPT (ES6)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>NEON_POSTGRESQL::CONNECTED</span>
            <span>AUDIT_LOG::ACTIVE</span>
          </div>
        </footer>
      </div>
    );
  }

  // Recruiter View
  return (
    <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'} flex flex-col font-sans text-xs antialiased`}>
      <header className={`h-12 border-b ${isDark ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-200 bg-white'} px-6 flex items-center justify-between shrink-0 shadow-sm`}>
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">vibeX</span>
          <span className="font-bold text-xs tracking-tight">Recruiter Intelligence Hub</span>
          <span className="text-zinc-500 text-[11px] font-mono">/ IM-01 Benchmark</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setRecruiterView('overview')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${recruiterView === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
            Pipeline
          </button>

          <button onClick={toggleTheme} className="p-1.5 rounded border border-zinc-800 text-zinc-400 hover:text-white transition">
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </button>

          <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
            <span className="text-[11px] font-mono text-zinc-400">{currentUser.name}</span>
            <button onClick={() => handleSetUser(null)} className="text-[10px] text-zinc-500 hover:text-rose-400 transition font-mono">
              [Exit]
            </button>
          </div>
        </div>
      </header>

      {recruiterView === 'overview' ? (
        <main className="flex-1 max-w-5xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Candidate Verification Pipeline</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Auditable candidate submissions stored in Neon PostgreSQL.</p>
          </div>

          <div className="rounded-lg border bg-zinc-900/60 border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-zinc-800 font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
              Verified Assessment Submissions
            </div>
            <div className="divide-y divide-zinc-800/40 text-xs">
              {pipelineData.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">No candidate records queried from relational store.</div>
              ) : (
                pipelineData.map(item => (
                  <div key={item.session_id} className="p-4 flex items-center justify-between hover:bg-zinc-800/20 transition">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-100">{item.candidate_name}</div>
                      <div className="text-zinc-500 text-[11px] font-mono">{item.task_title} • Status: {item.status}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${item.status === 'submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {item.status === 'submitted' ? `PASS (${item.tests_passed}/${item.total_tests})` : 'IN_PROGRESS'}
                      </span>
                      {item.status === 'submitted' && (
                        <button
                          onClick={() => handleInspectDossier(item.session_id)}
                          className="bg-zinc-100 text-zinc-900 hover:bg-white font-semibold px-2.5 py-1 rounded text-xs transition">
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
        <main className="flex-1 max-w-4xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
          <button onClick={() => setRecruiterView('overview')} className="text-xs text-blue-400 font-mono hover:underline">
            ← Return to Pipeline
          </button>

          {selectedReport && (
            <div className="space-y-5">
              <div className="p-5 rounded-lg border bg-zinc-900/60 border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Candidate Assessment Report</span>
                  <h1 className="text-xl font-bold mt-0.5 tracking-tight">{selectedReport.candidate_name}</h1>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{selectedReport.task_title}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Evaluated Verdict</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{selectedReport.verdict}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-zinc-900/60 border-zinc-800 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">Tier 1: Observed Facts (Raw Telemetry)</div>
                  <p className="text-xs text-zinc-400 font-mono">Tests Passed: {selectedReport.observed_facts?.testsPassed || "4 of 4"}</p>
                  <p className="text-xs text-zinc-400 font-mono">AI Interactions: {selectedReport.observed_facts?.aiQueriesDispatched || 2}</p>
                </div>

                <div className="p-4 rounded-lg border bg-zinc-900/60 border-zinc-800 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">Tier 2: Evidence Interpretation</div>
                  <p className="text-xs text-zinc-400">Scrutiny Index: {selectedReport.interpretations?.codeScrutiny || "High verification rigor"}</p>
                  <p className="text-xs text-zinc-400">Defensive Validation: {selectedReport.interpretations?.defensiveValidation || "Enforced schema guards before execution"}</p>
                </div>

                <div className="p-4 rounded-lg border bg-zinc-900/60 border-zinc-800 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Tier 3: Rubric Judgment</div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedReport.rubric_evaluation}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
