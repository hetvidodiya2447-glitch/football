import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── System Prompts ───────────────────────────────────────────────────────────

const COMPANION_SYSTEM_PROMPT = `You are StadiumIQ — an AI stadium companion assistant for fans attending a live football match between TITANS (home) and APEX (away).

Current match context:
- Score: TITANS 2 — APEX 1, currently LIVE
- Attendance: 54,892 (91.5% capacity)
- Gate 7 has a congestion alert; Gate 4 is clear (2 min wait)
- Concourse B is at moderate capacity (64%)
- South Wing is heavily congested (94%)
- North Wing is clear and optimal (42%)
- Concession stands are at 78% load, avg wait 4.2 min
- VIP boxes are fully occupied

Your role: Help fans navigate the stadium, find amenities, check crowd status, understand alerts, and enjoy their match experience.

Guidelines:
- Be concise, friendly, and helpful
- Use stadium context when relevant
- Give specific directions and actionable advice
- Keep responses under 3 sentences where possible
- Do not make up information not in the context`;

const COPILOT_SYSTEM_PROMPT = `You are CopilotIQ v4.2 — an advanced AI operations assistant for StadiumIQ Command Center.

Current stadium operations context:
- Event: TITANS vs APEX football match (LIVE)
- Total attendance: 54,892 / 60,000 capacity (91.5%)
- Gate flow rate: 142 people/min
- CONGESTION ALERT: Gate 7 (immediate action needed)
- Concession load: 78%, avg wait 4.2 min
- Active incidents: INC-001 (Medical, Section B12), INC-002 (Gate 7 congestion), INC-003 (Unauthorized access, Tunnel C)
- Units deployed: ALPHA-9 (Sector D), MEDIC-03 (Section B12), SEC-01 (Tunnel C), OPS-07 (Gate 4)
- Available units: BETA-2 (North Stand), 11 others on standby
- Zone status: North Stand 88% optimal, South Terrace 96% high load

Your role: Analyze operational data, recommend actions, help dispatch staff, identify risks, and provide real-time crowd management insights.

Guidelines:
- Be precise and action-oriented — use ops terminology
- Format recommendations clearly with specific unit assignments
- Prioritize safety over convenience
- Always mention risk levels and time sensitivity
- Keep responses focused and under 4 sentences`;

// ─── Gemini Client Factory ────────────────────────────────────────────────────

const getClient = (apiKey) => new GoogleGenerativeAI(apiKey);

// ─── Chat Session Creators ────────────────────────────────────────────────────

export const createCompanionChat = (apiKey) => {
  const model = getClient(apiKey).getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: COMPANION_SYSTEM_PROMPT,
  });
  return model.startChat({ history: [] });
};

export const createCopilotChat = (apiKey) => {
  const model = getClient(apiKey).getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: COPILOT_SYSTEM_PROMPT,
  });
  return model.startChat({ history: [] });
};

// ─── Streaming send helper ────────────────────────────────────────────────────
// onChunk(text) is called incrementally; returns the final full text
export const sendMessageStream = async (chat, message, onChunk) => {
  const result = await chat.sendMessageStream(message);
  let full = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    full += text;
    onChunk(full);
  }
  return full;
};
