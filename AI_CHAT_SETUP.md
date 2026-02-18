# AI 聊天功能配置指南

## 支持的 AI 提供商

系统支持多个 AI 提供商，会自动选择已配置的提供商。推荐使用国内可用的免费服务。

### 1. DeepSeek（推荐 ⭐️）

**优势**：
- ✅ 国内可直接访问，无需翻墙
- ✅ 免费额度充足（每天 500 万 tokens）
- ✅ 响应速度快
- ✅ 中文理解能力强

**申请步骤**：
1. 访问：https://platform.deepseek.com/
2. 注册账号（支持手机号）
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 API Key 到 `.env.local` 文件：
   ```
   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
   ```

**价格**：免费额度每天 500 万 tokens，超出后按量付费（非常便宜）

---

### 2. 智谱 AI (GLM)

**优势**：
- ✅ 国内可直接访问
- ✅ 有免费额度
- ✅ 清华大学技术支持

**申请步骤**：
1. 访问：https://open.bigmodel.cn/
2. 注册账号
3. 进入 API Keys 管理
4. 创建 API Key
5. 添加到 `.env.local`：
   ```
   ZHIPU_API_KEY=xxxxxxxxxxxxxxxx
   ```

**价格**：新用户有免费额度，之后按量付费

---

### 3. OpenAI (GPT)

**优势**：
- ✅ 性能强大
- ❌ 需要国外网络
- ❌ 需要付费

**配置**：
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

---

### 4. Anthropic (Claude)

**优势**：
- ✅ 性能优秀
- ❌ 需要国外网络
- ❌ 需要付费

**配置**：
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

---

## 快速配置步骤

### 方法一：使用 DeepSeek（推荐）

1. **获取 API Key**
   ```bash
   # 访问 https://platform.deepseek.com/
   # 注册并创建 API Key
   ```

2. **配置环境变量**
   ```bash
   cd /Users/k/Desktop/pathforge-web

   # 编辑 .env.local 文件
   echo "DEEPSEEK_API_KEY=你的API密钥" >> .env.local
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   ```

4. **测试聊天功能**
   - 访问：http://localhost:3000/dashboard/chat
   - 发送消息测试

---

## K博士提示词配置

系统已预设了 K博士的角色和对话风格，你可以在以下文件中自定义：

### 文件位置
`/src/lib/ai-config.ts`

### 可配置内容

1. **基础角色设定** (`DR_K_PROMPTS.base`)
   - K博士的身份和核心原则
   - 对话语气和风格

2. **对话风格示例** (`DR_K_PROMPTS.style`)
   - 不同场景的回复示例
   - 引导孩子思考的方式

3. **知识库** (`DR_K_PROMPTS.knowledge`)
   - 学习相关话题
   - 情绪相关话题
   - 社交相关话题
   - 未来规划话题

4. **标签关键词** (`TAG_KEYWORDS`)
   - 从对话中提取的特质标签
   - 用于丰富学生画像

### 自定义示例

```typescript
// 修改对话风格
export const DR_K_PROMPTS = {
  base: `你是K博士🦄，一位温暖有趣的AI成长伙伴...`,

  // 添加新的知识库主题
  knowledge: {
    coding: `## 编程学习话题
- 强调动手实践
- 鼓励创造性思维
- 引导问题解决能力`,
  }
}

// 添加新的标签关键词
export const TAG_KEYWORDS = {
  '编程思维': ['编程', '代码', '算法', '逻辑'],
  '艺术创作': ['画画', '音乐', '设计', '创作'],
}
```

---

## 常见问题

### Q: 如何切换 AI 提供商？
A: 系统会自动检测已配置的 API Key，按以下优先级选择：
1. DeepSeek
2. 智谱 AI
3. OpenAI
4. Anthropic

只需配置你想用的提供商的 API Key 即可。

### Q: 可以同时配置多个提供商吗？
A: 可以。系统会自动选择第一个可用的提供商。

### Q: DeepSeek 免费额度够用吗？
A: 对于个人项目和小规模使用完全够用。每天 500 万 tokens 相当于约 1 万次对话。

### Q: 如何修改 K博士的回复风格？
A: 编辑 `/src/lib/ai-config.ts` 文件中的 `DR_K_PROMPTS` 配置。

### Q: 聊天记录保存在哪里？
A: 保存在 Supabase 的 `chat_messages` 表中，每个用户的聊天记录独立存储。

---

## 测试 API 连接

创建测试脚本 `test-chat.js`：

```javascript
const fetch = require('node-fetch')

async function testChat() {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'your-session-cookie'
    },
    body: JSON.stringify({
      message: '你好，K博士！'
    })
  })

  const data = await response.json()
  console.log('Reply:', data.reply)
  console.log('Tags:', data.tags)
}

testChat()
```

运行测试：
```bash
node test-chat.js
```

---

## 下一步

1. ✅ 配置 DeepSeek API Key
2. ✅ 重启开发服务器
3. ✅ 测试聊天功能
4. 🎨 根据需要自定义 K博士的提示词
5. 📊 查看聊天记录和提取的标签

有问题随时查看服务器日志：
```bash
tail -f /private/tmp/claude-501/-Users-k/tasks/be8dc45.output
```
