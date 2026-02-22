# AI 未来家庭社群 - 开发工作记录

## 项目概述
- **项目名称**: AI 未来家庭社群 (PathForge Web)
- **技术栈**: Next.js 14 (App Router), Supabase, TypeScript
- **项目路径**: `/Users/k/Desktop/pathforge-web`

---

## 核心问题与解决方案

### 1. Supabase Schema Cache 问题 ⭐️ 重要

**问题描述**:
- 使用 `select('*')` 查询时，即使数据库有数据，也返回空数组
- Count 查询显示有记录，但 select 查询返回空
- 错误信息: "Could not find the 'xxx' column in the schema cache"

**解决方案**:
```typescript
// ❌ 错误方式 - 会返回空数组
.select('*')

// ✅ 正确方式 - 显式指定所有列名
.select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')
```

**影响的文件**:
- `/src/app/api/admin/observations/route.ts`
- `/src/app/api/admin/observations/create/route.ts`
- `/src/app/api/observations/route.ts`

---

### 2. Admin 权限与 RLS 策略

**问题**:
- Admin 使用授权码 (123) 登录，没有 Supabase auth 用户账号
- RLS 策略阻止数据访问

**解决方案**:
创建 Admin Client 使用 SERVICE_ROLE_KEY 绕过 RLS:

```typescript
// /src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

**环境变量** (`.env.local`):
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paHZjd21xbXV4eG54aXphb2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMxMzU3NiwiZXhwIjoyMDg2ODg5NTc2fQ.inakZtgtDV9ZJHxgMvbAEBCnljS3MP7prsYAtdq7K5I
```

---

### 3. 观察记录系统 (Observations)

#### 问题历史:
1. ❌ 401 Unauthorized - Admin 没有 auth 账号
2. ❌ `student_id` 列不存在 - 应该用 `user_id`
3. ❌ `observer_id` not-null 约束违规
4. ❌ Foreign key 约束 - `observer_id` 必须引用现有用户
5. ❌ `select('*')` 返回空数组 - Schema cache 问题

#### 最终解决方案:

**创建 API** (`/src/app/api/admin/observations/create/route.ts`):
```typescript
// 获取第一个现有用户作为 observer_id 占位符
const { data: firstUser } = await supabaseAdmin
  .from('profiles')
  .select('id')
  .limit(1)
  .single()

// 插入观察记录
const { data: observationData, error: insertError } = await supabaseAdmin
  .from('observations')
  .insert({
    user_id: student_id,  // 不是 student_id!
    observer_id: firstUser.id,  // 必须是现有用户 ID
    title: title,
    category: category || null,
    observation: observation,
    suggested_tags: suggested_tags || null,
  })
  .select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')  // 显式列名
  .single()
```

**获取 API** (`/src/app/api/admin/observations/route.ts`):
```typescript
// 管理员端 - 获取所有观察记录
const { data: observations } = await supabaseAdmin
  .from('observations')
  .select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')
  .order('created_at', { ascending: false })

// 手动关联 profiles 数据（不能用 JOIN）
const userIds = [...new Set(observations.map(o => o.user_id).filter(Boolean))]
const { data: profiles } = await supabaseAdmin
  .from('profiles')
  .select('id, nickname, age, grade')
  .in('id', userIds)

const observationsWithProfiles = observations.map(obs => ({
  ...obs,
  profiles: profiles?.find(p => p.id === obs.user_id)
}))
```

**学生端 API** (`/src/app/api/observations/route.ts`):
```typescript
// 学生只能看自己的观察记录
const { data: observations } = await supabase
  .from('observations')
  .select('id, user_id, observer_id, title, category, observation, suggested_tags, created_at')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

#### 新功能 - 新观察记录提示

**组件** (`/src/components/ObservationsList.tsx`):
- 使用 `localStorage` 跟踪上次查看时间
- 新观察记录显示黄色高亮背景
- "新" 徽章和 ✨ 图标
- 首次查看时所有记录标记为新

```typescript
// 检测新观察记录
const lastSeenStr = localStorage.getItem('observations_last_seen')
const lastSeen = lastSeenStr ? new Date(lastSeenStr) : null

if (lastSeen) {
  const newIds = new Set<string>()
  observations.forEach(obs => {
    const createdAt = new Date(obs.created_at)
    if (createdAt > lastSeen) {
      newIds.add(obs.id)
    }
  })
  setNewObservationIds(newIds)
}

// 更新最后查看时间
localStorage.setItem('observations_last_seen', new Date().toISOString())
```

---

### 4. 作品审批系统 (Works Approval)

#### 数据库 Schema 限制:

**user_tasks 表** (实际列):
```sql
- id uuid
- user_id uuid
- task_id integer
- status task_status (pending/completed)
- submitted_at timestamptz
- reviewed_at timestamptz
- created_at timestamptz
```

**缺少的列**: `feedback`, `points_earned`, `completed_at`

**works 表** (实际列):
```sql
- id uuid
- user_id uuid
- task_id integer
- title text
- description text
- reflection text
- link text
- tags text[]
- created_at timestamptz
```

**缺少的列**: `feedback`, `points`, `status`

#### 解决方案 - 使用 tags 存储元数据

**审批 API** (`/src/app/api/admin/works/[id]/approve/route.ts`):

```typescript
// 1. 更新 user_tasks 状态（只更新存在的列）
await supabaseAdmin
  .from('user_tasks')
  .update({
    status: status || 'completed',
    reviewed_at: new Date().toISOString()
  })
  .eq('user_id', work.user_id)
  .eq('task_id', work.task_id)

// 2. 将 feedback 和 points 存储在 tags 数组中
const metadataTags = []
if (feedback) {
  metadataTags.push(`feedback:${feedback}`)
}
metadataTags.push(`points:${points}`)
metadataTags.push(`status:${status || 'completed'}`)

await supabaseAdmin
  .from('works')
  .update({
    tags: [...(work.tags || []).filter(tag =>
      !tag.startsWith('feedback:') &&
      !tag.startsWith('points:') &&
      !tag.startsWith('status:')
    ), ...metadataTags]
  })
  .eq('id', params.id)

// 3. 更新用户总积分
const { data: profile } = await supabaseAdmin
  .from('profiles')
  .select('total_points')
  .eq('id', work.user_id)
  .single()

await supabaseAdmin
  .from('profiles')
  .update({
    total_points: (profile.total_points || 0) + points
  })
  .eq('id', work.user_id)
```

**前端提取元数据** (`/src/app/admin/works/[id]/page.tsx`):

```typescript
// 从 tags 中提取 feedback 和 points
let extractedFeedback = ''
let extractedPoints = 0

if (work.tags && Array.isArray(work.tags)) {
  work.tags.forEach((tag: string) => {
    if (tag.startsWith('feedback:')) {
      extractedFeedback = tag.substring('feedback:'.length)
    } else if (tag.startsWith('points:')) {
      extractedPoints = parseInt(tag.substring('points:'.length), 10)
    }
  })
}
```

---

### 5. 评估数据 (Assessments) 保存问题

**问题**:
- 学生完成 onboarding 测评后数据没有保存
- RLS 策略阻止客户端直接插入

**解决方案**:
创建服务端 API 使用 admin client 保存数据

**API** (`/src/app/api/onboarding/submit/route.ts`):
```typescript
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await request.json()

  // 使用 admin client 绕过 RLS
  await supabaseAdmin
    .from('profiles')
    .update({
      age: data.basicInfo.age,
      grade: data.basicInfo.grade,
      gender: data.basicInfo.gender,
      onboarding_completed: true,
    })
    .eq('id', user.id)

  // 插入评估数据
  await supabaseAdmin
    .from('assessments')
    .insert({
      user_id: user.id,
      type: 'onboarding',
      source: 'self',
      data: data,
    })

  // 插入兴趣、优势、特质、目标...
}
```

**前端调用** (`/src/app/onboarding/page.tsx`):
```typescript
const response = await fetch('/api/onboarding/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ data }),
})
```

---

### 6. Admin 页面授权问题

**问题**:
- Admin 页面使用 Server Component 检查 auth
- Admin 没有 auth 账号导致重定向到登录页

**解决方案**:
将所有 admin 页面改为 Client Component，通过 API 获取数据

**示例** (`/src/app/admin/users/[id]/page.tsx`):

```typescript
// ❌ 之前 - Server Component
export default async function AdminUserDetailPage({ params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')  // Admin 会被重定向
  // ...
}

// ✅ 现在 - Client Component
'use client'
export default function AdminUserDetailPage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(result => setData(result))
  }, [])
  // ...
}
```

---

## 创建的新文件

### API Routes
1. `/src/app/api/admin/observations/route.ts` - 管理员获取所有观察记录
2. `/src/app/api/admin/observations/create/route.ts` - 创建观察记录
3. `/src/app/api/observations/route.ts` - 学生获取自己的观察记录
4. `/src/app/api/onboarding/submit/route.ts` - 提交 onboarding 数据
5. `/src/lib/supabase/admin.ts` - Admin client（绕过 RLS）

### Components
1. `/src/components/ObservationsList.tsx` - 学生端观察记录列表组件
   - 自动检测新记录
   - 黄色高亮显示
   - localStorage 跟踪查看状态

### Pages
- 所有 admin 页面改为 Client Component

---

## 修改的现有文件

### API Routes
- `/src/app/api/admin/stats/route.ts` - 改用 admin client
- `/src/app/api/admin/works/route.ts` - 修复 JOIN 查询，手动合并数据
- `/src/app/api/admin/works/[id]/route.ts` - 改用 admin client
- `/src/app/api/admin/works/[id]/approve/route.ts` - 完全重写，使用 tags 存储元数据
- `/src/app/api/admin/users/[id]/route.ts` - 改用 admin client

### Admin Pages
- `/src/app/admin/observations/page.tsx` - 添加刷新按钮，自动刷新机制
- `/src/app/admin/observations/new/page.tsx` - 使用 API 创建观察记录
- `/src/app/admin/works/[id]/page.tsx` - 从 tags 提取元数据
- `/src/app/admin/users/[id]/page.tsx` - 改为 Client Component

### Student Pages
- `/src/app/dashboard/profile/page.tsx` - 添加 `<ObservationsList />` 组件
- `/src/app/onboarding/page.tsx` - 使用 API 提交数据

---

## 数据库 Schema 说明

### observations 表
```sql
create table observations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  observer_id uuid references profiles(id) on delete set null not null,  -- 必须是现有用户 ID
  title text not null,
  category text,
  observation text not null,
  suggested_tags text[],
  created_at timestamptz not null default now()
);
```

### RLS 策略
```sql
-- 学生可以查看关于自己的观察记录
create policy "Users can view observations about them"
  on observations for select
  using (auth.uid() = user_id);

-- Admin/Counselor 可以查看所有记录
create policy "Admins can view all observations"
  on observations for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );

-- Admin/Counselor 可以插入记录
create policy "Admins can insert observations"
  on observations for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'counselor')
    )
  );
```

---

## 关键技术决策

### 1. 不修改数据库 Schema
**原因**: 避免破坏现有数据和应用
**方案**: 使用 `tags` 数组存储元数据

### 2. 使用 Admin Client 绕过 RLS
**原因**: Admin 没有 auth 账号，无法通过 RLS 策略
**方案**: 创建使用 SERVICE_ROLE_KEY 的 admin client

### 3. 显式列选择替代 `select('*')`
**原因**: Supabase schema cache 问题导致 `*` 返回空
**方案**: 所有查询都显式列出列名

### 4. 手动关联表数据
**原因**: Supabase JOIN 在某些情况下失败
**方案**: 分别查询后在代码中手动合并

### 5. Client Component + API 替代 Server Component
**原因**: Server Component 的 auth 检查阻止 Admin 访问
**方案**: Admin 页面改为 Client Component，通过 API 获取数据

---

## 当前系统状态

### ✅ 已完成功能

1. **观察记录系统**
   - ✅ Admin 可以创建观察记录
   - ✅ 观察记录正确保存到数据库
   - ✅ Admin 可以查看所有观察记录
   - ✅ 学生可以在个人画像页面查看自己的观察记录
   - ✅ 新观察记录有高亮提示

2. **作品审批系统**
   - ✅ Admin 可以查看学生提交的作品
   - ✅ 可以给作品打分并添加反馈
   - ✅ 积分正确累加到学生总积分
   - ✅ 反馈和积分存储在 works.tags 中

3. **评估数据保存**
   - ✅ Onboarding 数据正确保存
   - ✅ Admin 可以查看评估数据

4. **权限系统**
   - ✅ Admin 使用授权码 (123) 访问
   - ✅ 所有 Admin 操作使用 SERVICE_ROLE_KEY
   - ✅ 学生只能访问自己的数据

### 🔄 待优化项

1. **数据库 Schema 更新**（可选）
   - 考虑在 `works` 表添加 `feedback` 和 `points` 列
   - 考虑在 `user_tasks` 表添加 `points_earned` 列
   - 当前使用 tags 作为临时方案可以正常工作

2. **观察记录通知**
   - 当前使用 localStorage 检测新记录
   - 可以考虑添加更明显的通知（如导航栏徽章）

3. **作品反馈展示**
   - 学生端需要能查看老师的反馈
   - 可以在作品详情页或个人中心展示

---

## 调试技巧

### 查看服务器日志
```bash
tail -f /private/tmp/claude-501/-Users-k/tasks/b54345d.output
```

### 常见错误标记
- 🔍 - 调试信息
- ✅ - 成功操作
- ❌ - 错误信息

### 测试 API
```bash
# 测试管理员观察记录 API
curl -X GET http://localhost:3000/api/admin/observations \
  -H "Cookie: your-session-cookie" \
  | jq

# 测试学生观察记录 API
curl -X GET http://localhost:3000/api/observations \
  -H "Cookie: student-session-cookie" \
  | jq
```

---

## 环境配置检查清单

- [ ] `.env.local` 包含 `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Next.js 开发服务器运行在 `localhost:3000`
- [ ] Supabase 项目 URL: `nihvcwmqmuxxnxizaoec.supabase.co`
- [ ] Admin 授权码: `123` (存储在 sessionStorage)

---

## 已知问题与解决方法

### 问题: select('*') 返回空数组
**解决**: 显式列出所有列名

### 问题: Could not find column in schema cache
**解决**: 该列可能不存在，检查 schema 或使用其他方式存储

### 问题: Foreign key constraint violation
**解决**: 确保引用的 ID 存在于目标表中

### 问题: Admin 页面重定向到登录
**解决**: 将页面改为 Client Component，通过 API 获取数据

---

## 联系与继续开发

将此文档提供给其他 AI 时，请说明：
1. 项目路径: `/Users/k/Desktop/pathforge-web`
2. 开发服务器输出文件: `/private/tmp/claude-501/-Users-k/tasks/b54345d.output`
3. 当前使用的技术栈和关键决策
4. 哪些问题已解决，哪些还需要处理

**最后更新**: 2026-02-18

---

## 快速命令参考

```bash
# 启动开发服务器
cd /Users/k/Desktop/pathforge-web
npm run dev

# 查看实时日志
tail -f /private/tmp/claude-501/-Users-k/tasks/b54345d.output

# 搜索特定日志
grep -i "observations" /private/tmp/claude-501/-Users-k/tasks/b54345d.output

# 查看最近 100 行日志
tail -100 /private/tmp/claude-501/-Users-k/tasks/b54345d.output
```
