# 新项目基础框架

## 项目简介

这是一个基于 Next.js 的前端项目框架，保留了现代深色主题 UI 风格和基础架构。

## 技术栈

- **框架**：Next.js 14+ (App Router)
- **样式**：Tailwind CSS
- **状态管理**：React Query
- **国际化**：next-intl
- **通知**：sonner

## UI 风格

- 深色主题：`#111111` 基础背景
- 渐变光效：
  - 左上角：青色径向渐变 `rgba(41,122,119,0.75)`
  - 右下角：橙色径向渐变 `rgba(255,129,39,0.75)`
- 玻璃态边框：`border-white/10`
- 现代科技感设计

## 项目结构

```
src/
├── app/
│   ├── (platform)/         # 平台页面（带导航和背景）
│   │   ├── layout.tsx      # 平台布局（导航栏 + 背景效果）
│   │   └── page.tsx        # 首页
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 根页面重定向
├── components/
│   ├── common/             # 通用组件（Logo、按钮、语言切换）
│   ├── providers/          # Provider 组件
│   └── ui/                 # 基础 UI 组件库
├── locales/                # 国际化语言文件
└── styles/                 # Tailwind CSS
```

## 使用方法

### 开发启动

```bash
npm install
npm run dev
```

### 添加新页面

在 `src/app/(platform)/` 下创建目录，新页面自动继承平台布局。

### 自定义布局

修改 `src/app/(platform)/layout.tsx` 可自定义导航栏和背景效果。
