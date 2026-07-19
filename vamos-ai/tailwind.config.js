export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "cyber-volt": "#DFFF00",
        "on-background": "#e5e2e1",
        "surface-variant": "#353534",
        "on-surface-variant": "#c6c9ab",
        "primary": "#ffffff",
        "secondary": "#dcb8ff"
      },
      fontFamily: {
        "headline-lg": ["Anybody"],
        "body-md": ["Anybody"],
        "label-caps": ["Anybody"],
        "headline-md": ["Anybody"],
        "body-lg": ["Anybody"],
        "headline-sm": ["Anybody"],
        "display-xl": ["Anybody"],
        "headline-lg-mobile": ["Anybody"]
      },
      fontSize: {
        "headline-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.01em", "fontWeight": "700"}],
        "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "label-caps": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "700"}],
        "headline-md": ["32px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "headline-sm": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "display-xl": ["72px", {"lineHeight": "1.0", "letterSpacing": "-0.02em", "fontWeight": "800"}],
        "headline-lg-mobile": ["36px", {"lineHeight": "1.1", "fontWeight": "700"}]
      }
    },
  },
  plugins: [],
}
