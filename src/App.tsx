import React, { useState, useEffect } from 'react';
import { vibeXApi } from './services/api';
import { 
  Terminal, Bot, Play, CheckCircle2, XCircle, Send, 
  BarChart3, UserCheck, ShieldCheck, Info, Sparkles, ArrowRight,
  ExternalLink, Code2, AlertTriangle
} from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'workspace' | 'recruiter' | 'candidate'>('workspace');
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Platform Session State
  const [sessionId, setSessionId] = useState('');
  const [task, setTask] = useState<any>(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Socratic AI Coach
  const [promptInput, setPromptInput] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'coach'; text: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Assessment Reports
  const [recruiterReport, setRecruiterReport] = useState<any>(null);
  const [candidateFeedback, setCandidateFeedback] = useState<any>(null);

  useEffect(() => {
    vibeXApi.initSession("Chetan Shakhapure").then(res => {
      setSessionId(res.sessionId);
      setTask(res.task);
      setCode(res.task.starterCode);
    });
  }, []);

  const handleRunTests = async () => {
    if (!task) return;
    setIsExecuting(true);
    const data = await vibeXApi.runTests(sessionId, task.id, code);
    setTestResults(data.results);
    setIsExecuting(false);
  };

  const handleAskCoach = async (explicitPrompt?: string) => {
    const q = explicitPrompt || promptInput;
    if (!q.trim() || !task) return;

    const failed = testResults.filter(t => !t.passed).map(t => t.id);
    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setPromptInput('');
    setIsThinking(true);

    const data = await vibeXApi.askCoach(sessionId, q, code, failed);
    setChatLog(prev => [...prev, { sender: 'coach', text: data.guidance }]);
    setIsThinking(false);
  };

  const handleSubmitAssessment = async () => {
    if (!task) return;
    const res = await vibeXApi.submitAssessment(sessionId, task.id, code);
    setRecruiterReport(res.recruiterReport);
    setCandidateFeedback(res.candidateFeedback);
    setView('recruiter');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Onboarding & Transparency Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-black text-base">vX</div>
              <div>
                <h3 className="text-base font-bold text-white">Welcome to vibeX Assessment</h3>
                <p className="text-xs text-slate-400">iMocha AI-Era Skills Intelligence Platform</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="font-semibold text-slate-200 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fairness & Transparency Guarantee</span>
              </div>
              <p>• You have access to a built-in Socratic AI Assistant to brainstorm and debug.</p>
              <p>• <strong>Prompt count & speed are NOT scored</strong>. You will not be penalized for asking questions.</p>
              <p>• Evaluation focuses on verified test outcomes, critical thinking, and edge-case handling.</p>
            </div>

            <button 
              onClick={() => setShowOnboarding(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-indigo-900/40">
              Enter Assessment Workspace
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black px-2.5 py-1 rounded-lg text-xs tracking-wider">vibeX</span>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">The AI-Era Assessment Engine</span>
        </div>

        {/* View Switchers */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button 
            onClick={() => setView('workspace')}
            className={`px-3 py-1.5 rounded-lg transition ${view === 'workspace' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Candidate Workspace
          </button>
          <button 
            onClick={() => recruiterReport ? setView('recruiter') : handleSubmitAssessment()}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${view === 'recruiter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Recruiter Report</span>
          </button>
          <button 
            onClick={() => candidateFeedback ? setView('candidate') : handleSubmitAssessment()}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${view === 'candidate' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <UserCheck className="w-3.5 h-3.5" />
            <span>Candidate Growth View</span>
          </button>
        </div>

        <button 
          onClick={handleSubmitAssessment}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-950">
          <span>Submit Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* VIEW 1: Candidate Workspace */}
      {view === 'workspace' && (
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left: Task Specification Drawer */}
          <div className="col-span-3 border-r border-slate-800 p-5 overflow-y-auto bg-slate-900/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Benchmark Task</span>
            <h2 className="text-sm font-bold text-white mt-1">{task?.title || "Loading..."}</h2>
            <div className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
              {task?.roleLevel}
            </div>

            <div className="mt-4 text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              {task?.description}
            </div>
          </div>

          {/* Middle: Code Editor & Sandboxed Test Results */}
          <div className="col-span-6 flex flex-col border-r border-slate-800 bg-slate-950">
            <div className="h-10 border-b border-slate-800 px-4 flex items-center justify-between bg-slate-900/40">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>processor.js</span>
              </span>
              <button 
                onClick={handleRunTests}
                disabled={isExecuting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition">
                <Play className="w-3 h-3 fill-current" />
                <span>{isExecuting ? "Executing Sandbox..." : "Run Tests"}</span>
              </button>
            </div>

            {/* Code Input */}
            <textarea 
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 bg-transparent p-4 font-mono text-xs focus:outline-none resize-none text-slate-200 leading-relaxed border-none selection:bg-indigo-800"
              spellCheck={false}
            />

            {/* Deterministic Test Results Bar */}
            <div className="h-44 border-t border-slate-800 bg-slate-900/50 p-3 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deterministic Assertion Sandbox</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {testResults.length > 0 && `${testResults.filter(t => t.passed).length} / ${testResults.length} Passed`}
                </span>
              </div>

              {testResults.length === 0 ? (
                <div className="text-xs text-slate-500 italic mt-4 text-center">Execute your code to inspect unit and boundary assertions.</div>
              ) : (
                <div className="space-y-1.5">
                  {testResults.map(test => (
                    <div key={test.id} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${test.passed ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' : 'bg-rose-950/20 border-rose-800/40 text-rose-300'}`}>
                      <div className="flex items-center space-x-2">
                        {test.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className="font-medium">{test.description}</span>
                      </div>
                      {!test.passed && <span className="text-[10px] font-mono text-rose-400">{test.actual}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Socratic AI Coach */}
          <div className="col-span-3 flex flex-col bg-slate-900/20">
            <div className="h-10 border-b border-slate-800 px-4 flex items-center space-x-2 bg-slate-900/40">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">Socratic AI Coach</span>
            </div>

            {/* Quick Socratic Question Chips */}
            <div className="p-2 border-b border-slate-800 flex flex-wrap gap-1">
              <button onClick={() => handleAskCoach("How should I reject corrupt or incomplete packets in parseEvent?")} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition">
                Hint: Packet Validation
              </button>
              <button onClick={() => handleAskCoach("Why does floating point math fail on computeWindowAverages?")} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition">
                Hint: Float Rounding
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {chatLog.length === 0 && (
                <div className="text-xs text-slate-500 italic text-center mt-6">
                  Stuck on an edge case or assertion? Ask the coach for structural hints.
                </div>
              )}
              {chatLog.map((msg, i) => (
                <div key={i} className={`p-2.5 rounded-xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-950 border border-indigo-800 text-indigo-200 ml-4' : 'bg-slate-800/80 border border-slate-700 text-slate-200 mr-4'}`}>
                  {msg.text}
                </div>
              ))}
              {isThinking && <div className="text-xs text-indigo-400 italic">Coach analyzing session state...</div>}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-slate-800 flex items-center space-x-2">
              <input 
                type="text"
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskCoach()}
                placeholder="Ask coach for guidance..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-600"
              />
              <button onClick={() => handleAskCoach()} className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Recruiter Evidence-Backed Skill Report */}
      {view === 'recruiter' && recruiterReport && (
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-6 overflow-y-auto">
          {/* Executive Header */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Recruiter Diagnostic Dossier</span>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">Evidence Anchored</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">{recruiterReport.candidateName}</h1>
              <p className="text-xs text-slate-400 mt-0.5">Role Benchmark: {recruiterReport.taskTitle} • Total Duration: {recruiterReport.totalTimeMinutes} mins</p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Evaluation Verdict</div>
              <div className="text-base font-bold text-emerald-400">{recruiterReport.executiveSummary}</div>
            </div>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">Deterministic Pass Rate</div>
              <div className="text-3xl font-black text-indigo-400 mt-1">{recruiterReport.metrics.testPassPercentage}%</div>
              <div className="text-[11px] text-slate-500 mt-1">Grounded in unit assertions</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">AI Fluency & Critical Thinking</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">{recruiterReport.metrics.aiVerificationScore}%</div>
              <div className="text-[11px] text-slate-500 mt-1">Evaluates contextual intent</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold">Verification Velocity</div>
              <div className="text-3xl font-black text-purple-400 mt-1">{recruiterReport.metrics.debuggingEfficiencyScore}%</div>
              <div className="text-[11px] text-slate-500 mt-1">Failure-to-fix resolution loops</div>
            </div>
          </div>

          {/* Evidence Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Inspectable Evidence Chains</h3>
            {recruiterReport.evidenceFindings.map((finding: any) => (
              <div key={finding.id} className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{finding.dimension}</span>
                    <span className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">{finding.status}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Confidence: {finding.confidenceRating}</span>
                </div>
                <p className="text-xs font-semibold text-slate-200">{finding.observation}</p>
                <p className="text-xs text-slate-400">{finding.interpretation}</p>

                {/* Event Audit Trail */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Anchored Telemetry Trail:</div>
                  {finding.evidenceTrail.map((ev: any, idx: number) => (
                    <div key={idx} className="text-xs font-mono text-slate-300 flex items-center space-x-2">
                      <span className="text-indigo-400">[{ev.eventId}]</span>
                      <span className="text-slate-400">({ev.action}):</span>
                      <span>{ev.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Fairness Guarantee */}
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Fairness & Transparency Guardrail</strong>: {recruiterReport.fairnessAudit.explanation}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Candidate Personal Growth View */}
      {view === 'candidate' && candidateFeedback && (
        <div className="flex-1 p-8 max-w-3xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Candidate Growth Dossier</span>
            <h1 className="text-2xl font-black text-white mt-1">Hello, {candidateFeedback.candidateName}</h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{candidateFeedback.headline}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                {candidateFeedback.verifiedStrengths.map((str: string, i: number) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Actionable Growth Areas</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                {candidateFeedback.actionableGrowthAreas.map((area: string, i: number) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
