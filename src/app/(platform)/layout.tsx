"use client";
import { Settings, Sparkles, Bot, LayoutGrid, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@components/common/Logo';

const navItems = [
  { href: '/', icon: Sparkles, label: '创作' },
  { href: '/agents', icon: Bot, label: '智能体' },
  { href: '/templates', icon: LayoutGrid, label: '模板' },
  { href: '/profile', icon: User, label: '我的' },
];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111111]/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-50">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'text-[#4cf8f0]' 
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? 'bg-[#4cf8f0]/20' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
