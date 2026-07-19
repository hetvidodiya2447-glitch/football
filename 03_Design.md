# Design.md
## VAMOS AI — Design System & Visual Identity

---

## 1. Design Principles

1. **Clarity under pressure.** Fans and staff will use this in loud, crowded, high-stress environments. Every screen must be understandable in under 3 seconds, one-handed, in bright sunlight or dim tunnels.
2. **Accessibility is not a mode, it's the default posture.** High contrast, large touch targets, and screen-reader support apply to every screen, not just an "accessibility toggle."
3. **AI should feel like a knowledgeable local friend, not a form.** Conversational-first UI (chat bar front and center), not deep menu trees.
4. **One visual language, two audiences.** Companion (fan) is vibrant and celebratory; Command (staff) is calm, dense, and data-serious — but they share the same core system so they clearly belong to the same product family.
5. **Global by design.** Iconography and layout must work equally well in LTR and RTL languages, and across literacy levels (icon + text pairing, never icon-only for critical actions).

---

## 2. Brand Identity

**Name:** VAMOS AI
**Meaning:** "Vamos" (Spanish/Portuguese for "Let's go") — a natural World Cup chant, immediately understood across the three host nations (USA, Mexico, Canada) and beyond.

**Tone of voice:**
- Warm, encouraging, concise. "You've got this — Gate 11 is just ahead."
- Never robotic, never alarmist. Even advisories are calm and directive: "Let's use Gate 16 instead — quicker and just as close."
- Culturally neutral phrasing; avoid idioms that don't translate.

---

## 3. Color System

### Companion (Fan App) — vibrant, celebratory
| Token | Hex | Use |
|---|---|---|
| `--vamos-green-primary` | #0BA85C | Primary actions, "all clear" status |
| `--vamos-blue-accent` | #1C6FEB | Links, secondary actions, navigation highlights |
| `--vamos-amber-alert` | #F5A623 | "Busy" status, gentle warnings |
| `--vamos-red-alert` | #E5484D | Critical advisories only (used sparingly) |
| `--vamos-sunset-gradient` | #FF6B6B → #FFD93D | Hero/celebratory moments (match day banners) |
| `--vamos-ink` | #14181F | Primary text |
| `--vamos-surface` | #FFFFFF / #0F1216 (dark mode) | Backgrounds |

### Command (Staff Dashboard) — calm, data-serious
| Token | Hex | Use |
|---|---|---|
| `--cmd-bg` | #0D1117 | Base dark background (control-room legibility) |
| `--cmd-panel` | #161B22 | Card/panel surfaces |
| `--cmd-density-1` (low) | #2ECC71 | Heatmap level 1 |
| `--cmd-density-2` | #A3D62B | Heatmap level 2 |
| `--cmd-density-3` | #F5C518 | Heatmap level 3 |
| `--cmd-density-4` | #F0883E | Heatmap level 4 |
| `--cmd-density-5` (critical) | #F85149 | Heatmap level 5 |
| `--cmd-text-primary` | #E6EDF3 | Primary text on dark |
| `--cmd-accent` | #58A6FF | Interactive elements |

**Accessibility check:** all text/background pairs meet WCAG 2.1 AA contrast (≥ 4.5:1 for body text, ≥ 3:1 for large text/icons). Density heatmap palette is checked against common color-vision deficiencies (deuteranopia/protanopia safe — verified via simulation, not color alone; density levels are also labeled numerically/textually, never color-only).

---

## 4. Typography

| Role | Typeface | Notes |
|---|---|---|
| Companion UI | **Inter** (or system font fallback) | Excellent multilingual glyph coverage, high legibility at small sizes |
| Command UI | **Inter** + **JetBrains Mono** for data/timestamps | Mono for scannable logs/IDs |
| Minimum body size | 16px (Companion), 14px (Command) | Never below 14px anywhere critical info is shown |
| Line height | 1.5x for body text | Readability in motion/low light |

Font must support Latin, Cyrillic, Arabic, and CJK glyph sets at minimum for World Cup fan demographics; RTL layout mirroring required for Arabic.

---

## 5. Components (Core Library)

- **AI Chat Bar** — persistent, rounded, mic icon + text input, always reachable via one thumb-reach zone at bottom of screen.
- **Status Banner** — 3-state color pill (green/amber/red) + one-line generated text, always paired with an icon (not color-only).
- **Route Card** — map thumbnail + ETA + one-line "why this route" rationale + accessibility icon if step-free.
- **Density Heatmap Tile** (Command only) — zone label, numeric %, color, trend arrow (↑↓→).
- **Decision Card** (Command only) — anomaly headline, confidence %, 2-3 ranked action buttons (Approve/Modify/Reject), audit timestamp.
- **Dispatch Chip** (Command, mobile volunteer view) — instruction text + Acknowledge/En Route/Done state toggle, large touch target (min 44x44px).
- **Language Switcher** — flag-free (uses language name in-language, e.g. "Português", "العربية") to avoid nationality/flag sensitivities.
- **Green Score Ring** — circular progress ring + short encouraging microcopy, gamified but not childish.

---

## 6. Layout & Interaction Guidelines

- **Companion:** single-hand thumb-zone design; primary CTA always in bottom third of screen; max 2 taps from Home to any core action (navigate, translate, report, transport).
- **Command:** information-dense grid (map + side panel + queue), but every card has a "generated summary first, raw data on expand" pattern — never dump raw logs as the default view.
- **Motion:** subtle, purposeful only — e.g., heatmap tiles pulse gently when trending toward critical; no decorative animation that could distract control-room staff.
- **Empty/loading states:** always show a human-readable status ("Checking live crowd data…") never a bare spinner — reduces perceived latency anxiety in a stressful context.
- **Error states:** if AI/data is unavailable, UI must clearly say so and fall back to last-known-good static info (never fail silently or show stale data as if live).

---

## 7. Accessibility-Specific Design Rules

- Minimum touch target: 44×44px (mobile), 40×40px (desktop).
- All icons paired with text labels for critical actions (no icon-only buttons for navigation/safety features).
- Captions: minimum 18px, high-contrast background plate, user-adjustable size.
- Sign-language avatar: positioned consistently (bottom-right, resizable/dismissible), never obstructing primary content.
- Full screen-reader labeling (ARIA) on Companion web build; VoiceOver/TalkBack tested on mobile.
- Reduced-motion setting respected system-wide (disables non-essential animation).
- Color is **never** the sole indicator of state — always paired with icon/text/pattern.

---

## 8. Iconography & Imagery

- Icon set: rounded, 2px stroke, consistent with a "friendly guide" feel (not overly corporate/sharp).
- Avoid national flags/team crests in core UI chrome (neutral, welcoming to all fans; team pride can live in optional cosmetic themes only).
- Photography/illustration (if used): diverse, celebratory, avoids stock-photo cliché; stadium-specific illustrations for onboarding.

---

## 9. Dark Mode

- Companion: supports both light (default, daytime pre-match) and dark (evening matches) — auto-switch by device setting.
- Command: **dark by default** — control rooms are typically dim, and dark UI reduces eye strain during long shifts; heatmap colors are calibrated for dark background contrast.

---

## 10. Sample Screen Descriptions (for hackathon mockups)

1. **Companion Home:** Warm gradient header with match countdown → central chat bar with placeholder "Ask me anything, in any language" → 4 quick-action chips below → status banner pinned at top.
2. **Navigation Result:** Map card up top (route line + pins) → route rationale line ("via Concourse B, less busy") → ETA + accessibility badge → "Start Navigation" primary button.
3. **Command Live Overview:** Left 60% = venue map with color-coded zones; right 40% = scrolling AI-generated situation feed + Decision Support cards stacked by priority.
4. **Decision Card (expanded):** Anomaly title + confidence meter → 3 ranked option buttons with one-line rationale each → "Approve / Modify / Reject" + audit note field.
