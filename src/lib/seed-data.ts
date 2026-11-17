import type { DesignReference } from "@/lib/types";

export const SEED_REFERENCES: DesignReference[] = [
  {
    id: "ref-brutal-chair",
    title: "Brutalist lounge chair",
    imageUrl: "/samples/ref-1.jpg",
    labels: ["furniture", "brutalism", "stone", "wood", "seating"],
    semantic:
      "A sculptural lounge chair with a rough, cast-stone seat shell mounted on four tapered timber legs. The seat reads as a carved monolith—organic edges, matte mineral texture—contrasting the warm, sanded oak base. Soft studio light skims the stone, emphasizing porosity and shadow under the cantilevered back.",
    prompt:
      "Sculptural brutalist lounge chair, rough cast-stone organic seat shell, four tapered oak legs, matte mineral texture, soft studio lighting, pale gray backdrop, high-end gallery product photo, centered composition",
    boundingBox: { x: 0.22, y: 0.18, width: 0.56, height: 0.62 },
    location: { lat: 52.3676, lng: 4.9041, label: "Amsterdam, NL" },
    capturedAt: "2026-03-12",
    source: "seed",
  },
  {
    id: "ref-neon-wayfinding",
    title: "Neon wayfinding glyph",
    imageUrl: "/samples/ref-2.jpg",
    labels: ["signage", "neon", "typography", "night", "urban"],
    semantic:
      "A single neon glyph glowing lime-white against a dark facade. Tubing is thin and precise, with a slight bloom; the surrounding wall is charcoal concrete with hairline cracks. The mark feels like a wayfinding symbol rather than a word—geometric, memorable, slightly sci-fi.",
    prompt:
      "Minimal neon wayfinding glyph, thin tubing, soft lime glow, charcoal concrete wall, night urban facade, graphic symbol not lettering, cinematic contrast, square crop",
    boundingBox: { x: 0.3, y: 0.25, width: 0.4, height: 0.45 },
    location: { lat: 35.6762, lng: 139.6503, label: "Tokyo, JP" },
    capturedAt: "2026-01-04",
    source: "seed",
  },
  {
    id: "ref-ceramic-vessel",
    title: "Asymmetric ceramic vessel",
    imageUrl: "/samples/ref-3.jpg",
    labels: ["ceramics", "object", "texture", "studio", "form"],
    semantic:
      "An asymmetric hand-thrown ceramic vessel with a pinched rim and speckled ash glaze. The silhouette leans slightly left; the surface mixes glossy pools with dry matte patches. Photographed on a pale seamless paper with a soft falloff shadow.",
    prompt:
      "Asymmetric hand-thrown ceramic vessel, pinched rim, speckled ash glaze, matte and glossy contrast, pale seamless paper, soft studio shadow, object still life, editorial product photo",
    boundingBox: { x: 0.28, y: 0.15, width: 0.44, height: 0.68 },
    location: { lat: 34.0522, lng: -118.2437, label: "Los Angeles, CA" },
    capturedAt: "2025-11-22",
    source: "seed",
  },
  {
    id: "ref-grid-poster",
    title: "Modular grid poster",
    imageUrl: "/samples/ref-4.jpg",
    labels: ["print", "grid", "poster", "layout", "swiss"],
    semantic:
      "A modular poster layout built on a strict square grid. Heavy black type anchors the top-left cells; a photographic fragment occupies the lower-right quadrant. Gutters are generous, margins clean, palette strictly black, white, and one accent field.",
    prompt:
      "Swiss modular poster, strict square grid, heavy black sans type top-left, photographic fragment lower-right, generous gutters, black white accent palette, print design reference",
    boundingBox: { x: 0.12, y: 0.1, width: 0.76, height: 0.8 },
    location: { lat: 47.3769, lng: 8.5417, label: "Zürich, CH" },
    capturedAt: "2026-02-18",
    source: "seed",
  },
  {
    id: "ref-stair-shadow",
    title: "Concrete stair shadow",
    imageUrl: "/samples/ref-5.jpg",
    labels: ["architecture", "shadow", "concrete", "geometry", "light"],
    semantic:
      "A hard-edged shadow cast by a concrete stair across a sunlit plaza. Steps create a rhythmic chevron of light and dark; the concrete is pale with board-form texture. The extracted region isolates the geometric shadow pattern rather than the building mass.",
    prompt:
      "Hard geometric shadow from concrete stairs on sunlit plaza, rhythmic chevron light pattern, pale board-form concrete, architectural photography, high contrast midday sun",
    boundingBox: { x: 0.18, y: 0.3, width: 0.64, height: 0.42 },
    location: { lat: 41.3851, lng: 2.1734, label: "Barcelona, ES" },
    capturedAt: "2025-09-08",
    source: "seed",
  },
  {
    id: "ref-knit-swatch",
    title: "Chunky knit swatch",
    imageUrl: "/samples/ref-6.jpg",
    labels: ["textile", "knit", "material", "close-up", "tactile"],
    semantic:
      "A close-up of a chunky wool knit showing oversized cable twists and soft pile. Yarn is undyed ivory with occasional gray flecks. Side lighting reveals depth in each cable; the crop feels like a material library card.",
    prompt:
      "Macro chunky wool knit swatch, oversized cable twists, undyed ivory yarn with gray flecks, side lighting, tactile textile library photo, square crop",
    boundingBox: { x: 0.2, y: 0.2, width: 0.6, height: 0.6 },
    location: { lat: 55.6761, lng: 12.5683, label: "Copenhagen, DK" },
    capturedAt: "2026-04-02",
    source: "seed",
  },
  {
    id: "ref-storefront",
    title: "Glass storefront facade",
    imageUrl: "/samples/ref-7.jpg",
    labels: ["retail", "facade", "glass", "minimal", "street"],
    semantic:
      "A minimal glass storefront with black steel mullions and a single centered door. Interior shows a sparse display plinth. Reflections of the street soften the plane; the extracted element is the facade rhythm of mullion and void.",
    prompt:
      "Minimal glass retail storefront, black steel mullions, centered door, sparse interior plinth, soft street reflections, architectural street photo, calm daylight",
    boundingBox: { x: 0.15, y: 0.12, width: 0.7, height: 0.76 },
    location: { lat: 40.7128, lng: -74.006, label: "New York, NY" },
    capturedAt: "2025-12-14",
    source: "seed",
  },
  {
    id: "ref-book-cover",
    title: "Debossed cloth cover",
    imageUrl: "/samples/ref-8.jpg",
    labels: ["book", "print", "deboss", "cloth", "typography"],
    semantic:
      "A cloth-bound book cover with deep debossed title type and a single foil rule. Cloth is slate green with visible weave. Lighting is raked to catch the emboss depth; the crop centers the typographic mark.",
    prompt:
      "Cloth-bound book cover, slate green weave, deep debossed title type, single foil rule, raked light catching emboss, editorial print object photo",
    boundingBox: { x: 0.25, y: 0.22, width: 0.5, height: 0.55 },
    location: { lat: 51.5074, lng: -0.1278, label: "London, UK" },
    capturedAt: "2026-05-19",
    source: "seed",
  },
  {
    id: "ref-lamp",
    title: "Paper lantern lamp",
    imageUrl: "/samples/ref-9.jpg",
    labels: ["lighting", "paper", "warm", "interior", "object"],
    semantic:
      "A cylindrical paper lantern lamp with visible bamboo ribs and warm 2700K glow. The shade is slightly imperfect—hand-assembled. Background is a dim room so the lantern becomes the sole luminous object.",
    prompt:
      "Cylindrical paper lantern lamp, visible bamboo ribs, warm 2700K glow, hand-assembled imperfect shade, dim room background, intimate interior object photo",
    boundingBox: { x: 0.32, y: 0.1, width: 0.36, height: 0.75 },
    location: { lat: 35.0116, lng: 135.7681, label: "Kyoto, JP" },
    capturedAt: "2026-01-28",
    source: "seed",
  },
  {
    id: "ref-tile",
    title: "Glazed subway tile",
    imageUrl: "/samples/ref-10.jpg",
    labels: ["surface", "tile", "glaze", "interior", "pattern"],
    semantic:
      "A field of glossy subway tiles with irregular handmade edges and soft blue-gray glaze. Grout lines are narrow and slightly uneven. Specular highlights travel across the plane, revealing the wet glaze character.",
    prompt:
      "Handmade subway tile wall, irregular edges, soft blue-gray glossy glaze, narrow uneven grout, specular highlights, material surface reference photo",
    boundingBox: { x: 0.1, y: 0.15, width: 0.8, height: 0.7 },
    location: { lat: 45.4642, lng: 9.19, label: "Milan, IT" },
    capturedAt: "2025-10-30",
    source: "seed",
  },
  {
    id: "ref-metal-handle",
    title: "Brushed brass handle",
    imageUrl: "/samples/ref-11.jpg",
    labels: ["hardware", "brass", "detail", "product", "industrial"],
    semantic:
      "A brushed brass door handle with a cylindrical grip and circular rose plate. Brush lines run longitudinally; fingerprints are absent. Soft window light creates a long highlight along the cylinder.",
    prompt:
      "Brushed brass cylindrical door handle, circular rose plate, longitudinal brush lines, soft window highlight, product detail photo, neutral wall",
    boundingBox: { x: 0.35, y: 0.28, width: 0.3, height: 0.45 },
    location: { lat: 48.8566, lng: 2.3522, label: "Paris, FR" },
    capturedAt: "2026-03-01",
    source: "seed",
  },
  {
    id: "ref-landscape",
    title: "Fog ridge landscape",
    imageUrl: "/samples/ref-12.jpg",
    labels: ["landscape", "fog", "tone", "atmosphere", "nature"],
    semantic:
      "Layered mountain ridges dissolving into fog, rendered as soft tonal bands from near charcoal to pale silver. No skyline sky—only atmosphere. The extracted band is the mid-distance ridge silhouette useful for mood boards.",
    prompt:
      "Layered mountain ridges in fog, soft tonal bands charcoal to silver, no sky, atmospheric landscape, minimal mood-board crop, muted grayscale",
    boundingBox: { x: 0.05, y: 0.35, width: 0.9, height: 0.35 },
    location: { lat: 46.8182, lng: 8.2275, label: "Swiss Alps" },
    capturedAt: "2025-08-16",
    source: "seed",
  },
];
