"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Button1024LightMode from './Button1024LightMode'
import Button1024DarkMode from './Button1024DarkMode'

const button1024Variants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        light_mode:
          "bg-[rgba(69,215,208,0.5)] hover:bg-[rgba(69,215,208,0.7)] text-white border-0",
        dark_mode:
          "border border-white/20 text-white hover:bg-white/10",
      },
      size: {
        lg: "px-6 py-2 text-lg button-s",
      },
      weight: {
        light: "font-light",
        medium: "font-medium",
      },
    },
    defaultVariants: {
      variant: "light_mode",
      size: "lg",
      weight: "light",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button1024Variants> & {
    asChild?: boolean;
    size?: "lg";
    weight?: "light" | "medium";
  };

export function Button1024({ className, variant, size, weight, ...props }: ButtonProps) {
  if (variant === 'light_mode') {
    return (
          <Button1024LightMode className={className} size={size} weight={weight} {...props} />
    );
  }

  return (
        <Button1024DarkMode className={className} size={size} weight={weight} {...props} />
  );
}

export { button1024Variants };


