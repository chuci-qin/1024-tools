"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Copy, Check, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GenerateResult {
  title: string;
  content: string;
  image: string;
}

export default function ResultPage() {
  const router = useRouter();
  
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 从 sessionStorage 获取结果
    const savedResult = sessionStorage.getItem('generateResult');
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setResult(parsed);
      } catch (e) {
        console.error('Parse error:', e);
        toast.error('加载结果失败');
        router.push('/product');
        return;
      }
    } else {
      toast.error('未找到生成结果');
      router.push('/product');
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleRegenerate = async () => {
    if (!result?.image) return;
    
    setIsRegenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: result.image,
          style: 'viral',
          scene: 'default',
          wordCount: 200,
          platform: 'xiaohongshu',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      const newResult = {
        title: data.title,
        content: data.content,
        image: result.image,
      };
      
      setResult(newResult);
      sessionStorage.setItem('generateResult', JSON.stringify(newResult));
      toast.success('已重新生成');
      
    } catch (error) {
      console.error('Regenerate error:', error);
      toast.error(error instanceof Error ? error.message : '重新生成失败');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyAll = () => {
    if (!result) return;
    
    const text = `${result.title}\n\n${result.content}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('已复制到剪贴板');
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">加载中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#111111]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/product" className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">生成结果</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 结果头部 */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-6 text-center">
          <h2 className="text-xl font-bold text-white">AI生成结果</h2>
          <p className="text-white/70 text-sm mt-1">基于您的产品图片智能生成</p>
        </div>

        {/* 产品图片预览 */}
        {result.image && (
          <div className="flex justify-center">
            <img
              src={result.image}
              alt="Product"
              className="w-24 h-24 object-cover rounded-xl border border-white/20"
            />
          </div>
        )}

        {/* 生成的标题 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="text-white/50 text-sm mb-2">生成的标题</div>
          <p className="text-white text-lg font-medium">{result.title}</p>
        </div>

        {/* 生成的文案 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="text-white/50 text-sm mb-3">生成的文案</div>
          <div className="text-white whitespace-pre-wrap leading-relaxed">
            {result.content}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex-1 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? '生成中...' : '重新生成'}</span>
          </button>
          
          <button
            onClick={handleCopyAll}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-violet-500 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>复制全部</span>
              </>
            )}
          </button>
        </div>

        {/* 提示 */}
        <div className="bg-[#4cf8f0]/10 border border-[#4cf8f0]/30 rounded-xl p-4">
          <p className="text-[#4cf8f0] text-sm">
            💡 提示：您可以直接复制文案到小红书、抖音等平台发布
          </p>
        </div>
      </div>

      {/* 悬浮分享按钮 */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform">
        <ArrowUp className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
