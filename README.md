# Spar — Design Reference Capture

Spar is a minimal design-reference library. Upload or browse photos, inspect an extracted region, read auto labels and a semantic write-up, open a map of where it was captured, and **Copy Prompt** for any generative AI tool.

## Features

- **Library** — multi-column square thumbnail grid with Geist Mono header and Geist Pixel wordmark
- **Detail** — split layout with bounding box overlay, semantic text, collapsible metadata (closed by default), map (open by default)
- **Upload** — accepts images and runs a **mock** extraction pipeline (lasso box, labels, semantics, prompt) with no API key
- **Persistence** — uploads stay in `localStorage` for the session/browser; seed references always load

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Geist (Sans / Mono / Pixel) · Leaflet

## Run locally

```bash
npm install
npm run dev
```

Dev server binds to **http://127.0.0.1:3847**.

```bash
npm run build
npm run start
```

## OpenRouter later

Mock extraction lives in `src/lib/extraction.ts`. Swap `mockExtractFromImage` for an OpenRouter vision call when you have a key; keep that file as the single integration point.

## Sample data

Twelve seeded references in `public/samples/` with mock labels, prompts, boxes, and lat/lng.
