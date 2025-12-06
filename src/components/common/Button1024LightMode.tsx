"use client";

import * as React from "react";
import { cn } from "@components/ui/utils";
import { cva, type VariantProps } from "class-variance-authority";

const lightVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      size: {
        lg: "px-6 py-2 text-lg button-s",
      },
      weight: {
        light: "font-light",
        medium: "font-medium",
      },
    },
    defaultVariants: {
      size: "lg",
      weight: "light",
    },
  },
);

type LightButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof lightVariants> & {
    className?: string;
  };

export function Button1024LightMode({ className, size, weight, ...props }: LightButtonProps) {
  return (
        <button
          className={cn(
            "bg-[rgba(69,215,208,0.5)] hover:bg-[rgba(69,215,208,0.7)] text-white border-0",
            lightVariants({ size, weight, className })
          )}
          {...props}
        >
          {props.children}
        </button>
  );
}

export default Button1024LightMode;

