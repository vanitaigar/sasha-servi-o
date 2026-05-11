# Design Brief

## Direction

SASHA SERVIÇO — Professional multi-sector enterprise management dashboard for gas stations, bars, and barbershops with role-based access, financial tracking, and operational clarity.

## Tone

Professional minimalism with warm confidence: structured, focused, human-centered — avoiding cold corporate sterility through warm amber accents on dark foundation.

## Differentiation

Warm amber primary accent on deep dark charcoal foundation is rare in enterprise UIs (most use blue) — this reflects the warm, human-centered multi-sector business context while maintaining professional credibility.

## Color Palette

| Token      | Light OKLCH        | Dark OKLCH        | Role                             |
|------------|-------------------|------------------|----------------------------------|
| background | 0.99 0.005 75     | 0.14 0.015 50    | Primary surface, content area    |
| foreground | 0.18 0.015 50     | 0.92 0.01 60     | Body text, primary semantic text |
| card       | 1.0 0.0 0         | 0.18 0.018 50    | Elevated content containers      |
| primary    | 0.62 0.19 70      | 0.72 0.17 70     | Warm amber accent, CTAs, focus   |
| accent     | 0.62 0.19 70      | 0.72 0.17 70     | Same as primary for consistency  |
| muted      | 0.92 0.01 75      | 0.22 0.02 50     | Secondary, disabled states       |
| destructive| 0.55 0.22 25      | 0.55 0.22 25     | Errors, deletions                |
| chart-1    | 0.72 0.18 70      | 0.72 0.18 70     | Amber (financial transactions)   |
| chart-2    | 0.58 0.15 15      | 0.65 0.16 15     | Warm coral (expenses)            |
| chart-3    | 0.65 0.16 145     | 0.7 0.15 145     | Green (success, revenue)         |
| chart-4    | 0.68 0.14 200     | 0.75 0.14 200    | Cyan (metrics, employees)        |
| chart-5    | 0.75 0.14 280     | 0.8 0.12 280     | Violet (future, targets)         |

## Typography

- Display: Space Grotesk — headings, hero text, department labels (bold, tight tracking)
- Body: General Sans — paragraphs, UI labels, metadata (regular/medium weight)
- Mono: JetBrains Mono — transaction IDs, timestamps, numerical precision
- Scale: hero `text-5xl font-bold tracking-tight`, h2 `text-3xl font-bold`, label `text-xs uppercase`, body `text-base`

## Elevation & Depth

Three-layer surface hierarchy: flat muted backgrounds for grouped sections, subtle card backgrounds for contained data, elevated white/dark cards for primary content with soft shadows. Functional hierarchy only, no decorative elements.

## Structural Zones

| Zone      | Background        | Border           | Notes                                  |
|-----------|------------------|------------------|----------------------------------------|
| Header    | card elevated     | bottom subtle    | Department selector, warm amber zone   |
| Sidebar   | lighter card      | right subtle     | Role-aware navigation, persistent      |
| Content   | background       | —                | Alternating card backgrounds           |
| Footer    | muted/20%        | top subtle       | Action buttons, export controls        |

## Spacing & Rhythm

Base unit 8px: sections gap-8 (2rem), card padding p-6 (1.5rem), micro-spacing px-1. Even spacing creates rhythm and readability.

## Component Patterns

- Buttons: Warm amber primary, rounded-md, font-semibold, full-width in forms; secondary uses card+border
- Cards: rounded-md, shadow-md, elevated backgrounds, p-6, section grouping with gap-4
- Badges: rounded-full, amber text on amber/10 for department; muted for status
- Inputs: rounded-sm, border-subtle, focus:ring-amber, no blur

## Motion

- Entrance: Cards cascade on load (0.2s stagger), sidebar slide-in (0.3s ease-out)
- Hover: Buttons opacity-90, cards shadow-lg, smooth 0.3s transition
- Decorative: Pulse on alerts (pulse 2s infinite), none on primary UI

## Constraints

- Portuguese language only (PT-BR/PT-PT)
- Dark mode primary, light mode fallback
- No gradients, glows, or decorative animations
- Colors via CSS variables, no arbitrary values
- Department-aware context labels

## Signature Detail

Warm amber accent on dark charcoal foundation across a multi-sector enterprise dashboard — unexpected (most enterprise apps default to corporate blue) and signals human-centered, approachable business operations while maintaining professional credibility.
