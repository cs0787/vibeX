const BACKEND_URL = "https://vibe-x-backend.vercel.app";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter';
}

export const vibeXApi = {
  // Authentication
  async register(name: string, email: string, password: string, role: 'candidate' | 'recruiter') {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // Assessments & Sessions
  async getAssessments() {
    const res = await fetch(`${BACKEND_URL}/api/assessments`);
    return res.json();
  },

  async startSession(candidateId: string, candidateName: string, assessmentId = 'task-iot-stream') {
    const res = await fetch(`${BACKEND_URL}/api/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, candidateName, assessmentId })
    });
    return res.json();
  },

  async runTests(sessionId: string, code: string, assessmentId = 'task-iot-stream') {
    const res = await fetch(`${BACKEND_URL}/api/execute/run-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, code, assessmentId })
    });
    return res.json();
  },

  async askCoach(sessionId: string, prompt: string, code: string, failedTestList: string[] = []) {
    const res = await fetch(`${BACKEND_URL}/api/ai/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, prompt, code, failedTestList })
    });
    return res.json();
  },

  async submitAssessment(sessionId: string, code: string) {
    const res = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return res.json();
  },

  // Recruiter Portal
  async getRecruiterPipeline() {
    const res = await fetch(`${BACKEND_URL}/api/recruiter/pipeline`);
    return res.json();
  },

  async getReport(sessionId: string) {
    const res = await fetch(`${BACKEND_URL}/api/reports/${sessionId}`);
    return res.json();
  }
};
