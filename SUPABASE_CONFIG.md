# Supabase 配置指南

## 步骤 1：关闭邮箱确认（让用户可以直接注册使用）

1. 打开 https://supabase.com/dashboard
2. 选择项目：nihvcwmqmuxxnxizaoec
3. 点击左侧菜单 **Authentication**
4. 点击 **Providers**
5. 找到 **Email** 提供商，点击编辑
6. 找到 **Confirm email** 选项
7. **关闭**该开关（设为 disabled）
8. 点击 **Save** 保存

完成后，用户注册即可直接登录，无需确认邮箱。

## 步骤 2：运行数据库迁移

1. 在 Supabase Dashboard 中
2. 点击左侧菜单 **SQL Editor**
3. 点击 **+ New query**
4. 复制下面的 SQL 脚本并粘贴：

```sql
-- 见下方完整 SQL 脚本
```

5. 点击 **Run** 执行

## 完整 SQL 迁移脚本

将以下内容复制到 SQL Editor：

