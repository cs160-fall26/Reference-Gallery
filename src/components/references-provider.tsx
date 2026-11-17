"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DesignReference } from "@/lib/types";
import { loadReferences, saveReference } from "@/lib/storage";

type ReferencesContextValue = {
  references: DesignReference[];
  ready: boolean;
  /** Resolves once the reference is stored; rejects if the browser refuses it. */
  addReference: (ref: DesignReference) => Promise<void>;
  getById: (id: string) => DesignReference | undefined;
};

const ReferencesContext = createContext<ReferencesContextValue | null>(null);

export function ReferencesProvider({ children }: { children: ReactNode }) {
  const [references, setReferences] = useState<DesignReference[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadReferences()
      .then((refs) => {
        if (!cancelled) setReferences(refs);
      })
      .catch(() => {
        // Storage unavailable (e.g. private mode): start with an empty library.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addReference = useCallback(async (ref: DesignReference) => {
    await saveReference(ref);
    setReferences((prev) => [ref, ...prev.filter((r) => r.id !== ref.id)]);
  }, []);

  const getById = useCallback(
    (id: string) => references.find((r) => r.id === id),
    [references],
  );

  const value = useMemo(
    () => ({ references, ready, addReference, getById }),
    [references, ready, addReference, getById],
  );

  return (
    <ReferencesContext.Provider value={value}>
      {children}
    </ReferencesContext.Provider>
  );
}

export function useReferences() {
  const ctx = useContext(ReferencesContext);
  if (!ctx) {
    throw new Error("useReferences must be used within ReferencesProvider");
  }
  return ctx;
}
