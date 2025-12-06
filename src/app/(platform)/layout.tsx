"use client";
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@components/common/Logo';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-[#111111] to-[#111111] text-white relative overflow-hidden">
      {/* Cyan gradients to match Figma design */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/50 via-orange-600/25 to-transparent"></div>
      </div>

      {/* Upper-left light effect */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 -left-48 w-[100vw] h-[100vw] blur-2xl opacity-80 mix-blend-screen"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(41,122,119,0.75)_0%,rgba(41,122,119,0.35)_15%,transparent_45%)]"></div>
      </div>

      {/* Lower-right orange light effect (mirrored) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -right-48 w-[100vw] h-[100vw] blur-2xl opacity-80 mix-blend-screen"
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,129,39,0.75)_0%,rgba(255,129,39,0.35)_5%,transparent_38%)]"></div>
      </div>

      {/* Navigation Bar */}
      <header className="relative z-50 flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Home">
            <Logo className="w-[87px] h-[17px]" />
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Settings className="w-6 h-6 text-white cursor-pointer hover:text-white/80 transition-colors" />
        </div>
      </header>

      {/* Main content area */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
