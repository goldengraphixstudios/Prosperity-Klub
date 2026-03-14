# Prosperity Klub

Prosperity Klub is a Next.js website for a Filipino financial growth community powered by IMG. It includes marketing pages, calculators, gated resources, partner information, and lead capture flows.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
```

## Deployment Note

The app builds successfully for a normal Next.js host. GitHub Pages is not a complete fit in its current form because the site still contains a server route at `src/app/api/leads/route.ts`, and GitHub Pages cannot run Node/Next.js server functions.
