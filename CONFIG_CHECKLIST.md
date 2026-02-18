# AI 未来家庭社群 - 配置检查清单

## ✅ 已完成

- [x] Anthropic API Key 已配置
- [x] 开发服务器运行在 http://localhost:3002
- [x] Supabase 连接已配置

## ⏳ 待完成（按顺序执行）

### 步骤 1：关闭 Supabase 邮箱确认 ⭐ 重要

**为什么要做：**让用户注册后可以直接使用，无需等待邮件确认

**操作步骤：**
1. 打开浏览器访问：https://supabase.com/dashboard
2. 登录你的 Supabase 账号
3. 选择项目（URL 中包含 nihvcwmqmuxxnxizaoec）
4. 点击左侧菜单 **⚙️ Authentication**
5. 点击顶部标签 **Providers**
6. 在列表中找到 **Email**，点击右侧的编辑图标或展开
7. 找到 **Confirm email** 开关
8. **将其设为 OFF（关闭）**
9. 点击 **Save** 按钮保存

**如何验证：**
- 注册新账号后应该直接跳转到 /onboarding
- 不需要查收邮件确认

---

### 步骤 2：运行数据库迁移 ⭐ 重要

**为什么要做：**创建所有必要的数据库表（profiles、chat_messages、tasks 等）

**操作步骤：**

**方式 1：使用 SQL Editor（推荐）**

1. 在 Supabase Dashboard 中
2. 点击左侧菜单 **🔧 SQL Editor**
3. 点击右上角 **+ New query** 按钮
4. 在编辑器中粘贴以下命令：

打开终端，执行：
```bash
cat /Users/k/Desktop/pathforge-web/supabase/schema.sql
```

5. 复制终端输出的全部内容
6. 粘贴到 Supabase SQL Editor
7. 点击右下角 **Run** 按钮（或按 Cmd+Enter）
8. 等待执行完成（应该显示 "Success. No rows returned"）

**方式 2：直接从文件复制（如果不想用终端）**

1. 用文本编辑器打开文件：
   `/Users/k/Desktop/pathforge-web/supabase/schema.sql`
2. 全选并复制所有内容（Cmd+A，Cmd+C）
3. 在 Supabase SQL Editor 中粘贴
4. 点击 **Run**

**如何验证：**
1. 在 Supabase Dashboard，点击左侧 **🗄️ Table Editor**
2. 应该能看到以下表：
   - profiles
   - user_interests
   - user_strengths
   - user_traits
   - user_goals
   - chat_messages
   - user_tasks
   - works
   - observations
   - assessments

---

### 步骤 3：测试注册流程

1. 访问 http://localhost:3002
2. 点击"开始探索"按钮
3. 点击"注册"标签
4. 填写信息：
   - 邮箱：test@example.com（随便填）
   - 密码：123456（至少6位）
   - 昵称：测试用户
   - 年龄：12
5. 点击"注册"
6. **应该直接跳转到 /onboarding**（如果步骤1完成）
7. 完成入门评估
8. 进入 Dashboard

---

### 步骤 4：创建管理员账号（可选）

**在测试账号注册成功后：**

1. 在 Supabase Dashboard，点击 **🔧 SQL Editor**
2. 点击 **+ New query**
3. 先查询你的 user_id：

```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

4. 复制刚才注册的用户的 id
5. 新建查询，将该用户设为管理员：

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = '你复制的user_id';
```

6. 点击 **Run**
7. 退出登录，重新登录
8. 应该自动跳转到 /admin 管理后台

---

## 🎯 完成后你可以：

- ✅ 用户可以正常注册登录
- ✅ 完成入门评估
- ✅ 与 K博士 对话（AI 功能已启用）
- ✅ 完成任务并提交作品
- ✅ 查看个人画像和成长数据
- ✅ 管理员可以访问后台

---

## 🔍 故障排查

### 问题：注册后还是要求确认邮箱
**解决：**检查步骤1是否正确关闭了邮箱确认

### 问题：注册后显示数据库错误
**解决：**检查步骤2数据库迁移是否执行成功

### 问题：K博士对话不工作
**解决：**API Key 已配置，刷新页面重试

### 问题：无法创建管理员
**解决：**确保 profiles 表已创建（步骤2），并使用正确的 user_id

---

## 📞 需要帮助？

如果遇到问题，告诉我：
1. 你在哪一步
2. 遇到什么错误信息
3. 截图（如果可以）

我会帮你解决！
