"use client";
import { useState } from 'react';
import { Github, Sparkles, Bot, LayoutGrid, User, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@components/common/Logo';

const GITHUB_URL = 'https://github.com/chuci-qin/1024-tools';

const navItems = [
  { href: '/', icon: Sparkles, label: '创作', enabled: true },
  { href: '/agents', icon: Bot, label: '智能体', enabled: false },
  { href: '/templates', icon: LayoutGrid, label: '模板', enabled: false },
  { href: '/profile', icon: User, label: '我的', enabled: false },
];

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  const handleDisabledClick = (label: string) => {
    setSelectedFeature(label);
    setShowModal(true);
  };

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

        {/* Right Side - GitHub */}
        <div className="flex items-center space-x-4">
          <Link 
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <Github className="w-5 h-5 text-white" />
            <span className="text-white text-sm">GitHub</span>
          </Link>
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
            const isActive = pathname === item.href || 
              (item.href === '/' && (pathname === '/' || pathname?.startsWith('/product')));
            const Icon = item.icon;
            
            if (!item.enabled) {
              return (
                <button
                  key={item.href}
                  onClick={() => handleDisabledClick(item.label)}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-white/30 hover:text-white/50 transition-colors"
                >
                  <div className="p-2 rounded-xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            }
            
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

      {/* 共建 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal 内容 */}
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            {/* 关闭按钮 */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* 图标 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4cf8f0]/20 to-orange-500/20 flex items-center justify-center">
                <Github className="w-8 h-8 text-[#4cf8f0]" />
              </div>
            </div>
            
            {/* 标题 */}
            <h3 className="text-xl font-bold text-white text-center mb-2">
              「{selectedFeature}」功能开发中
            </h3>
            
            {/* 描述 */}
            <p className="text-white/60 text-center mb-6">
              这是一个开源项目，我们诚邀您一起参与共建！
              <br />
              <span className="text-[#4cf8f0]">您的每一行代码都将让这个工具更强大 ✨</span>
            </p>
            
            {/* 功能列表 */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-white/50 text-sm mb-2">您可以贡献：</p>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• 🎨 新功能开发</li>
                <li>• 🐛 Bug 修复</li>
                <li>• 📝 文档完善</li>
                <li>• 💡 提交 Issue 建议</li>
              </ul>
            </div>
            
            {/* 按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                知道了
              </button>
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4cf8f0] to-cyan-400 text-black font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Github className="w-4 h-4" />
                去 GitHub
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
