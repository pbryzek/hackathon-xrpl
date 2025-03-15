
import * as React from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium",
          {
            "bg-bond-blue/10 text-bond-blue": variant === "default",
            "border border-border bg-transparent": variant === "outline",
            "bg-bond-green/10 text-bond-green": variant === "success",
            "bg-amber-500/10 text-amber-600": variant === "warning",
            "bg-bond-red/10 text-bond-red": variant === "danger",
            "text-xs px-2 py-0.5": size === "sm",
            "text-sm px-2.5 py-1": size === "md",
            "text-base px-3 py-1.5": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";

export { Chip };
