"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Music, Video, FileText, Package, Flame, ImageIcon, Megaphone, Github, X, ExternalLink } from 'lucide-react';

// 平台选择
const platforms = [
  { id: 'xiaohongshu', icon: Heart, label: '小红', color: 'text-red-400', enabled: true },
  { id: 'douyin', icon: Music, label: '抖抖', color: 'text-white/40', enabled: false },
  { id: 'video', icon: Video, label: 'AI视频', color: 'text-white/40', enabled: false },
];

// 功能入口
const features = [
  { 
    id: 'benchmark', 
    icon: FileText, 
    label: '对标图文', 
    href: '/benchmark',
    gradient: 'from-violet-600/30 to-indigo-600/30',
    description: '参考爆款生成',
    enabled: false,
  },
  { 
    id: 'product', 
    icon: Package, 
    label: '我有产品', 
    href: '/product',
    gradient: 'from-pink-500 to-rose-500',
    description: '上传产品生成文案',
    enabled: true,
  },
  { 
    id: 'viral', 
    icon: Flame, 
    label: '爆款创作', 
    href: '/viral',
    gradient: 'from-blue-500/30 to-cyan-500/30',
    description: '热门话题创作',
    enabled: false,
  },
  { 
    id: 'image', 
    icon: ImageIcon, 
    label: '图片焕新', 
    href: '/image',
    gradient: 'from-teal-500/30 to-emerald-500/30',
    description: '图片优化处理',
    enabled: false,
  },
];

const GITHUB_URL = 'https://github.com/chuci-qin/1024-tools';

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState('xiaohongshu');
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string>('');

  const handleDisabledClick = (label: string) => {
    setSelectedFeature(label);
    setShowModal(true);
  };

  return (
    <>
      <div className="px-3 py-4 space-y-4">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-4">
          {/* 装饰元素 */}
          <div className="absolute top-2 right-2 w-12 h-12 bg-yellow-400 rounded-full blur-sm opacity-80" />
          <div className="absolute top-5 right-8 w-6 h-6 bg-yellow-300 rounded-full" />
          <div className="absolute bottom-2 left-2 w-4 h-4 bg-yellow-400/50 rounded-full" />
          
          {/* 喇叭图标 */}
          <div className="absolute right-4 bottom-2">
            <Megaphone className="w-12 h-12 text-yellow-400 transform rotate-[-15deg]" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-1.5">
              AI一出手
            </h1>
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">🔥 爆款跟你走</span>
            </div>
          </div>
        </div>

        {/* 平台选择 Tabs */}
        <div className="flex gap-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isActive = activePlatform === platform.id;
            
            return (
              <button
                key={platform.id}
                onClick={() => platform.enabled ? setActivePlatform(platform.id) : handleDisabledClick(platform.label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  !platform.enabled 
                    ? 'bg-white/5 border border-white/5 opacity-50'
                    : isActive 
                      ? 'bg-white/10 border border-[#4cf8f0]/50' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${platform.color}`} />
                <span className={`text-xs font-medium ${platform.enabled ? 'text-white' : 'text-white/40'}`}>
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 功能入口 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            
            if (!feature.enabled) {
              return (
                <button
                  key={feature.id}
                  onClick={() => handleDisabledClick(feature.label)}
                  className="relative bg-white/5 border border-white/10 border-dashed rounded-xl p-3.5 hover:border-[#4cf8f0]/30 hover:bg-white/[0.03] transition-all text-left group"
                >
                  {/* 右上角敬请期待 */}
                  <div className="absolute top-2 right-2 bg-white/10 rounded-full px-1.5 py-0.5">
                    <span className="text-white/50 text-[10px]">敬请期待</span>
                  </div>
                  
                  {/* 图标 */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white/40" />
                  </div>
                  
                  {/* 文字 */}
                  <h3 className="text-white/40 text-sm font-semibold mb-0.5">{feature.label}</h3>
                  <p className="text-white/25 text-xs mb-2">{feature.description}</p>
                  
                  {/* 底部提示 */}
                  <div className="flex items-center gap-0.5 text-[#4cf8f0]/60 group-hover:text-[#4cf8f0] transition-colors">
                    <span className="text-[10px]">🚀 点击参与共建</span>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            }
            
            return (
              <Link
                key={feature.id}
                href={feature.href}
                className="group relative bg-white/5 border border-white/10 rounded-xl p-3.5 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* 图标 */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                
                {/* 文字 */}
                <h3 className="text-white text-sm font-semibold mb-0.5">{feature.label}</h3>
                <p className="text-white/50 text-xs">{feature.description}</p>
                
                {/* 悬停箭头 */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-[#4cf8f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 开源共建提示 */}
        <Link 
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-[#4cf8f0]/10 to-orange-500/10 border border-white/10 rounded-lg p-3 hover:border-[#4cf8f0]/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Github className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">🌟 一起共建开源项目</p>
              <p className="text-white/50 text-xs">欢迎 Star、Fork、PR</p>
            </div>
            <ExternalLink className="w-4 h-4 text-white/50" />
          </div>
        </Link>
      </div>

      {/* 共建 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal 内容 */}
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-xl p-5 max-w-xs w-full shadow-2xl">
            {/* 关闭按钮 */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* 图标 */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4cf8f0]/20 to-orange-500/20 flex items-center justify-center">
                <Github className="w-6 h-6 text-[#4cf8f0]" />
              </div>
            </div>
            
            {/* 标题 */}
            <h3 className="text-lg font-bold text-white text-center mb-2">
              「{selectedFeature}」功能开发中
            </h3>
            
            {/* 描述 */}
            <p className="text-white/60 text-sm text-center mb-4">
              这是一个开源项目，诚邀您一起参与共建！
              <br />
              <span className="text-[#4cf8f0]">您的代码将让工具更强大 ✨</span>
            </p>
            
            {/* 功能列表 */}
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-white/50 text-xs mb-1.5">您可以贡献：</p>
              <ul className="text-white/70 text-xs space-y-0.5">
                <li>• 🎨 新功能开发</li>
                <li>• 🐛 Bug 修复</li>
                <li>• 📝 文档完善</li>
                <li>• 💡 提交 Issue</li>
              </ul>
            </div>
            
            {/* 按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                知道了
              </button>
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#4cf8f0] to-cyan-400 text-black text-sm font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Github className="w-3.5 h-3.5" />
                去 GitHub
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
