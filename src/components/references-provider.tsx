"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { DesignReference } from "@/lib/types";
import { SEED_REFERENCES } from "@/lib/seed-data";
import { loadReferences, persistUploads } from "@/lib/storage";

type ReferencesContextValue = {
  references: DesignReference[];
  ready: boolean;
  addReference: (ref: DesignReference) => void;
  getById: (id: string) => DesignReference | undefined;
};

const ReferencesContext = createContext<ReferencesContextValue | null>(null);

export function ReferencesProvider({ children }: { children: ReactNode }) {
  const [references, setReferences] =
    useState<DesignReference[]>(SEED_REFERENCES);
  const [ready, setReady] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setReferences(loadReferences());
      setReady(true);
    });
  }, []);

  const addReference = useCallback((ref: DesignReference) => {
    setReferences((prev) => {
      const next = [ref, ...prev.filter((r) => r.id !== ref.id)];
      persistUploads(next);
      return next;
    });
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
