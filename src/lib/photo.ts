import type { BoundingBox, GeoPoint, ImageMetadata } from "@/lib/types";

/** Longest edge kept for storage and for the vision model. */
const MAX_EDGE = 1600;
const CROP_MAX_EDGE = 1024;

export type PreparedPhoto = {
  /** Downscaled, orientation-corrected pixels. */
  canvas: HTMLCanvasElement;
  dataUrl: string;
  /** Size of the original file's pixels, after applying EXIF orientation. */
  width: number;
  height: number;
};

export type PhotoFacts = {
  capturedAt: string | null;
  location: GeoPoint | null;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: number;
  software?: string;
};

function newCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is not available in this browser.");
  return { canvas, context };
}

/** Decodes the file, applies its EXIF rotation and downscales it. */
export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const { canvas, context } = newCanvas(
      bitmap.width * scale,
      bitmap.height * scale,
    );
    // JPEG has no alpha channel; without this, transparent pixels turn black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return {
      canvas,
      dataUrl: canvas.toDataURL("image/jpeg", 0.85),
      width: bitmap.width,
      height: bitmap.height,
    };
  } finally {
    bitmap.close();
  }
}

function regionPixels(canvas: HTMLCanvasElement, box: BoundingBox) {
  const x = Math.round(box.x * canvas.width);
  const y = Math.round(box.y * canvas.height);
  return {
    x,
    y,
    width: Math.max(1, Math.min(canvas.width - x, Math.round(box.width * canvas.width))),
    height: Math.max(1, Math.min(canvas.height - y, Math.round(box.height * canvas.height))),
  };
}

/** The boxed region as its own JPEG data URL. */
export function cropToDataUrl(photo: PreparedPhoto, box: BoundingBox): string {
  const region = regionPixels(photo.canvas, box);
  const scale = Math.min(
    1,
    CROP_MAX_EDGE / Math.max(region.width, region.height),
  );
  const { canvas, context } = newCanvas(
    region.width * scale,
    region.height * scale,
  );
  context.drawImage(
    photo.canvas,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}

function toHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * Dominant colours of the boxed region: pixels are binned into a coarse RGB
 * histogram and the most populated, mutually distinct bins are returned.
 */
export function dominantColors(
  photo: PreparedPhoto,
  box: BoundingBox,
  count = 5,
): string[] {
  const region = regionPixels(photo.canvas, box);
  const sample = 64;
  const { context } = newCanvas(sample, sample);
  context.drawImage(
    photo.canvas,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    sample,
    sample,
  );
  const { data } = context.getImageData(0, 0, sample, sample);

  const bins = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bin = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bin.n += 1;
    bin.r += r;
    bin.g += g;
    bin.b += b;
    bins.set(key, bin);
  }

  const ranked = Array.from(bins.values())
    .sort((a, b) => b.n - a.n)
    .map((bin) => [bin.r / bin.n, bin.g / bin.n, bin.b / bin.n] as const);

  const minDistance = 56;
  const picked: (readonly [number, number, number])[] = [];
  for (const color of ranked) {
    const distinct = picked.every(
      (other) =>
        Math.hypot(
          color[0] - other[0],
          color[1] - other[1],
          color[2] - other[2],
        ) >= minDistance,
    );
    if (distinct) picked.push(color);
    if (picked.length === count) break;
  }
  return picked.map(([r, g, b]) => toHex(r, g, b));
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function finite(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function formatShutter(seconds: number): string {
  if (seconds >= 1) return `${Number(seconds.toFixed(1))} s`;
  return `1/${Math.round(1 / seconds)} s`;
}

function trimNumber(value: number): string {
  return String(Number(value.toFixed(1)));
}

/**
 * Reads EXIF and GPS from the original file bytes. This has to run on the
 * file the user picked: re-encoding through a canvas drops all of it.
 */
export async function readPhotoFacts(file: File): Promise<PhotoFacts> {
  let tags: Record<string, unknown> | undefined;
  try {
    const exifr = await import("exifr");
    tags = await exifr.parse(file, { tiff: true, exif: true, gps: true });
  } catch {
    // Formats without EXIF, or formats the parser does not know.
  }
  if (!tags) return { capturedAt: null, location: null };

  const lat = finite(tags.latitude);
  const lng = finite(tags.longitude);
  // Some cameras write 0,0 when they have no GPS fix.
  const hasFix =
    lat !== undefined &&
    lng !== undefined &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0);
  const altitude = finite(tags.GPSAltitude);
  const belowSeaLevel = tags.GPSAltitudeRef === 1;

  const taken = tags.DateTimeOriginal ?? tags.CreateDate;
  const make = text(tags.Make);
  const model = text(tags.Model);
  const focal = finite(tags.FocalLength);
  const focal35 = finite(tags.FocalLengthIn35mmFormat);
  const fNumber = finite(tags.FNumber);
  const exposure = finite(tags.ExposureTime);

  return {
    capturedAt:
      taken instanceof Date && !Number.isNaN(taken.getTime())
        ? taken.toISOString()
        : null,
    location: hasFix
      ? {
          lat,
          lng,
          ...(altitude !== undefined
            ? { altitude: belowSeaLevel ? -altitude : altitude }
            : {}),
        }
      : null,
    camera:
      make && model
        ? model.toLowerCase().startsWith(make.toLowerCase())
          ? model
          : `${make} ${model}`
        : (model ?? make),
    lens: text(tags.LensModel),
    focalLength:
      focal !== undefined
        ? `${trimNumber(focal)} mm${focal35 ? ` (${trimNumber(focal35)} mm equiv.)` : ""}`
        : undefined,
    aperture: fNumber !== undefined ? `f/${trimNumber(fNumber)}` : undefined,
    shutter:
      exposure !== undefined && exposure > 0 ? formatShutter(exposure) : undefined,
    iso: finite(tags.ISO),
    software: text(tags.Software),
  };
}

export function buildMetadata(
  file: File,
  photo: PreparedPhoto,
  facts: PhotoFacts,
  palette: string[],
): ImageMetadata {
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    width: photo.width,
    height: photo.height,
    camera: facts.camera,
    lens: facts.lens,
    focalLength: facts.focalLength,
    aperture: facts.aperture,
    shutter: facts.shutter,
    iso: facts.iso,
    software: facts.software,
    palette,
  };
}
