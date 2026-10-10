const BASE_URL = 'http://localhost:5000/api';

export const vibeXApi = {
  async initSession(candidateName: string, taskId = "task-data-pipeline") {
    const res = await fetch(`${BASE_URL}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateName, taskId })
    });
    return res.json();
  },

  async runTests(sessionId: string, taskId: string, code: string) {
    const res = await fetch(`${BASE_URL}/execute/run-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, taskId, code })
    });
    return res.json();
  },

  async askCoach(sessionId: string, prompt: string, code: string, failedTestList: string[]) {
    const res = await fetch(`${BASE_URL}/ai/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, prompt, code, failedTestList })
    });
    return res.json();
  },

  async submitAssessment(sessionId: string, taskId: string, code: string) {
    const res = await fetch(`${BASE_URL}/sessions/${sessionId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, code })
    });
    return res.json();
  }
};
