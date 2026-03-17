const plugin = require("tailwindcss/plugin");
const semanticColors = require("./semantic-colors");

// NOTE: Cache must be cleared if any color token values are modified
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      backgroundColor: {
        page: "var(--bg-page)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        overlay: "var(--bg-overlay)",
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        destructive: "var(--bg-destructive)",
        success: "var(--bg-success)",
        // ACT
        "act-page": "var(--bg-act-page)",
        "btn-act-page": "var(--btn-act-page)",
        "btn-act-page-selected": "var(--btn-act-page-selected)",
        "btn-act-page-unselected": "var(--btn-act-page-unselected)",
        "btn-dark": "var(--btn-dark)",
        "act-input": "var(--act-input-bg)",
        // Ocean
        "ocean-bg": "var(--ocean-bg-wave)",
        "ocean-mid": "var(--ocean-mid-wave)",
        "ocean-fore": "var(--ocean-fore-wave)",
        "ocean-front": "var(--ocean-front-wave)",
        "ocean-deep": "var(--ocean-deep)",
        "ocean-horizon": "var(--ocean-horizon)",
        // Chat
        "chat-overlay": "var(--bg-chat-overlay)",
        "chat-assistant": "var(--bg-chat-assistant)",
        "chat-user": "var(--bg-chat-user)",
        "chat-input": "var(--chat-input-bg)",
        // Interactive
        "btn-cancel": "var(--btn-cancel-bg)",
        input: "var(--input-bg)",
        "input-disabled": "var(--input-disabled-bg)",
      },
      textColor: {
        body: "var(--text-primary)",
        sub: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        disabled: "var(--text-disabled)",
        inverse: "var(--text-inverse)",
        destructive: "var(--text-destructive)",
        success: "var(--text-success)",
        // Chat
        "chat-assistant": "var(--text-chat-assistant)",
        "chat-user": "var(--text-chat-user)",
        // Interactive
        "btn-cancel": "var(--btn-cancel-text)",
        input: "var(--input-text)",
        "input-placeholder": "var(--input-placeholder)",
        "input-disabled": "var(--input-disabled-text)",
        "act-input-placeholder": "var(--act-input-placeholder)",
      },
      borderColor: {
        default: "var(--border-default)",
        subtle: "var(--border-subtle)",
        focus: "var(--border-focus)",
        destructive: "var(--border-destructive)",
        input: "var(--input-border)",
        "input-focus": "var(--input-border-focus)",
        "btn-act-page": "var(--btn-act-page)",
        chat: "var(--chat-border)",
      },
      colors: {
        "icon-primary": "var(--icon-primary)",
        "icon-secondary": "var(--icon-secondary)",
        "chat-icon-default": "var(--chat-icon-default)",
        "chat-icon-active": "var(--chat-icon-active)",
        "chat-placeholder": "var(--chat-placeholder)",
        "ocean-act-path": "var(--ocean-act-path)",
        "ocean-act-step": "var(--ocean-act-step)",
      },
      boxShadowColor: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": semanticColors.light,
        ":root.dark": semanticColors.dark,
      });
    }),
  ],
};
