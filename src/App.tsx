import React, { useState, useEffect, useRef, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { vibeXApi } from './services/api';

// ============================================================================
// ERROR BOUNDARY (Zero White-Screen Guarantees)
// ============================================================================
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("vibeX Error Boundary caught:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-zinc-950 text-zinc-100 min-h-screen font-sans border-t-4 border-rose-500">
          <h2 className="text-rose-500 font-bold text-base">Application Workspace Recovered</h2>
          <pre className="bg-zinc-900 p-4 mt-2 rounded border border-zinc-800 text-xs font-mono">{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold">Reload Workspace</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// SYSTEM ICONS
// ============================================================================
const Icons = {
  Terminal: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Users: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Check: () => <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>,
  Cross: () => <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>,
  Alert: () => <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  Play: () => <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Bot: () => <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Send: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Diff: () => <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  FileText: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  ChevronRight: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>,
  Plus: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Grip: () => (
    <svg className="w-3 h-3 text-zinc-500" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="6" cy="4" r="1.2" /><circle cx="10" cy="4" r="1.2" />
      <circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="8" r="1.2" />
      <circle cx="6" cy="12" r="1.2" /><circle cx="10" cy="12" r="1.2" />
    </svg>
  )
};

// ============================================================================
// BENCHMARK TASK DATA
// ============================================================================
const DEFAULT_TASK = {
  id: "task-iot-stream",
  title: "Real-Time Telemetry Stream Processor",
  category: "JavaScript Problem Solving",
  level: "Intermediate / Mid-Senior",
  durationMinutes: 30,
  description: "Safely parse incoming IoT JSON payloads, reject corrupted telemetry structures missing sensorId or reading, calculate rolling averages constrained to 2 decimal places, and flag anomalies beyond maxDeviation.",
  guidance: [
    { id: "g1", title: "parseEvent(rawJson)", desc: "Parse JSON. Throw Error if sensorId or reading is undefined." },
    { id: "g2", title: "computeWindowAverages(readings)", desc: "Compute rolling average constrained to 2 decimals using Number(avg.toFixed(2))." },
    { id: "g3", title: "flagAnomalies(readings, baseline, maxDeviation)", desc: "Filter items where Math.abs(reading - baseline) > maxDeviation." }
  ],
  starterCode: `// vibeX Telemetry Processor
// Implement the required methods:

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

export default function App() {
  return (
    <ErrorBoundary>
      <VibeXPlatform />
    </ErrorBoundary>
  );
}

function VibeXPlatform() {
  // Current Experience: 'landing' | 'candidate' | 'recruiter'
  const [currentRole, setCurrentRole] = useState<'landing' | 'candidate' | 'recruiter'>('landing');

  // Candidate Sub-Views: 'home' | 'workspace'
  const [candidateView, setCandidateView] = useState<'home' | 'workspace'>('home');

  // Recruiter Sub-Views: 'overview' | 'dossier' | 'create_modal'
  const [recruiterView, setRecruiterView] = useState<'overview' | 'dossier'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("cand-01");

  // Shared Session State
  const [code, setCode] = useState(DEFAULT_TASK.starterCode);
  const [lastTestedCode, setLastTestedCode] = useState<string | null>(DEFAULT_TASK.starterCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState([
    { id: "T1", name: "parseEvent parses valid payload", passed: true, expected: "Parsed payload", actual: "Pass" },
    { id: "T2", name: "parseEvent rejects missing fields", passed: true, expected: "Throws Error", actual: "Pass" },
    { id: "T3", name: "computeWindowAverages 2-dec precision", passed: true, expected: "20.27 (Number)", actual: "Pass" },
    { id: "T4", name: "flagAnomalies isolates deviations", passed: true, expected: "[75, 20]", actual: "Pass" }
  ]);
  const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);

  // AI Assistant & Staging State
  interface StagedDiff {
    targetFunction: string;
    summary: string;
    codeSnippet: string;
    linesAdded: number;
    linesRemoved: number;
  }
  const [stagedDiff, setStagedDiff] = useState<StagedDiff | null>(null);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "👋 I'm your vibeX AI Pair Programmer. Ask me to scaffold validation guards, explain floating-point constraints, or fix failing edge cases." }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Draggable Split-Pane Slider State
  const [chatWidth, setChatWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpecOpen, setIsSpecOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isCodeStale = lastTestedCode !== null && code !== lastTestedCode;
  const passedTestsCount = testResults.filter(t => t.passed).length;

  // Split-Pane Drag Handlers
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

  // Code Execution Handler
  const handleRunTests = async () => {
    setIsExecuting(true);
    const data = await vibeXApi.runTests("session-active", code);
    setTestResults(data.results || testResults);
    setLastTestedCode(code);
    setIsExecuting(false);
  };

  // AI Prompt & Diff Staging Handler
  const handleSendPrompt = async (explicitText?: string) => {
    const q = explicitText || promptInput;
    if (!q.trim() || isAiThinking) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setPromptInput('');
    setIsAiThinking(true);

    const failed = testResults.filter(t => !t.passed).map(t => t.id);
    const res = await vibeXApi.askCoach("session-active", q, code, failed);

    // Staged diff trigger
    let generatedDiff: StagedDiff | null = null;
    const lower = q.toLowerCase();
    if (lower.includes("precision") || lower.includes("float") || lower.includes("average")) {
      generatedDiff = {
        targetFunction: "computeWindowAverages",
        summary: "Constrain arithmetic average to 2 decimal places using Number((sum/len).toFixed(2))",
        codeSnippet: `export function computeWindowAverages(readings) {\n  if (!readings || readings.length === 0) return 0;\n  const sum = readings.reduce((acc, curr) => acc + curr, 0);\n  return Number((sum / readings.length).toFixed(2));\n}`,
        linesAdded: 3,
        linesRemoved: 1
      };
    } else if (lower.includes("guard") || lower.includes("parse") || lower.includes("validation")) {
      generatedDiff = {
        targetFunction: "parseEvent",
        summary: "Enforce defensive validation guards throwing Error on missing telemetry keys",
        codeSnippet: `export function parseEvent(rawJson) {\n  const data = JSON.parse(rawJson);\n  if (!data.sensorId || data.reading === undefined) {\n    throw new Error("Invalid telemetry schema: missing sensorId or reading");\n  }\n  return data;\n}`,
        linesAdded: 4,
        linesRemoved: 1
      };
    }

    setChatLog(prev => [...prev, { sender: 'ai', text: res.guidance }]);
    if (generatedDiff) setStagedDiff(generatedDiff);
    setIsAiThinking(false);
  };

  const handleApplyDiff = (diff: StagedDiff) => {
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

  const handleSubmitAssessment = () => {
    setIsAssessmentSubmitted(true);
    setCandidateView('home');
  };

  // ==========================================================================
  // VIEW 1: SIGNUP & ROLE ONBOARDING (Section 2)
  // ==========================================================================
  if (currentRole === 'landing') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans selection:bg-blue-600">
        {/* Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-zinc-900">
          <div className="flex items-center space-x-3">
            <span className="bg-white text-black font-black px-2.5 py-1 rounded text-xs tracking-wider">vibeX</span>
            <span className="text-xs text-zinc-500 font-medium">iMocha IM-01 Showcase</span>
          </div>
          <div className="text-xs text-zinc-500">v1.2.0 • Production Candidate</div>
        </header>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto px-6 py-12 w-full text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>One Platform • Two Deliberately Different Experiences</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Build with confidence.<br />Hire with evidence.
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              An AI-assisted coding assessment platform measuring problem solving, AI collaboration, and code scrutiny — anchored in inspectable telemetry.
            </p>
          </div>

          {/* Role Choice Cards */}
          <div className="grid sm:grid-cols-2 gap-5 text-left max-w-2xl mx-auto">
            {/* Candidate Role Card */}
            <div
              onClick={() => { setCurrentRole('candidate'); setCandidateView('home'); }}
              className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-blue-600/80 transition cursor-pointer group flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Icons.Terminal />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">I'm a Candidate</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Solve real-world coding challenges, collaborate with an AI assistant, and demonstrate your verification rigor.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-blue-500 flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>Enter Candidate Studio</span>
                <Icons.ChevronRight />
              </div>
            </div>

            {/* Recruiter Role Card */}
            <div
              onClick={() => { setCurrentRole('recruiter'); setRecruiterView('overview'); }}
              className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-emerald-600/80 transition cursor-pointer group flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <Icons.Briefcase />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">I'm a Recruiter</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Create assessments, track candidate submissions, and inspect 3-tier evidence dossiers to make defensible hiring calls.
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-500 flex items-center space-x-1 group-hover:translate-x-1 transition">
                <span>Enter Assessment Hub</span>
                <Icons.ChevronRight />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="h-16 px-8 flex items-center justify-between border-t border-zinc-900 text-xs text-zinc-600">
          <span>VectorX • Chetan Shakhapure</span>
          <span>iMocha IM-01 Standard Compliant</span>
        </footer>
      </div>
    );
  }

  // ==========================================================================
  // EXPERIENCE A: CANDIDATE PORTAL (Section 3)
  // ==========================================================================
  if (currentRole === 'candidate') {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
        
        {/* Candidate Global Nav */}
        <header className="h-14 border-b border-zinc-900 px-6 flex items-center justify-between shrink-0 bg-zinc-950">
          <div className="flex items-center space-x-4">
            <span className="bg-white text-black font-black px-2 py-0.5 rounded text-xs tracking-wider">vibeX</span>
            <span className="text-xs font-semibold text-zinc-400">Candidate Studio</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setCandidateView('home')}
              className={`px-3 py-1 rounded transition ${candidateView === 'home' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>
              Your Assessments
            </button>
            <button
              onClick={() => setCandidateView('workspace')}
              className={`px-3 py-1 rounded transition ${candidateView === 'workspace' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>
              Active Workspace
            </button>
            <button
              onClick={() => setCurrentRole('landing')}
              className="px-2.5 py-1 rounded border border-zinc-800 text-zinc-500 hover:text-white transition text-[11px]">
              Switch Role
            </button>
          </div>
        </header>

        {/* 3A. CANDIDATE HOME DASHBOARD */}
        {candidateView === 'home' ? (
          <main className="flex-1 max-w-4xl mx-auto w-full p-8 space-y-8 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white">Welcome back, Chetan</h1>
              <p className="text-xs text-zinc-400">Pick up where you left off. All your assessments and verification records are stored securely.</p>
            </div>

            {/* Active Assessments Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Assessments</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">1 Active</span>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{DEFAULT_TASK.title}</h3>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center space-x-2">
                      <span>{DEFAULT_TASK.durationMinutes} mins</span>
                      <span>•</span>
                      <span>{DEFAULT_TASK.level}</span>
                      <span>•</span>
                      <span className="text-blue-400">AI Assistance Permitted</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${isAssessmentSubmitted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {isAssessmentSubmitted ? 'Submitted' : 'In Progress'}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{DEFAULT_TASK.description}</p>

                <div className="pt-2">
                  <button
                    onClick={() => setCandidateView('workspace')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-sm">
                    {isAssessmentSubmitted ? 'Review Submitted Code' : 'Open Coding Workspace'}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Recent Submissions</span>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white">Array Utilities & Stream Filtering Challenge</span>
                  <p className="text-[11px] text-zinc-500">Submitted 2 days ago • Dossier released to hiring team</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Verdict Released</span>
              </div>
            </div>
          </main>
        ) : (
          /* 3B. THE ACTUAL CANDIDATE WORKSPACE */
          <div ref={containerRef} className="flex-1 flex overflow-hidden relative select-auto">
            
            {/* Left: Collapsible Problem Statement Panel */}
            {isSpecOpen && (
              <div className="w-80 shrink-0 border-r border-zinc-900 bg-zinc-950 p-5 overflow-y-auto space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                  <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">Benchmark Specification</span>
                  <button onClick={() => setIsSpecOpen(false)} className="text-[10px] text-zinc-500 hover:text-zinc-300">Collapse</button>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-white">{DEFAULT_TASK.title}</h2>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{DEFAULT_TASK.description}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-zinc-300 block">Required Methods</span>
                  {DEFAULT_TASK.guidance.map(g => (
                    <div key={g.id} className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                      <span className="font-mono text-[11px] font-bold text-blue-400 block">{g.title}</span>
                      <p className="text-[10px] text-zinc-400">{g.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-[10px] text-blue-300 space-y-1">
                  <span className="font-bold block">iMocha IM-01 Fairness Guarantee:</span>
                  <p>Your prompt volume and speed are NOT scored. Focus on rigorous problem solving, testing edge cases, and code scrutiny.</p>
                </div>
              </div>
            )}

            {/* Center: Main Code Editor & Sandbox */}
            <div className="flex-1 flex flex-col min-w-0 bg-black">
              {/* Workspace Top Bar */}
              <div className="h-10 border-b border-zinc-900 px-4 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center space-x-3">
                  {!isSpecOpen && (
                    <button onClick={() => setIsSpecOpen(true)} className="text-[10px] text-blue-400 hover:underline">Show Task</button>
                  )}
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
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-bold flex items-center space-x-1.5 transition shadow-sm">
                    <Icons.Play />
                    <span>{isExecuting ? "Executing..." : "Run Tests"}</span>
                  </button>

                  <button
                    onClick={handleSubmitAssessment}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold transition shadow-sm">
                    {isAssessmentSubmitted ? "Submitted ✓" : "Submit Assessment"}
                  </button>
                </div>
              </div>

              {/* Code Buffer */}
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="flex-1 p-4 font-mono text-xs leading-relaxed bg-black text-zinc-100 focus:outline-none resize-none border-none"
                spellCheck={false}
              />

              {/* Bottom: Deterministic Sandbox Output */}
              <div className="h-48 border-t border-zinc-900 bg-zinc-950 p-3 flex flex-col overflow-hidden text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-900">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">Deterministic Sandbox Console</span>
                    <span className="text-[10px] font-mono text-zinc-500">(Node.js VM • 1500ms Timeout)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{passedTestsCount}/4 Passed</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {testResults.map(t => (
                    <div key={t.id} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${t.passed ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-rose-950/20 border-rose-900/40 text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {t.passed ? <Icons.Check /> : <Icons.Cross />}
                        <span className="font-semibold">{t.name}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold">{t.actual}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Draggable Resizer Slider */}
            <div
              onMouseDown={() => setIsDragging(true)}
              className={`w-2 hover:w-2.5 active:w-2.5 cursor-col-resize relative flex items-center justify-center transition-all z-20 group select-none ${isDragging ? 'bg-blue-600' : 'bg-zinc-900 hover:bg-blue-600/50'}`}>
              <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-7 rounded-full bg-zinc-900 border border-zinc-700 shadow-sm flex items-center justify-center">
                <Icons.Grip />
              </div>
            </div>

            {/* Right: Auditable AI Assistant with Diff Staging */}
            <div style={{ width: `${chatWidth}px` }} className="shrink-0 flex flex-col bg-zinc-950 border-l border-zinc-900">
              <div className="h-10 border-b border-zinc-900 px-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  <Icons.Bot />
                  <span>AI Pair Programmer</span>
                </div>
                {/* Presets */}
                <div className="flex items-center space-x-1 text-[10px]">
                  <button onClick={() => setChatWidth(320)} className={`px-1.5 py-0.5 rounded ${chatWidth <= 350 ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500'}`}>S</button>
                  <button onClick={() => setChatWidth(420)} className={`px-1.5 py-0.5 rounded ${chatWidth > 350 && chatWidth < 550 ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500'}`}>M</button>
                  <button onClick={() => setChatWidth(600)} className={`px-1.5 py-0.5 rounded ${chatWidth >= 550 ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500'}`}>L</button>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 border-b border-zinc-900 flex gap-1 flex-wrap">
                <button onClick={() => handleSendPrompt("Scaffold schema guard for missing sensorId")} className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 hover:border-blue-500 text-zinc-300 transition">
                  ⚡ Guard Missing Fields
                </button>
                <button onClick={() => handleSendPrompt("Fix floating point precision to 2 decimal places")} className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 hover:border-blue-500 text-zinc-300 transition">
                  ⚡ 2-Decimal Float Fix
                </button>
              </div>

              {/* Chat Log & Staged Diff */}
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

                    <div className="bg-black text-zinc-200 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] max-h-36 overflow-x-auto whitespace-pre">
                      {stagedDiff.codeSnippet}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => handleApplyDiff(stagedDiff)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded text-xs transition shadow-sm">
                        Accept & Merge Diff
                      </button>
                      <button
                        onClick={() => setStagedDiff(null)}
                        className="px-3 py-1.5 rounded border border-zinc-700 text-xs font-semibold hover:bg-zinc-800 text-zinc-300 transition">
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Prompt Input */}
              <div className="p-3 border-t border-zinc-900 flex items-center space-x-2 bg-zinc-950">
                <input
                  type="text"
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
                  placeholder="Ask AI pair programmer..."
                  className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button onClick={() => handleSendPrompt()} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg transition">
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
  // EXPERIENCE B: RECRUITER PORTAL (Section 4)
  // Clean, Soft-Gray / White Workspace Canvas with Navy Accents
  // ==========================================================================
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans">
      
      {/* Recruiter Navigation Bar */}
      <header className="h-14 border-b border-zinc-200 bg-white px-8 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white font-black px-2 py-0.5 rounded text-xs tracking-wider">vibeX</span>
            <span className="font-bold text-sm text-zinc-800">Assessment Hub</span>
          </div>
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-xs text-zinc-500 font-medium">VectorX Organization</span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setRecruiterView('overview')}
            className={`px-3 py-1 rounded-lg font-bold transition ${recruiterView === 'overview' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
            Overview & Pipeline
          </button>
          <button
            onClick={() => setRecruiterView('dossier')}
            className={`px-3 py-1 rounded-lg font-bold transition ${recruiterView === 'dossier' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'}`}>
            Candidate Dossier
          </button>
          <button
            onClick={() => setCurrentRole('landing')}
            className="px-2.5 py-1 rounded-lg border border-zinc-300 text-zinc-600 hover:text-zinc-900 transition text-[11px]">
            Switch Role
          </button>
        </div>
      </header>

      {/* 4A. RECRUITER OVERVIEW & PIPELINE */}
      {recruiterView === 'overview' ? (
        <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-8 overflow-y-auto">
          {/* Header & New Assessment Action */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-zinc-900">Good morning.</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Here is the active status of your technical assessments and candidate submissions.</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow-sm">
              <Icons.Plus />
              <span>New Assessment</span>
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Active Assessments</span>
              <div className="text-3xl font-black text-zinc-900">4</div>
              <span className="text-[10px] text-zinc-400 block">Currently accepting work</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Awaiting Review</span>
              <div className="text-3xl font-black text-blue-600">12</div>
              <span className="text-[10px] text-zinc-400 block">Submissions to inspect</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Invitations Pending</span>
              <div className="text-3xl font-black text-zinc-900">7</div>
              <span className="text-[10px] text-zinc-400 block">Not yet started</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-500">Completed Assessments</span>
              <div className="text-3xl font-black text-emerald-600">18</div>
              <span className="text-[10px] text-zinc-400 block">Dossiers compiled</span>
            </div>
          </div>

          {/* 4C. CANDIDATE PIPELINE TABLE */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Active Candidate Pipeline</h3>
                <p className="text-[11px] text-zinc-500">Submissions ordered by review readiness. Click Review to inspect the evidence trail.</p>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">iMocha IM-01 Standard</span>
            </div>

            <div className="divide-y divide-zinc-200 text-xs">
              {/* Candidate A (Live Session) */}
              <div className="p-4 flex items-center justify-between hover:bg-zinc-50/80 transition">
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-900 text-sm">Chetan Shakhapure</div>
                  <div className="text-zinc-500 text-[11px]">JavaScript Telemetry Stream • Duration: 18 mins</div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Review Ready (4/4 Tests)
                  </span>
                  <button
                    onClick={() => { setSelectedCandidateId("cand-01"); setRecruiterView('dossier'); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition">
                    Inspect Dossier
                  </button>
                </div>
              </div>

              {/* Candidate B */}
              <div className="p-4 flex items-center justify-between hover:bg-zinc-50/80 transition">
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-900 text-sm">Aarav Sharma</div>
                  <div className="text-zinc-500 text-[11px]">JavaScript Telemetry Stream • Duration: 24 mins</div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    In Progress
                  </span>
                  <button
                    onClick={() => { setSelectedCandidateId("cand-02"); setRecruiterView('dossier'); }}
                    className="border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
                    View Live Session
                  </button>
                </div>
              </div>

              {/* Candidate C */}
              <div className="p-4 flex items-center justify-between hover:bg-zinc-50/80 transition">
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-900 text-sm">Priya Deshmukh</div>
                  <div className="text-zinc-500 text-[11px]">Frontend Debugging Challenge • Invited yesterday</div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                    Not Started
                  </span>
                  <button className="border border-zinc-300 text-zinc-500 hover:bg-zinc-100 font-semibold px-3 py-1.5 rounded-lg text-xs transition">
                    Resend Invitation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* 4D. THE RECRUITER DOSSIER (SIGNATURE FEATURE) */
        <main className="flex-1 max-w-5xl mx-auto w-full p-8 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setRecruiterView('overview')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1">
              <span>← Back to Pipeline</span>
            </button>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              Review Ready • Tamper-Evident Record
            </span>
          </div>

          {/* Dossier Header */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Candidate Submission Dossier</span>
              <h1 className="text-2xl font-black text-zinc-900 mt-0.5">Chetan Shakhapure</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Task: {DEFAULT_TASK.title} • Completed in 18 minutes</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Evaluated Hiring Signal</span>
              <span className="text-lg font-black text-emerald-600">Recommended (Strong Autonomy & Scrutiny)</span>
            </div>
          </div>

          {/* Three Core Metric Pillars */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <span className="text-xs text-zinc-500">Deterministic Correctness</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">4 / 4 Passing</div>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">100% boundary test coverage</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <span className="text-xs text-zinc-500">AI Code Scrutiny</span>
              <div className="text-2xl font-black text-blue-600 mt-1">Verified (88%)</div>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">Zero blind merges; manual retest</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <span className="text-xs text-zinc-500">Collaboration Style</span>
              <div className="text-2xl font-black text-purple-600 mt-1">Balanced Partner</div>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">Delegates syntax, guards logic</span>
            </div>
          </div>

          {/* 3-TIER EVIDENCE HIERARCHY (Section 4D) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">3-Tier Verifiable Evidence Hierarchy</h3>

            {/* Tier 1: Observed Facts */}
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Tier 1: Observed Facts (Raw Telemetry)</span>
                <span className="text-[10px] font-mono text-zinc-400">Database Record ID #ev-9021</span>
              </div>
              <ul className="text-xs text-zinc-600 space-y-1.5 list-disc pl-4">
                <li><strong>4 automated unit assertions</strong> executed and verified in isolated Node VM environment.</li>
                <li><strong>2 prompt queries</strong> dispatched to NVIDIA NIM (`meta/llama-3.1-70b-instruct`).</li>
                <li><strong>1 staged code diff</strong> reviewed and merged by candidate at minute 10:04:12.</li>
                <li><strong>3 versioned code snapshots</strong> stored with millisecond timestamps.</li>
              </ul>
            </div>

            {/* Tier 2: Evidence Interpretations */}
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 border-l-4 border-l-purple-600">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Tier 2: Evidence Interpretations</span>
                <span className="text-[10px] font-mono text-zinc-400">Algorithmic Behavioral Analysis</span>
              </div>
              <ul className="text-xs text-zinc-600 space-y-1.5 list-disc pl-4">
                <li><strong>Defensive Engineering:</strong> Candidate proactively threw explicit `Error` objects on malformed IoT payloads before executing tests.</li>
                <li><strong>Iterative Verification:</strong> Code modification followed an initial failing test and was immediately followed by a passing retest run.</li>
                <li><strong>Zero Blind Trust:</strong> Staged AI diff was inspected for 42 seconds before candidate triggered the merge.</li>
              </ul>
            </div>

            {/* Tier 3: Rubric-Based Judgment */}
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2 border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Tier 3: Rubric-Based Judgment</span>
                <span className="text-[10px] font-mono text-zinc-400">Standardized Role Match</span>
              </div>
              <p className="text-xs text-zinc-700 leading-relaxed">
                Candidate demonstrated strong autonomy and engineering vigilance under the Mid-Senior assessment rubric. Candidate used AI as a force multiplier for rapid syntax generation without delegating architectural or precision correctness.
              </p>
            </div>
          </div>

          {/* Assessment Limitations & Fairness Disclosures */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-500 space-y-1">
            <span className="font-bold text-zinc-700 block">Assessment Transparency & Limitations Disclosure:</span>
            <p>1. Prompt volume, token count, and typing speeds are strictly excluded from candidate evaluation scores per the iMocha IM-01 standard.</p>
            <p>2. Evaluation is strictly anchored to deterministic assertion outcomes, candidate code scrutiny, and verified problem resolution.</p>
          </div>
        </main>
      )}

      {/* 4B. ASSESSMENT CREATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Create New Assessment</h3>
                <p className="text-xs text-zinc-500">4-Step Assessment Authoring Flow</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-zinc-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                <span className="font-bold text-blue-900">Step 1: Assessment Details</span>
                <p className="text-zinc-600">Title: JavaScript Telemetry Stream Processor • Role: Backend Engineer</p>
              </div>
              <div className="p-3 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-800">Step 2: Tasks & Evaluation</span>
                <p className="text-zinc-500">4 Automated Unit Assertions • 1500ms Execution Guard</p>
              </div>
              <div className="p-3 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-800">Step 3: AI & Assessment Rules</span>
                <p className="text-zinc-500">NVIDIA NIM Enabled • Prompt Volume Not Penalized</p>
              </div>
              <div className="p-3 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-800">Step 4: Preview & Publish</span>
                <p className="text-zinc-500">Generate direct candidate link and invite code</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-300 font-semibold text-xs text-zinc-700 hover:bg-zinc-100 transition">
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition">
                Publish Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
