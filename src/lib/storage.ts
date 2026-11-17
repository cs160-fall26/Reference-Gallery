import type { DesignReference } from "@/lib/types";
import { SEED_REFERENCES } from "@/lib/seed-data";

const STORAGE_KEY = "spar-references-v1";

export function loadReferences(): DesignReference[] {
  if (typeof window === "undefined") return SEED_REFERENCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_REFERENCES;
    const uploaded = JSON.parse(raw) as DesignReference[];
    if (!Array.isArray(uploaded)) return SEED_REFERENCES;
    const seedIds = new Set(SEED_REFERENCES.map((r) => r.id));
    const extras = uploaded.filter((r) => !seedIds.has(r.id));
    return [...extras, ...SEED_REFERENCES];
  } catch {
    return SEED_REFERENCES;
  }
}

export function persistUploads(refs: DesignReference[]) {
  if (typeof window === "undefined") return;
  const uploads = refs.filter((r) => r.source === "upload");
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
}

export function getReferenceById(
  refs: DesignReference[],
  id: string,
): DesignReference | undefined {
  return refs.find((r) => r.id === id);
}
