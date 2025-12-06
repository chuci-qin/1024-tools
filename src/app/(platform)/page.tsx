"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Music, Video, FileText, Package, Flame, ImageIcon, Megaphone } from 'lucide-react';

// 平台选择
const platforms = [
  { id: 'xiaohongshu', icon: Heart, label: '小红', color: 'text-red-400' },
  { id: 'douyin', icon: Music, label: '抖抖', color: 'text-white' },
  { id: 'video', icon: Video, label: 'AI视频', color: 'text-white' },
];

// 功能入口
const features = [
  { 
    id: 'benchmark', 
    icon: FileText, 
    label: '对标图文', 
    href: '/benchmark',
    gradient: 'from-violet-600 to-indigo-600',
    description: '参考爆款生成'
  },
  { 
    id: 'product', 
    icon: Package, 
    label: '我有产品', 
    href: '/product',
    gradient: 'from-pink-500 to-rose-500',
    description: '上传产品生成文案'
  },
  { 
    id: 'viral', 
    icon: Flame, 
    label: '爆款创作', 
    href: '/viral',
    gradient: 'from-blue-500 to-cyan-500',
    description: '热门话题创作'
  },
  { 
    id: 'image', 
    icon: ImageIcon, 
    label: '图片焕新', 
    href: '/image',
    gradient: 'from-teal-500 to-emerald-500',
    description: '图片优化处理'
  },
];

export default function HomePage() {
  const [activePlatform, setActivePlatform] = useState('xiaohongshu');

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6">
        {/* 装饰元素 */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full blur-sm opacity-80" />
        <div className="absolute top-8 right-12 w-8 h-8 bg-yellow-300 rounded-full" />
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-yellow-400/50 rounded-full" />
        
        {/* 喇叭图标 */}
        <div className="absolute right-6 bottom-4">
          <Megaphone className="w-16 h-16 text-yellow-400 transform rotate-[-15deg]" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI一出手
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="text-white font-medium">🔥 爆款跟你走</span>
          </div>
        </div>
      </div>

      {/* 平台选择 Tabs */}
      <div className="flex gap-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isActive = activePlatform === platform.id;
          
          return (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/10 border border-[#4cf8f0]/50' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${platform.color}`} />
              <span className="text-sm font-medium text-white">{platform.label}</span>
            </button>
          );
        })}
      </div>

      {/* 功能入口 Grid */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              {/* 图标 */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              {/* 文字 */}
              <h3 className="text-white font-semibold mb-1">{feature.label}</h3>
              <p className="text-white/50 text-sm">{feature.description}</p>
              
              {/* 悬停箭头 */}
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-[#4cf8f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 快速入口提示 */}
      <div className="bg-gradient-to-r from-[#4cf8f0]/10 to-orange-500/10 border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4cf8f0]/20 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <p className="text-white font-medium">新用户专享</p>
            <p className="text-white/50 text-sm">每日免费生成 10 次爆款文案</p>
          </div>
        </div>
      </div>
    </div>
  );
}
