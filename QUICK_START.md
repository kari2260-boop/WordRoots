# AI 未来家庭社群 - 快速启动指南

## 当前状态

✅ 开发服务器运行在: http://localhost:3002
✅ 项目名称已更新为"AI 未来家庭社群"
✅ 图标已更换为独角兽🦄
✅ Chat API 已修复，没有 API key 也能正常显示提示

## 立即开始测试（无需邮箱确认）

### 1. 关闭 Supabase 邮箱确认

在 Supabase Dashboard 中：

1. 打开 https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧 `Authentication` → `Providers` → `Email`
4. 找到 `Confirm email` 选项
5. **关闭** `Enable email confirmations`
6. 点击 `Save`

完成后，用户注册后会直接跳转到 onboarding，无需确认邮箱。

### 2. 配置 Anthropic API Key（可选）

如果要使用 K博士对话功能：

编辑 `.env.local` 文件：
```bash
ANTHROPIC_API_KEY=sk-ant-api03-你的真实key
```

然后重启开发服务器：
```bash
# 停止当前服务器 (Ctrl+C)
npm run dev
```

### 3. 运行数据库迁移

在 Supabase Dashboard 的 SQL Editor 中执行：

```bash
# 复制 supabase/schema.sql 的全部内容并执行
```

这会创建所有必要的数据库表和触发器。

## 测试流程

### 不配置 API Key 可测试：
- ✅ 注册/登录
- ✅ Onboarding 入门评估
- ✅ Dashboard 浏览
- ✅ 任务列表查看
- ✅ 个人资料
- ⚠️ K博士对话（会显示"暂时不在线"提示）

### 配置 API Key 后可测试：
- ✅ 与 K博士实时对话
- ✅ 对话标签提取
- ✅ 完整的 AI 功能

## 当前配置

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nihvcwmqmuxxnxizaoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=已配置 ✅

# Claude AI
ANTHROPIC_API_KEY=未配置 ⚠️
```

## 常见问题

### Q: 注册后没有跳转？
A: 检查 Supabase 是否关闭了邮箱确认。或者检查邮箱中的确认链接。

### Q: 显示 "Invalid API key"？
A: 已修复！现在会显示友好提示"K博士暂时不在线"。

### Q: 无法登录？
A: 确保已运行数据库迁移（schema.sql），创建了 profiles 表和触发器。

## 创建管理员账号

1. 先注册一个普通账号
2. 在 Supabase Dashboard 的 SQL Editor 执行：

```sql
-- 查找你的 user_id
SELECT id, email FROM auth.users;

-- 将用户设为管理员（替换 user_id）
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

3. 重新登录，会自动跳转到管理后台 `/admin`

## 下一步

1. 关闭邮箱确认 → 快速测试注册流程
2. 运行数据库迁移 → 创建必要的表
3. 配置 API Key → 启用对话功能
4. 创建管理员账号 → 访问后台管理

---

🎉 现在访问 http://localhost:3002 开始体验！
