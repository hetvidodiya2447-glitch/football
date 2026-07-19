---
name: Cyber-Athletic Performance Interface
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c6c9ab'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#909378'
  outline-variant: '#454932'
  surface-tint: '#b8d300'
  primary: '#ffffff'
  on-primary: '#2c3400'
  primary-container: '#d2f000'
  on-primary-container: '#5d6b00'
  inverse-primary: '#576500'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#ffffff'
  on-tertiary: '#00363a'
  tertiary-container: '#7df4ff'
  on-tertiary-container: '#006f77'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2f000'
  primary-fixed-dim: '#b8d300'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414c00'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Anybody
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anybody
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Anybody
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Anybody
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Anybody
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Anybody
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.15em
  data-mono:
    fontFamily: Anybody
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for high-stakes sports environments, blending peak athletic performance with cutting-edge data visualization. It targets professional analysts, stadium operators, and elite athletes who require immediate, actionable insights.

The aesthetic follows a **Cyber-Athletic** movement: a fusion of futuristic Neo-Brutalism and Glassmorphism. The interface evokes a sense of "digital precision" and "kinetic energy." It utilizes high-contrast visuals, data-dense layouts, and technical flourishes like microscopic borders and neon glows to simulate a heads-up display (HUD). The emotional response should be one of intense focus, technical superiority, and high-velocity intelligence.

## Colors

The palette is anchored in a true **Midnight Black (#000000)** base to maximize contrast and power efficiency on OLED displays. 

- **Primary (Cyber Volt):** A high-visibility neon yellow-green used exclusively for critical actions, success states, and primary data points. It should "vibrate" against the dark background.
- **Secondary (Electric Violet):** A deep, energetic purple used for secondary branding, interactive accents, and differentiating data sets.
- **Tertiary (Cyber Cyan):** Introduced for tertiary technical details and informational status indicators.
- **Neutrals:** A range of Slate Greys (from `#0A0A0A` to `#2D2D2D`) are used for container backgrounds and structural borders to maintain depth without breaking the dark immersion.
- **Functional Glows:** Active states should utilize a 10-15px outer blur using the primary or secondary color at 40% opacity to simulate a neon hardware effect.

## Typography

This design system exclusively uses **Anybody**, leveraging its variable width and weight to create a technical, high-performance atmosphere. 

Headlines utilize Expanded and Bold widths to command attention, while body text remains in Normal width for legibility. For data-heavy views, use the **label-caps** style to emulate industrial markings. Numerical data should always feel monospaced; utilize the tabular numerals feature of the font to ensure alignment in dashboards. High-contrast color application is critical—ensure Cyber Volt is only used on weights above 600 for maximum readability.

## Layout & Spacing

The layout is built on a **4px hard grid**, ensuring mathematical precision in every element. 

- **Grid Model:** A 12-column fluid grid for desktop and a 4-column grid for mobile.
- **Data Density:** Spacing is intentionally tight to allow for maximum information on screen. Use "Micro-Padding" (4px or 8px) for internal component spacing.
- **Reflow:** On mobile, complex data tables should transition into vertical "Metric Cards."
- **Safe Zones:** High-contrast borders act as the primary separators rather than whitespace, allowing for a more compact, "engineered" feel.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

1.  **Base Layer:** Midnight Black (#000000).
2.  **Surface Layer:** Translucent Slate Grey (#1A1A1A at 70% opacity) with a 20px background blur.
3.  **Borders:** Every container must have a 1px solid border. Use `#FFFFFF10` for inactive states and the Primary/Secondary colors for active states.
4.  **Outer Glows:** Instead of drop shadows, use a `box-shadow: 0 0 15px [color]40` on active or "hot" elements to simulate light emission.
5.  **Scanlines:** A subtle, 2% opacity horizontal pattern can be overlaid on the entire UI to enhance the futuristic monitor aesthetic.

## Shapes

The shape language is defined by **precision and rigidity**. Following the "ROUND_FOUR" logic, the system uses minimal rounding (4px/0.25rem) to maintain a sharp, technical appearance while avoiding the harshness of raw 0px corners.

- **Standard Elements:** 4px (Soft) radius.
- **Interactive Triggers:** 4px radius.
- **Large Containers:** 8px (Large) radius.
- **Exceptions:** Notification pips and status dots are the only elements permitted to be 100% circular (pill-shaped).

## Components

- **Buttons:** High-intensity blocks. Primary buttons use a solid Cyber Volt fill with Black text. Secondary buttons use a transparent fill with an Electric Violet 1px border and glowing hover state.
- **Metrics Chips:** Small, rectangular containers with a 1px border. They include a small "Status Glow" dot in the corner to indicate data freshness.
- **Input Fields:** Dark grey backgrounds with bottom-only borders that "light up" (Cyber Volt) when focused. Use monospaced fonts for numerical input.
- **Data Cards:** Glassmorphic panels with a 1px border. The top-left corner should feature a "technical ID" or label in uppercase 10px type.
- **Gauges & Progress:** Linear and angular bars only. Avoid soft curves. Use segmenting (e.g., a bar made of 10 small blocks) to reinforce the digital/technical theme.
- **Tabs:** Underline style using the Primary color, with the active tab emitting a subtle vertical gradient glow from the baseline.