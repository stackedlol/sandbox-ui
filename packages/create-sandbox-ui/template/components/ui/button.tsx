"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "glass-strong",
    "border-[var(--glass-border-strong)]",
    "text-fg",
    "hover:shadow-[0_0_24px_rgba(255,255,255,0.06)]",
    "hover:border-fg/25",
    "active:scale-[0.97]",
  ].join(" "),
  secondary: [
    "glass",
    "text-fg/80",
    "hover:shadow-[0_0_16px_rgba(255,255,255,0.04)]",
    "hover:border-fg/15",
    "active:scale-[0.97]",
  ].join(" "),
  ghost: [
    "bg-transparent",
    "border border-transparent",
    "text-fg/60",
    "hover:bg-[var(--glass-bg)]",
    "hover:border-[var(--glass-border)]",
    "active:scale-[0.97]",
  ].join(" "),
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          "cursor-pointer select-none",
          sizeClasses[size],
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
