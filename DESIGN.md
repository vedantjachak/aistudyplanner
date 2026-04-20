# Design Brief

## Purpose & Context
AI-powered study planner for students. Drives engagement through animated dashboards, progress tracking, and gamified learning. Emotional state: motivated, focused, slightly fatigued — design rewards progress visually and emotionally.

## Tone & Differentiation
Futuristic minimal with vibrant accents. Modern, energetic, approachable. Every dashboard card breathes with animation. Progress visualization dominates. Violet-blue primary accent + cyan secondary creates energy without chaos. Student-friendly, intuitive, professional.

## Color Palette (OKLCH)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| **Primary** | 0.70 0.18 270 | 0.72 0.19 270 | CTAs, progress rings, active states |
| **Secondary** | 0.72 0.16 180 | 0.68 0.16 180 | Supporting actions, secondary highlights |
| **Accent** | 0.68 0.20 260 | 0.70 0.20 260 | Hero elements, emphasis, gradients |
| **Background** | 0.98 0 0 | 0.14 0 0 | Page base, dark mode optimized |
| **Card** | 0.95 0 0 | 0.20 0 0 | Elevated surface, task cards |
| **Muted** | 0.92 0 0 | 0.24 0 0 | Disabled, secondary text |
| **Destructive** | 0.58 0.22 15 | 0.63 0.20 15 | Delete, abandon, warnings |
| **Success** | 0.60 0.19 120 | 0.62 0.20 120 | Completed tasks, streaks |

## Typography
- **Display**: General Sans — geometric, modern, confident. Headlines (3xl, 2xl sizes).
- **Body**: DM Sans — open, readable, tech-forward. Content, labels, UI text (base, sm sizes).
- **Mono**: Geist Mono — timer, stats, code examples. Technical data display.

## Shape Language
`12px` border-radius. Balanced between sharp and soft. Active borders on interactive elements. Rounded buttons, cards with subtle elevation.

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| **Header/Nav** | `bg-card` with `border-b border-border`, `shadow-elevated` | Clear section division, pinned navigation |
| **Main content** | `bg-background`, `text-foreground` | Primary reading area |
| **Task cards** | `bg-card`, `border-border`, `shadow-elevated`, gradient accent border-top | Visual hierarchy, taskgroup focus |
| **Stats/progress** | `bg-gradient-primary`, animated rings, bars | High-impact visualization |
| **Footer** | `bg-card`, `border-t border-border` | Grounded closure |

## Component Patterns
- **Buttons**: Primary (gradient background, violet text on light), secondary (outlined), ghost (text only), destructive (red)
- **Progress**: Animated circular rings (SVG), bar charts with fade-in animation
- **Cards**: Hover lift (`shadow-elevated`), scale animation (1.02x), border highlight on focus
- **Inputs**: `bg-input`, `border-border`, focus state uses `ring` token
- **Badges**: Task status, subject tags, streak counts — colored by semantic type

## Motion & Animation Choreography
- **Load**: Staggered fade-in for card deck (150ms stagger)
- **Interaction**: Slide-up on modal open, fade on overlay
- **Progress updates**: Smooth ring/bar animation (0.6s easing)
- **Hover**: Subtle lift, border highlight, shadow intensify
- **Micro**: Icon rotation on active, text gradient shift on focus

## Spacing & Rhythm
- **Padding**: Cards 1.5rem, sections 2rem, compact 1rem
- **Gap**: Flex children 1rem, grid 1.5rem
- **Hierarchy**: Generous whitespace in focused UI, tighter in data tables

## Constraints
- No rainbow colors; maintain 3–5 core palette
- Animations max 0.6s (avoid slow, clunky feel)
- Always use semantic tokens; never raw hex/rgb
- Dark mode optimized (primary reading context = evening study)
- Responsive mobile-first; breakpoints at 640px, 1024px, 1280px

## Signature Detail
Animated gradient flow from violet primary → cyan secondary on CTA buttons and progress indicators. Gives motion and energy without looking artificial. Reinforces "live learning" perception.

