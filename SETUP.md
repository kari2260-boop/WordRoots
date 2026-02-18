# PathForge AI - 部署配置指南

## 一、Supabase 配置

### 1. 创建项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 记录下项目的 URL 和 anon key

### 2. 运行数据库脚本

1. 进入 Supabase Dashboard
2. 打开 SQL Editor
3. 复制 `supabase/schema.sql` 的全部内容
4. 粘贴并运行
5. 确认所有表都创建成功

### 3. 配置认证

在 Supabase Dashboard 的 Authentication 设置中：
- 启用 Email provider
- 配置 Site URL: `http://localhost:3000` (开发环境)
- 配置 Redirect URLs: 添加 `http://localhost:3000/auth/callback`

## 二、Anthropic API 配置

### 1. 获取 API Key

1. 访问 [console.anthropic.com](https://console.anthropic.com)
2. 注册/登录账号
3. 创建 API Key
4. 复制 API Key

### 2. 测试 API

可以用以下命令测试 API Key 是否有效：

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 三、本地开发环境

### 1. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入配置：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 四、创建管理员账号

### 方法一：通过 Supabase Dashboard

1. 在应用中注册一个账号（记住邮箱）
2. 打开 Supabase Dashboard
3. 进入 Table Editor → profiles 表
4. 找到你的账号（通过邮箱查找）
5. 将 `role` 字段改为 `admin`
6. 保存
7. 重新登录，访问 `/admin`

### 方法二：通过 SQL

在 Supabase SQL Editor 中运行：

```sql
update profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'your-email@example.com'
);
```

## 五、生产环境部署

### Vercel 部署步骤

1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. 在 [vercel.com](https://vercel.com) 导入项目

3. 配置环境变量（与 .env.local 相同）

4. 部署完成后，更新 Supabase 的认证设置：
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: 添加 `https://your-app.vercel.app/auth/callback`

### 环境变量检查清单

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `ANTHROPIC_API_KEY`

## 六、功能验证

部署完成后，按以下顺序测试功能：

### 学生端功能

1. [ ] 注册/登录
2. [ ] 完成入门测评（7个步骤）
3. [ ] 查看首页（用户卡片、推荐任务）
4. [ ] 浏览任务列表
5. [ ] 完成一个任务并提交作品
6. [ ] 与K博士聊天
7. [ ] 查看作品集
8. [ ] 查看个人画像
9. [ ] 查看未来理事会
10. [ ] 查看持续探索页面

### 管理后台功能

1. [ ] 访问 `/admin`
2. [ ] 查看总览数据
3. [ ] 查看用户列表
4. [ ] 进入用户详情页
5. [ ] 添加观察记录
6. [ ] 查看对话记录
7. [ ] 查看测评数据
8. [ ] 查看所有观察记录

## 七、常见问题

### 问题1：登录后跳转到 /onboarding 一直循环

**原因**：数据库中 profile 的 `onboarding_completed` 没有更新

**解决**：
```sql
update profiles
set onboarding_completed = true
where id = 'user-id';
```

### 问题2：AI对话无法工作

**检查**：
1. Anthropic API Key 是否正确
2. 是否有足够的 API 额度
3. 查看浏览器控制台和 Vercel 日志

### 问题3：任务列表为空

**原因**：任务是硬编码在 `src/lib/constants.ts` 中的

**解决**：检查 TASKS 常量是否正确导出

### 问题4：Supabase 连接失败

**检查**：
1. URL 和 Key 是否正确
2. RLS 策略是否正确执行
3. 数据库表是否都创建成功

## 八、维护和更新

### 添加新任务

编辑 `src/lib/constants.ts`，在 TASKS 数组中添加：

```typescript
{
  id: 9,
  title: '新任务',
  description: '任务描述',
  emoji: '🎯',
  type: 'exploration',
  points: 100,
  difficulty: 1,
  requirements: ['要求1', '要求2'],
}
```

### 修改测评题目

编辑 `src/lib/assessment.ts`，修改 ONBOARDING_STEPS 配置。

### 调整等级系统

编辑 `src/lib/constants.ts`，修改 LEVELS 数组。

### 添加新导师

编辑 `src/lib/constants.ts`，在 COUNCIL_MENTORS 数组中添加。

## 九、监控和日志

### Vercel 日志

在 Vercel Dashboard 查看：
- 部署日志
- 函数日志（API routes）
- 错误追踪

### Supabase 监控

在 Supabase Dashboard 查看：
- API 请求数
- 数据库性能
- 认证活动

### 用户行为分析

可以通过查询数据库获取：
- 用户增长趋势
- 任务完成率
- 对话活跃度
- 作品提交量

示例查询：

```sql
-- 每日新增用户
select date(created_at) as date, count(*) as new_users
from profiles
where role = 'student'
group by date(created_at)
order by date desc;

-- 任务完成统计
select task_id, count(*) as completions
from user_tasks
where status = 'completed'
group by task_id
order by completions desc;
```

## 十、安全建议

1. **定期更新依赖**
```bash
npm audit
npm update
```

2. **保护 API Keys**
- 不要提交 .env 文件到 Git
- 使用 Vercel 的环境变量管理

3. **监控 API 使用**
- 设置 Anthropic API 使用限额
- 监控 Supabase 请求量

4. **备份数据**
- 定期备份 Supabase 数据库
- 导出重要的用户数据

## 完成！

如有问题，请查看主 README.md 或提交 Issue。
