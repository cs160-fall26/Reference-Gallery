"use client";

import type { BoundingBox } from "@/lib/types";

export function BoundingBoxOverlay({ box }: { box: BoundingBox }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute border-2 border-[#CCFF00] shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
      style={{
        left: `${box.x * 100}%`,
        top: `${box.y * 100}%`,
        width: `${box.width * 100}%`,
        height: `${box.height * 100}%`,
      }}
    >
      <span className="absolute -top-5 left-0 font-mono text-[10px] tracking-wide text-black/70">
        EXTRACTED
      </span>
    </div>
  );
}
