# Design System Spec — Liquid Glass / Liquid Metal (Next.js + Tailwind)

This project aims for calm minimalism: high contrast, precise spacing, and believable materials.
Themes are implemented via **CSS variables** (tokens) in `app/globals.css`.

---

## 1) Tokens (the contract)

Define these in `:root` and override in `.dark`.

### Color + typography
- `--bg`: page background
- `--fg`: primary text
- `--muted`: secondary text
- `--accent`: brand/accent color (single accent)

### Surfaces (materials)
- `--surface`: primary glass surface fill
- `--surface-2`: stronger surface fill (used for primary buttons / featured cards)
- `--border`: default border for glass
- `--border-strong`: emphasized border (featured/active)
- `--highlight`: specular highlight color (sheen)

### Depth
- `--shadow`: primary shadow string for surfaces
- `--radius`: base border radius
- `--blur`: backdrop blur strength (e.g. `18px`)

Guideline: **keep tokens stable and few**. New tokens require a reason.

---

## 2) Material recipes (copy/paste patterns)

### A) Glass Surface (Card / Navbar container)
**Purpose:** reusable premium surface.

**Requirements**
- Background: `--surface`
- Border: `--border`
- Backdrop blur: `--blur`
- Shadow: `--shadow`
- Sheen overlay using `::before`

**Tailwind usage (token-driven)**
- `bg-[color:var(--surface)]`
- `border border-[color:var(--border)]`
- `shadow-[var(--shadow)]`
- `rounded-[var(--radius)]`

**Do**
- Keep sheen subtle (opacity ~0.4–0.6)
- Prefer one direction (top-left → bottom-right)

**Don’t**
- Over-blur or over-saturate
- Stack multiple gradients

---

### B) Glass Button (primary / secondary / ghost)
**Purpose:** conversion CTA and consistent interaction.

**Primary**
- Fill: `--surface-2`
- Border: `--border-strong`
- Hover: slightly increase highlight + tiny lift (1–2px)

**Secondary**
- Fill: `--surface`
- Border: `--border`
- Hover: mild highlight, no glow spam

**Ghost**
- Transparent fill
- Hover: use `--surface`

**Accessibility**
- Visible focus ring (token-colored, not default blue unless it fits)
- Disabled state reduces opacity and removes lift

---

### C) Metal Edge (silver rim)
**Purpose:** add a premium rim to featured surfaces.

**Approach**
- Add a subtle outer ring and a faint inner highlight.
- Keep it monochrome/silver; avoid obvious gradients.

**Do**
- Use on “featured” pricing tier or active navbar state

**Don’t**
- Use everywhere (it stops feeling special)

---

## 3) Layout + typography

### Layout rhythm
- Default container: `mx-auto max-w-6xl px-6`
- Section spacing: `py-16` (desktop), slightly less on mobile
- Inter-section gap: `gap-10`

### Typography (recommended defaults)
- Hero headline: large, tight leading, high contrast
- Subhead: readable, muted token
- Body: simple, consistent

Rule: **hierarchy via size + weight + spacing**, not extra colors.

---

## 4) Implementation notes

- Tokens live in `app/globals.css`.
- Components live in `components/ui/*`.
- Components must be easy to copy into a future shadcn-style registry.
