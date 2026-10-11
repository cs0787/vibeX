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
          <h2 className="text-red-600 font-bold text-lg">Application Exception Caught</h2>
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
  Sparkles: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
  Check: () => <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Cross: () => <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Play: () => <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  Bot: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  Send: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
  Shield: () => <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Layers: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>,
  Code: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>,
  FileText: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  UserCheck: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M8.5 11a4 4 0 100-8 4 4 0 000 8zM20 8l-4 4-2-2"/></svg>,
  CopyCheck: () => <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
};

const ASSESSMENT_TASKS = [
  {
    id: "task-iot-stream",
    title: "Real-Time Telemetry Stream Processor",
    track: "Backend & Systems",
    level: "Mid-Senior Level",
    estimatedMinutes: 30,
    guidance: [
      { id: "req-1", text: "parseEvent(rawJson): Safely parse JSON strings. Reject corrupted payloads or packets missing sensorId or reading (must throw an Error)." },
      { id: "req-2", text: "computeWindowAverages(readings): Compute arithmetic average constrained to exactly 2 decimal places (handling IEEE-754 precision)." },
      { id: "req-3", text: "flagAnomalies(readings, baseline, maxDeviation): Return readings where Math.abs(reading - baseline) > maxDeviation." }
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
`,
    tests: [
      { id: "T1", name: "parseEvent parses valid IoT payloads", passed: true, actual: "Pass" },
      { id: "T2", name: "parseEvent rejects corrupt payload & missing fields", passed: true, actual: "Pass" },
      { id: "T3", name: "computeWindowAverages handles 2-decimal precision", passed: true, actual: "Pass" },
      { id: "T4", name: "flagAnomalies isolates positive and negative deviations", passed: true, actual: "Pass" }
    ]
  }
];

function MainApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'workspace' | 'journey' | 'report' | 'candidate_feedback'>('workspace');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const currentTask = ASSESSMENT_TASKS[0];
  const [code, setCode] = useState(currentTask.starterCode);
  const [testResults, setTestResults] = useState(currentTask.tests);
  const [isExecuting, setIsExecuting] = useState(false);

  const [currentJourneyPhase, setCurrentJourneyPhase] = useState<'Planning' | 'Prompting' | 'Testing' | 'Fixing'>('Planning');
  const [journeyTimeline, setJourneyTimeline] = useState([
    { id: "J-01", phase: "Planning", title: "Assessment Onboarded", time: "10:00:15", detail: "Candidate reviewed requirements and initialized workspace." },
    { id: "J-02", phase: "Prompting", title: "Clarified Schema Guards", time: "10:04:22", detail: "Consulted AI assistant on defensive property checks." },
    { id: "J-03", phase: "Testing", title: "Initial Sandbox Run", time: "10:07:45", detail: "Executed tests; detected unrounded float assertions." },
    { id: "J-04", phase: "Fixing", title: "Integrated Precision Safeguard", time: "10:09:12", detail: "Applied Number(avg.toFixed(2)); verified 4/4 assertions green." }
  ]);

  const [coachMode, setCoachMode] = useState<'socratic' | 'pair_programmer'>('pair_programmer');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'ai'; text: string; codeSnippet?: string }[]>([
    {
      sender: 'ai',
      text: "👋 Welcome! I am your vibeX AI Pair Programmer powered by NVIDIA NIM. Ask me to explain code, scaffold validation guards, or fix edge cases."
    }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const isLight = theme === 'light';
  const containerTheme = isLight ? 'bg-white text-zinc-900' : 'bg-zinc-950 text-zinc-100';
  const surfaceTheme = isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800';
  const cardTheme = isLight ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/60 border-zinc-800';
  const borderTheme = isLight ? 'border-zinc-200' : 'border-zinc-800';
  const mutedText = isLight ? 'text-zinc-500' : 'text-zinc-400';

  const handleRunTests = async () => {
    setIsExecuting(true);
    setCurrentJourneyPhase('Testing');
    const data = await vibeXApi.runTests("session-id", code);
    setTestResults(data.results || currentTask.tests);
    setIsExecuting(false);

    setJourneyTimeline(prev => [
      ...prev,
      {
        id: `J-RUN-${Date.now()}`,
        phase: "Testing",
        title: "Sandbox Assertion Suite Executed",
        time: new Date().toLocaleTimeString(),
        detail: "Evaluated code against 4 automated unit & boundary test cases."
      }
    ]);
  };

  const handleAiPrompt = async (explicitText?: string) => {
    const q = explicitText || promptInput;
    if (!q.trim()) return;

    setCurrentJourneyPhase('Prompting');
    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setPromptInput('');
    setIsAiThinking(true);

    const failed = testResults.filter(t => !t.passed).map(t => t.id);
    const res = await vibeXApi.askCoach("session-id", q, code, failed);

    let generatedSnippet = "";
    const lower = q.toLowerCase();
    if (lower.includes("parse") || lower.includes("guard") || lower.includes("validation")) {
      generatedSnippet = `export function parseEvent(rawJson) {
  const data = JSON.parse(rawJson);
  if (!data.sensorId || data.reading === undefined) {
    throw new Error("Invalid telemetry schema: missing sensorId or reading");
  }
  return data;
}`;
    } else if (lower.includes("float") || lower.includes("average") || lower.includes("round")) {
      generatedSnippet = `export function computeWindowAverages(readings) {
  if (!readings || readings.length === 0) return 0;
  const sum = readings.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / readings.length).toFixed(2));
}`;
    }

    setChatLog(prev => [
      ...prev,
      {
        sender: 'ai',
        text: res.guidance,
        codeSnippet: generatedSnippet || undefined
      }
    ]);
    setIsAiThinking(false);

    setJourneyTimeline(prev => [
      ...prev,
      {
        id: `J-PROMPT-${Date.now()}`,
        phase: "Prompting",
        title: `AI Prompt Dispatched`,
        time: new Date().toLocaleTimeString(),
        detail: `Candidate asked: "${q.slice(0, 50)}..."`
      }
    ]);
  };

  const handleApplySnippet = (snippet: string) => {
    setCurrentJourneyPhase('Fixing');
    setCode(prev => {
      const funcNameMatch = snippet.match(/function\s+(\w+)/);
      if (funcNameMatch && prev.includes(funcNameMatch[1])) {
        const regex = new RegExp(`export function ${funcNameMatch[1]}\\([\\s\\S]*?\\n\\}`, 'm');
        return prev.replace(regex, snippet.trim());
      }
      return prev + "\n\n" + snippet;
    });

    setJourneyTimeline(prev => [
      ...prev,
      {
        id: `J-APPLY-${Date.now()}`,
        phase: "Fixing",
        title: "Code Scrutinized & Applied",
        time: new Date().toLocaleTimeString(),
        detail: "Candidate verified AI suggestion and updated editor buffer."
      }
    ]);
  };

  return (
    <div className={`min-h-screen ${containerTheme} flex flex-col font-sans transition-colors duration-150`}>
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-lg w-full ${cardTheme} border rounded-2xl p-7 shadow-2xl space-y-5`}>
            <div className="flex items-center space-x-3">
              <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black px-2.5 py-1 rounded text-xs tracking-wider">vibeX</span>
              <div>
                <h3 className="text-base font-bold">Welcome to Vibe Coding</h3>
                <p className={`text-xs ${mutedText}`}>iMocha AI-Era Assessment Framework</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${borderTheme} ${surfaceTheme} space-y-3 text-xs leading-relaxed`}>
              <div className="font-bold flex items-center space-x-1.5 text-emerald-600">
                <Icons.Shield />
                <span>Fairness & Transparency Guarantee</span>
              </div>
              <p>• Build software with an AI assistant just like real work.</p>
              <p>• <strong>Prompt count & token speed are NOT scored.</strong> You will never be penalized for asking questions.</p>
              <p>• Evaluation focuses on verified test outcomes, code scrutiny, and critical reasoning.</p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button 
                onClick={() => { setIsPracticeMode(true); setShowOnboarding(false); }}
                className={`flex-1 py-2.5 rounded-xl border ${borderTheme} text-xs font-semibold hover:border-zinc-400 transition`}>
                Start in Practice Mode
              </button>
              <button 
                onClick={() => { setIsPracticeMode(false); setShowOnboarding(false); }}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold py-2.5 rounded-xl text-xs transition">
                Begin Live Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className={`h-14 border-b ${borderTheme} ${surfaceTheme} px-6 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <span className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black px-2.5 py-1 rounded text-xs tracking-wider">vibeX</span>
          <span className="text-xs font-semibold text-zinc-500">iMocha IM-01</span>
          {isPracticeMode && (
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">Practice Mode</span>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center p-1 rounded-lg border ${borderTheme} ${cardTheme} text-xs`}>
          <button 
            onClick={() => setActiveTab('workspace')} 
            className={`px-3 py-1 rounded font-semibold transition flex items-center space-x-1.5 ${activeTab === 'workspace' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}>
            <Icons.Code />
            <span>Workspace</span>
          </button>
          <button 
            onClick={() => setActiveTab('journey')} 
            className={`px-3 py-1 rounded font-semibold transition flex items-center space-x-1.5 ${activeTab === 'journey' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}>
            <Icons.Layers />
            <span>Candidate Journey</span>
          </button>
          <button 
            onClick={() => setActiveTab('report')} 
            className={`px-3 py-1 rounded font-semibold transition flex items-center space-x-1.5 ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}>
            <Icons.FileText />
            <span>1-Page Skill Report</span>
          </button>
          <button 
            onClick={() => setActiveTab('candidate_feedback')} 
            className={`px-3 py-1 rounded font-semibold transition flex items-center space-x-1.5 ${activeTab === 'candidate_feedback' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}>
            <Icons.UserCheck />
            <span>Candidate Growth</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setTheme(isLight ? 'dark' : 'light')} 
            className={`p-1.5 rounded-lg border ${borderTheme} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition`}
            title="Toggle theme">
            {isLight ? <Icons.Moon /> : <Icons.Sun />}
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">
            Finalize & Submit
          </button>
        </div>
      </header>

      {/* WORKSPACE TAB */}
      {activeTab === 'workspace' && (
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Task Guidance Column */}
          <div className={`col-span-3 border-r ${borderTheme} p-5 overflow-y-auto ${surfaceTheme} text-xs space-y-4`}>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Benchmark Task</span>
              <h2 className="font-bold text-sm mt-0.5">{currentTask.title}</h2>
              <div className="text-[10px] text-zinc-500 font-semibold mt-1">{currentTask.level} • {currentTask.estimatedMinutes} mins</div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider block">Requirements Checklist</span>
              {currentTask.guidance.map(req => (
                <div key={req.id} className={`${cardTheme} border p-3 rounded-xl font-mono text-[11px] leading-relaxed flex items-start space-x-2`}>
                  <Icons.Check />
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            <div className={`p-3 rounded-xl border ${borderTheme} bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 text-[11px]`}>
              <span className="font-bold block">Current Phase: {currentJourneyPhase}</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Captured transparently in candidate journey.</span>
            </div>
          </div>

          {/* IDE Editor & Sandbox Column */}
          <div className={`col-span-6 flex flex-col border-r ${borderTheme} ${isLight ? 'bg-white' : 'bg-zinc-950'}`}>
            <div className={`h-10 border-b ${borderTheme} px-4 flex justify-between items-center ${surfaceTheme}`}>
              <span className="text-xs font-mono text-zinc-500">processor.js</span>
              <button 
                onClick={handleRunTests} 
                disabled={isExecuting}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center space-x-1.5 transition">
                <Icons.Play />
                <span>{isExecuting ? "Executing..." : "Run Tests"}</span>
              </button>
            </div>

            <textarea 
              value={code} 
              onChange={e => { setCode(e.target.value); setCurrentJourneyPhase('Fixing'); }} 
              className={`flex-1 bg-transparent p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed border-none ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`} 
              spellCheck={false}
            />

            <div className={`h-48 border-t ${borderTheme} ${surfaceTheme} p-3 overflow-y-auto text-xs`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs">Deterministic Assertion Sandbox</span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {testResults.filter(t => t.passed).length}/{testResults.length} Passed
                </span>
              </div>

              <div className="space-y-1.5">
                {testResults.map(t => (
                  <div key={t.id} className={`p-2 rounded-lg border flex justify-between items-center ${t.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-300'}`}>
                    <div className="flex items-center space-x-2">
                      {t.passed ? <Icons.Check /> : <Icons.Cross />}
                      <span className="font-semibold text-xs">{t.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold">{t.actual}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Pair Programmer Column */}
          <div className={`col-span-3 flex flex-col ${surfaceTheme}`}>
            <div className={`h-10 border-b ${borderTheme} px-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-2 text-xs font-bold">
                <Icons.Bot />
                <span>AI Pair Programmer</span>
              </div>
              <div className="flex items-center text-[10px] border border-zinc-200 dark:border-zinc-800 rounded p-0.5">
                <button 
                  onClick={() => setCoachMode('socratic')} 
                  className={`px-1.5 py-0.5 rounded ${coachMode === 'socratic' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400'}`}>
                  Coach
                </button>
                <button 
                  onClick={() => setCoachMode('pair_programmer')} 
                  className={`px-1.5 py-0.5 rounded ${coachMode === 'pair_programmer' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400'}`}>
                  Pair
                </button>
              </div>
            </div>

            <div className={`p-2 border-b ${borderTheme} flex gap-1 flex-wrap`}>
              <button 
                onClick={() => handleAiPrompt("How should I reject corrupt packets in parseEvent?")} 
                className={`text-[10px] ${cardTheme} border px-2 py-1 rounded font-medium hover:border-zinc-400 transition`}>
                ⚡ Scaffold Validation
              </button>
              <button 
                onClick={() => handleAiPrompt("How to solve IEEE-754 floating point rounding in JavaScript?")} 
                className={`text-[10px] ${cardTheme} border px-2 py-1 rounded font-medium hover:border-zinc-400 transition`}>
                ⚡ Fix Float Rounding
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {chatLog.map((msg, i) => (
                <div key={i} className={`p-3 rounded-xl border leading-relaxed space-y-2 ${msg.sender === 'user' ? 'bg-blue-600 text-white border-blue-600 ml-4 font-medium' : `${cardTheme} mr-4`}`}>
                  <div>{msg.text}</div>
                  {msg.codeSnippet && (
                    <div className="bg-zinc-950 text-zinc-100 p-2.5 rounded-lg border border-zinc-800 font-mono text-[10px] space-y-2">
                      <pre className="overflow-x-auto">{msg.codeSnippet}</pre>
                      <button 
                        onClick={() => handleApplySnippet(msg.codeSnippet!)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-1 rounded text-[10px] flex items-center space-x-1 transition shadow-sm">
                        <Icons.CopyCheck />
                        <span>Review & Apply to Editor</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isAiThinking && <div className="text-[11px] text-blue-600 italic">Querying NVIDIA NIM...</div>}
            </div>

            <div className={`p-3 border-t ${borderTheme} flex items-center space-x-2`}>
              <input 
                type="text" 
                value={promptInput} 
                onChange={e => setPromptInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAiPrompt()} 
                placeholder={coachMode === 'socratic' ? "Ask coach to explain..." : "Ask pair programmer to code..."}
                className={`flex-1 ${cardTheme} border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600`}
              />
              <button onClick={() => handleAiPrompt()} className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 p-1.5 rounded-lg hover:opacity-90 transition">
                <Icons.Send />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOURNEY TAB */}
      {activeTab === 'journey' && (
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Candidate Journey Capture</span>
            <h1 className="text-2xl font-black mt-1">Showing How You Worked</h1>
            <p className={`text-xs ${mutedText} mt-1`}>Your complete process is captured across four verifiable phases in a transparent event stream.</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {['Planning', 'Prompting', 'Testing', 'Fixing'].map((p, idx) => (
              <div key={p} className={`${cardTheme} border p-4 rounded-xl space-y-1`}>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Phase {idx + 1}</span>
                <h3 className="text-sm font-bold">{p}</h3>
                <p className={`text-[11px] ${mutedText}`}>
                  {p === 'Planning' && "Decomposed task & verified requirements."}
                  {p === 'Prompting' && "Formulated targeted queries to AI assistant."}
                  {p === 'Testing' && "Executed sandboxed unit assertions."}
                  {p === 'Fixing' && "Refactored code and resolved edge cases."}
                </p>
              </div>
            ))}
          </div>

          <div className={`${cardTheme} border p-6 rounded-2xl space-y-3`}>
            <h3 className="text-sm font-bold">Chronological Journey Telemetry</h3>
            <div className="space-y-2.5">
              {journeyTimeline.map(item => (
                <div key={item.id} className={`p-3.5 rounded-xl border ${borderTheme} ${surfaceTheme} flex items-center justify-between text-xs`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-950">{item.phase}</span>
                      <span className="font-bold">{item.title}</span>
                    </div>
                    <p className={`text-[11px] ${mutedText}`}>{item.detail}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1-PAGE RECRUITER REPORT TAB */}
      {activeTab === 'report' && (
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className={`${cardTheme} border p-6 rounded-2xl flex justify-between items-center`}>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">1-Page Recruiter Skill Report</span>
              <h1 className="text-2xl font-black mt-1">Chetan Shakhapure</h1>
              <p className={`text-xs ${mutedText} mt-0.5`}>Task: {currentTask.title} • Duration: 18 mins</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Overall Verdict</span>
              <span className="text-lg font-black text-emerald-600">Recommended (Strong Autonomy & Scrutiny)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={`${cardTheme} border p-4 rounded-xl`}>
              <div className={`text-xs ${mutedText}`}>Deterministic Test Pass</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">100%</div>
              <div className={`text-[10px] ${mutedText} mt-1`}>4 of 4 assertions passed</div>
            </div>
            <div className={`${cardTheme} border p-4 rounded-xl`}>
              <div className={`text-xs ${mutedText}`}>Intent Clarity Rating</div>
              <div className="text-2xl font-black text-blue-600 mt-1">High (92%)</div>
              <div className={`text-[10px] ${mutedText} mt-1`}>Precise, well-scoped prompts</div>
            </div>
            <div className={`${cardTheme} border p-4 rounded-xl`}>
              <div className={`text-xs ${mutedText}`}>AI Output Scrutiny</div>
              <div className="text-2xl font-black text-purple-600 mt-1">88% Verified</div>
              <div className={`text-[10px] ${mutedText} mt-1`}>Inspected & tested diffs before merge</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardTheme} border p-5 rounded-xl space-y-2`}>
              <h3 className="font-bold text-emerald-600 flex items-center space-x-1.5 text-sm">
                <Icons.Check />
                <span>Demonstrated Strengths</span>
              </h3>
              <ul className={`list-disc pl-4 space-y-1.5 text-xs ${mutedText}`}>
                <li><strong>Defensive schema validation:</strong> Enforced error throws on corrupted payloads.</li>
                <li><strong>High code scrutiny:</strong> Candidate edited and reviewed AI output rather than blind copy-pasting.</li>
                <li><strong>Systematic verification loop:</strong> Executed sandbox tests immediately after code adjustments.</li>
              </ul>
            </div>

            <div className={`${cardTheme} border p-5 rounded-xl space-y-2`}>
              <h3 className="font-bold text-amber-600 flex items-center space-x-1.5 text-sm">
                <Icons.Sparkles />
                <span>Identified Growth Gaps</span>
              </h3>
              <ul className={`list-disc pl-4 space-y-1.5 text-xs ${mutedText}`}>
                <li>Initial submission overlooked IEEE-754 floating precision before running retests.</li>
                <li>Could author custom assertions for uninitialized array payloads.</li>
              </ul>
            </div>
          </div>

          <div className={`${cardTheme} border p-6 rounded-2xl space-y-4`}>
            <h3 className="text-sm font-bold">Evidence Anchored in Candidate Work</h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${borderTheme} ${surfaceTheme} space-y-1.5`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Example 1: Intent Clarity & Error Boundary Enforcement</span>
                  <span className="text-[10px] font-mono text-blue-600">Event Trace: J-02</span>
                </div>
                <p className={`text-xs ${mutedText}`}>Candidate queried: <em>"Explain how to validate sensorId and reading without crashing"</em>. Resulted in explicit defensive guard block in <code>parseEvent</code>.</p>
              </div>

              <div className={`p-4 rounded-xl border ${borderTheme} ${surfaceTheme} space-y-1.5`}>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Example 2: Verification of Floating Precision</span>
                  <span className="text-[10px] font-mono text-blue-600">Event Trace: J-04</span>
                </div>
                <p className={`text-xs ${mutedText}`}>Candidate modified <code>computeWindowAverages</code> with <code>Number((sum / len).toFixed(2))</code> after identifying rounding gap in test run T3.</p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${borderTheme} ${surfaceTheme} text-xs text-zinc-600 dark:text-zinc-400 flex items-start space-x-2`}>
            <Icons.Shield />
            <div>
              <strong>iMocha Fairness Audit:</strong> Prompt count, token quantity, and typing speed are strictly excluded from scoring. Assessment evaluates verified test outcomes and critical reasoning.
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE FEEDBACK TAB */}
      {activeTab === 'candidate_feedback' && (
        <div className="flex-1 p-8 max-w-3xl mx-auto w-full space-y-6 text-xs">
          <div className={`${cardTheme} border p-6 rounded-2xl`}>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Candidate Growth Dossier</span>
            <h1 className="text-2xl font-black mt-1">Hello, Chetan Shakhapure</h1>
            <p className={`mt-2 ${mutedText} leading-relaxed`}>Review your personalized feedback from the <strong>{currentTask.title}</strong> assessment.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardTheme} border p-5 rounded-xl space-y-2`}>
              <h3 className="font-bold text-emerald-600 flex items-center space-x-1.5 text-sm">
                <Icons.Check />
                <span>Verified Strengths</span>
              </h3>
              <ul className={`list-disc pl-4 space-y-1.5 ${mutedText}`}>
                <li>Defensive schema verification guards on JSON payload inputs</li>
                <li>Systematic test verification loops after code modifications</li>
                <li>Collaborative prompt formulation focused on architectural constraints</li>
              </ul>
            </div>

            <div className={`${cardTheme} border p-5 rounded-xl space-y-2`}>
              <h3 className="font-bold text-blue-600 flex items-center space-x-1.5 text-sm">
                <Icons.Sparkles />
                <span>Actionable Growth Areas</span>
              </h3>
              <ul className={`list-disc pl-4 space-y-1.5 ${mutedText}`}>
                <li>Review IEEE-754 precision constraints when computing running totals</li>
                <li>Enforce explicit input validation guards for empty arrays</li>
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
