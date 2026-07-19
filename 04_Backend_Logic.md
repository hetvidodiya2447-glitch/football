# Backend Logic Document
## VAMOS AI — Multi-Agent Architecture, Data Pipeline & Orchestration Logic

---

## 1. System Architecture Overview

```
                                ┌───────────────────────────┐
                                │   Client Apps             │
                                │  Companion (mobile/web)   │
                                │  Command (staff dashboard)│
                                └────────────┬──────────────┘
                                             │ HTTPS/WebSocket
                                             ▼
                                ┌───────────────────────────┐
                                │      API Gateway          │
                                │ (Auth, rate limit, routing)│
                                └────────────┬──────────────┘
                                             ▼
                                ┌───────────────────────────┐
                                │      ORCHESTRATOR          │
                                │  (LLM w/ tool-calling)     │
                                │  - Intent classification   │
                                │  - Agent routing           │
                                │  - Response merging        │
                                │  - Guardrail enforcement   │
                                └──────┬─────┬─────┬─────┬───┘
                 ┌────────────────────┘     │     │     └────────────────────┐
                 ▼                          ▼     ▼                          ▼
        ┌────────────────┐        ┌────────────────┐              ┌────────────────┐
        │ Navigation Agent│        │  Crowd Agent    │   ...        │ Decision Support│
        │ Accessibility   │        │  Transport      │              │ Ops Intelligence│
        │ Sustainability  │        │  Language        │              │  Agent          │
        └───────┬────────┘        └───────┬────────┘              └───────┬────────┘
                 │                          │                                │
                 └──────────────┬───────────┴────────────────┬──────────────┘
                                ▼                            ▼
                    ┌───────────────────────┐     ┌───────────────────────┐
                    │  RAG Layer / Vector DB │     │  Real-Time Data Bus    │
                    │ (Stadium Knowledge     │     │ (Kafka / Redis Streams)│
                    │  Graph: maps, POIs,    │     │ CCTV counts, Wi-Fi/BLE,│
                    │  policies, FAQs)       │     │ turnstiles, transit,   │
                    └───────────────────────┘     │ weather, incidents     │
                                                    └───────────┬───────────┘
                                                                ▼
                                                    ┌───────────────────────┐
                                                    │   Data Ingestion Layer │
                                                    │ (per-source connectors)│
                                                    └───────────────────────┘
```

---

## 2. Orchestrator Logic

The Orchestrator is the single LLM entry point every request passes through. Pseudocode:

```python
def handle_request(user_input, session_context, user_role):
    # Step 1: Classify intent + detect required agents
    intent = orchestrator_llm.classify(
        input=user_input,
        context=session_context,
        available_tools=AGENT_TOOL_DEFINITIONS
    )

    # Step 2: Determine if multi-agent fan-out is needed
    required_agents = intent.agents  # e.g. ["navigation", "crowd", "accessibility"]

    agent_responses = {}
    for agent in required_agents:
        retrieved_context = rag_retrieve(agent, user_input, session_context)
        agent_responses[agent] = call_agent(agent, user_input, retrieved_context)

    # Step 3: Guardrail check BEFORE merging into a user-facing response
    if is_safety_critical(agent_responses):
        return route_to_human_approval_queue(agent_responses, user_role)

    # Step 4: Merge into one coherent, grounded response
    final_response = orchestrator_llm.merge(
        agent_responses=agent_responses,
        style="warm, concise, cite live data source"
    )

    log_interaction(user_input, agent_responses, final_response)
    return final_response
```

**Key design decisions:**
- **Tool-calling, not prompt-stuffing.** Each agent is exposed to the Orchestrator as a callable tool with a strict schema (see §4), so the LLM decides *which* tools to call rather than one giant prompt trying to do everything.
- **RAG before generation, always.** No agent generates a factual claim about live venue state without first retrieving grounding data. If retrieval fails or data is stale (> threshold age), the agent must respond with an explicit "I don't have current information on that" rather than guessing.
- **Guardrail gate sits between agent output and user-facing output.** This is the single most important safety control in the system.

---

## 3. Guardrail / Safety-Critical Classification Logic

```python
SAFETY_CRITICAL_TRIGGERS = [
    "gate_open_close_action",
    "evacuation_recommendation",
    "medical_dispatch",
    "crowd_density_critical_threshold",
    "security_incident_response",
]

def is_safety_critical(agent_responses):
    for agent, response in agent_responses.items():
        if response.get("action_type") in SAFETY_CRITICAL_TRIGGERS:
            return True
        if response.get("confidence", 1.0) < CONFIDENCE_FLOOR and response.get("domain") == "crowd_safety":
            return True
    return False

def route_to_human_approval_queue(agent_responses, user_role):
    # Only Command-side operators can approve; fans never see raw recommendations
    ticket = create_decision_ticket(
        recommendations=rank_actions(agent_responses),
        confidence=aggregate_confidence(agent_responses),
        rationale=explain(agent_responses)
    )
    notify_control_room(ticket)
    return ticket  # UI renders as a Decision Card, not auto-executed
```

This guarantees: **no agent can independently trigger a gate action, evacuation notice, or dispatch — a human operator always approves, modifies, or rejects first.**

---

## 4. Agent Tool Definitions (schema examples)

Each agent is registered with the Orchestrator as a function-calling tool. Example schemas:

```json
{
  "name": "navigation_agent",
  "description": "Generates a route between the user's current location and a requested destination or POI type, considering live crowd/accessibility constraints.",
  "parameters": {
    "origin": "string (zone/gate id or lat-lng)",
    "destination_query": "string (natural language, e.g. 'nearest accessible restroom')",
    "constraints": ["step_free", "avoid_high_density", "shortest_queue"]
  }
}
```

```json
{
  "name": "crowd_agent",
  "description": "Returns live and predicted density for a given zone, or venue-wide status.",
  "parameters": {
    "zone_id": "string (optional, defaults to venue-wide)",
    "horizon_minutes": "integer (0, 15, 30, 60)"
  }
}
```

```json
{
  "name": "decision_support_agent",
  "description": "Given an anomaly signal, returns ranked recommended actions with rationale and confidence. Output MUST be routed through human approval before execution.",
  "parameters": {
    "anomaly_type": "string",
    "zone_id": "string",
    "signal_payload": "object (raw metrics that triggered the anomaly)"
  }
}
```

```json
{
  "name": "language_agent",
  "description": "Translates text or speech between the user's language and a target language, with cultural tone adaptation.",
  "parameters": {
    "text_or_audio": "string | audio_blob",
    "source_lang": "string (auto-detect if omitted)",
    "target_lang": "string"
  }
}
```

---

## 5. Data Pipeline

### 5.1 Ingestion
| Source | Protocol | Frequency | Landing Zone |
|---|---|---|---|
| CCTV people-count (simulated) | HTTP push / Kafka producer | every 10-30s | `crowd.raw` topic |
| Wi-Fi/BLE probe density (simulated) | Kafka producer | every 30s | `crowd.raw` topic |
| Turnstile scans | Kafka producer | event-driven | `ticketing.scans` topic |
| Transit (GTFS-RT) | Polling REST | every 60s | `transit.status` topic |
| Weather API | Polling REST | every 5 min | `weather.status` topic |
| Volunteer/fan incident reports | REST POST from app | event-driven | `incidents.raw` topic |

### 5.2 Stream Processing
- A stream processor (e.g., Kafka Streams / Flink) aggregates raw `crowd.raw` events into **per-zone rolling density scores** (5-level scale) every 30 seconds.
- Anomaly detection runs as a separate consumer: simple statistical thresholding for MVP (rate-of-change + absolute threshold), upgradeable to a trained model in production.
- Aggregated state is written to a fast key-value store (Redis) for low-latency reads by the Crowd Agent, and to a time-series store (e.g., TimescaleDB) for historical trend/prediction.

### 5.3 RAG / Knowledge Graph
- **Static knowledge:** venue maps, POI locations, accessibility routes, FAQs, policies — chunked and embedded into a vector DB.
- **Semi-live knowledge:** current gate status, active advisories, incident summaries — refreshed on write, retrieved fresh per query (not just embedding similarity — combined with structured lookups for anything time-sensitive).
- **Retrieval strategy:** hybrid — structured lookup (SQL/Redis) for "what is the current state of X" questions; vector similarity search for "how do I / where is / what is the policy on" questions.

---

## 6. Core Data Schemas (simplified)

```sql
-- Zone density (time-series)
CREATE TABLE zone_density (
    zone_id        TEXT NOT NULL,
    ts             TIMESTAMPTZ NOT NULL,
    density_level  SMALLINT NOT NULL,   -- 1-5
    raw_count_est  INTEGER,
    capacity_pct   NUMERIC(5,2),
    PRIMARY KEY (zone_id, ts)
);

-- Incidents
CREATE TABLE incidents (
    incident_id     UUID PRIMARY KEY,
    zone_id         TEXT,
    category        TEXT,             -- medical, lost_child, security, facility, other
    status          TEXT,             -- new, acknowledged, in_progress, resolved
    reported_by     TEXT,             -- fan / volunteer / system
    ai_summary      TEXT,
    created_at      TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ
);

-- Decision Support tickets (audit trail)
CREATE TABLE decision_tickets (
    ticket_id       UUID PRIMARY KEY,
    anomaly_type    TEXT,
    zone_id         TEXT,
    recommendations JSONB,            -- ranked actions + rationale + confidence
    operator_id     TEXT,
    decision        TEXT,             -- approved / modified / rejected
    decided_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ
);

-- Fan session (pseudonymous)
CREATE TABLE fan_sessions (
    session_id      UUID PRIMARY KEY,
    language        TEXT,
    accessibility_prefs JSONB,
    ticket_zone     TEXT,
    green_score     NUMERIC(5,2),
    created_at      TIMESTAMPTZ
);
```

---

## 7. API Surface (representative endpoints)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/chat` | POST | Fan/staff message → Orchestrator → response |
| `/api/navigation/route` | POST | Get generated route given origin/destination/constraints |
| `/api/crowd/zone/{zone_id}` | GET | Current + predicted density for a zone |
| `/api/crowd/venue` | GET | Venue-wide heatmap snapshot |
| `/api/transport/exit-plan` | POST | Personalized exit recommendation |
| `/api/sustainability/score/{session_id}` | GET | Fan's Green Score |
| `/api/incidents` | POST/GET | Create/list incidents |
| `/api/decisions/queue` | GET | Pending Decision Support tickets (Command only) |
| `/api/decisions/{ticket_id}/action` | POST | Approve/Modify/Reject (Command, role-gated) |
| `/api/dispatch/{volunteer_id}` | POST | Send generated dispatch instruction |
| `/api/translate` | POST | Text/speech translation |

All Command-side endpoints require role-based auth (Volunteer / Zone Staff / Control Room Operator) with scope checks — e.g., only Control Room Operators can call `/api/decisions/{ticket_id}/action`.

---

## 8. Prediction Logic (Crowd Agent, MVP → Production)

**MVP (hackathon):**
```python
def predict_density(zone_id, horizon_minutes):
    history = get_recent_density(zone_id, window_minutes=30)
    trend = linear_regression_slope(history)
    current = history[-1].density_level
    predicted = clamp(current + trend * (horizon_minutes / 10), 1, 5)
    return predicted
```

**Production evolution:** replace linear trend with a trained time-series model (e.g., gradient-boosted or transformer-based forecaster) using historical match-day patterns, weather, kickoff proximity, and event type (final vs. group stage) as features. The GenAI layer's job is **not** to do the numeric forecasting itself — it consumes the forecaster's structured output and turns it into a human-readable advisory. This separation (deterministic model for prediction, LLM for explanation/communication) keeps the system explainable and auditable.

---

## 9. Scaling & Infra Notes

- **Per-host-city deployment**: each of the 16 host cities can run an independent Kubernetes cluster (data residency + latency), with a federated aggregation layer for cross-city analytics/reporting.
- **Agent services are independently scalable** — Crowd Agent and Navigation Agent will see the highest QPS during pre-match/post-match windows and should scale independently of, e.g., Sustainability Agent.
- **LLM API calls are the primary cost/latency driver** — mitigate with: response caching for common queries (e.g., "where's the nearest restroom" from a given zone), streaming responses for perceived latency, and a smaller/faster model tier for simple intent classification vs. a stronger model for complex multi-agent merging.
- **Degraded mode:** if the LLM API or a given agent is unreachable, the client falls back to last-cached static map + a clear "live assistant temporarily unavailable" banner — the system must never silently show stale data as if it were live.

---

## 10. Monitoring & Audit

- **Structured logs** for every Orchestrator call: input, agents invoked, retrieved context sources, final output, latency.
- **Decision Support audit trail** is immutable and exportable — critical for post-event review and continuous improvement of anomaly thresholds.
- **Dashboards:** agent-level latency/error rate, RAG retrieval hit-rate, guardrail trigger frequency, human override rate on Decision Support recommendations (a key quality signal — high override rate flags a need to retune the model/thresholds).
