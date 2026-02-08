# Sandbox — Glassmorphism Component Showcase

A premium glassmorphism design system and component showcase built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Features frosted glass surfaces, pastel accent colors, animated particles, 3D transforms, and rich interactivity — all with zero UI library dependencies.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm, yarn, pnpm, or bun

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project Structure

```
app/
  layout.tsx              # Root layout, fonts (Geist Sans, Geist Mono, Space Grotesk)
  globals.css             # CSS variables, glass classes, animations, theme overrides
  page.tsx                # Welcome / landing page
  buttons/page.tsx        # Buttons showcase
  cards/page.tsx          # Cards showcase (3D tilt + specular glow)
  calendar/page.tsx       # Calendar: roadmap timeline, month calendar, analog clock, week ring
  charts/page.tsx         # Charts: line, bar, scatter (pure SVG)
  devices/page.tsx        # CSS-only iPhone, MacBook, iPad mockups
  docs/page.tsx           # Documentation page
  flow/page.tsx           # Interactive node canvas (pan, zoom, wires, undo/redo)
  navbar/page.tsx         # Navbar showcase
  nodes/page.tsx          # Static node graph infographics
  pricing/page.tsx        # Pricing table
  table/page.tsx          # Table components
components/
  theme-provider.tsx      # Dark/light mode context (data-theme attribute)
  theme-shell.tsx         # Layout wrapper: sticky navbar + scrollable content
  ui/
    button.tsx            # Button (primary | secondary | ghost)
    card.tsx              # 3D tilt card with cursor-following glow
    cryptic-text.tsx      # Animated text scramble effect
    navbar.tsx            # 3D carousel navbar with perspective transforms
    pricing.tsx           # Pricing table with 3 tier plans
lib/
  cn.ts                   # clsx + tailwind-merge utility
```

## Tech Stack

| Layer         | Technology                             |
|---------------|----------------------------------------|
| Framework     | Next.js 16 (App Router)                |
| UI Library    | React 19                               |
| Styling       | Tailwind CSS v4 + CSS custom properties |
| Fonts         | Geist Sans, Geist Mono, Space Grotesk  |
| Class Merging | clsx + tailwind-merge                  |
| Linting       | ESLint (eslint-config-next)            |
| Language      | TypeScript (strict mode)               |

## Design System

### Theme

Dark mode is the default. Light mode uses a cool off-white palette. Toggled via `data-theme="light"` on `<html>`.

All styling derives from CSS variables defined in `app/globals.css`:

- `--fg` / `--body-bg` — foreground and background
- `--glass-bg` / `--glass-bg-strong` — frosted glass surface fills
- `--glass-border` / `--glass-border-strong` — glass surface edges
- `--glass-shadow` — layered box shadows

### Pastel Accents

Six pastel colors for categories, events, charts, and nodes:

- `--pastel-pink` `#f2a0b8`
- `--pastel-blue` `#a0c4f2`
- `--pastel-green` `#a0e6c8`
- `--pastel-yellow` `#f2e0a0`
- `--pastel-purple` `#c0a0f2`
- `--pastel-orange` `#f2c0a0`

### Glass Materials

Two tiers: `.glass` (subtle) and `.glass-strong` (elevated). Each includes backdrop blur, semi-transparent backgrounds, multi-layer box shadows, and a `::before` pseudo-element for noise texture and specular highlights.

### 3D Cards

Cards use `rotateX` / `rotateY` transforms driven by `mousemove` via `requestAnimationFrame`, with a cursor-following radial gradient glow.

## Pages

| Route        | Description |
|--------------|-------------|
| `/`          | Welcome landing page with animated walkthrough |
| `/buttons`   | Button variants, sizes, and states |
| `/cards`     | 3D tilt cards with specular glow |
| `/calendar`  | Notion-style roadmap, month calendar, analog clock, week ring |
| `/charts`    | Line, bar, and scatter charts (pure SVG) |
| `/devices`   | CSS-only device mockups (iPhone, MacBook, iPad) |
| `/docs`      | Documentation page |
| `/flow`      | Interactive React Flow-style canvas (zero dependencies) |
| `/navbar`    | 3D carousel navbar showcase |
| `/nodes`     | Static node graph infographics with hover highlighting |
| `/pricing`   | Tiered pricing table with premium card effects |
| `/table`     | Data table components |

## Key Features

- **Glassmorphism everywhere** — backdrop blur, translucent surfaces, layered shadows
- **Dark and light mode** — full theme support via CSS variables
- **3D navbar carousel** — perspective transforms with cubic-bezier timing
- **Interactive flow canvas** — pan, zoom, snap-to-grid, wire drawing, undo/redo, node palette
- **Pure SVG charts and graphs** — no charting library needed
- **CSS-only device mockups** — pixel-accurate iPhone, MacBook, iPad frames
- **Animated particles** — flowing along edges in node graphs and the flow canvas
- **Performance-first** — `requestAnimationFrame`, `ResizeObserver`, targeted transitions, `useCallback`/`useMemo`

## Scripts

| Command          | Description                        |
|------------------|------------------------------------|
| `npm run dev`    | Start development server           |
| `npm run build`  | Create production build            |
| `npm start`      | Start production server            |
| `npm run lint`   | Run ESLint                         |

## License

Private project.
