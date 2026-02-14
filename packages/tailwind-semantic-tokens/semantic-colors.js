const colors = require("@pado/tailwind-design-tokens/colors");

const semanticColors = {
  light: {
    // ── Surface (배경 계층) ──
    "--bg-page": colors.neutral[100],
    "--bg-surface": colors.white,
    "--bg-elevated": colors.white,
    "--bg-overlay": "rgba(0, 0, 0, 0.5)",
    "--bg-primary": colors.primary[500],
    "--bg-secondary": colors.neutral[200],
    "--bg-destructive": colors.danger[500],
    "--bg-success": colors.success[500],
    "--bg-warning": colors.warning[500],

    // ── ACT 도메인 ──
    "--bg-act-page": colors.act.page,
    "--btn-act-page": colors.act.button,
    "--btn-act-page-selected": colors.blue[500],
    "--btn-act-page-unselected": colors.blue[50],
    "--act-input-bg": "rgba(255, 255, 255, 0.5)",
    "--act-input-placeholder": colors.blue[700],

    // ── Ocean (바다 시각화 — 가까울수록 진함) ──
    "--ocean-bg-wave": colors.ocean[50],
    "--ocean-horizon": colors.ocean[100],
    "--ocean-mid-wave": colors.ocean[200],
    "--ocean-fore-wave": colors.ocean[300],
    "--ocean-front-wave": colors.ocean[400],
    "--ocean-deep": colors.ocean[900],
    "--ocean-act-path": colors.ocean[500],
    "--ocean-act-step": colors.ocean[600],
    "--ocean-path-line": "rgba(255, 255, 255, 0.15)",

    // ── Chat (라이트/다크 동일 — 항상 어두운 톤) ──
    "--bg-chat-overlay": "rgba(0, 0, 0, 0.88)",
    "--bg-chat-assistant": colors.neutral[900],
    "--bg-chat-user": colors.neutral[800],
    "--chat-input-bg": "rgba(65, 65, 65, 0.9)",
    "--chat-icon-default": "rgba(255, 255, 255, 0.9)",
    "--chat-icon-active": "#FFFFFF",
    "--chat-placeholder": "rgba(255, 255, 255, 0.5)",
    "--chat-border": "rgb(224, 224, 224)",

    // ── Text 계층 (WCAG AA 준수) ──
    "--text-primary": colors.neutral[800],
    "--text-secondary": colors.neutral[600],
    "--text-tertiary": colors.neutral[500],
    "--text-disabled": colors.neutral[400],
    "--text-inverse": colors.white,
    "--text-destructive": colors.danger[500],
    "--text-success": colors.success[600],
    "--text-warning": colors.warning[600],
    "--text-chat-assistant": colors.white,
    "--text-chat-user": colors.neutral[900],

    // ── Icon ──
    "--icon-primary": colors.neutral[800],
    "--icon-secondary": colors.neutral[500],

    // ── Border ──
    "--border-default": colors.neutral[300],
    "--border-subtle": colors.neutral[200],
    "--border-focus": colors.primary[500],
    "--border-destructive": colors.danger[500],
    "--border-success": colors.success[500],

    // ── Interactive (버튼/입력) ──
    "--btn-cancel-bg": colors.neutral[300],
    "--btn-cancel-text": colors.neutral[700],
    "--input-bg": colors.white,
    "--input-border": colors.neutral[300],
    "--input-border-focus": colors.primary[500],
    "--input-text": colors.neutral[900],
    "--input-placeholder": colors.neutral[500],
    "--input-disabled-bg": colors.neutral[100],
    "--input-disabled-text": colors.neutral[400],

    // ── Shadow ──
    "--shadow-sm": "rgba(0, 0, 0, 0.05)",
    "--shadow-md": "rgba(0, 0, 0, 0.1)",
    "--shadow-lg": "rgba(0, 0, 0, 0.15)",
    "--shadow-xl": "rgba(0, 0, 0, 0.2)",
  },

  dark: {
    // ── Surface (배경 계층) ──
    "--bg-page": "#1C1D22",
    "--bg-surface": colors.neutral[800],
    "--bg-elevated": colors.neutral[700],
    "--bg-overlay": "rgba(0, 0, 0, 0.7)",
    "--bg-primary": colors.primary[700],
    "--bg-secondary": colors.neutral[700],
    "--bg-destructive": colors.danger[700],
    "--bg-success": colors.success[700],
    "--bg-warning": colors.warning[700],

    // ── ACT 도메인 ──
    "--bg-act-page": colors.act.pageDark,
    "--btn-act-page": colors.act.buttonDark,
    "--btn-act-page-selected": "#5A82AE",
    "--btn-act-page-unselected": "#252A32",
    "--act-input-bg": "rgba(255, 255, 255, 0.05)",
    "--act-input-placeholder": colors.blue[100],

    // ── Ocean (바다 시각화 — 다크: Vivid Indigo hue, 밝기 UP) ──
    "--ocean-bg-wave": "#3A5A90",
    "--ocean-horizon": "#304E82",
    "--ocean-mid-wave": "#264274",
    "--ocean-fore-wave": "#1E3666",
    "--ocean-front-wave": "#162A58",
    "--ocean-deep": "#0A1430",
    "--ocean-act-path": "#12234C",
    "--ocean-act-step": "#101F44",
    "--ocean-path-line": "rgba(255, 255, 255, 0.25)",

    // ── Chat (라이트/다크 동일) ──
    "--bg-chat-overlay": "rgba(0, 0, 0, 0.88)",
    "--bg-chat-assistant": colors.neutral[900],
    "--bg-chat-user": colors.neutral[800],
    "--chat-input-bg": "rgba(65, 65, 65, 0.9)",
    "--chat-icon-default": "rgba(255, 255, 255, 0.9)",
    "--chat-icon-active": "#FFFFFF",
    "--chat-placeholder": "rgba(255, 255, 255, 0.5)",
    "--chat-border": "rgba(255, 255, 255, 0.15)",

    // ── Text 계층 ──
    "--text-primary": colors.neutral[100],
    "--text-secondary": colors.neutral[300],
    "--text-tertiary": colors.neutral[400],
    "--text-disabled": colors.neutral[600],
    "--text-inverse": colors.neutral[900],
    "--text-destructive": colors.danger[400],
    "--text-success": colors.success[400],
    "--text-warning": colors.warning[400],
    "--text-chat-assistant": colors.white,
    "--text-chat-user": colors.white,

    // ── Icon ──
    "--icon-primary": colors.neutral[100],
    "--icon-secondary": colors.neutral[400],

    // ── Border ──
    "--border-default": colors.neutral[700],
    "--border-subtle": colors.neutral[800],
    "--border-focus": colors.primary[400],
    "--border-destructive": colors.danger[400],
    "--border-success": colors.success[400],

    // ── Interactive (버튼/입력) ──
    "--btn-cancel-bg": colors.neutral[700],
    "--btn-cancel-text": colors.neutral[300],
    "--input-bg": colors.neutral[800],
    "--input-border": colors.neutral[700],
    "--input-border-focus": colors.primary[500],
    "--input-text": colors.neutral[100],
    "--input-placeholder": colors.neutral[500],
    "--input-disabled-bg": colors.neutral[800],
    "--input-disabled-text": colors.neutral[600],

    // ── Shadow ──
    "--shadow-sm": "rgba(0, 0, 0, 0.2)",
    "--shadow-md": "rgba(0, 0, 0, 0.3)",
    "--shadow-lg": "rgba(0, 0, 0, 0.4)",
    "--shadow-xl": "rgba(0, 0, 0, 0.5)",
  },
};

module.exports = semanticColors;
