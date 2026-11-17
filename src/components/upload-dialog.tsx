"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LimeCta } from "@/components/lime-cta";
import { mockExtractFromImage } from "@/lib/extraction";
import { useReferences } from "@/components/references-provider";
import type { DesignReference } from "@/lib/types";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function UploadDialog() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();
  const { addReference } = useReferences();
  const router = useRouter();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const extracted = await mockExtractFromImage(file.name, dataUrl);
      const ref: DesignReference = {
        id: `upload-${Date.now()}`,
        title: extracted.title,
        imageUrl: dataUrl,
        labels: extracted.labels,
        semantic: extracted.semantic,
        prompt: extracted.prompt,
        boundingBox: extracted.boundingBox,
        location: extracted.location,
        capturedAt: new Date().toISOString().slice(0, 10),
        source: "upload",
      };
      startTransition(() => {
        addReference(ref);
        setOpen(false);
        setBusy(false);
        router.push(`/r/${ref.id}`);
      });
    } catch {
      setError("Could not process that image. Try another file.");
      setBusy(false);
    }
  }

  return (
    <>
      <LimeCta
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-40 shadow-sm md:right-8 md:bottom-8"
      >
        Upload
      </LimeCta>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-5 rounded-none border-black/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans text-xl">
              Capture a reference
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-black/55">
              Upload a photo. Spar invents a lasso region, labels, and a
              copyable generative prompt offline (mock extraction — plug
              OpenRouter later).
            </DialogDescription>
          </DialogHeader>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />

          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 border border-dashed border-black/25 bg-[#f6f6f6] text-sm transition-colors hover:bg-[#efefef] disabled:opacity-60"
          >
            {busy ? (
              <span className="font-mono text-xs tracking-wide">
                Extracting…
              </span>
            ) : (
              <>
                <span>Drop or choose an image</span>
                <span className="font-mono text-[10px] text-black/45">
                  JPG · PNG · WEBP
                </span>
              </>
            )}
          </button>

          {error ? (
            <p className="font-mono text-xs text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
