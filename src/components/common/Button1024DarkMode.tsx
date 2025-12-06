"use client";

import * as React from "react";
import { cn } from "@components/ui/utils";
import { cva, type VariantProps } from "class-variance-authority";

/** 与 LightMode 完全一致的尺寸/字重配置 */
const darkVariants = cva(
  // 基础交互与圆角、focus ring 与 Light 保持一致
  "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      size: {
        // 与 lightVariants 完全相同
        lg: "px-6 py-2 text-lg button-s",
      },
      weight: {
        light: "font-light",
        medium: "font-medium",
      },
    },
    defaultVariants: {
      size: "lg",
      weight: "medium",
    },
  },
);

type DarkButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof darkVariants> & {
    className?: string;
  };

export function Button1024DarkMode({
  className,
  size,
  weight,
  children,
  ...props
}: DarkButtonProps) {
  // A lightweight, no-centering glass FX layer inspired by liquid-glass-react,
  // but without internal position management (no translate(-50%, -50%)).
  // This follows the idea from the issue's solution to opt out of centering.
  function FXWarp({
    cornerRadius = 999,
    blurAmount = 0.08,
    saturation = 50,
    overLight = false,
  }: { cornerRadius?: number; blurAmount?: number; saturation?: number; overLight?: boolean }) {
    const isFirefox = typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox");
    const blurPx = (overLight ? 12 : 4) + blurAmount * 32;
    return (
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: cornerRadius,
          // No transform at all — avoids center anchoring entirely
          transform: "none",
          // Keep things performant and visually similar
          backdropFilter: `blur(${blurPx}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturation}%)`,
          // Fallback for Firefox where backdropFilter is limited
          // (we skip SVG filter shims here for simplicity and stability)
          filter: isFirefox ? undefined : undefined,
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        // 外层只是“定位+圆角”，不加尺寸类，避免和 button 本体抢 class
        "relative inline-flex rounded-full isolate",
        className,
      )}
    >
      {/* FX 层：只放折射玻璃；裁切它，别影响边缘光 */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "rounded-inherit overflow-hidden", // 只裁 LiquidGlass，避免“飞边”
          "will-change:transform contain-paint",
        )}
        aria-hidden
      >
        <FXWarp cornerRadius={999} blurAmount={0.08} saturation={140} overLight={false} />
      </div>

      {/* 真正的按钮本体：把 cva 尺寸类挂这里，保证和 Light 完全一致 */}
      <button
        {...props}
        className={cn(
          darkVariants({ size, weight }),
          "rounded-full relative z-[1] text-white bg-black/25",
          "shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]",
        )}
      >
        {children}
      </button>
    </div>
  );
}

export default Button1024DarkMode;
