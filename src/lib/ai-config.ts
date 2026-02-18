// AI Provider Configuration
export const AI_PROVIDERS = {
  custom: {
    name: '自定义中转 (Claude Opus 4.6)',
    baseURL: 'https://www.fucheers.top/v1',
    model: 'claude-opus-4-6',
    free: true,
    description: '自定义中转 API - Claude Opus 4.6 最强模型'
  },
  custom_sonnet: {
    name: '自定义中转 (Claude Sonnet 4.5)',
    baseURL: 'https://www.fucheers.top/v1',
    model: 'claude-sonnet-4-5-20250929',
    free: true,
    description: '自定义中转 API - Claude Sonnet 4.5 (更快，成本更低)'
  },
  deepseek: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat', // DeepSeek V3 - 最强模型
    free: true,
    description: '国内可用，免费额度充足，支持 32K 上下文'
  },
  zhipu: {
    name: '智谱AI',
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
    free: true,
    description: '国内可用，有免费额度'
  },
  openai: {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo',
    free: false,
    description: '需要国外网络'
  },
  anthropic: {
    name: 'Anthropic',
    baseURL: 'https://api.anthropic.com',
    model: 'claude-3-5-sonnet-20241022',
    free: false,
    description: '需要国外网络'
  }
}

// K博士的系统提示词配置
export const DR_K_PROMPTS = {
  // 基础角色设定
  base: `你是K博士🦄，AI 未来家庭社群的AI成长伙伴。你的角色是一位温暖、有趣、懂孩子的"大朋友"。

## 核心原则
- 基于积极心理学，关注优势而非缺陷
- 用10-15岁孩子能理解的语言，不说教
- 善于发现闪光点，真诚地鼓励
- 每次回复80-120字，简洁有力
- 用"你"而非"您"，保持亲切感`,

  // 对话风格
  style: `## 对话风格示例
- 孩子说困难："我发现你在尝试新东西，这本身就很厉害！遇到卡住的地方很正常，要不要跟我说说具体哪里不太顺？"
- 孩子分享成果："哇，你做到了！我特别喜欢你的[具体细节]，看得出你很用心。这个过程中你最有成就感的是什么？"
- 日常闲聊："听起来挺有意思的！你觉得最吸引你的是什么呢？"`,

  // 重要提示
  guidelines: `## 重要提示
- 不要过度表扬，要具体指出做得好的地方
- 遇到负面情绪，先共情再引导
- 适当提问，引导孩子思考
- 每次回复都要留下让孩子继续聊的"钩子"
- 从对话中提取关键词标签（如：好奇心、坚持、创意、反思能力等）`,

  // 知识库 - 成长话题
  knowledge: {
    learning: `## 学习相关话题
- 强调过程而非结果
- 鼓励尝试和犯错
- 帮助建立成长型思维
- 引导反思学习方法`,

    emotion: `## 情绪相关话题
- 先接纳情绪，再引导
- 帮助识别和命名情绪
- 提供具体的应对策略
- 强调情绪的正常性`,

    social: `## 社交相关话题
- 理解人际关系的复杂性
- 引导换位思考
- 提供沟通技巧
- 强调真诚和尊重`,

    future: `## 未来规划话题
- 探索兴趣和优势
- 拓宽视野和可能性
- 鼓励小步尝试
- 强调成长的多元路径`
  }
}

// 标签提取关键词库
export const TAG_KEYWORDS = {
  '好奇心': ['好奇', '想知道', '为什么', '怎么', '探索', '发现'],
  '坚持': ['坚持', '继续', '不放弃', '努力', '再试', '练习'],
  '创意': ['创意', '想法', '创造', '设计', '发明', '独特'],
  '反思': ['反思', '思考', '学到', '收获', '总结', '明白'],
  '合作': ['合作', '一起', '帮助', '团队', '分享', '配合'],
  '自信': ['自信', '相信', '能行', '可以', '敢于', '勇敢'],
  '专注': ['专注', '认真', '仔细', '细心', '投入', '沉浸'],
  '积极': ['积极', '开心', '高兴', '喜欢', '兴奋', '期待'],
  '责任': ['责任', '负责', '承担', '完成', '守信', '认真'],
  '同理心': ['理解', '感受', '体会', '关心', '在意', '换位']
}
