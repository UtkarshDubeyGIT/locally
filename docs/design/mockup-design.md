# Art-Directed Minimal Interface — Mockup Design System

## 1. Purpose

Use this system to create calm, distinctive digital products with strong visual hierarchy and a human point of view.

It is **not a fixed dashboard template** and it is **not inherently editorial, newspaper-like, or serif-led**. The exact page structure, components, typography, and density must be chosen for the product being built.

The reference dashboard is one possible expression of this system. New applications should inherit its restraint, spacing, contrast, and personality—not automatically copy its layout.

## 2. First decide what the product needs

Before designing, identify:

- the product type: dashboard, consumer app, internal tool, landing page, portfolio, mobile app, or content experience;
- the primary user action;
- the information density users actually need;
- whether the experience should feel focused, expressive, technical, playful, or premium;
- which one or two visual devices will give this particular product its identity.

Build the information architecture around the product. Do not start by adding a masthead, newspaper columns, oversized serif headings, numbered feeds, or an art hero unless they serve the task.

## 3. Core character

The shared visual character comes from these principles:

1. **Calm confidence.** The interface uses space, scale, and alignment instead of excessive decoration.
2. **Clear hierarchy.** Every screen has an obvious primary action and reading order.
3. **Selective expression.** One memorable visual gesture is stronger than many competing effects.
4. **Soft environment, crisp content.** Backgrounds and surfaces stay quiet while important copy and controls remain sharp.
5. **Human composition.** Controlled asymmetry, varied scale, and purposeful imagery prevent the product from feeling mechanically templated.
6. **Content-shaped layout.** Components adapt to the information instead of forcing everything into identical cards.
7. **Functional personality.** Typography, color, illustration, and motion should support the product’s purpose.

## 4. Foundation tokens

These are starting values, not immovable branding. Keep their relationships intact when adapting them.

```css
:root {
  /* Neutral environment */
  --canvas: #f7f7f5;
  --surface: #efefed;
  --surface-strong: #e6e6e2;
  --ink: #151515;
  --text-muted: #838387;
  --text-faint: #b5b5b2;
  --border: #dcdcd8;

  /* Primary signal */
  --accent: #ffdc00;
  --accent-hover: #f1cf00;
  --on-accent: #151515;

  /* Feedback colors: introduce only when the product needs them */
  --success: #377a52;
  --warning: #b06f08;
  --danger: #bd3f3f;

  /* Typography */
  --font-ui: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  --font-display: "Iowan Old Style", Baskerville, Georgia, serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  /* Shape */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-pill: 999px;

  /* Layout */
  --page-gutter: clamp(20px, 5vw, 88px);
  --section-gap: clamp(64px, 9vw, 132px);
  --content-max: 1500px;

  /* Motion */
  --ease-out: cubic-bezier(.2, .8, .2, 1);
  --duration-fast: 160ms;
  --duration-normal: 280ms;
}
```

### Token relationships to preserve

- The canvas is warm and nearly white, not clinically pure white.
- Surfaces differ from the canvas by only a small amount.
- Primary text is near-black; secondary text is genuinely quieter.
- The accent is vivid and scarce.
- Borders are subtle and shadows are used only when depth communicates state.

## 5. Color rules

| Role | Use | Guidance |
| --- | --- | --- |
| Canvas | Main application background | Let it occupy most of the screen. |
| Surface | Grouped content, controls, modal panels | A surface should communicate grouping, not decorate every item. |
| Ink | Primary copy, active icons, key values | Use near-black rather than tinted dark colors. |
| Muted text | Supporting copy and metadata | Maintain accessible contrast at small sizes. |
| Border | Separation and control boundaries | Prefer a quiet rule over a heavy card outline. |
| Accent | Primary action, selection, progress, or delight | Keep it below roughly 10% of a typical viewport. |

The default accent is yellow because it creates a distinctive, optimistic signal against the neutral base. It may be replaced with another single high-chroma brand color. Do not introduce a rainbow of product accents unless categories or data semantics require it.

## 6. Typography: choose a mode

Typography should match the application. Do not use the display serif everywhere by default.

### Mode A — Product / utility

Best for SaaS applications, admin tools, analytics, developer tools, and dense dashboards.

- Use the UI sans-serif for headings, body text, navigation, and controls.
- Create hierarchy through weight, size, spacing, and alignment.
- Reserve serif or mono type for one small expressive role, or omit them entirely.
- Typical heading: `32–64px`, weight `600–700`, tracking `-0.03em`.
- Typical body: `15–18px`, line-height `1.5–1.65`.

### Mode B — Human / lifestyle

Best for personal tools, wellbeing, learning, planning, hospitality, creative products, and consumer apps.

- Pair a clean UI sans-serif with an expressive serif or rounded display face.
- Use the expressive face for short headings, quotes, or moments of encouragement.
- Keep functional controls and longer paragraphs in the UI sans-serif.
- Avoid turning the whole screen into an article.

### Mode C — Editorial / cultural

Best only when content, storytelling, art, or a curated daily experience is central.

- Use a display serif for hero and section headings.
- Use sans-serif for facts, navigation, task copy, and long paragraphs.
- Allow larger scale shifts and more whitespace.
- Newspaper-like devices are optional even in this mode.

### Mode D — Technical / data

Best for observability, infrastructure, finance, AI tooling, and code-heavy products.

- Use the UI sans-serif as the foundation.
- Use mono type for identifiers, timestamps, code, data labels, and compact metrics.
- Keep the neutral canvas and sparse accent to prevent data from becoming visually noisy.

### Universal typography rules

- Use no more than two primary type families, plus mono when functionally necessary.
- Body lines should usually remain between 50 and 75 characters.
- Large headings may use negative tracking; body copy should not.
- Avoid italicizing full paragraphs.
- Minimum default body size is `16px` for consumer-facing interfaces.

## 7. Layout system

### Build around hierarchy, not a preset composition

Every page should answer, in order:

1. Where am I?
2. What matters now?
3. What can I do?
4. What supporting context is available?

Choose an appropriate shell:

| Product need | Suitable shell |
| --- | --- |
| Dense operations | Sidebar or compact top navigation with a stable content grid |
| Focused workflow | Narrow centered flow with a persistent primary action |
| Personal overview | Spacious dashboard with a small number of heterogeneous modules |
| Exploration | Search/filter controls above a responsive collection or canvas |
| Storytelling | Scroll-led sections with larger visual transitions |
| Mobile-first utility | Bottom navigation and a single dominant task per screen |

### Composition rules

- Use a maximum content width appropriate to the product; `1200–1500px` is a good desktop range.
- Allow large breathing room around the most important content.
- Use tighter spacing inside data-dense regions and looser spacing between major regions.
- Asymmetry is encouraged when it clarifies priority; symmetry is appropriate for repeated comparisons.
- Do not use a 12-column grid merely because it is standard. Use the smallest grid that supports the content.
- Avoid endless rows of equal cards. Mix full-width panels, lists, split views, compact metrics, and visual modules as the content demands.

## 8. Surface and card strategy

The visual system is **card-light**, not card-free.

Use a surface when it:

- groups information that belongs together;
- signals an interactive region;
- distinguishes a temporary or elevated state;
- helps scan a collection of repeated objects.

Avoid a surface when spacing, alignment, or a single divider can communicate the same relationship.

### Surface hierarchy

1. **Canvas:** the quiet background.
2. **Inline grouping:** spacing or a hairline divider; preferred for lists.
3. **Soft panel:** pale background and medium radius; preferred for callouts and modules.
4. **Interactive card:** outline or subtle state change; used for selectable objects.
5. **Elevated layer:** shadow plus surface; reserved for menus, dialogs, drawers, and drag state.

Do not combine a heavy border, strong shadow, tinted fill, and large radius on the same component.

## 9. Component language

### Navigation

- Match navigation density to the product.
- Active state should use weight, a quiet fill, a rule, or the accent—not several at once.
- Keep branding compact so it does not compete with the current task.

### Buttons

- Primary: dark ink or accent fill, high contrast, concise label.
- Secondary: quiet surface or subtle outline.
- Tertiary: text-only with a clear hover/focus state.
- Use pill shapes for filters, status, or short actions; use moderate radii for general buttons.
- Decorative shapes such as a starburst are optional brand moments, not the default button shape.

### Lists and tables

- Use dividers and alignment before card containers.
- Give rows enough height to scan comfortably.
- Right-align comparable numbers; use tabular numerals when available.
- On mobile, convert tables into labelled rows or focused detail screens rather than horizontal overflow when possible.

### Forms

- Labels remain visible; placeholders are examples, not labels.
- Inputs use quiet fills or outlines and a strong focus state.
- Group related fields with space and subheadings instead of enclosing every group in a card.
- Keep error messages direct, local, and actionable.

### Data visualization

- Begin with monochrome or muted series.
- Use the accent to show the active series, selected point, threshold, or most important comparison.
- Introduce semantic colors only when their meaning is explicit.
- Remove chart decoration that does not aid interpretation.

### Empty states and completion

- Use a compact visual cue plus one useful next action.
- The tone may be warm, but the state must remain informative.
- Celebration should be proportional to the achievement.
- Modal celebration is appropriate only for a meaningful completed flow, not every checkbox.

### Imagery and illustration

- Use imagery when it adds atmosphere, identity, explanation, or trust.
- A large art-led hero is optional and should appear only when it supports the page goal.
- Product dashboards may instead use a small abstract motif, custom icon set, data visualization, or no imagery.
- Keep image treatment consistent: similar color temperature, crop logic, and contrast.

## 10. Distinctive visual device

Choose **one primary device** for each product and use it consistently:

- vivid yellow action markers;
- oversized numeric typography;
- organic black brand shapes;
- structured asymmetry;
- art or photography crops;
- thin ruled layouts;
- subtle dot-grid or grain texture;
- mono metadata;
- expressive serif moments;
- geometric iconography.

At most one secondary device should accompany it. The interface should still feel coherent after removing all other decoration.

## 11. Motion

- Standard hover and press feedback: `120–180ms`.
- Panel or route transitions: `220–320ms`.
- Prefer fade, small translation, scale, and progressive reveal.
- Motion should explain hierarchy, continuity, or state—not continuously seek attention.
- Avoid elastic movement unless the product is intentionally playful.
- Respect `prefers-reduced-motion` by removing transforms and nonessential animation.

## 12. Responsive behavior

Do not treat mobile as a compressed desktop canvas.

### Desktop

- Use multiple columns only when simultaneous comparison or context is valuable.
- Keep the primary working region visually dominant.

### Tablet

- Collapse secondary columns, side metadata, and nonessential controls.
- Preserve meaningful scale contrast rather than making everything uniformly smaller.

### Mobile

- Establish one clear primary action per screen.
- Convert sidebars into drawers, sheets, tabs, or bottom navigation.
- Stack complex panels and move secondary context behind disclosure.
- Use at least `16px` body copy and `44px` touch targets.
- Preserve generous outer padding, usually `18–24px`.

## 13. Content voice

The voice should be clear, composed, and specific.

- State what happened and why it matters.
- Prefer useful verbs over dashboard jargon.
- Keep button labels short and unambiguous.
- Use warm language only where it fits the product relationship.
- Technical products can remain direct; personal products can sound more encouraging.

Examples:

- Better: “Review the seven unresolved comments.”
- Worse: “Action items require attention.”
- Better: “No deployments failed this week.”
- Worse: “Great job! Everything is awesome!”

## 14. Accessibility

- Target WCAG AA contrast for text and interactive states.
- Never use accent color alone to communicate status.
- Do not place small yellow text on the light canvas; use dark text on a yellow fill.
- Provide accessible names for icon-only controls.
- Preserve logical DOM reading order even when the visual layout is asymmetric.
- Provide visible keyboard focus with at least a `2px` outline.
- Announce dynamic success, error, loading, and modal states appropriately.
- Ensure layout and text survive zoom, font scaling, and localization.

## 15. Guardrails for implementation agents

When building from this document:

1. Start with the application’s user flow and information architecture.
2. Select one typography mode from Section 6.
3. Select one primary visual device from Section 10.
4. Use the neutral and spacing foundations consistently.
5. Design components appropriate to the product type.
6. Treat the reference HTML as an example of one expressive dashboard, not a mandatory template.
7. Do not automatically create a newspaper layout, art hero, serif masthead, vertical date, numbered feed, or starburst badge.
8. Explain any major visual choice that is not supported by the product’s purpose.

The intended result should feel related through restraint, hierarchy, neutral warmth, and a precise accent—even when two applications have completely different structures.
