# 熙泰科技招聘官网

基于 Next.js 14 + Tailwind CSS 构建的响应式招聘官网。

## 🚀 功能特性

- **前台展示页**：公司介绍、校园招聘、社会招聘、公司环境、联系方式
- **后台管理**：密钥登录后可管理所有内容（密钥：xitaikeji2025）
- **响应式设计**：完美适配手机端和电脑端
- **动态数据**：所有内容通过 API 动态获取

## 🛠️ 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- RESTful API

## 📦 安装与运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🌐 访问地址

- 前台首页：http://localhost:3000
- 管理后台：http://localhost:3000/admin

## 🚢 部署

项目已配置 Vercel，可一键部署到 Vercel 平台。

### 部署步骤

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 点击 Deploy 即可自动部署

## 📝 管理后台使用

1. 访问 `/admin` 页面
2. 输入密钥：`xitaikeji2025`
3. 进入管理面板，可管理：
   - 公司信息（名称、Logo、Slogan、简介等）
   - 公司简介排版设置
   - 联系方式
   - 环境图片
   - 招聘岗位
   - 二维码设置

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/         # 认证 API
│   │   └── data/         # 数据 API
│   ├── admin/            # 管理后台
│   ├── globals.css       # 全局样式
│   ├── layout.tsx       # 根布局
│   └── page.tsx          # 首页
├── components/            # React 组件
│   ├── Header.tsx        # 导航栏
│   ├── Hero.tsx         # 首屏区域
│   ├── About.tsx        # 公司简介
│   ├── Jobs.tsx         # 招聘岗位
│   ├── Environment.tsx   # 公司环境
│   ├── Contact.tsx       # 联系方式
│   └── Footer.tsx        # 页脚
├── lib/                   # 工具函数
│   └── data.ts          # 数据读写
├── types/                 # TypeScript 类型
├── data.json             # 网站数据
└── package.json         # 依赖配置
```

## 🎨 设计风格

- 主色调：深蓝 (#0A1F44)
- 辅助色：科技蓝 (#1E90FF)
- 简约大气，现代科技感

## 📄 许可证

MIT License
