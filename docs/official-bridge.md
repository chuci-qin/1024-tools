# AI 内容生成器

## 项目简介

一款 AI 驱动的社交媒体内容生成工具，用户上传产品图片，AI 自动生成适合小红书、抖音的爆款文案。

## 核心功能

- **我有产品**: 上传产品图 → 选择风格/场景/字数 → AI 生成文案 ✅
- **对标图文**: 参考爆款内容生成 (待开发)
- **爆款创作**: 热门话题创作 (待开发)
- **图片焕新**: 图片优化处理 (待开发)

## 技术栈

- Next.js 14 (App Router) + Tailwind CSS
- OpenAI GPT-4o-mini (视觉模型)
- React Query + Sonner (Toast)

## 开发进度

- [x] 首页布局 - Banner + 平台选择 + 功能入口 + 底部导航
- [x] 产品页面 - 图片上传 + 风格/场景/字数选择器
- [x] 结果页面 - AI生成结果展示 + 复制/重新生成
- [x] OpenAI API 集成 - 图片理解 + 文案生成

## 相关文件

| 文件 | 说明 |
|------|------|
| `docs/ai-content-generator.md` | 完整设计文档 |
| `src/app/(platform)/page.tsx` | 首页 |
| `src/app/(platform)/product/page.tsx` | 产品页 |
| `src/app/(platform)/product/result/page.tsx` | 结果页 |
| `src/app/api/generate/route.ts` | AI 生成接口 |

## 环境变量

```env
LLM_API_KEY=sk-xxx
LLM_CHATBOT_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1  # 可选，默认为 OpenAI，通义千问可用 https://dashscope.aliyuncs.com/compatible-mode/v1
```

## 使用方法

```bash
npm run dev
```

访问 http://localhost:3001

### 测试流程
1. 访问首页，点击「我有产品」
2. 上传一张产品图片
3. 选择文案风格、关联场景、字数
4. 点击「智能生成文案」
5. 查看 AI 生成的标题和文案
6. 复制文案到小红书/抖音发布
