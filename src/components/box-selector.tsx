"use client";

import { useRef } from "react";
import type { BoundingBox } from "@/lib/types";

type Corner = "nw" | "ne" | "sw" | "se";

type Drag =
  /** Drawing or resizing: one corner stays fixed, the pointer is the other. */
  | { kind: "stretch"; anchorX: number; anchorY: number; previous: BoundingBox | null }
  | { kind: "move"; grabX: number; grabY: number };

const MIN_SIZE = 0.03;
const CORNERS: { corner: Corner; className: string }[] = [
  { corner: "nw", className: "-top-2 -left-2 cursor-nwse-resize" },
  { corner: "ne", className: "-top-2 -right-2 cursor-nesw-resize" },
  { corner: "sw", className: "-bottom-2 -left-2 cursor-nesw-resize" },
  { corner: "se", className: "-right-2 -bottom-2 cursor-nwse-resize" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type BoxSelectorProps = {
  src: string;
  /** Pixel size of the image, used only for its aspect ratio. */
  width: number;
  height: number;
  box: BoundingBox | null;
  onChange: (box: BoundingBox | null) => void;
  disabled?: boolean;
};

/**
 * Drag on the photo to draw a box, drag the box to move it, drag a corner to
 * resize it. Coordinates are normalized 0–1 against the image.
 */
export function BoxSelector({
  src,
  width,
  height,
  box,
  onChange,
  disabled,
}: BoxSelectorProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);

  function pointAt(event: React.PointerEvent) {
    const rect = surfaceRef.current!.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
    };
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0) return;
    const point = pointAt(event);
    const target = event.target as HTMLElement;
    const corner = target.dataset.corner as Corner | undefined;

    if (corner && box) {
      dragRef.current = {
        kind: "stretch",
        anchorX: corner.includes("w") ? box.x + box.width : box.x,
        anchorY: corner.includes("n") ? box.y + box.height : box.y,
        previous: box,
      };
    } else if (target.dataset.boxBody !== undefined && box) {
      dragRef.current = {
        kind: "move",
        grabX: point.x - box.x,
        grabY: point.y - box.y,
      };
    } else {
      dragRef.current = {
        kind: "stretch",
        anchorX: point.x,
        anchorY: point.y,
        previous: box,
      };
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointAt(event);

    if (drag.kind === "move" && box) {
      onChange({
        ...box,
        x: clamp(point.x - drag.grabX, 0, 1 - box.width),
        y: clamp(point.y - drag.grabY, 0, 1 - box.height),
      });
      return;
    }
    if (drag.kind === "stretch") {
      onChange({
        x: Math.min(drag.anchorX, point.x),
        y: Math.min(drag.anchorY, point.y),
        width: Math.abs(point.x - drag.anchorX),
        height: Math.abs(point.y - drag.anchorY),
      });
    }
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    // A click or a sliver is not a selection: keep whatever was there before.
    if (
      drag.kind === "stretch" &&
      (!box || box.width < MIN_SIZE || box.height < MIN_SIZE)
    ) {
      onChange(drag.previous);
    }
  }

  return (
    <div
      ref={surfaceRef}
      role="application"
      aria-label="Photo. Drag to draw a box around the element to extract."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative mx-auto touch-none overflow-hidden bg-[#e4e4e4] select-none data-[disabled=true]:opacity-70"
      data-disabled={disabled ? "true" : "false"}
      style={{
        aspectRatio: `${width} / ${height}`,
        width: `min(100%, calc(52vh * ${width / height}))`,
        cursor: disabled ? "default" : "crosshair",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="pointer-events-none block size-full"
      />
      {box ? (
        <div
          data-box-body
          className="absolute border-2 border-[#CCFF00] shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.width * 100}%`,
            height: `${box.height * 100}%`,
            cursor: disabled ? "default" : "move",
          }}
        >
          {disabled
            ? null
            : CORNERS.map(({ corner, className }) => (
                <span
                  key={corner}
                  data-corner={corner}
                  className={`absolute size-4 border border-black bg-[#CCFF00] ${className}`}
                />
              ))}
        </div>
      ) : null}
    </div>
  );
}
