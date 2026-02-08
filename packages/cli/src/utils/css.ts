/**
 * Base glass CSS that gets injected during `init`.
 * This is the minimal set of variables + classes needed for sandbox-ui components.
 */

export const BASE_CSS = `/* ═══ sandbox-ui: Glass Design Tokens ═══════════════════════════ */

/* Dark mode (default) */
:root {
  --fg: #e8e8e8;
  --body-bg: #0a0a0a;
  --accent: #c0c0c0;

  /* Glass surface */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-bg-strong: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-strong: rgba(255, 255, 255, 0.14);
  --glass-blur: 18px;

  /* Depth & reflections */
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.65);
  --glass-shadow-lg: 0 24px 60px rgba(0, 0, 0, 0.55);
  --glass-edge-top: rgba(255, 255, 255, 0.12);
  --glass-edge-bottom: rgba(0, 0, 0, 0.1);
  --glass-specular: rgba(255, 255, 255, 0.14);
  --glass-sheen: rgba(255, 255, 255, 0.05);
  --glass-depth: rgba(0, 0, 0, 0.06);
  --glass-inner-glow: rgba(255, 255, 255, 0.015);
  --glass-noise: rgba(255, 255, 255, 0.02);
  --card-glow: rgba(255, 255, 255, 0.06);

  /* Pastel accents */
  --pastel-pink: #f2a0b8;
  --pastel-blue: #a0c4f2;
  --pastel-green: #a0e6c8;
  --pastel-yellow: #f2e0a0;
  --pastel-purple: #c0a0f2;
  --pastel-orange: #f2c0a0;
}

/* Light mode overrides */
[data-theme="light"] {
  --fg: #1a1a1e;
  --body-bg: #e4e5e8;
  --accent: #2c2c30;

  --glass-bg: rgba(255, 255, 255, 0.55);
  --glass-bg-strong: rgba(255, 255, 255, 0.70);
  --glass-border: rgba(0, 0, 0, 0.06);
  --glass-border-strong: rgba(0, 0, 0, 0.10);
  --glass-blur: 20px;

  --glass-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  --glass-shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.08);
  --glass-edge-top: rgba(255, 255, 255, 0.70);
  --glass-edge-bottom: rgba(0, 0, 0, 0.03);
  --glass-specular: rgba(255, 255, 255, 0.30);
  --glass-sheen: rgba(255, 255, 255, 0.15);
  --glass-depth: rgba(0, 0, 0, 0.02);
  --glass-inner-glow: rgba(255, 255, 255, 0.08);
  --glass-noise: rgba(0, 0, 0, 0.008);
  --card-glow: rgba(0, 0, 0, 0.03);

  --pastel-pink: #c4607a;
  --pastel-blue: #4a80b8;
  --pastel-green: #3a9070;
  --pastel-yellow: #a89040;
  --pastel-purple: #7a58b8;
  --pastel-orange: #b87848;
}

/* ═══ sandbox-ui: Tailwind Token Registration ═══════════════════ */
@theme inline {
  --color-fg: var(--fg);
  --color-accent: var(--accent);
  --color-pastel-pink: var(--pastel-pink);
  --color-pastel-blue: var(--pastel-blue);
  --color-pastel-green: var(--pastel-green);
  --color-pastel-yellow: var(--pastel-yellow);
  --color-pastel-purple: var(--pastel-purple);
  --color-pastel-orange: var(--pastel-orange);
}

/* ═══ sandbox-ui: Glass Surfaces ════════════════════════════════ */
@layer components {
  .glass {
    position: relative;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    box-shadow:
      var(--glass-shadow),
      inset 0 1px 0 0 var(--glass-edge-top),
      inset 0 -1px 0 0 var(--glass-edge-bottom),
      inset 0 0 40px var(--glass-inner-glow);
    transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .glass::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background-image:
      repeating-conic-gradient(var(--glass-noise) 0% 25%, transparent 0% 50%),
      linear-gradient(90deg, var(--glass-sheen) 0%, transparent 4%),
      radial-gradient(ellipse 80% 50% at 25% 0%, var(--glass-specular) 0%, transparent 50%),
      linear-gradient(180deg, var(--glass-sheen) 0%, transparent 35%, transparent 65%, var(--glass-depth) 100%);
    background-size: 3px 3px, 100% 100%, 100% 100%, 100% 100%;
    opacity: 0.8;
    transition: opacity 0.4s ease-out;
  }

  .glass:hover::before {
    opacity: 1;
  }

  .glass-strong {
    position: relative;
    background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border-strong);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    box-shadow:
      var(--glass-shadow),
      inset 0 1px 0 0 var(--glass-edge-top),
      inset 0 -1px 0 0 var(--glass-edge-bottom),
      inset 0 0 40px var(--glass-inner-glow);
    transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .glass-strong::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background-image:
      repeating-conic-gradient(var(--glass-noise) 0% 25%, transparent 0% 50%),
      linear-gradient(90deg, var(--glass-sheen) 0%, transparent 4%),
      radial-gradient(ellipse 80% 50% at 25% 0%, var(--glass-specular) 0%, transparent 50%),
      linear-gradient(180deg, var(--glass-sheen) 0%, transparent 35%, transparent 65%, var(--glass-depth) 100%);
    background-size: 3px 3px, 100% 100%, 100% 100%, 100% 100%;
    opacity: 0.8;
    transition: opacity 0.4s ease-out;
  }

  .glass-strong:hover::before {
    opacity: 1;
  }
}

/* ═══ sandbox-ui: 3D Glass Cards ════════════════════════════════ */
.glass-3d {
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition:
    transform 0.25s ease-out,
    translate 0.3s ease-out,
    box-shadow 0.3s ease-out,
    background 0.4s ease,
    border-color 0.4s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.glass-3d:hover {
  box-shadow:
    var(--glass-shadow-lg),
    inset 0 1px 0 0 var(--glass-edge-top),
    inset 0 -1px 0 0 var(--glass-edge-bottom),
    inset 0 0 60px var(--glass-inner-glow);
}

.glass-3d::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease-out;
  background: radial-gradient(
    350px circle at var(--gx, 50%) var(--gy, 50%),
    var(--card-glow) 0%,
    transparent 60%
  );
  z-index: 2;
}

.glass-3d:hover::after {
  opacity: 1;
}

/* ═══ sandbox-ui: Fade-in Animation ═════════════════════════════ */
@keyframes fade-up {
  from { opacity: 0; translate: 0 30px; }
  to   { opacity: 1; translate: 0 0; }
}

.animate-fade-up {
  animation: fade-up 0.8s ease-out backwards;
}
/* ═══ end sandbox-ui ════════════════════════════════════════════ */`;

export const MARKER_START = "/* ═══ sandbox-ui: Glass Design Tokens";
export const MARKER_END = "/* ═══ end sandbox-ui";

/**
 * Check whether a CSS file already contains sandbox-ui base styles.
 */
export function hasBaseStyles(css: string): boolean {
  return css.includes(MARKER_START);
}
