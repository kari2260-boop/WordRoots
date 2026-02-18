# DeepSeek API Key 获取详细步骤

## 第一步：访问 DeepSeek 平台

在浏览器中打开：
```
https://platform.deepseek.com/
```

---

## 第二步：注册账号

### 方式一：手机号注册（推荐）
1. 点击页面右上角的"注册"或"Sign Up"按钮
2. 选择"手机号注册"
3. 输入你的手机号码
4. 获取并输入验证码
5. 设置密码（建议使用强密码）
6. 同意服务条款
7. 点击"注册"

### 方式二：邮箱注册
1. 选择"邮箱注册"
2. 输入你的邮箱地址
3. 获取并输入验证码
4. 设置密码
5. 完成注册

---

## 第三步：登录账号

1. 使用刚才注册的手机号/邮箱登录
2. 输入密码
3. 点击"登录"

---

## 第四步：进入 API Keys 页面

登录后，你会看到控制台界面：

1. 在左侧菜单栏找到"API Keys"或"API 密钥"
2. 点击进入 API Keys 管理页面

---

## 第五步：创建 API Key

1. 点击"创建新密钥"或"Create API Key"按钮
2. 给你的 API Key 起个名字（比如：PathForge-Dev）
3. 点击"创建"或"Create"
4. **重要**：立即复制生成的 API Key！

⚠️ **注意**：
- API Key 只会显示一次！
- 格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- 如果忘记复制，需要删除后重新创建

---

## 第六步：配置到项目中

### 方法一：直接编辑文件

1. 打开项目目录：
   ```bash
   cd /Users/k/Desktop/pathforge-web
   ```

2. 编辑 `.env.local` 文件：
   ```bash
   # 如果文件不存在，创建它
   touch .env.local

   # 用文本编辑器打开
   open .env.local
   ```

3. 添加以下内容（替换成你的 API Key）：
   ```
   DEEPSEEK_API_KEY=sk-你复制的完整API密钥
   ```

4. 保存文件

### 方法二：使用命令行

```bash
cd /Users/k/Desktop/pathforge-web

# 添加 API Key（替换成你的）
echo "DEEPSEEK_API_KEY=sk-你的API密钥" >> .env.local
```

---

## 第七步：重启开发服务器

如果服务器正在运行，需要重启才能加载新的环境变量：

```bash
# 1. 停止当前服务器（在终端按 Ctrl+C）

# 2. 重新启动
npm run dev
```

---

## 第八步：测试 API Key

### 方法一：通过聊天页面测试

1. 访问：http://localhost:3000/dashboard/chat
2. 发送消息："你好，K博士！"
3. 如果收到回复，说明配置成功！

### 方法二：查看服务器日志

```bash
tail -f /private/tmp/claude-501/-Users-k/tasks/be8dc45.output
```

发送消息后，日志中应该显示：
```
🤖 Using AI provider: deepseek
```

---

## 常见问题

### Q1: 注册时收不到验证码？
**解决方法**：
- 检查手机号是否正确
- 等待 1-2 分钟
- 尝试重新发送
- 如果还是不行，尝试邮箱注册

### Q2: API Key 无效？
**检查清单**：
- ✅ 是否复制了完整的 key（包括 `sk-` 前缀）
- ✅ 是否有多余的空格或换行
- ✅ 是否保存了 `.env.local` 文件
- ✅ 是否重启了开发服务器

### Q3: 如何查看 API 使用量？
1. 登录 DeepSeek 平台
2. 进入"用量统计"或"Usage"页面
3. 查看今日使用量和剩余额度

### Q4: 免费额度是多少？
- 每天 500 万 tokens
- 相当于约 1 万次对话
- 个人项目完全够用

### Q5: 超出免费额度怎么办？
- 第二天会重置额度
- 或者充值使用付费额度（很便宜）
- 1 百万 tokens 约 1 元人民币

---

## 安全提示

⚠️ **保护你的 API Key**：
1. ❌ 不要分享给他人
2. ❌ 不要提交到 GitHub
3. ❌ 不要在代码中硬编码
4. ✅ 只保存在 `.env.local` 文件中
5. ✅ 确保 `.env.local` 在 `.gitignore` 中

---

## 完整配置示例

你的 `.env.local` 文件应该包含：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://nihvcwmqmuxxnxizaoec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key

# DeepSeek API Key
DEEPSEEK_API_KEY=sk-你的deepseek_api_key
```

---

## 下一步

配置完成后，你可以：

1. ✅ 测试聊天功能
2. ✅ 查看 K博士的回复
3. ✅ 自定义知识库和提示词
4. ✅ 查看聊天记录和提取的标签

---

## 需要帮助？

如果遇到问题：
1. 查看服务器日志
2. 检查 API Key 配置
3. 确认服务器已重启
4. 告诉我具体的错误信息

---

## 快速命令参考

```bash
# 进入项目目录
cd /Users/k/Desktop/pathforge-web

# 查看 .env.local 文件
cat .env.local

# 编辑 .env.local 文件
open .env.local

# 重启开发服务器
npm run dev

# 查看服务器日志
tail -f /private/tmp/claude-501/-Users-k/tasks/be8dc45.output
```

---

现在就去获取你的 DeepSeek API Key 吧！🚀
