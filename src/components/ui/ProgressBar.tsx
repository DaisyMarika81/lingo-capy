import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0 - 100
  height?: number;
  color?: string;
  className?: string;
}

export function ProgressBar({
  progress,
  height = 12,
  color = "bg-capy-primary",
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={cn("bar-progress w-full", className)}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("bar-progress-inner", color)}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
