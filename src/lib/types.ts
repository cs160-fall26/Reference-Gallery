export type BoundingBox = {
  /** Normalized 0–1 relative to image */
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GeoPoint = {
  lat: number;
  lng: number;
  label: string;
};

export type DesignReference = {
  id: string;
  title: string;
  imageUrl: string;
  labels: string[];
  semantic: string;
  prompt: string;
  boundingBox: BoundingBox;
  location: GeoPoint;
  capturedAt: string;
  source: "seed" | "upload";
};
