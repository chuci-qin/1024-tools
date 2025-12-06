# AI 内容生成器 - 开发设计文档

## 项目概述

一款 AI 驱动的社交媒体内容生成工具，帮助用户根据产品图片自动生成适合小红书、抖音等平台的爆款文案。

**核心价值**: AI一出手，爆款跟你走

## 页面结构 (共3页)

### 页面 1: 首页 (Home)

**路由**: `/`

**功能模块**:

1. **顶部 Banner**
   - 标语: "AI一出手 爆款跟你走"
   - 紫蓝色渐变背景 + 装饰元素（喇叭图标、圆点）

2. **平台选择 Tabs**
   - ❤️ 小红 (小红书)
   - 🎵 抖抖 (抖音)
   - 📹 AI视频

3. **功能入口 Grid (2x2)**
   | 功能 | 图标颜色 | 描述 |
   |------|----------|------|
   | 对标图文 | 紫色 | 参考爆款内容生成 |
   | 我有产品 | 粉色 | 根据产品图生成文案 ⭐主功能 |
   | 爆款创作 | 蓝色 | 热门话题创作 |
   | 图片焕新 | 青色 | 图片优化处理 |

4. **底部导航 Tab Bar**
   - 创作 (当前页)
   - 智能体
   - 模板
   - 我的

---

### 页面 2: 产品文案生成 (Product Copy Generator)

**路由**: `/product`

**页面标题**: 我有产品

**功能模块**:

1. **产品图片上传**
   - 标签: 产品图片（仅需1张）
   - 上传区域: 虚线框 + "添加图片"
   - 上传成功提示: "成功上传1张产品图！"

2. **文案风格选择** (单选，横向滚动)
   - 智能识别 (默认)
   - 爆款热门
   - 专业商务
   - 创意时尚
   - 亲和温馨
   - ...更多

3. **关联场景选择** (单选，横向滚动)
   - 默认
   - 美妆
   - 穿搭
   - 家居
   - 健身
   - ...更多

4. **文案字数选择** (单选)
   | 选项 | 字数 | 说明 |
   |------|------|------|
   | 精简版 | 50 | 短文案 |
   | 标准版 | 100 | 常规长度 |
   | 详细版 | 200 | 详细介绍 |
   | 完整版 | 500 | 完整描述 |
   | 深度版 | 1000 | 深度内容 |

5. **文字补充** (可选)
   - 展开/收起的输入区域
   - 用户可补充产品卖点、关键词等

6. **生成按钮**
   - "✨ 智能生成文案"
   - 条件满足时底部提示: "所有条件已满足，可以开始生成！"

---

### 页面 3: AI 生成结果 (Result)

**路由**: `/product/result` 或 Modal 弹窗

**功能模块**:

1. **结果头部**
   - 蓝紫色渐变背景
   - 标题: "AI生成结果"

2. **生成的标题**
   - 白色卡片
   - 显示生成的标题（带 emoji）
   - 示例: "🎀毛茸茸发簪，美妆时的可爱神器！"

3. **生成的文案**
   - 白色卡片
   - 显示生成的正文内容
   - 小红书风格文案（带 emoji、口语化）

4. **操作按钮**
   - 🔄 重新生成
   - 📋 复制全部
   - ⬆️ 右下角上传/分享按钮

---

## UI 设计规范

### 配色方案

```css
/* 主题色 */
--primary: #6366F1;        /* 紫蓝色 - 主按钮 */
--primary-light: #818CF8;  /* 浅紫 */
--accent-pink: #EC4899;    /* 粉色图标 */
--accent-blue: #3B82F6;    /* 蓝色图标 */
--accent-teal: #14B8A6;    /* 青色图标 */
--accent-orange: #F97316;  /* 橙色图标 */

/* 背景 */
--bg-primary: #FFFFFF;     /* 主背景 */
--bg-secondary: #F8FAFC;   /* 次级背景 */
--bg-card: #FFFFFF;        /* 卡片背景 */

/* 文字 */
--text-primary: #1F2937;   /* 主要文字 */
--text-secondary: #6B7280; /* 次要文字 */

/* 选中状态 */
--selected-bg: #6366F1;    /* 选中背景 */
--selected-border: #6366F1; /* 选中边框 */
```

### 组件样式

**选择按钮 (Chip)**
- 未选中: 白色背景 + 灰色边框 + 圆形图标
- 选中: 紫色边框 + 蓝色实心圆点

**卡片**
- 圆角: 12px
- 阴影: 轻微投影
- 内边距: 16px

**功能入口卡片**
- 大圆角图标 (渐变色)
- 文字居中在下方

---

## 技术实现

### 技术栈

- **前端**: Next.js 14 (App Router) + Tailwind CSS
- **AI 服务**: 通义千问 (Qwen) - 图文理解 + 文案生成
- **图片处理**: 本地预览 + Base64 编码
- **状态管理**: React useState / Zustand (可选)

### API 设计

#### 1. 图片分析 + 文案生成

```typescript
// POST /api/generate
interface GenerateRequest {
  image: string;          // Base64 图片
  style: string;          // 文案风格
  scene: string;          // 关联场景
  wordCount: number;      // 目标字数
  supplement?: string;    // 补充信息
  platform: 'xiaohongshu' | 'douyin';
}

interface GenerateResponse {
  title: string;          // 生成的标题
  content: string;        // 生成的文案
  tags?: string[];        // 推荐标签
}
```

### Qwen API 集成

```typescript
// 使用通义千问 qwen-vl-plus (视觉语言模型)
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';

const systemPrompt = `你是一个专业的社交媒体文案写手，擅长为小红书、抖音等平台创作爆款内容。
根据用户提供的产品图片和要求，生成吸引人的标题和文案。

要求：
1. 标题要有吸引力，可以使用emoji
2. 文案要口语化、有感染力
3. 适当使用emoji和网络热词
4. 根据指定的字数控制长度
5. 突出产品卖点和使用场景`;

// 调用示例
async function generateCopy(imageBase64: string, options: GenerateOptions) {
  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-vl-plus',
      input: {
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { image: imageBase64 },
              { text: `请为这个产品生成${options.platform}文案。
风格：${options.style}
场景：${options.scene}
字数：约${options.wordCount}字
${options.supplement ? `补充信息：${options.supplement}` : ''}` }
            ]
          }
        ]
      }
    })
  });
  
  return response.json();
}
```

### 环境变量

```env
QWEN_API_KEY=sk-xxxxxxxx  # 通义千问 API Key
```

---

## 文件结构

```
src/
├── app/
│   ├── (platform)/
│   │   ├── layout.tsx           # 平台布局
│   │   ├── page.tsx             # 首页
│   │   └── product/
│   │       ├── page.tsx         # 产品文案生成页
│   │       └── result/
│   │           └── page.tsx     # 生成结果页
│   └── api/
│       └── generate/
│           └── route.ts         # AI 生成接口
├── components/
│   ├── home/
│   │   ├── Banner.tsx           # 顶部 Banner
│   │   ├── PlatformTabs.tsx     # 平台选择
│   │   ├── FeatureGrid.tsx      # 功能入口网格
│   │   └── BottomNav.tsx        # 底部导航
│   ├── product/
│   │   ├── ImageUpload.tsx      # 图片上传
│   │   ├── StyleSelector.tsx    # 风格选择
│   │   ├── SceneSelector.tsx    # 场景选择
│   │   ├── WordCountSelector.tsx # 字数选择
│   │   └── SupplementInput.tsx  # 补充输入
│   └── result/
│       ├── ResultCard.tsx       # 结果卡片
│       └── ActionButtons.tsx    # 操作按钮
└── lib/
    └── qwen.ts                  # Qwen API 封装
```

---

## 开发计划

### Phase 1: 基础框架 (Day 1)
- [ ] 首页布局 + 功能入口
- [ ] 底部导航组件
- [ ] 页面路由配置

### Phase 2: 产品页面 (Day 2)
- [ ] 图片上传组件
- [ ] 风格/场景/字数选择器
- [ ] 表单状态管理

### Phase 3: AI 集成 (Day 3)
- [ ] Qwen API 接口封装
- [ ] 生成结果页面
- [ ] Loading 状态 + 错误处理

### Phase 4: 优化 (Day 4)
- [ ] 复制功能
- [ ] 重新生成
- [ ] 历史记录 (可选)

---

## 成本估算

**Qwen API 定价** (通义千问):
- qwen-vl-plus: ¥0.008/千tokens (输入) + ¥0.02/千tokens (输出)
- 每次生成约 500-1000 tokens
- 预估每次生成成本: ¥0.01-0.03

**对比其他选项**:
- GPT-4V: $0.01/千tokens - 贵约10倍
- Claude Vision: $0.003/千tokens - 接近
- Qwen 性价比最高，且中文效果好

