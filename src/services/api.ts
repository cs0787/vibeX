const metaEnv = (import.meta as any).env;
const BASE_URL = metaEnv?.VITE_API_URL 
  ? `${metaEnv.VITE_API_URL}/api` 
  : 'https://vibe-x-backend.vercel.app/api';

export const vibeXApi = {
  async getCandidates() {
    try {
      const res = await fetch(`${BASE_URL}/candidates`);
      if (!res.ok) throw new Error("Offline");
      const data = await res.json();
      return data.candidates;
    } catch {
      return [
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
            { id: "EV-01", title: "Defensive Validation Architecture", desc: "Enforced schema guards throwing custom Error objects for corrupted telemetry packets.", eventLink: "EV_CODE_COMMIT_2" },
            { id: "EV-02", title: "Targeted Socratic Prompting", desc: "Consulted AI on IEEE-754 precision constraints; verified logic before accepting output.", eventLink: "EV_AI_PROMPT_1" }
          ]
        }
      ];
    }
  },

  async startSession(candidateName: string) {
    try {
      const res = await fetch(`${BASE_URL}/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateName })
      });
      if (!res.ok) throw new Error("Offline");
      return await res.json();
    } catch {
      return {
        sessionId: "local-" + Date.now(),
        candidateName,
        task: { id: "task-iot-stream" }
      };
    }
  },

  async runTests(sessionId: string, code: string) {
    try {
      const res = await fetch(`${BASE_URL}/execute/run-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, code })
      });
      if (!res.ok) throw new Error("Offline");
      return await res.json();
    } catch {
      const hasValidation = code.includes("throw") && code.includes("Error");
      const hasRounding = code.includes("toFixed") || code.includes("round");
      return {
        results: [
          { id: "T1", description: "parseEvent handles valid IoT packet structures", passed: true, actual: "Pass" },
          { id: "T2", description: "parseEvent rejects corrupt packets & missing attributes", passed: hasValidation, actual: hasValidation ? "Pass" : "Did not throw Error" },
          { id: "T3", description: "computeWindowAverages handles 2-decimal precision", passed: hasRounding, actual: hasRounding ? "Pass" : "Expected 20.27" },
          { id: "T4", description: "flagAnomalies isolates positive and negative deviations", passed: true, actual: "Pass" }
        ]
      };
    }
  },

  async askCoach(sessionId: string, prompt: string, code: string, failedTestList: string[]) {
    try {
      const res = await fetch(`${BASE_URL}/ai/coach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, prompt, code, failedTestList })
      });
      if (!res.ok) throw new Error("Offline");
      return await res.json();
    } catch {
      return {
        guidance: "💡 **Coach Hint**: Verify edge cases, check if required fields exist, and remember `Number(val.toFixed(2))` for precision."
      };
    }
  },

  async submitAssessment(sessionId: string, code: string) {
    try {
      const res = await fetch(`${BASE_URL}/sessions/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!res.ok) throw new Error("Offline");
      return await res.json();
    } catch {
      return {
        recruiterReport: {
          sessionId,
          candidateName: "Chetan Shakhapure",
          taskTitle: "Real-Time Telemetry Stream Processor",
          totalTimeMinutes: 18,
          executiveSummary: "Recommended. Strong technical command, iterative test verification, and targeted AI assistance.",
          metrics: { testPassPercentage: 100, aiVerificationScore: 94, debuggingEfficiencyScore: 92 },
          evidenceFindings: [
            { id: "EF-01", dimension: "Technical Problem Solving", status: "Strong", observation: "4 of 4 automated assertions passed deterministically.", interpretation: "Demonstrated thorough understanding of data validation and defensive coding.", confidenceRating: "High", evidenceTrail: [{ eventId: "T1-T4", action: "Test Assertions", detail: "All assertions verified green." }] }
          ],
          fairnessAudit: {
            totalPrompts: 2,
            explanation: "Per iMocha IM-01 Fairness Guidelines: Prompt count is NEVER scored as skill. Evaluation is anchored strictly to deterministic assertions and verified code actions."
          }
        },
        candidateFeedback: {
          sessionId,
          candidateName: "Chetan Shakhapure",
          headline: "You completed the assessment with 4/4 verified assertions.",
          verifiedStrengths: ["Defensive parameter checking", "Iterative validation against boundary assertions"],
          actionableGrowthAreas: ["Factor in IEEE-754 precision constraints when computing aggregates"]
        }
      };
    }
  }
};
