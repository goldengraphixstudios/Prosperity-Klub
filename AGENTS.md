# AGENTS.md

## Resume Notes (Codex --yolo)
This file is intended for resuming the Prosperity Klub work in Codex **--yolo** mode. It summarizes current state, open tasks, and important implementation details.

### Project Summary
- Next.js 16 App Router, React 19 + TypeScript
- Tailwind v4, shadcn-style Radix UI wrappers in `src/components/ui/*`
- Motion helpers: `PageTransition`, `FadeIn`, `Stagger`
- Lenis smooth scrolling provider in `src/components/smooth-scroll-provider.tsx`
- Charts are custom SVG: `src/components/charts/simple-bar-chart.tsx` and `src/components/charts/simple-line-chart.tsx`

### Current Focus: /debt-strategies
- Layout has been restructured to match the reference: left column (inputs) + right column (results + charts)
- Left column uses 3 separate cards:
  1) Your Debts (add row + buttons + debts table + total row)
  2) Strategy Settings
  3) Consolidation (Secured Loan) + eligibility panel + buttons
- Right column:
  - Results Overview card with 3 mini cards
  - Charts section with 3 cards (2 small bar charts + 1 full-width line chart)
- Chart containers have explicit height and SVG viewBox + preserveAspectRatio="xMidYMid meet".

### Known Files Touched
- `src/app/debt-strategies/page.tsx`
- `src/components/charts/simple-bar-chart.tsx`
- `src/components/charts/simple-line-chart.tsx`
- `codex-conversation-log.txt`

### Important Behavior
- Sample button loads sample debts/settings/consolidation that should produce payoff for all strategies.
- Calculations are in `src/lib/debt-strategies.ts` (do not change unless bug found).
- Consolidation eligibility uses LTV rule.

### What To Check Next
- Visual parity for /debt-strategies (ensure left column is readable and right charts fill space)
- Verify line chart tooltip, axis labels, and legend
- Validate bar chart readability and font sizes
- Ensure no React key warnings

### How To Run
- `npm run dev`
- `npm run lint`

### Notes
- The user wants all logging appended in `codex-conversation-log.txt`.
- Do not remove any existing log entries; only append.
