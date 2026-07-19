// ─── Client-Side JavaScript RAG & Learning System ───────────────────────────

// Formal greetings list
const FORMAL_GREETINGS = [
  "Greetings, esteemed user. I am StadiumIQ, your dedicated intelligence companion.",
  "Good day. It is an honor to assist you at the StadiumIQ Command Terminal.",
  "Salutations. I stand ready to provide real-time updates and localized information.",
  "A very warm welcome to you. How may I facilitate your query requirements today?",
  "Greetings. Please allow me to assist you with any live stadium statistics or routing queries.",
  "Welcome. I am prepared to process your request against our local database archives."
];

// Fan Companion Knowledge Base
const COMPANION_KNOWLEDGE = [
  {
    tags: ['water', 'drinking', 'nearest water', 'thirsty', 'hydration'],
    text: "The nearest drinking water station is located directly near Gate 4, just past Concourse B. Wait times are currently negligible (under 1 minute)."
  },
  {
    tags: ['gate 4', 'g4', 'entrance 4'],
    text: "Gate 4 status is currently CLEAR with an average security screening wait time of approximately 2 minutes."
  },
  {
    tags: ['gate 7', 'g7', 'entrance 7', 'congested', 'crowded'],
    text: "Gate 7 is experiencing HEAVY CONGESTION. Inbound fans are formally advised to reroute to either the East or West entrances to avoid delays."
  },
  {
    tags: ['concourse b', 'concourse'],
    text: "Concourse B is currently operating at moderate capacity (64%) with fluid traffic flow. It is situated adjacent to Gate 4."
  },
  {
    tags: ['north stand', 'north wing', 'optimal'],
    text: "The North Wing is experiencing optimal flow with a current capacity density of only 42%."
  },
  {
    tags: ['south terrace', 'south wing', 'south stand', 'crowd'],
    text: "The South Wing/Terrace is heavily crowded at 94% capacity. Security personnel are monitoring crowd distribution."
  },
  {
    tags: ['restroom', 'toilet', 'washroom', 'pee', 'poop'],
    text: "Restrooms are located in Concourses A, B, and C. The restrooms in Concourse B currently have the shortest wait times."
  },
  {
    tags: ['food', 'concession', 'eat', 'pizza', 'tacos', 'burger', 'hungry'],
    text: "Food options include Pizza in Concourse A, Tacos in Concourse B, and Burgers/Beverages in Concourse C. Average concession wait time is 4.2 minutes."
  },
  {
    tags: ['ticket', 'booking', 'seat', 'lost'],
    text: "For ticketing issues, seat discrepancies, or lost items, please report directly to the Help Desk situated at the Main Entrance lobby."
  },
  {
    tags: [' titans', 'score', 'apex', 'match', 'time', 'live'],
    text: "The live score is TITANS 2 — APEX 1. The match is currently active in the 74th minute."
  }
];

// Staff/Ops Dashboard Knowledge Base
const COPILOT_KNOWLEDGE = [
  {
    tags: ['incidents', 'incident', 'emergency', 'active', 'medical', 'security'],
    text: "There are currently 3 active incidents: INC-001 (Medical Emergency at Section B12, Unit MEDIC-03 on scene), INC-002 (Gate 7 Congestion, Unit ALPHA-9 deployed), and INC-003 (Unauthorized Access at Tunnel C, Unit SEC-01 monitoring)."
  },
  {
    tags: ['units', 'roster', 'units roster', 'active units', 'staff'],
    text: "The active unit roster is: ALPHA-9 (Crowd Control, Sector D), MEDIC-03 (Medical, Section B12), SEC-01 (Security, Tunnel C), and OPS-07 (Standby, Gate 4)."
  },
  {
    tags: ['beta-2', 'beta', 'available units', 'backup'],
    text: "Unit BETA-2 is currently stationed at the North Stand and is fully available for dispatch along with 11 standby units."
  },
  {
    tags: ['concession', 'revenue', 'money', 'sales'],
    text: "Concession stands are at 78% capacity load. Current matchday revenue stands at ₹8.4 Lakhs against a target of ₹10 Lakhs."
  },
  {
    tags: ['congestion', 'gate 7 congestion', 'gate 7 flow', 'surge'],
    text: "Gate 7 flow rate is 142 people/min. Recommendation is to re-route incoming flow to Gate 4 or dispatch Unit ALPHA-9 for crowd control."
  },
  {
    tags: ['medical emergency', 'inc-001', 'b12', 'medic'],
    text: "Incident INC-001 is a critical medical emergency at Section B12. Unit MEDIC-03 was dispatched and is currently on scene providing assistance."
  },
  {
    tags: ['gate 4', 'gate 4 wait', 'clear'],
    text: "Gate 4 is clear and operating at optimal efficiency with an average wait time of 2 minutes."
  }
];

// Class to manage a dynamic RAG session that learns what the user wants
class RAGChatSession {
  constructor(isCopilot = false) {
    this.isCopilot = isCopilot;
    this.kb = isCopilot ? COPILOT_KNOWLEDGE : COMPANION_KNOWLEDGE;
    this.history = [];
    this.learnedData = {
      userPreferences: [],
      userQueryTopics: new Set(),
      lastMentionedTopic: null
    };
  }

  // Learns and parses parameters from user queries to customize future answers
  learnFromQuery(query) {
    const qLower = query.toLowerCase();

    // 1. Learn topics of interest
    if (qLower.includes('water') || qLower.includes('thirsty') || qLower.includes('drink')) {
      this.learnedData.userQueryTopics.add('hydration');
      this.learnedData.lastMentionedTopic = 'hydration';
    }
    if (qLower.includes('food') || qLower.includes('eat') || qLower.includes('hungry') || qLower.includes('pizza')) {
      this.learnedData.userQueryTopics.add('dining');
      this.learnedData.lastMentionedTopic = 'dining';
    }
    if (qLower.includes('gate') || qLower.includes('entrance') || qLower.includes('exit')) {
      this.learnedData.userQueryTopics.add('navigation');
      this.learnedData.lastMentionedTopic = 'navigation';
    }
    if (qLower.includes('emergency') || qLower.includes('medical') || qLower.includes('hurt') || qLower.includes('help')) {
      this.learnedData.userQueryTopics.add('safety');
      this.learnedData.lastMentionedTopic = 'safety';
    }

    // 2. Try to extract names or sections
    const nameMatch = query.match(/(?:my name is|i am|call me) ([a-zA-Z0-9_-]+)/i);
    if (nameMatch && nameMatch[1]) {
      this.learnedData.userName = nameMatch[1];
    }

    const sectionMatch = query.match(/(?:section|sector|seat) ([a-zA-Z0-9_-]+)/i);
    if (sectionMatch && sectionMatch[1]) {
      this.learnedData.userSection = sectionMatch[1];
    }
  }

  // RAG Retrieval step: search documents matching token overlap
  retrieveContext(query) {
    const tokens = query.toLowerCase().split(/[\s,?.!]+/);
    let bestDoc = null;
    let maxScore = 0;

    for (const doc of this.kb) {
      let score = 0;
      for (const tag of doc.tags) {
        if (tokens.includes(tag) || query.toLowerCase().includes(tag)) {
          score += 2;
        }
      }
      // Add extra points for partial token overlap
      for (const token of tokens) {
        if (token.length > 2 && doc.tags.some(tag => tag.includes(token))) {
          score += 0.5;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestDoc = doc;
      }
    }

    return { bestDoc, maxScore };
  }

  // RAG Generation step: build customized, natural responses in JS
  generateResponse(query) {
    this.learnFromQuery(query);
    const { bestDoc, maxScore } = this.retrieveContext(query);
    
    // Pick a formal greeting dynamically based on chat history size
    const greetingIdx = this.history.length % FORMAL_GREETINGS.length;
    const greeting = FORMAL_GREETINGS[greetingIdx];

    // Reference learning data if available
    let memoryHook = "";
    if (this.learnedData.userName && this.history.length === 1) {
      memoryHook = ` I have noted your identity as operator ${this.learnedData.userName}.`;
    } else if (this.learnedData.userSection && Math.random() > 0.5) {
      memoryHook = ` Considering you are stationed near section/gate ${this.learnedData.userSection}, here is the relevant status:`;
    } else if (this.learnedData.lastMentionedTopic && Math.random() > 0.6) {
      memoryHook = ` Regarding your interest in stadium ${this.learnedData.lastMentionedTopic}:`;
    }

    let answerText = "";
    if (maxScore > 0 && bestDoc) {
      answerText = bestDoc.text;
    } else {
      // Fallback answers when no match is found
      if (this.isCopilot) {
        answerText = "Our local database shows all telemetry systems are nominal. Please specify if you require details on active incidents, staff rosters, or gate flows.";
      } else {
        answerText = "I could not find a direct database match for your specific query. For direct help, you can look at the Live Map or visit the Information Desk near Concourse A.";
      }
    }

    // Save turn to history
    this.history.push({ query, response: answerText });

    return `${greeting}${memoryHook} ${answerText}`;
  }
}

// ─── Exported Mock Creators matching original signatures ──────────────────────

export const createCompanionChat = () => {
  return new RAGChatSession(false);
};

export const createCopilotChat = () => {
  return new RAGChatSession(true);
};

// Simulated typing stream helper
export const sendMessageStream = async (chatSession, message, onChunk) => {
  const fullText = chatSession.generateResponse(message);
  const words = fullText.split(' ');
  let currentText = '';

  // Simulate token stream locally with micro-intervals
  for (let i = 0; i < words.length; i++) {
    currentText += (i === 0 ? '' : ' ') + words[i];
    onChunk(currentText);
    await new Promise(resolve => setTimeout(resolve, 30));
  }

  return fullText;
};

// Keep helper signature intact
export const getErrorMessage = (err) => {
  return `Local RAG error: ${err.message || String(err)}`;
};
