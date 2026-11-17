"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LimeCtaProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  showArrow?: boolean;
  disabled?: boolean;
};

export function LimeCta({
  children,
  onClick,
  type = "button",
  className,
  showArrow = true,
  disabled,
}: LimeCtaProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-full bg-[#CCFF00] px-6 py-3 text-sm font-medium text-black transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span>{children}</span>
      {showArrow ? <ArrowUpRight className="size-4" strokeWidth={2} /> : null}
    </button>
  );
}
