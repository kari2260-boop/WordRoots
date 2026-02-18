# PathForge AI AI未来家庭社区

青少年成长画像平台 - 基于积极心理学的AI驱动成长陪伴系统

## 项目简介

PathForge AI /AI为了家庭社区 是一个面向10-15岁青少年家庭的成长画像平台，通过AI对话、任务挑战、作品记录等方式，帮助孩子发现自己的优势和潜能。

### 核心功能

- 🦌 **K博士** - AI成长伙伴，随时倾听和陪伴
- 📋 **入门测评** - 基于积极心理学的多维度自我探索
- 🎯 **任务系统** - 多类型成长任务，完成获得积分和经验
- 🎨 **作品集** - 记录成长足迹和收获
- 🏆 **未来理事会** - 解锁专业AI导师团队
- 👁️ **持续观察** - 老师/咨询师可添加观察记录
- 📊 **成长画像** - 多源数据综合的全方位画像

### 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL + Auth)
- **AI**: Anthropic Claude API
- **部署**: Vercel

## 快速开始

### 1. 环境要求

- Node.js 18+
- npm/yarn/pnpm

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env.local`，填入配置：

```bash
cp .env.example .env.local
```

需要配置：
- Supabase URL 和 Anon Key
- Anthropic API Key

### 4. 数据库设置

1. 在 [Supabase](https://supabase.com) 创建项目
2. 在 SQL Editor 中运行 `supabase/schema.sql`
3. 复制项目 URL 和 anon key 到 `.env.local`

### 5. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 6. 创建管理员账号

1. 注册一个普通账号
2. 在 Supabase Dashboard 的 Table Editor 中找到 `profiles` 表
3. 将该用户的 `role` 字段改为 `admin`
4. 刷新页面，访问 `/admin` 即可进入管理后台

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   │   ├── login/         # 登录注册
│   │   └── onboarding/    # 入门测评
│   ├── dashboard/         # 学生主界面
│   │   ├── page.tsx       # 首页
│   │   ├── tasks/         # 任务
│   │   ├── chat/          # K博士对话
│   │   ├── works/         # 作品集
│   │   ├── profile/       # 个人画像
│   │   ├── discover/      # 持续探索
│   │   └── council/       # 未来理事会
│   ├── admin/             # 管理后台
│   │   ├── users/         # 用户管理
│   │   ├── tasks/         # 任务管理
│   │   ├── conversations/ # 对话记录
│   │   ├── assessments/   # 测评数据
│   │   └── observations/  # 观察记录
│   └── api/               # API路由
│       ├── chat/          # AI对话
│       └── assess/        # 画像分析
├── components/            # 组件
│   ├── ui/               # 基础UI组件
│   └── *.tsx             # 业务组件
├── lib/                  # 工具库
│   ├── constants.ts      # 常量配置
│   ├── assessment.ts     # 测评题库
│   ├── council.ts        # 导师解锁逻辑
│   ├── utils.ts          # 工具函数
│   └── supabase/         # Supabase客户端
└── types/                # TypeScript类型定义
```

## 核心设计

### 1. 等级系统

8个等级，从"新手探险家"到"未来领袖"：
- 每个等级有对应的积分门槛
- 完成任务获得积分
- 积分决定等级和解锁内容

### 2. 任务类型

- 🔭 探索发现 - 观察和体验
- 🎨 创意制作 - 动手创造
- 💭 思考记录 - 反思和表达
- 🔧 动手实践 - 实践应用
- 📚 深度学习 - 知识探索

### 3. 未来理事会

5位AI导师，各有专长：
- 达芬奇教授 - 艺术与创意
- 居里夫人 - 科学探索
- 郑和船长 - 勇气与探险
- 张衡先生 - 观察与思考
- 莫扎特 - 音乐与表达

达成条件后自动解锁。

### 4. 画像数据源

多源数据综合构建画像：
- 入门测评（自评）
- 任务完成记录
- 对话中的关键词
- 作品反思
- 老师/咨询师观察

## 部署

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 环境变量

生产环境需要配置：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`

## 开发计划

当前版本实现了核心功能。后续迭代方向：

- [ ] 动态任务管理（当前任务为代码硬编码）
- [ ] AI画像分析报告生成
- [ ] 未来理事会导师对话
- [ ] 家长端功能
- [ ] 定期成长报告
- [ ] 更丰富的数据可视化

## License

MIT License

## 联系方式

如有问题或建议，欢迎提 Issue。
