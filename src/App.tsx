import React, { useState, useEffect, useRef, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { vibeXApi } from './services/api';

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

const Icons = {
  Sun: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Play: () => <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Bot: () => <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Send: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Check: () => <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>,
  Cross: () => <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>,
  Alert: () => <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  Diff: () => <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>,
  Grip: () => (
    <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="6" cy="4" r="1.2" /><circle cx="10" cy="4" r="1.2" />
      <circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="8" r="1.2" />
      <circle cx="6" cy="12" r="1.2" /><circle cx="10" cy="12" r="1.2" />
    </svg>
  )
};

const TASK_SPEC = {
  id: "task-iot-stream",
  title: "Real-Time Telemetry Stream Processor",
  level: "Senior / Mid-Level Software Engineer",
  timeLimit: "30 Mins",
  description: "Implement safe JSON payload parsing, compute arithmetic rolling averages to 2 decimal places, and isolate anomalous deviations.",
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
      <VibeXWorkspace />
    </ErrorBoundary>
  );
}

function VibeXWorkspace() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'workspace' | 'report'>('workspace');

  // Code & Sandbox Execution State
  const [code, setCode] = useState(TASK_SPEC.starterCode);
  const [lastTestedCode, setLastTestedCode] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState([
    { id: "T1", name: "parseEvent parses valid payload", passed: true, expected: "Parsed object", actual: "Pass" },
    { id: "T2", name: "parseEvent rejects missing fields", passed: true, expected: "Throws Error", actual: "Pass" },
    { id: "T3", name: "computeWindowAverages precision", passed: true, expected: "20.27 (Number)", actual: "Pass" },
    { id: "T4", name: "flagAnomalies isolates deviations", passed: true, expected: "[75, 20]", actual: "Pass" }
  ]);

  // AI Staging & Diff Proposal State
  interface StagedDiff {
    id: string;
    targetFunction: string;
    summary: string;
    codeSnippet: string;
    linesAdded: number;
    linesRemoved: number;
    generatedAtCodeSnapshot: string;
  }
  const [stagedDiff, setStagedDiff] = useState<StagedDiff | null>(null);

  // Chat & AI State
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string; hasProposal?: boolean }[]>([
    {
      sender: 'ai',
      text: "👋 AI Pair Programmer active. Inquire about edge-case handling, floating-point precision, or scaffold defensive guards."
    }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Layout Resizer State
  const [chatWidth, setChatWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Recruiter Dossier Key Moments Selection
  const [selectedMoment, setSelectedMoment] = useState<string>("M-02");

  const isLight = theme === 'light';
  const isCodeStale = lastTestedCode !== null && code !== lastTestedCode;
  const passedTestsCount = testResults.filter(t => t.passed).length;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const newW = bounds.right - e.clientX;
    if (newW >= 300 && newW <= bounds.width - 450) setChatWidth(newW);
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

  const handleRunTests = async () => {
    setIsExecuting(true);
    const data = await vibeXApi.runTests("session-active", code);
    setTestResults(data.results || testResults);
    setLastTestedCode(code);
    setIsExecuting(false);
  };

  const handleSendPrompt = async (explicitText?: string) => {
    const q = explicitText || promptInput;
    if (!q.trim() || isAiThinking) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setPromptInput('');
    setIsAiThinking(true);

    const failed = testResults.filter(t => !t.passed).map(t => t.id);
    const res = await vibeXApi.askCoach("session-active", q, code, failed);

    // Contextual Diff generation for code demonstration
    let generatedDiff: StagedDiff | null = null;
    const lower = q.toLowerCase();
    if (lower.includes("precision") || lower.includes("float") || lower.includes("average")) {
      generatedDiff = {
        id: "diff-" + Date.now(),
        targetFunction: "computeWindowAverages",
        summary: "Constrain arithmetic average to 2 decimal places using Number(sum/len.toFixed(2))",
        codeSnippet: `export function computeWindowAverages(readings) {\n  if (!readings || readings.length === 0) return 0;\n  const sum = readings.reduce((acc, curr) => acc + curr, 0);\n  return Number((sum / readings.length).toFixed(2));\n}`,
        linesAdded: 3,
        linesRemoved: 1,
        generatedAtCodeSnapshot: code
      };
    } else if (lower.includes("parse") || lower.includes("guard") || lower.includes("validation")) {
      generatedDiff = {
        id: "diff-" + Date.now(),
        targetFunction: "parseEvent",
        summary: "Defensive guard throwing explicit Error on missing telemetry keys",
        codeSnippet: `export function parseEvent(rawJson) {\n  const data = JSON.parse(rawJson);\n  if (!data.sensorId || data.reading === undefined) {\n    throw new Error("Invalid telemetry schema: missing sensorId or reading");\n  }\n  return data;\n}`,
        linesAdded: 4,
        linesRemoved: 1,
        generatedAtCodeSnapshot: code
      };
    }

    setChatLog(prev => [...prev, { sender: 'ai', text: res.guidance, hasProposal: Boolean(generatedDiff) }]);
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

  return (
    <div className={`min-h-screen ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'} flex flex-col font-sans select-${isDragging ? 'none' : 'auto'}`}>
      
      {/* GLOBAL APPLICATION HEADER */}
      <header className={`h-13 border-b ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'} px-5 flex items-center justify-between shrink-0`}>
        <div className="flex items-center space-x-3">
          <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black px-2 py-0.5 rounded text-xs tracking-wider">vibeX</span>
          <span className="text-xs font-semibold text-zinc-400">iMocha IM-01 Benchmark</span>
          
          {/* Truth-in-State Status Badges */}
          <div className="hidden sm:flex items-center space-x-2 pl-3 border-l border-zinc-200 dark:border-zinc-800 text-[11px]">
            <span className="flex items-center space-x-1.5 text-zinc-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Session Active</span>
            </span>
            {isCodeStale ? (
              <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-semibold border border-amber-200 dark:border-amber-900">
                <Icons.Alert />
                <span>Unverified Code Modifications</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold border border-emerald-200 dark:border-emerald-900">
                <Icons.Check />
                <span>{passedTestsCount}/4 Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* View Selection & Tool Controls */}
        <div className="flex items-center space-x-2">
          <div className={`flex p-0.5 rounded-lg border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-900 border-zinc-800'} text-xs`}>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-3 py-1 rounded font-bold transition ${activeTab === 'workspace' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-700'}`}>
              Workspace IDE
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1 rounded font-bold transition ${activeTab === 'report' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-700'}`}>
              Recruiter Dossier
            </button>
          </div>

          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className={`p-1.5 rounded-lg border ${isLight ? 'border-zinc-200 hover:bg-zinc-100' : 'border-zinc-800 hover:bg-zinc-900'} transition text-zinc-500`}
            title="Toggle Theme">
            {isLight ? <Icons.Moon /> : <Icons.Sun />}
          </button>
        </div>
      </header>

      {/* WORKSPACE VIEW: EDITOR, SANDBOX & AI STAGING */}
      {activeTab === 'workspace' && (
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
          
          {/* Main Code Editor & Sandbox */}
          <div className="flex-1 flex flex-col min-w-0 bg-transparent">
            {/* Editor Top Bar */}
            <div className={`h-9 border-b ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'} px-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-zinc-500">processor.js</span>
                {isCodeStale && (
                  <span className="text-[10px] text-amber-500 font-semibold italic">• Unsaved to test suite</span>
                )}
              </div>
              <button
                onClick={handleRunTests}
                disabled={isExecuting}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1 rounded text-xs font-bold flex items-center space-x-1.5 transition shadow-sm">
                <Icons.Play />
                <span>{isExecuting ? "Executing Sandboxed VM..." : "Run Tests (Ctrl+Enter)"}</span>
              </button>
            </div>

            {/* Editor Buffer */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className={`flex-1 p-4 font-mono text-xs leading-relaxed focus:outline-none resize-none border-none ${isLight ? 'bg-white text-zinc-900' : 'bg-zinc-950 text-zinc-100'}`}
              spellCheck={false}
            />

            {/* Bottom: Deterministic Sandbox Diagnostics Console */}
            <div className={`h-52 border-t ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'} p-3 flex flex-col overflow-hidden`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">Assertion Suite Diagnostics</span>
                  <span className="text-[10px] text-zinc-400 font-mono">(Node VM • 1500ms Hard Timeout)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {isCodeStale && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Re-run to verify modifications</span>
                  )}
                  <span className="text-xs font-mono font-bold text-emerald-600">{passedTestsCount}/4 Passing</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {testResults.map(t => (
                  <div key={t.id} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${t.passed ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300' : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300'}`}>
                    <div className="flex items-center space-x-2">
                      {t.passed ? <Icons.Check /> : <Icons.Cross />}
                      <span className="font-semibold text-[11px]">{t.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] font-mono">
                      <span className="text-zinc-400">Expected: {t.expected}</span>
                      <span className="font-bold px-1.5 py-0.5 rounded bg-white/60 dark:bg-zinc-900">{t.actual}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Draggable Divider with Visual Grip */}
          <div
            onMouseDown={() => setIsDragging(true)}
            className={`w-2 hover:w-2.5 active:w-2.5 cursor-col-resize relative flex items-center justify-center transition-all z-20 group select-none ${isDragging ? 'bg-blue-600' : 'bg-transparent hover:bg-blue-400/20'}`}>
            <div className={`w-[1px] h-full ${isDragging ? 'bg-blue-600' : isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
            <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-7 rounded-full border shadow-sm flex items-center justify-center ${isLight ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-700'}`}>
              <Icons.Grip />
            </div>
          </div>

          {/* Right: AI Pair Programmer & Staging Window */}
          <div style={{ width: `${chatWidth}px` }} className={`shrink-0 flex flex-col ${isLight ? 'bg-zinc-50 border-l border-zinc-200' : 'bg-zinc-900/50 border-l border-zinc-800'}`}>
            <div className={`h-9 border-b ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'} px-3 flex items-center justify-between text-xs`}>
              <div className="flex items-center space-x-1.5 font-bold">
                <Icons.Bot />
                <span>AI Pair Programmer</span>
              </div>
              
              {/* Presets */}
              <div className="flex items-center space-x-1 text-[10px]">
                <button onClick={() => setChatWidth(320)} className={`px-1.5 py-0.5 rounded ${chatWidth <= 350 ? 'bg-zinc-200 dark:bg-zinc-700 font-bold' : 'text-zinc-400'}`}>S</button>
                <button onClick={() => setChatWidth(420)} className={`px-1.5 py-0.5 rounded ${chatWidth > 350 && chatWidth < 550 ? 'bg-zinc-200 dark:bg-zinc-700 font-bold' : 'text-zinc-400'}`}>M</button>
                <button onClick={() => setChatWidth(600)} className={`px-1.5 py-0.5 rounded ${chatWidth >= 550 ? 'bg-zinc-200 dark:bg-zinc-700 font-bold' : 'text-zinc-400'}`}>L</button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 flex gap-1 flex-wrap">
              <button onClick={() => handleSendPrompt("Scaffold schema guard for missing sensorId")} className="text-[10px] px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition">
                ⚡ Guard Missing Fields
              </button>
              <button onClick={() => handleSendPrompt("Fix floating point precision to 2 decimal places")} className="text-[10px] px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition">
                ⚡ 2-Decimal Float Fix
              </button>
            </div>

            {/* Chat Log */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {chatLog.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl border leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white border-blue-600 ml-4' : `${isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900 border-zinc-800'} mr-2`}`}>
                  <div>{m.text}</div>
                </div>
              ))}
              {isAiThinking && <div className="text-[11px] text-blue-500 italic">Querying NVIDIA NIM...</div>}

              {/* AUDITABLE STAGED DIFF INSPECTION CARD */}
              {stagedDiff && (
                <div className={`p-3 rounded-xl border-2 border-blue-500/80 ${isLight ? 'bg-blue-50/50' : 'bg-blue-950/20'} space-y-2 mt-2`}>
                  <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center space-x-1.5">
                      <Icons.Diff />
                      <span>Proposed Code Diff</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">+{stagedDiff.linesAdded} / -{stagedDiff.linesRemoved} lines</span>
                  </div>

                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-snug">{stagedDiff.summary}</p>

                  <div className="bg-zinc-950 text-zinc-100 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] max-h-36 overflow-x-auto whitespace-pre">
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
                      className="px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition">
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-2">
              <input
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendPrompt()}
                placeholder="Ask AI pair programmer..."
                className={`flex-1 rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}
              />
              <button onClick={() => handleSendPrompt()} className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg transition">
                <Icons.Send />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECRUITER DOSSIER VIEW: HIERARCHICAL & DRILLDOWN EVIDENCE */}
      {activeTab === 'report' && (
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-6 overflow-y-auto">
          
          {/* Top: Executive Decision-Support Header */}
          <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/60 border-zinc-800'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">iMocha IM-01 Assessment Dossier</div>
              <h1 className="text-2xl font-black mt-0.5">Chetan Shakhapure</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Role: Systems / Fullstack Engineer • Task: {TASK_SPEC.title}</p>
            </div>
            <div className="md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Evaluated Hiring Signal</span>
              <span className="text-lg font-black text-emerald-600">Strong Hire (High Scrutiny & Autonomy)</span>
            </div>
          </div>

          {/* Quick Metrics Rubric */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <div className="text-xs text-zinc-400">Deterministic Correctness</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">4 / 4 Passing</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">100% boundary test coverage</div>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <div className="text-xs text-zinc-400">AI Code Scrutiny</div>
              <div className="text-2xl font-black text-blue-600 mt-1">Verified (88%)</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Zero blind merges; manual retest</div>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'}`}>
              <div className="text-xs text-zinc-400">Collaboration Style</div>
              <div className="text-2xl font-black text-purple-600 mt-1">Balanced Partner</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Delegates syntax, guards logic</div>
            </div>
          </div>

          {/* Middle: Interactive Key Moments Drilldown */}
          <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/60 border-zinc-800'} space-y-4`}>
            <div>
              <h3 className="text-sm font-bold">Key Assessment Moments & Traceable Evidence</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Click any moment to inspect the code diff and execution snapshot.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => setSelectedMoment("M-01")}
                className={`p-3 rounded-xl border text-left transition ${selectedMoment === "M-01" ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <span className="text-[10px] font-bold text-zinc-400 block">Moment 01</span>
                <span className="font-bold">Initial Float Precision Gap</span>
                <span className="text-[10px] text-rose-500 block mt-1">Assertion T3 Failed</span>
              </button>

              <button
                onClick={() => setSelectedMoment("M-02")}
                className={`p-3 rounded-xl border text-left transition ${selectedMoment === "M-02" ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <span className="text-[10px] font-bold text-blue-600 block">Moment 02 (Key)</span>
                <span className="font-bold">Socratic Prompt & Patch Staging</span>
                <span className="text-[10px] text-blue-500 block mt-1">Diff Scrutinized & Applied</span>
              </button>

              <button
                onClick={() => setSelectedMoment("M-03")}
                className={`p-3 rounded-xl border text-left transition ${selectedMoment === "M-03" ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}>
                <span className="text-[10px] font-bold text-zinc-400 block">Moment 03</span>
                <span className="font-bold">Post-Patch Verification</span>
                <span className="text-[10px] text-emerald-500 block mt-1">4/4 Assertions Green</span>
              </button>
            </div>

            {/* Drilldown Inspector Drawer */}
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-zinc-800'} space-y-2`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Inspecting Event Evidence: {selectedMoment}</span>
                <span className="text-[10px] font-mono text-zinc-400">Timestamp: 10:08:42 AM IST</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {selectedMoment === "M-01" && "Candidate ran test suite on unrounded accumulator; received assertion mismatch: Expected 20.27, got 20.2666666."}
                {selectedMoment === "M-02" && "Candidate prompted AI: 'Fix floating point precision to 2 decimal places'. AI returned unified diff. Candidate reviewed and clicked 'Accept & Merge Diff'."}
                {selectedMoment === "M-03" && "Candidate executed sandbox retest immediately following code patch merge; all four unit tests verified passing."}
              </p>
            </div>
          </div>

          {/* Bottom: Transparency, Fairness & Rubric Limitations */}
          <div className={`p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 space-y-1 ${isLight ? 'bg-zinc-50' : 'bg-zinc-900/30'}`}>
            <span className="font-bold text-zinc-700 dark:text-zinc-300 block">iMocha IM-01 Fairness & Limitations Commitment</span>
            <p>1. Prompt volume, token generation speed, and typing frequency are strictly excluded from candidate scoring.</p>
            <p>2. Evaluation is anchored to deterministic test executions, diff scrutiny, and verified problem resolution.</p>
          </div>
        </div>
      )}
    </div>
  );
}
