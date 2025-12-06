"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// 文案风格选项
const styleOptions = [
  { id: 'smart', label: '智能识别' },
  { id: 'viral', label: '爆款热门' },
  { id: 'professional', label: '专业商务' },
  { id: 'creative', label: '创意时尚' },
  { id: 'friendly', label: '亲和温馨' },
  { id: 'humorous', label: '幽默搞笑' },
];

// 关联场景选项
const sceneOptions = [
  { id: 'default', label: '默认' },
  { id: 'beauty', label: '美妆' },
  { id: 'fashion', label: '穿搭' },
  { id: 'home', label: '家居' },
  { id: 'fitness', label: '健身' },
  { id: 'food', label: '美食' },
  { id: 'digital', label: '数码' },
  { id: 'baby', label: '母婴' },
];

// 文案字数选项
const wordCountOptions = [
  { id: 50, label: '50', desc: '精简版' },
  { id: 100, label: '100', desc: '标准版' },
  { id: 200, label: '200', desc: '详细版' },
  { id: 500, label: '500', desc: '完整版' },
  { id: 1000, label: '1000', desc: '深度版' },
];

export default function ProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [image, setImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('viral');
  const [selectedScene, setSelectedScene] = useState('default');
  const [selectedWordCount, setSelectedWordCount] = useState(200);
  const [supplement, setSupplement] = useState('');
  const [showSupplement, setShowSupplement] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小 (限制 4MB)
      if (file.size > 4 * 1024 * 1024) {
        toast.error('图片大小不能超过 4MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        toast.success('图片上传成功！');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canGenerate = image !== null;

  const handleGenerate = async () => {
    if (!canGenerate || !image) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: image,
          style: selectedStyle,
          scene: selectedScene,
          wordCount: selectedWordCount,
          supplement: supplement,
          platform: 'xiaohongshu',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      // 存储结果到 sessionStorage
      sessionStorage.setItem('generateResult', JSON.stringify({
        title: data.title,
        content: data.content,
        image: image,
      }));

      router.push('/product/result');
      
    } catch (error) {
      console.error('Generate error:', error);
      toast.error(error instanceof Error ? error.message : '生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#111111]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">我有产品</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 产品图片上传 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-white font-medium">产品图片（仅需1张）</h2>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          {!image ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[4/3] max-w-[200px] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#4cf8f0]/50 hover:bg-white/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white/60" />
              </div>
              <span className="text-white/60 text-sm">添加图片</span>
            </button>
          ) : (
            <div className="relative w-full max-w-[200px]">
              <img
                src={image}
                alt="Product"
                className="w-full aspect-[4/3] object-cover rounded-2xl border border-white/20"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-2 left-2 right-2 bg-green-500/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span className="text-white text-xs">已上传</span>
              </div>
            </div>
          )}
        </section>

        {/* 文案风格 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-white font-medium">文案风格</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {styleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  selectedStyle === style.id
                    ? 'bg-indigo-500/20 border border-indigo-500'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  selectedStyle === style.id ? 'bg-indigo-500' : 'bg-white/30'
                }`} />
                <span className="text-white text-sm">{style.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 关联场景 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-white font-medium">关联场景</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {sceneOptions.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  selectedScene === scene.id
                    ? 'bg-[#4cf8f0]/20 border border-[#4cf8f0]'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  selectedScene === scene.id ? 'bg-[#4cf8f0]' : 'bg-white/30'
                }`} />
                <span className="text-white text-sm">{scene.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 文案字数 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-white font-medium">文案字数</h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {wordCountOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedWordCount(option.id)}
                className={`flex-shrink-0 flex flex-col items-center px-5 py-3 rounded-xl transition-all ${
                  selectedWordCount === option.id
                    ? 'bg-white/10 border-2 border-indigo-500'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-white font-semibold">{option.label}</span>
                <span className="text-white/50 text-xs">{option.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 文字补充 */}
        <section>
          <button
            onClick={() => setShowSupplement(!showSupplement)}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-white font-medium">文字补充</h2>
            <svg 
              className={`w-4 h-4 text-white/50 transition-transform ${showSupplement ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showSupplement && (
            <textarea
              value={supplement}
              onChange={(e) => setSupplement(e.target.value)}
              placeholder="输入产品卖点、关键词、特殊要求等..."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-[#4cf8f0]/50 transition-colors"
            />
          )}
        </section>

        {/* 生成按钮 */}
        <div className="pt-4">
          {canGenerate && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">所有条件已满足，可以开始生成！</span>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              canGenerate
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI 生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>智能生成文案</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
