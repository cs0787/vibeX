import React, { useState } from 'react';
import { 
  Bot, Play, CheckCircle2, XCircle, Send, 
  BarChart3, UserCheck, ShieldCheck, ArrowRight,
  Code2, Terminal, Briefcase, GraduationCap,
  LogOut, Clock, Search, ChevronRight,
  Sparkles, Check, RefreshCw
} from 'lucide-react';

// Benchmark Task Specification
const BENCHMARK_TASK = {
  id: "task-iot-stream",
  title: "Real-Time Telemetry Stream Processor",
  level: "Senior / Mid-Level Software Engineer",
  timeLimitMinutes: 45,
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

// Initial Mock Pipeline for Recruiter Evaluation
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
      {
        id: "EV-01",
        title: "Defensive Validation Architecture",
        desc: "Enforced schema guards throwing custom Error objects for corrupted telemetry packets.",
        status: "Verified",
        eventLink: "EV_CODE_COMMIT_2"
      },
      {
        id: "EV-02",
        title: "Targeted Socratic Prompting",
        desc: "Consulted AI on IEEE-754 precision constraints; verified logic before accepting output.",
        status: "Verified",
        eventLink: "EV_AI_PROMPT_1"
      }
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
      {
        id: "EV-03",
        title: "Float Rounding Precision Gap",
        desc: "Missed 2-decimal constraint on arithmetic aggregation test assertion.",
        status: "Flagged",
        eventLink: "EV_TEST_FAIL_3"
      }
    ]
  },
  {
    id: "cand-03",
    name: "Priya Nair",
    role: "Distributed Systems Lead",
    verdict: "Strong Hire",
    score: 100,
    aiFluency: "Mastery",
    testsPassed: "4 / 4",
    duration: "14 mins",
    evidence: [
      {
        id: "EV-04",
        title: "Zero Regression Pipeline",
        desc: "Passed all boundary and edge-case assertions on initial verification cycle.",
        status: "Verified",
        eventLink: "EV_TEST_RUN_1"
      }
    ]
  }
];

export default function App() {
  // User Session & Role State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'candidate' | 'recruiter' } | null>(null);
  const [authRole, setAuthRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');

  // Candidate Assessment State
  const [candidateView, setCandidateView] = useState<'workspace' | 'feedback'>('workspace');
  const [code, setCode] = useState(BENCHMARK_TASK.starterCode);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'coach'; text: string }[]>([
    { sender: 'coach', text: "Welcome to vibeX! I'm your Socratic AI Coach. I won't write your code, but ask me anytime about edge cases, syntax, or debugging." }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Recruiter Dashboard State
  const [selectedCandidate, setSelectedCandidate] = useState(MOCK_CANDIDATES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // ----------------------------------------------------
  // Test Runner Handler
  // ----------------------------------------------------
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
    }, 450);
  };

  // ----------------------------------------------------
  // Socratic AI Coach Handler
  // ----------------------------------------------------
  const handleAskCoach = (presetPrompt?: string) => {
    const q = presetPrompt || coachInput;
    if (!q.trim()) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setCoachInput('');
    setIsCoachThinking(true);

    setTimeout(() => {
      let reply = "💡 **Coach Insight**: Check boundary conditions and verify your edge-case assertions in the test console.";
      const query = q.toLowerCase();
      if (query.includes("parse") || query.includes("corrupt") || query.includes("error")) {
        reply = "💡 **Socratic Guidance**: When parsing JSON, an object might parse fine but lack necessary fields. How can you inspect `sensorId` and throw an explicit `new Error()` before returning?";
      } else if (query.includes("float") || query.includes("average") || query.includes("round")) {
        reply = "💡 **Socratic Guidance**: In JavaScript, `0.1 + 0.2 !== 0.3`. To format numbers reliably, check `toFixed(2)` and remember to convert the result back to a number with `Number()`!";
      } else if (query.includes("anomaly") || query.includes("deviation")) {
        reply = "💡 **Socratic Guidance**: Deviations occur in both directions (+ and -). Have you tried wrapping the delta in `Math.abs(val - baseline)`?";
      }

      setChatLog(prev => [...prev, { sender: 'coach', text: reply }]);
      setIsCoachThinking(false);
    }, 600);
  };

  // ----------------------------------------------------
  // 1. AUTHENTICATION VIEW (Role Switcher & Login)
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>iMocha IM-01 AI-Era Assessment</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">vibeX</h1>
            <p className="text-xs text-slate-400 mt-1.5">Sign in to experience the AI-collaborative evaluation platform</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setAuthRole('candidate')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${authRole === 'candidate' ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <GraduationCap className={`w-5 h-5 mb-2 ${authRole === 'candidate' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Candidate</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Take assessment</div>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setAuthRole('recruiter')}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${authRole === 'recruiter' ? 'bg-indigo-600/15 border-indigo-500 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <Briefcase className={`w-5 h-5 mb-2 ${authRole === 'recruiter' ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold text-white">Recruiter</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Inspect dossiers</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Demo Logins */}
          <div className="space-y-3">
            <button 
              onClick={() => setCurrentUser({ name: authName || (authRole === 'candidate' ? "Chetan Shakhapure" : "Sarah Jenkins"), role: authRole })}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-900/40">
              <span>Continue as {authRole === 'candidate' ? 'Candidate' : 'Recruiter'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Sandbox Demo Access</span>
              <button 
                onClick={() => setCurrentUser({ name: authRole === 'candidate' ? "Sarah Jenkins" : "Chetan Shakhapure", role: authRole === 'candidate' ? 'recruiter' : 'candidate' })}
                className="text-indigo-400 hover:underline">
                Switch to {authRole === 'candidate' ? 'Recruiter' : 'Candidate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. RECRUITER PORTAL VIEW
  // ----------------------------------------------------
  if (currentUser.role === 'recruiter') {
    const filteredCandidates = MOCK_CANDIDATES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Recruiter Topbar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-indigo-600 text-white font-black px-2.5 py-1 rounded-lg text-xs tracking-wider">vibeX</span>
            <span className="text-xs font-semibold text-slate-400">Recruiter Talent Intelligence Portal</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium">{currentUser.name} (Hiring Lead)</span>
            </div>
            <button 
              onClick={() => setCurrentUser(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Recruiter Workspace Split */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left: Candidate Pipeline List */}
          <div className="col-span-4 border-r border-slate-800 bg-slate-900/20 p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Evaluated Candidates</h2>
                <p className="text-[11px] text-slate-400">IM-01 Benchmark Track</p>
              </div>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full font-bold border border-indigo-500/20">
                {filteredCandidates.length} Submissions
              </span>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search candidate or role..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Candidates Card List */}
            <div className="flex-1 overflow-y-auto space-y-2.5">
              {filteredCandidates.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCandidate(c)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${selectedCandidate.id === c.id ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-950' : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {c.verdict}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{c.role}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Pass: {c.testsPassed}</span>
                    <span>Score: <strong className="text-indigo-400">{c.score}%</strong></span>
                    <span>{c.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Candidate Inspectable Dossier */}
          <div className="col-span-8 p-8 overflow-y-auto space-y-6">
            {/* Executive Summary Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Candidate Skill Dossier</span>
                  <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Inspectable Evidence</span>
                </div>
                <h1 className="text-2xl font-black text-white mt-1">{selectedCandidate.name}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCandidate.role} • Assessment Time: {selectedCandidate.duration}</p>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Evaluation Verdict</div>
                <div className="text-lg font-bold text-emerald-400">{selectedCandidate.verdict}</div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-semibold">Deterministic Pass Rate</div>
                <div className="text-3xl font-black text-indigo-400 mt-1">{selectedCandidate.score}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Based on 4/4 isolated sandbox unit tests</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-semibold">AI Fluency Persona</div>
                <div className="text-xl font-bold text-emerald-400 mt-1.5">{selectedCandidate.aiFluency}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Socratic engagement & prompt precision</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-semibold">Verification Velocity</div>
                <div className="text-3xl font-black text-purple-400 mt-1">94%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Failure-to-fix validation loop</div>
              </div>
            </div>

            {/* Inspectable Evidence Chain (IM-01 Core Deliverable) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200">Anchored Evidence Chains</h3>
              <p className="text-xs text-slate-400">All findings are mathematically anchored to immutable telemetry timestamps.</p>

              <div className="space-y-3 mt-2">
                {selectedCandidate.evidence.map(item => (
                  <div key={item.id} className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{item.title}</span>
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                        Trace: {item.eventLink}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* iMocha Fairness Audit Notice */}
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">iMocha Fairness Guarantee</strong>: Prompt count and raw token quantity are explicitly excluded from scoring. Assessment evaluates verified test outcomes and critical reasoning.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. CANDIDATE WORKSPACE VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Candidate Topbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/80 px-6 flex items-center justify-between backdrop-blur">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 text-white font-black px-2.5 py-1 rounded-lg text-xs tracking-wider">vibeX</span>
          <span className="text-xs font-semibold text-slate-400">Candidate IDE Workspace</span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button 
            onClick={() => setCandidateView('workspace')}
            className={`px-3 py-1.5 rounded-lg transition ${candidateView === 'workspace' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            IDE & Workspace
          </button>
          <button 
            onClick={() => setCandidateView('feedback')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${candidateView === 'feedback' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Growth Dossier</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs text-amber-400 bg-amber-950/30 border border-amber-800/40 px-3 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono font-bold">34:12</span>
          </div>
          <button 
            onClick={() => setCandidateView('feedback')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-950">
            <span>Submit Solution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setCurrentUser(null)}
            className="text-slate-400 hover:text-white p-1 rounded transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Candidate Tab 1: Live IDE Workspace */}
      {candidateView === 'workspace' && (
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left Drawer: Benchmark Task Specs */}
          <div className="col-span-3 border-r border-slate-800 p-5 overflow-y-auto bg-slate-900/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Benchmark Task</span>
            <h2 className="text-sm font-bold text-white mt-1">{BENCHMARK_TASK.title}</h2>
            <div className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
              {BENCHMARK_TASK.level}
            </div>

            <div className="mt-4 text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-line">
              {BENCHMARK_TASK.instructions}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fairness Policy</span>
              </div>
              <p>You may ask the AI Coach as many questions as needed. Only verified correctness and reasoning are evaluated.</p>
            </div>
          </div>

          {/* Middle: Live Code Editor & Assertion Console */}
          <div className="col-span-6 flex flex-col border-r border-slate-800 bg-slate-950">
            {/* Editor Toolbar */}
            <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/40">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>solution.js</span>
              </span>
              <button 
                onClick={handleRunTests}
                disabled={isExecuting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm">
                <Play className="w-3 h-3 fill-current" />
                <span>{isExecuting ? "Evaluating..." : "Run Tests"}</span>
              </button>
            </div>

            {/* Code Input Area */}
            <textarea 
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 bg-transparent p-5 font-mono text-xs focus:outline-none resize-none text-slate-200 leading-relaxed border-none selection:bg-indigo-800"
              spellCheck={false}
            />

            {/* Deterministic Test Runner Console */}
            <div className="h-48 border-t border-slate-800 bg-slate-900/50 p-3.5 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sandbox Test Assertions</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {testResults.length > 0 && `${testResults.filter(t => t.passed).length} / ${testResults.length} Passed`}
                </span>
              </div>

              {testResults.length === 0 ? (
                <div className="text-xs text-slate-500 italic mt-6 text-center">Click "Run Tests" to execute against the benchmark assertions.</div>
              ) : (
                <div className="space-y-1.5">
                  {testResults.map(t => (
                    <div key={t.id} className={`p-2 rounded-xl border text-xs flex items-center justify-between ${t.passed ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/20 border-rose-800/40 text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {t.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className="font-medium">{t.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-mono text-[10px]">
                        <span>{t.time}</span>
                        {t.error && <span className="text-rose-400">({t.error})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Drawer: Socratic AI Coach */}
          <div className="col-span-3 flex flex-col bg-slate-900/20">
            <div className="h-10 border-b border-slate-800 px-4 flex items-center space-x-2 bg-slate-900/40">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">Socratic AI Coach</span>
            </div>

            {/* Quick Socratic Question Chips */}
            <div className="p-2.5 border-b border-slate-800 flex flex-wrap gap-1.5">
              <button 
                onClick={() => handleAskCoach("How should I reject corrupt packets in parseEvent?")}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300 transition">
                Hint: Packet Validation
              </button>
              <button 
                onClick={() => handleAskCoach("Why does float precision fail on computeWindowAverages?")}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-300 transition">
                Hint: Float Rounding
              </button>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatLog.map((msg, i) => (
                <div key={i} className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-950 border border-indigo-800 text-indigo-200 ml-4' : 'bg-slate-900 border border-slate-800 text-slate-200 mr-4 shadow-sm'}`}>
                  {msg.text}
                </div>
              ))}
              {isCoachThinking && <div className="text-xs text-indigo-400 italic">Coach thinking...</div>}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-800 flex items-center space-x-2">
              <input 
                type="text" 
                value={coachInput}
                onChange={e => setCoachInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskCoach()}
                placeholder="Ask coach for guidance..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-600"
              />
              <button onClick={() => handleAskCoach()} className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Tab 2: Candidate Growth Dossier */}
      {candidateView === 'feedback' && (
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Candidate Personal Growth Dossier</span>
            <h1 className="text-2xl font-black text-white mt-1">Hello, {currentUser.name}</h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              You completed the {BENCHMARK_TASK.title} assessment. Below is your skill breakdown, including verified strengths and actionable learning suggestions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                <li>Defensive parameter checks on telemetry schema validation.</li>
                <li>Systematic test verification before finalizing solution.</li>
                <li>Targeted Socratic queries rather than blind code acceptance.</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-amber-400 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Actionable Growth Areas</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
                <li>Handle IEEE-754 precision constraints when computing sums.</li>
                <li>Write explicit boundary assertions for undefined array inputs.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
