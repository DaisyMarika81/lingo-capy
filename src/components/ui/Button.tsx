import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cta" | "white" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variantStyles = {
      primary: "btn-pri",
      cta: "btn-cta",
      white: "btn-white",
      outline: "bg-white text-ink-900 border-2 border-capy-border hover:border-capy-primary",
      ghost: "bg-transparent text-ink-700 hover:bg-capy-softBg",
    };

    const sizeStyles = {
      sm: "min-h-[40px] px-4 text-sm rounded-xl",
      md: "min-h-[48px] px-6 text-base rounded-2xl",
      lg: "min-h-[56px] px-8 text-lg rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "btn-3d font-bold tracking-tight inline-flex items-center justify-center gap-2",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
