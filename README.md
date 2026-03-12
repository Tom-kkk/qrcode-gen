# QRCode Gen — 动态二维码生成平台

基于 Next.js 构建的动态二维码生成与管理平台，支持用户注册登录、创建二维码、扫码跳转追踪等功能。

## 功能特性

- **动态二维码** — 创建可随时修改目标链接的二维码，无需重新印刷
- **扫码数据统计** — 记录每次扫码的时间、设备、地区等信息
- **用户系统** — 基于 Supabase Auth 的注册/登录/退出
- **个人仪表盘** — 管理所有二维码，查看统计数据
- **精美落地页** — 含 Hero、Features、How It Works、CTA 等完整营销页面

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| 后端 / 数据库 | Supabase (PostgreSQL + Auth) |
| 二维码生成 | qrcode |
| 数据请求 | SWR |
| UA 解析 | ua-parser-js |
| 校验 | Zod |

## 快速开始

### 1. 克隆项目

```bash
git clone <repo-url>
cd qrcode-gen
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例文件并填入 Supabase 项目信息：

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 在 [Supabase 控制台](https://supabase.com) 创建项目后可获取上述密钥。

### 4. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 项目结构

```
qrcode-gen/
├── app/
│   ├── (auth)/          # 登录 / 注册页
│   ├── api/             # API 路由（扫码跳转、统计等）
│   ├── auth/            # Supabase Auth 回调
│   ├── dashboard/       # 用户仪表盘（我的二维码、新建、详情）
│   ├── r/               # 短链接跳转
│   └── page.tsx         # 落地页
├── components/
│   ├── dashboard/       # 仪表盘组件
│   ├── landing/         # 落地页各区块
│   ├── layout/          # 导航栏、Header
│   ├── modals/          # 弹窗
│   ├── qr/              # 二维码展示 / 生成组件
│   ├── stats/           # 统计图表组件
│   └── ui/              # 通用 UI 组件
├── lib/                 # 工具函数、Supabase 客户端
├── hooks/               # 自定义 React Hooks
├── types/               # TypeScript 类型定义
└── public/              # 静态资源
```

## 部署

推荐部署到 [Vercel](https://vercel.com)：

1. 将项目推送到 GitHub
2. 在 Vercel 导入仓库
3. 填入环境变量（同 `.env.local`）
4. 点击 Deploy

也可以使用项目根目录下的 `Dockerfile` 进行容器化部署。

## License

MIT
