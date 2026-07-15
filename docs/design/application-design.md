# Design Theme — "Editorial Operations" (extracted from Dia's Daily Report UI)

A warm, editorial, newspaper-meets-newsletter aesthetic. Reads like a printed
guided workspace rather than a software dashboard — generous whitespace, a single
confident accent color, and serif italic voice for headlines against clean
sans-serif for functional text.

---

## 1. Color Palette

| Token | Hex (approx) | Usage |
|---|---|---|
| `--color-bg` | `#F5F4F0` | Page background — warm off-white, paper-like |
| `--color-surface` | `#EFEEEA` | Card / section backgrounds, slightly deeper than bg |
| `--color-accent` | `#F7DC00` | The one accent color — badges, stickers, highlighted headline text |
| `--color-ink` | `#1A1A1A` | Primary text, near-black (not pure black) |
| `--color-muted` | `#8F8D86` | Secondary/body copy, captions, timestamps |
| `--color-divider` | `#E4E2DC` | Faint separators, avoided where possible in favor of spacing |

**Principles:**
- Monochrome + one accent. Yellow is used sparingly but boldly (badges, stamps, hero headline) — never as a tint or gradient.
- No pure black/white. Everything is slightly warm (cream, not gray-white; ink, not #000).
- Color signals *importance/achievement* (yellow = "look here" — a finalist badge, a completed-tasks seal, a CTA), not decoration.

---

## 2. Typography

Two-font system, clear division of labor:

### Display / Editorial — Serif Italic
- Used for: hero titles ("Your Tuesday Overview"), section headers ("Push your work forward", "New updates", "Top to-dos"), and any "voice"/personality moment.
- Style: high-contrast transitional/didone-leaning serif, set in italic — think **Canela, Tiempos, GT Sectra, or Playfair Display (italic)**.
- Feel: editorial, a little handwritten/human, warm — not corporate.
- Weight varies: light italic for connective words ("Your"), bold/heavy for the payoff word ("Tuesday Overview").

### Body / UI — Grotesk Sans-serif
- Used for: card headings, paragraph copy, labels, buttons.
- Style: clean, neutral grotesk — **Inter, Helvetica Neue, or system-ui**.
- Card titles are bold/semibold sans; body copy is regular weight in muted gray.

**Rule of thumb:** if it's *narrating* (a greeting, a summary sentence, a section title) → serif italic. If it's *informational/functional* (a card headline, a data point, a button label) → sans-serif.

---

## 3. Layout & Composition

- **Vertical rotated text** as a decorative framing device — date on one side, time on the other, rotated 90°/-90°, running along the outer edges of the hero banner like a magazine spine or ticket stub.
- **Full-bleed hero image** with rounded corners, headline text overlaid directly on the image (yellow serif italic over a photo/painting) rather than in a separate text block.
- **Generous vertical rhythm** — sections are separated by whitespace, not lines or boxes. Dividers are rare.
- **Numbered list items** (`01`, `02`...) rendered in light gray as a subtle index marker, not a heavy UI element.
- **Cards** are soft, low-contrast rectangles (surface color barely distinct from bg), rounded corners, no visible border/shadow — they feel like a shaded region of paper, not a floating panel.

---

## 4. Signature Component: The "Seal" Badge

The most distinctive motif — a jagged-edged circle (like a wax seal, stamp, or starburst) in the accent yellow, containing:
- Short italic serif call-to-action text ("Let's do it →"), **or**
- An icon (checkmark) + italic serif congratulatory copy ("You completed all your to-dos!")

This shape does double duty as both a **CTA button** and an **achievement badge** — reused for consistency so the eye learns "yellow seal = something worth noticing/clicking."

---

## 5. Micro-details

- **Inline icons**: third-party service icons (Gmail, GitHub) sit inline within a sentence at text height, not in separate icon slots — e.g. "Made for you by 🗨 Dia using *your* 🐙 GitHub and 📧 Gmail."
- **Italic emphasis** used mid-sentence for a warm, conversational tone ("using *your* GitHub").
- **Avatar initials**: small outlined circles with single-letter initials (B, C, N, Y) for a "made by the team" credit line — minimal, no photos.
- **Captions**: italic muted-gray sans/serif blend under the hero image, written in a friendly, personal narrating tone ("Tuesday with a clear calendar and a finalist badge fresh on your profile...").

---

## 6. Tone of Voice (informs visual pairing)

Copy is written like a personal assistant narrating your day — warm, concise, specific ("Sheetal's PR #2 has been waiting on your review since Jun 30"). The editorial serif italic headlines mirror this: it reads as *someone telling you something*, not a system logging events.

---

## Quick reference (CSS variables)

```css
:root {
  --color-bg: #F5F4F0;
  --color-surface: #EFEEEA;
  --color-accent: #F7DC00;
  --color-ink: #1A1A1A;
  --color-muted: #8F8D86;
  --color-divider: #E4E2DC;

  --font-display: 'Canela', 'Tiempos', 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', 'Helvetica Neue', system-ui, sans-serif;

  --radius-card: 16px;
  --radius-hero: 20px;
}
```
