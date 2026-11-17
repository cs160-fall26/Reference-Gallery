import type { BoundingBox, DesignReference, GeoPoint } from "@/lib/types";

/**
 * Mock extraction pipeline for v1.
 * Replace `mockExtractFromImage` with an OpenRouter (or other VL) call later:
 *   POST https://openrouter.ai/api/v1/chat/completions
 *   with an image + instruction to return labels, semantic, prompt, bbox.
 * Keep this module as the single integration point.
 */

const LABEL_POOL = [
  "texture",
  "form",
  "color",
  "material",
  "light",
  "shadow",
  "pattern",
  "object",
  "architecture",
  "typography",
  "surface",
  "detail",
];

const CITY_POOL: GeoPoint[] = [
  { lat: 37.7749, lng: -122.4194, label: "San Francisco, CA" },
  { lat: 52.52, lng: 13.405, label: "Berlin, DE" },
  { lat: 13.7563, lng: 100.5018, label: "Bangkok, TH" },
  { lat: -33.8688, lng: 151.2093, label: "Sydney, AU" },
  { lat: 19.4326, lng: -99.1332, label: "Mexico City, MX" },
];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickLabels(seed: number): string[] {
  const count = 3 + (seed % 3);
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    labels.push(LABEL_POOL[(seed + i * 3) % LABEL_POOL.length]);
  }
  return Array.from(new Set(labels));
}

function inventBox(seed: number): BoundingBox {
  const x = 0.15 + ((seed % 20) / 100);
  const y = 0.12 + (((seed >> 3) % 20) / 100);
  const width = 0.4 + (((seed >> 5) % 25) / 100);
  const height = 0.4 + (((seed >> 7) % 25) / 100);
  return {
    x,
    y,
    width: Math.min(width, 1 - x - 0.05),
    height: Math.min(height, 1 - y - 0.05),
  };
}

export type ExtractionResult = Pick<
  DesignReference,
  "title" | "labels" | "semantic" | "prompt" | "boundingBox" | "location"
>;

export async function mockExtractFromImage(
  fileName: string,
  _dataUrl: string,
): Promise<ExtractionResult> {
  // Simulate a short vision-model latency without requiring a network key.
  await new Promise((r) => setTimeout(r, 450 + Math.random() * 350));

  const seed = hashString(fileName || "upload");
  const labels = pickLabels(seed);
  const box = inventBox(seed);
  const location = CITY_POOL[seed % CITY_POOL.length];
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") || "untitled reference";
  const title =
    baseName.charAt(0).toUpperCase() + baseName.slice(1).slice(0, 48);

  const semantic = `A captured design reference emphasizing ${labels.slice(0, 2).join(" and ")}. The extracted region focuses on a distinctive visual element—material, silhouette, or light quality—suitable for mood boards and generative reproduction. Composition is square-friendly with clear subject hierarchy.`;

  const prompt = `Design reference: ${title.toLowerCase()}, ${labels.join(", ")}, clear subject, soft natural lighting, high detail material study, square crop, mood-board ready, no watermark`;

  return {
    title,
    labels,
    semantic,
    prompt,
    boundingBox: box,
    location,
  };
}
