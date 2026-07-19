---
name: Pro-Sport Athletic Visual Identity
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c3c5d9'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#8d90a2'
  outline-variant: '#434656'
  surface-tint: '#b7c4ff'
  primary: '#b7c4ff'
  on-primary: '#002682'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#004ced'
  secondary: '#ffffff'
  on-secondary: '#283500'
  secondary-container: '#c3f400'
  on-secondary-container: '#556d00'
  tertiary: '#ffb4aa'
  on-tertiary: '#690003'
  tertiary-container: '#cc0d11'
  on-tertiary-container: '#ffddd8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#c3f400'
  secondary-fixed-dim: '#abd600'
  on-secondary-fixed: '#161e00'
  on-secondary-fixed-variant: '#3c4d00'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-xl:
    fontFamily: Barlow Condensed
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Archivo Narrow
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.1'
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  skew-angle: -12deg
---

## Brand & Style
The design system is engineered for high-stakes sports environments, prioritizing speed, intensity, and precision. It moves away from passive tech-centric aesthetics toward an aggressive, "Pro-Sport" broadcast style. The goal is to evoke the adrenaline of a live stadium event while maintaining the clarity required for critical decision support.

The style is a fusion of **High-Contrast Bold** and **Modern Brutalism**. It utilizes heavy strokes, slanted geometry, and high-intensity visual cues to mimic the energy of movement and competitive performance. Every element should feel engineered for a professional athlete or a high-capacity stadium operator.

## Colors
The palette is built on a "Dark Mode First" foundation to reduce glare in stadium control rooms while allowing high-visibility accents to pop. 

- **Primary (Electric Blue):** Used for core actions, primary navigation states, and "In-Progress" indicators.
- **Secondary (High-Vis Yellow):** Reserved for critical alerts, active highlights, and "Live" status indicators. It must always be paired with dark text for accessibility.
- **Tertiary (Racing Red):** Used exclusively for high-priority warnings, emergency stops, and crowd density alerts.
- **Surface/Neutral:** A deep Charcoal (#0A0A0B) serves as the stadium "canvas," providing maximum contrast for the vivid accent colors.

## Typography
The typography system mimics stadium scoreboards and jersey lettering. 

- **Headlines:** Use **Barlow Condensed** in Bold or Extra Bold weights. Always use Uppercase for Display and Large Headline roles to convey authority and impact.
- **Body:** **Archivo Narrow** provides a compact, legible reading experience for data-heavy tables and descriptions, maintaining the "condensed" athletic feel.
- **Data & Labels:** **JetBrains Mono** is used for technical data points, coordinates, and timestamps to provide a precise, engineered feel to decision support metrics.

## Layout & Spacing
This design system uses a strict 12-column grid with a heavy emphasis on geometric "lean."

- **The Skew:** Use a -12 degree skew on specific decorative containers, button ends, or "Live" badges to suggest speed.
- **Grid:** Columns are separated by generous 24px gutters to prevent high-intensity cards from feeling cluttered.
- **Rhythm:** Use a 4px baseline grid. Components should be spaced in multiples of 8px (8, 16, 24, 40, 64) to maintain a rigid, athletic structure.
- **Mobile:** On small screens, the 12-column grid collapses to 4 columns. Slanted elements should be used sparingly on mobile to preserve horizontal tap targets.

## Elevation & Depth
Depth is not achieved through soft shadows, but through **Bold Borders** and **High-Intensity Offsets**.

- **Shadows:** Use "Hard Shadows" with 100% opacity, offset by 4px or 8px (e.g., `4px 4px 0px #000000`). This creates a stacked, physical effect rather than an ambient one.
- **Borders:** Every container should have a 2px or 3px solid border. Use the Primary color for active states and a muted grey (#2A2A2E) for inactive surfaces.
- **Textures:** Large background areas should utilize a subtle "Mesh" pattern (SVG dots or small diagonals) at 5% opacity to mimic jersey fabric and technical gear.

## Shapes
The shape language is strictly **Sharp (0px)**. 

Curves are avoided entirely to maintain the aggressive, high-performance aesthetic. Use 45-degree chamfered corners or -12 degree skewed parallelograms for buttons and status tags. This angularity reinforces the "Pro-Sport" broadcast identity and suggests precision engineering.

## Components

- **Action Cards:** These are the core of the decision support track. They feature 3px solid borders, hard 8px shadows, and a "lean" (skewed) header bar in High-Vis Yellow or Electric Blue.
- **Buttons:** Large, blocky, and uppercase. The primary button uses a chamfered right-side edge and a High-Vis Yellow background with Black text. 
- **Status Chips:** Small parallelograms. For example, a "LIVE" indicator should be a skewed Racing Red block with white JetBrains Mono text.
- **Progress Bars:** Known as "Performance Meters," these should use thick segments rather than a continuous line, resembling a digital equalizer or stadium power meter.
- **Inputs:** High-contrast fields with 2px borders that thicken to 4px on focus. Placeholder text should be in Archivo Narrow.
- **Navigation:** A heavy side-bar or top-bar with oversized icons and condensed labels. Active states are indicated by a 4px "Racing Stripe" in the Primary color.