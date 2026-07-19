# Technical Requirements Document (TRD)
## VAMOS AI — GenAI Command Layer for FIFA World Cup 2026

**Version:** 1.0 (Hackathon MVP scope, with production roadmap)
**Owner:** Product/Engineering
**Status:** Draft for hackathon submission

---

## 1. Purpose & Scope

VAMOS AI is a two-sided GenAI platform:
- **VAMOS Companion** (fan-facing mobile/web app)
- **VAMOS Command** (staff/organizer web dashboard)

This document defines what the system must do (functional requirements), how well it must do it (non-functional requirements), what it integrates with, and how the hackathon MVP scope differs from the full production vision.

**In scope:** Navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, real-time decision support — all within stadium precinct + immediate transit catchment.

**Out of scope (v1):** Ticketing/payment processing, stadium construction/IoT hardware installation, law-enforcement command systems (VAMOS *advises*, it does not replace command-and-control systems of record).

---

## 2. Personas

| Persona | Goal | Primary Surface |
|---|---|---|
| **Fan (general)** | Get to seat, find facilities, get home safely | VAMOS Companion (mobile) |
| **Fan (accessibility needs)** | Navigate step-free, get captions/audio description, avoid crowd stress | VAMOS Companion (accessibility mode) |
| **International fan** | Understand everything in their language | VAMOS Companion (any language) |
| **Volunteer** | Get instructions fast, answer fan questions, report incidents | VAMOS Command (lite/mobile) |
| **Venue staff / gate steward** | Manage flow at a specific zone | VAMOS Command (zone view) |
| **Organizer / control room operator** | See the whole venue, approve AI-recommended actions | VAMOS Command (control room view) |

---

## 3. Functional Requirements

### 3.1 Navigation Agent
- FR-1.1: Given a natural-language query ("nearest accessible restroom with shortest queue"), return a generated route with live wait-time estimate.
- FR-1.2: Support AR turn-by-turn overlay (stretch) or 2D indoor map fallback (MVP).
- FR-1.3: Route must avoid zones currently flagged "high density" or "closed" by the Crowd Agent.
- FR-1.4: Support voice input/output.

### 3.2 Crowd Agent
- FR-2.1: Ingest simulated/real density signals (CCTV people-count, Wi-Fi/BLE probe counts, turnstile deltas) per zone, refreshed ≤ 30s.
- FR-2.2: Generate a live heatmap (5-level density scale) per concourse/gate/seating block.
- FR-2.3: Predict density 15/30/60 minutes ahead using trend + historical pattern.
- FR-2.4: On threshold breach, auto-draft a natural-language advisory for control room review ("Gate 14 will exceed safe density in ~12 min at current inflow rate; recommend opening Gate 16").

### 3.3 Accessibility Agent
- FR-3.1: Real-time captioning of stadium PA announcements.
- FR-3.2: Generate a sign-language avatar rendering of key announcements (stretch goal; text-to-caption is MVP baseline).
- FR-3.3: Generate step-free/elevator-only routes on request.
- FR-3.4: Audio-description mode: narrate match/venue events for low-vision fans on demand.

### 3.4 Transport Agent
- FR-4.1: Recommend arrival mode/time based on predicted transit + traffic load.
- FR-4.2: Post-match: generate a personalized exit plan (which exit, which transit mode, what time to leave) to flatten demand curves.
- FR-4.3: Integrate with public transit and rideshare data feeds (simulated for MVP).

### 3.5 Sustainability Agent
- FR-5.1: Track and display a per-fan "Green Match Score" (transit mode, waste sorting, reusable items).
- FR-5.2: AI-vision (or manual photo) waste-sorting guidance ("this is recyclable — bin on your left").
- FR-5.3: Generate gamified nudges and aggregate venue-level sustainability dashboard for organizers.

### 3.6 Language Agent
- FR-6.1: Real-time text and speech translation across ≥ 20 languages for MVP (target 100+ for production), covering FIFA 2026's most common fan nationalities.
- FR-6.2: Culturally-aware phrasing (formality, idioms) — not literal machine translation.
- FR-6.3: Two-way live translation for volunteer↔fan spoken conversations.

### 3.7 Ops Intelligence Agent
- FR-7.1: Auto-generate shift briefings from the last N hours of logs/incidents.
- FR-7.2: Auto-summarize an in-progress incident thread into a concise status update.
- FR-7.3: Generate dispatch scripts/instructions for volunteers ("Go to Section 214, escort medical team, use Gate C").

### 3.8 Decision Support Agent
- FR-8.1: Detect anomalies (density spike, weather event, medical cluster, transit disruption).
- FR-8.2: Generate ≥ 2 ranked recommended actions with plain-language rationale and confidence score.
- FR-8.3: **No agent output triggers a physical/safety action automatically** — every safety-critical recommendation requires explicit human approval (one-tap approve/reject/modify).
- FR-8.4: Log every recommendation + human decision for audit and model improvement.

### 3.9 Orchestrator (cross-cutting)
- FR-9.1: Route each incoming request to the correct agent(s) using intent classification + tool-calling.
- FR-9.2: Merge multi-agent responses into one coherent answer (e.g., a navigation query during a crowd surge should combine Navigation + Crowd agents).
- FR-9.3: Ground every generated answer in retrieved, sourced data (RAG) — no unsourced factual claims about live venue state.
- FR-9.4: Maintain conversation context per user session.

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Latency** | Fan chat response ≤ 2.5s (p95) for text; ≤ 4s including translation; Crowd Agent heatmap refresh ≤ 30s |
| **Scale** | Support 90,000 concurrent stadium attendees, ~15,000 concurrent app sessions, 16 host cities running independently or federated |
| **Availability** | 99.9% during live match windows; graceful degraded mode (cached maps, canned responses) if LLM/API is unreachable |
| **Offline resilience** | Core navigation map + last-known crowd state must be cacheable client-side for spotty stadium Wi-Fi |
| **Security** | OAuth2/OIDC auth for staff; anonymous/pseudonymous sessions for fans; TLS everywhere; PII minimization |
| **Privacy** | No facial recognition/identity tracking of fans — crowd density only, aggregate/anonymized (GDPR/CCPA aligned) |
| **Accessibility** | WCAG 2.1 AA compliance across VAMOS Companion UI |
| **Auditability** | All Decision Support Agent recommendations + human actions logged immutably |
| **Localization** | UI + AI responses in ≥ 20 languages at MVP |
| **Human-in-the-loop** | Any recommendation classified "safety-critical" cannot auto-execute; requires named human approval |

---

## 5. High-Level Tech Stack (proposed)

| Layer | Choice | Rationale |
|---|---|---|
| LLM Orchestration | Claude (Sonnet-class) via API, function calling / tool use | Strong reasoning + tool-use for multi-agent routing |
| RAG / Vector store | pgvector / Pinecone / Weaviate | Ground responses in live venue knowledge graph |
| Real-time data bus | Kafka / Redis Streams | Handle high-frequency IoT/crowd signals |
| Backend services | Node.js / Python (FastAPI) microservices per agent | Independent scaling per agent |
| Mobile/web frontend | React Native (Companion), React + Tailwind (Command dashboard) | Cross-platform speed |
| Maps / indoor nav | Mapbox indoor maps / custom SVG venue maps | Flexible for hackathon demo |
| Translation | Claude + fallback dedicated speech translation API | Quality + redundancy |
| Infra | Kubernetes on cloud (AWS/GCP/Azure), per-host-city cluster or federated | Handles 16-city independent operation |
| Observability | Prometheus/Grafana + structured audit logs | Ops visibility, compliance |

*(Full detail in 04_Backend_Logic.md)*

---

## 6. Data Sources & Integrations

| Source | Used By | MVP Approach |
|---|---|---|
| CCTV people-counting | Crowd Agent | Simulated data generator |
| Wi-Fi/BLE density probes | Crowd Agent | Simulated |
| Turnstile/ticketing scans | Crowd Agent, Ops | Simulated CSV/stream |
| Public transit API (GTFS-RT) | Transport Agent | Real public GTFS feed where available, else mocked |
| Weather API | Decision Support | Real API (OpenWeather or similar) |
| Venue static maps/POIs | Navigation, Accessibility | Manually digitized sample venue |
| Volunteer incident reports | Ops Intelligence | In-app structured form |
| Sustainability inputs (bin scans, transit mode selection) | Sustainability Agent | Manual/self-report + optional photo |

---

## 7. Success Metrics

| Metric | Target (Production Vision) |
|---|---|
| Avg. wayfinding time to seat/facility | ↓ 30% vs. baseline |
| Time to control-room advisory during density breach | < 60 seconds (vs. minutes today) |
| Fan satisfaction (accessibility & language support) | ≥ 90% CSAT |
| Exit-crush peak density | ↓ 20% via staggered exit plans |
| Sustainability score adoption | ≥ 50% of fans engage with Green Score |
| Incident response time (volunteer dispatch) | ↓ 40% |

---

## 8. Hackathon MVP vs. Production Roadmap

| Capability | Hackathon MVP | Production (Post-Hackathon) |
|---|---|---|
| Data sources | Simulated/sample feeds + 1-2 real APIs (weather, GTFS) | Live stadium IoT/CCTV integration per host venue |
| Languages | 5-10 demoed live, architecture for 20+ | 100+ languages, on-device fallback |
| Sign language avatar | Text captions only | Full generative avatar rendering |
| Decision support | Simulated anomaly + recommendation demo | Real anomaly detection models + historical training data |
| Venues | 1 sample stadium | All 16 host cities, federated deployment |
| Auth | Simple staff login | Full SSO integration with FIFA/venue identity systems |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| LLM hallucinating venue facts (e.g., wrong gate status) | Strict RAG grounding; agent must cite retrieved data; refuse to answer if data is stale/missing |
| Over-reliance on AI for safety decisions | Hard rule: human approval required for all safety-critical actions |
| Network congestion in stadium (90k phones) | Client-side caching, degraded/offline mode, edge caching of static maps |
| Translation errors in urgent situations | Confidence scoring; fallback to human volunteer + Language Agent as assist tool, not sole channel |
| Data privacy concerns (crowd surveillance perception) | Aggregate/anonymized only, no facial recognition, clear privacy notice in-app |
