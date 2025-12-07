"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GenerateParams {
  image: string;
  style: string;
  scene: string;
  wordCount: number;
  supplement: string;
  platform: string;
}

export default function ResultPage() {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [params, setParams] = useState<GenerateParams | null>(null);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从流中读取内容
  const streamGenerate = async (generateParams: GenerateParams) => {
    setContent('');
    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateParams),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsGenerating(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setContent(prev => prev + parsed.content);
                // 自动滚动到底部
                if (contentRef.current) {
                  contentRef.current.scrollTop = contentRef.current.scrollHeight;
                }
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (err) {
      console.error('Stream error:', err);
      setError(err instanceof Error ? err.message : '生成失败');
      toast.error(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    // 从 sessionStorage 获取参数
    const savedParams = sessionStorage.getItem('generateParams');
    if (savedParams) {
      try {
        const parsed = JSON.parse(savedParams);
        setParams(parsed);
        streamGenerate(parsed);
      } catch (e) {
        console.error('Parse error:', e);
        toast.error('加载参数失败');
        router.push('/product');
      }
    } else {
      toast.error('未找到生成参数');
      router.push('/product');
    }
  }, [router]);

  const handleRegenerate = async () => {
    if (!params || isRegenerating) return;
    setIsRegenerating(true);
    await streamGenerate(params);
  };

  // 解析标题和正文
  const parseContent = () => {
    if (!content) return { title: '', body: '' };
    
    const lines = content.split('\n');
    const title = lines[0] || '';
    const body = lines.slice(1).join('\n').trim();
    
    return { title, body };
  };

  const { title, body } = parseContent();

  const handleCopyAll = () => {
    if (!content) return;
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('已复制到剪贴板');
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#111111]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/product" className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">生成结果</h1>
          {isGenerating && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">生成中...</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6" ref={contentRef}>
        {/* 结果头部 */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">AI生成结果</h2>
          </div>
          <p className="text-white/70 text-sm">基于您的产品图片智能生成</p>
        </div>

        {/* 产品图片预览 */}
        {params?.image && (
          <div className="flex justify-center">
            <img
              src={params.image}
              alt="Product"
              className="w-24 h-24 object-cover rounded-xl border border-white/20"
            />
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* 生成的标题 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="text-white/50 text-sm mb-2">生成的标题</div>
          <p className="text-white text-lg font-medium min-h-[28px]">
            {title || (isGenerating && <span className="text-white/30">正在生成...</span>)}
            {isGenerating && title && <span className="inline-block w-2 h-5 bg-[#4cf8f0] ml-1 animate-pulse" />}
          </p>
        </div>

        {/* 生成的文案 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="text-white/50 text-sm mb-3">生成的文案</div>
          <div className="text-white whitespace-pre-wrap leading-relaxed min-h-[100px]">
            {body || (isGenerating && !title && <span className="text-white/30">AI 正在分析图片...</span>)}
            {isGenerating && body && <span className="inline-block w-2 h-5 bg-[#4cf8f0] ml-1 animate-pulse" />}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating || isRegenerating}
            className="flex-1 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? '生成中...' : '重新生成'}</span>
          </button>
          
          <button
            onClick={handleCopyAll}
            disabled={!content || isGenerating}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-violet-500 transition-colors disabled:opacity-50"
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
    </div>
  );
}
