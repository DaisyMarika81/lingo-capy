import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "primary" | "gradient" | "bordered";
}

export function Card({ className, variant = "white", children, ...props }: CardProps) {
  const variantStyles = {
    white: "bg-white text-ink-900 shadow-card",
    primary: "bg-capy-primary text-white shadow-card",
    gradient: "bg-gradient-to-br from-[#EEF2FF] to-white text-ink-900 shadow-card",
    bordered: "bg-white text-ink-900 border-2 border-capy-border shadow-sm",
  };

  return (
    <div
      className={cn(
        "rounded-card p-6 transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
