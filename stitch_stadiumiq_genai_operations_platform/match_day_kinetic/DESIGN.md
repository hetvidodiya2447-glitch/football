---
name: Match Day Kinetic
colors:
  surface: '#111416'
  surface-dim: '#111416'
  surface-bright: '#37393c'
  surface-container-lowest: '#0c0e10'
  surface-container-low: '#1a1c1e'
  surface-container: '#1e2022'
  surface-container-high: '#282a2c'
  surface-container-highest: '#333537'
  on-surface: '#e2e2e5'
  on-surface-variant: '#baccaf'
  inverse-surface: '#e2e2e5'
  inverse-on-surface: '#2f3133'
  outline: '#84967c'
  outline-variant: '#3b4b35'
  surface-tint: '#13e600'
  primary: '#ebffdf'
  on-primary: '#023a00'
  primary-container: '#15ff00'
  on-primary-container: '#067100'
  inverse-primary: '#066e00'
  secondary: '#ffdb9d'
  on-secondary: '#412d00'
  secondary-container: '#feb700'
  on-secondary-container: '#6b4b00'
  tertiary: '#f6f8ff'
  on-tertiary: '#2d3136'
  tertiary-container: '#d9dce3'
  on-tertiary-container: '#5d6166'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#77ff5f'
  primary-fixed-dim: '#13e600'
  on-primary-fixed: '#012200'
  on-primary-fixed-variant: '#035300'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ffba20'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#e0e2e9'
  tertiary-fixed-dim: '#c3c7cd'
  on-tertiary-fixed: '#181c21'
  on-tertiary-fixed-variant: '#43474c'
  background: '#111416'
  on-background: '#e2e2e5'
  surface-variant: '#333537'
typography:
  display-lg:
    fontFamily: Barlow Condensed
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 64px
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 30px
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  utility-label:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  utility-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 14px
spacing:
  unit: 4px
  gutter: 16px
  margin-sm: 16px
  margin-md: 32px
  margin-lg: 48px
  edge-stroke: 2px
---

## Brand & Style

The design system is engineered for high-stakes stadium operations, where split-second decision-making and mechanical reliability are paramount. The brand personality is industrial, authoritative, and kinetic, reflecting the high-energy environment of live sports logistics.

The aesthetic follows a **Hard-Edge Industrial** style. It rejects the softness of consumer apps in favor of structural integrity and high-visibility signaling. Key characteristics include:
- **High-Contrast Functionalism:** Deep dark backgrounds paired with neon "signal" colors ensure readability in low-light control rooms or high-glare outdoor environments.
- **Structural Grid Alignment:** Every element is locked to a visible or perceived grid, utilizing heavy rules to separate data streams.
- **Zero-Blur Policy:** Shadows and gradients are replaced by solid fills and stroke offsets to maintain a "rugged digital" feel.
- **Action-Oriented Motion:** Visual cues prioritize "status" and "alerts," using color only to indicate system health or manual intervention requirements.

## Colors

The palette is strictly functional, derived from stadium lighting and industrial safety standards.

- **Stadium Shadow (#080A0C):** The foundational ink. Used for all primary backgrounds to reduce eye strain and maximize the pop of signal colors.
- **Pitch Green (#15FF00):** The "Go" signal. Reserved for active AI processes, healthy system statuses, and successful operations.
- **Signal Amber (#FFB800):** The "Caution" signal. Used exclusively for warnings, pending manual approvals, and human intervention triggers.
- **Beam White (#F2F5F7):** High-density light for maximum legibility of critical text and data.
- **Zinc Finish (#2A2E33):** The structural material. Used for borders, dividers, and inactive component states to create a sense of physical layering.

## Typography

Typography is treated as a mechanical component. 

- **Barlow Condensed (Extra Bold Italic):** Used for headlines and urgent status readouts. The slant communicates forward momentum and urgency. All headlines should be set in Uppercase.
- **Inter:** Used for standard body text and descriptive content. It provides a neutral, highly legible counterpoint to the aggressive headlines.
- **JetBrains Mono:** Dedicated to technical data, timestamps, and coordinate tracking. The monospaced nature ensures that fluctuating numbers do not cause layout shifts during live operations.

## Layout & Spacing

The layout is a **Fixed Industrial Grid** built on a 4px baseline. 

- **Grid Construction:** Layouts are divided by 2px solid "Zinc Finish" lines. Avoid whitespace-only separation; use physical borders to define data containers.
- **Density:** High information density is encouraged. Elements should feel "packed" but organized, simulating a cockpit or control panel.
- **Breakpoints:**
  - **Mobile (<600px):** Single column. Headlines scale down but retain their heavy italic weight.
  - **Tablet (600px - 1024px):** 6-column grid. Sidebars for utility data are introduced.
  - **Desktop (>1024px):** 12-column grid. Heavy use of multi-pane dashboarding for simultaneous monitoring of stadium sectors.

## Elevation & Depth

This design system avoids shadows entirely. Depth is achieved through **Tonal Boxing** and **Stroke Offsets**.

- **Level 0 (Base):** Stadium Shadow (#080A0C). The background for the entire application.
- **Level 1 (Panels):** Zinc Finish (#2A2E33) containers or panels defined by 2px solid strokes.
- **Level 2 (Active Elements):** Elements that are interactive or currently selected use a "Beam White" 1px inner stroke to highlight their edges.
- **The "Hard Shadow":** If an element needs to feel elevated, use a solid 4px offset block of Pitch Green or Zinc Finish behind the element, rather than a blurred shadow.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every button, card, and input field must have square 90-degree corners. This reinforces the industrial, non-nonsense utility of the system. For specialized status indicators, 45-degree chamfered corners may be used to indicate "Hardware" or "Machine" states, but standard UI remains rectangular.

## Components

- **Buttons:** Rectangular with a 2px stroke. Primary actions use Pitch Green backgrounds with black text. Secondary actions use Zinc Finish backgrounds with Beam White text. All text in buttons must be Barlow Condensed Bold Italic Uppercase.
- **Status Chips:** Small, monospaced (JetBrains Mono) blocks with a solid Pitch Green or Signal Amber left-side accent bar (4px wide).
- **Input Fields:** Deep black background with a 2px Zinc Finish bottom border. When focused, the border changes to Pitch Green.
- **Data Lists:** Use heavy horizontal Zinc Finish dividers (1px). Alternate row backgrounds are not used; instead, use Pitch Green text for the "key" and Beam White for the "value."
- **Cards:** Defined by a 2px Zinc Finish border. Headers of cards should have a solid Zinc Finish background with Beam White text to create a clear "handle."
- **Alerts:** Full-width bars using Signal Amber for warnings. The text should blink or pulse at a 1s interval if immediate human intervention is required.