/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#ffffff",
        "primary-fixed": "#dfff00",
        "on-primary-fixed": "#191e00",
        "secondary": "#dcb8ff",
        "secondary-fixed": "#dcb8ff",
        "secondary-container": "#7701d0",
        "on-secondary-container": "#dcb7ff",
        "tertiary": "#ffffff",
        "surface": "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#393939",
        "background": "#000000",
        "on-background": "#e5e2e1",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c6c9ab",
        "outline": "#909378",
        "outline-variant": "#454932",
        "error": "#ffb4ab",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "cyber-volt": "#dfff00"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "unit": "4px",
        "gutter": "16px",
        "margin-mobile": "16px",
        "margin-desktop": "32px",
        "container-max": "1440px"
      },
      fontFamily: {
        "display-xl": ["Anybody"],
        "display-lg": ["Anybody"],
        "headline-lg": ["Anybody"],
        "headline-md": ["Anybody"],
        "headline-sm": ["Anybody"],
        "body-lg": ["Anybody"],
        "body-md": ["Anybody"],
        "label-caps": ["Anybody"],
        "display-lg-mobile": ["Anybody"],
        "headline-lg-mobile": ["Anybody"]
      },
      fontSize: {
        "display-xl": ["72px", {"lineHeight": "1.0", "letterSpacing": "-0.04em", "fontWeight": "800"}],
        "display-lg": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg-mobile": ["32px", {"lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
        "headline-sm": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "label-caps": ["12px", {"lineHeight": "16px", "letterSpacing": "0.15em", "fontWeight": "700"}]
      }
    },
  },
  plugins: [],
}
