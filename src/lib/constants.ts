// AI 未来家庭社群 - Constants & Configurations

import type { LevelInfo, CouncilMentor, TaskType, InterestCategory, StrengthDimension } from '@/types'

// ============================================
// Level System Configuration
// ============================================

export const LEVELS: LevelInfo[] = [
  { level: 1, name: '新手探险家', minPoints: 0, emoji: '🌱' },
  { level: 2, name: '好奇观察者', minPoints: 300, emoji: '🔍' },
  { level: 3, name: '小小实验家', minPoints: 800, emoji: '🔬' },
  { level: 4, name: '创意发明者', minPoints: 1500, emoji: '💡' },
  { level: 5, name: '项目领航员', minPoints: 3000, emoji: '🚀' },
  { level: 6, name: '知识探索者', minPoints: 5000, emoji: '🌟' },
  { level: 7, name: '成长导师', minPoints: 8000, emoji: '🏆' },
  { level: 8, name: '未来领袖', minPoints: 12000, emoji: '👑' },
] as const

export function getLevelInfo(points: number) {
  const currentLevel = [...LEVELS].reverse().find(l => points >= l.minPoints) || LEVELS[0]
  const nextLevel = LEVELS.find(l => l.minPoints > points) || null

  const progress = nextLevel
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  const pointsToNext = nextLevel ? nextLevel.minPoints - points : 0

  return {
    current: currentLevel,
    next: nextLevel,
    progress: Math.min(100, Math.max(0, progress)),
    pointsToNext
  }
}

// ============================================
// Task Types Configuration
// ============================================

export const TASK_TYPES: Record<TaskType, { label: string; emoji: string; color: string }> = {
  knowledge: { label: '知识探索', emoji: '📚', color: 'bg-blue-100 text-blue-700' },
  'hands-on': { label: '动手实践', emoji: '🔨', color: 'bg-orange-100 text-orange-700' },
  social: { label: '社交沟通', emoji: '💬', color: 'bg-green-100 text-green-700' },
  creative: { label: '创意表达', emoji: '🎨', color: 'bg-purple-100 text-purple-700' },
  reflection: { label: '自我反思', emoji: '🪞', color: 'bg-pink-100 text-pink-700' },
  physical: { label: '运动健康', emoji: '⚽', color: 'bg-red-100 text-red-700' },
  service: { label: '服务他人', emoji: '💝', color: 'bg-yellow-100 text-yellow-700' },
  tech: { label: '科技探索', emoji: '💻', color: 'bg-cyan-100 text-cyan-700' },
} as const

// ============================================
// Interest Categories Configuration
// ============================================

export const INTEREST_CATEGORIES: Record<
  InterestCategory,
  { label: string; emoji: string; examples: string[] }
> = {
  science: { label: '科学探索', emoji: '🔬', examples: ['物理', '化学', '生物', '天文', '地理'] },
  arts: { label: '艺术创作', emoji: '🎨', examples: ['画画', '书法', '手工', '摄影', '设计'] },
  sports: { label: '运动健康', emoji: '⚽', examples: ['足球', '篮球', '游泳', '跑步', '武术', '舞蹈'] },
  social: { label: '社交活动', emoji: '🤝', examples: ['演讲', '辩论', '志愿者', '团队活动'] },
  tech: { label: '科技数码', emoji: '💻', examples: ['编程', '机器人', '游戏设计', '3D打印'] },
  nature: { label: '自然探索', emoji: '🌿', examples: ['植物', '动物', '户外探险', '环保'] },
  language: { label: '语言文字', emoji: '📝', examples: ['写作', '阅读', '外语', '诗歌'] },
  music: { label: '音乐表演', emoji: '🎵', examples: ['唱歌', '乐器', '作曲', '音乐欣赏'] },
} as const

// ============================================
// Strength Dimensions Configuration
// ============================================

export const STRENGTH_DIMENSIONS: Record<
  StrengthDimension,
  { label: string; emoji: string; color: string }
> = {
  cognitive: { label: '认知思维', emoji: '🧠', color: 'bg-blue-100 text-blue-700' },
  creative: { label: '创意想象', emoji: '💡', color: 'bg-purple-100 text-purple-700' },
  social: { label: '社交沟通', emoji: '🤝', color: 'bg-green-100 text-green-700' },
  emotional: { label: '情感智慧', emoji: '❤️', color: 'bg-pink-100 text-pink-700' },
  physical: { label: '身体运动', emoji: '💪', color: 'bg-orange-100 text-orange-700' },
  leadership: { label: '领导组织', emoji: '👑', color: 'bg-yellow-100 text-yellow-700' },
  practical: { label: '实践动手', emoji: '🔧', color: 'bg-cyan-100 text-cyan-700' },
} as const

// ============================================
// Future Council (Mentors) Configuration
// ============================================

export const COUNCIL_MENTORS: CouncilMentor[] = [
  {
    id: 'davinci',
    name: '达芬奇教授',
    title: 'Prof. Da Vinci',
    emoji: '🔬',
    description: '创意与发明的引路人。擅长激发你的想象力，帮你把脑海中的点子变成现实。',
    dimensions: ['creative', 'practical'],
    unlockCondition: { type: 'tasks_completed', value: 3, taskTypes: ['creative', 'hands-on'] }
  },
  {
    id: 'magellan',
    name: '探险家麦哲伦',
    title: 'Explorer Magellan',
    emoji: '🌍',
    description: '勇气与探索的伙伴。鼓励你走出舒适区，发现世界的精彩。',
    dimensions: ['physical'],
    unlockCondition: { type: 'level', value: 2 }
  },
  {
    id: 'oliver',
    name: '智慧猫头鹰奥利',
    title: 'Owl Oliver',
    emoji: '📚',
    description: '知识与思考的导师。帮你建立深度思考的习惯，享受学习的乐趣。',
    dimensions: ['cognitive'],
    unlockCondition: { type: 'tasks_completed', value: 3, taskTypes: ['knowledge'] }
  },
  {
    id: 'bridge',
    name: '友谊大使小桥',
    title: 'Bridge',
    emoji: '🤝',
    description: '社交与情感的守护者。帮你理解自己和他人的感受，建立真诚的友谊。',
    dimensions: ['social', 'emotional'],
    unlockCondition: { type: 'tasks_completed', value: 2, taskTypes: ['social'] }
  },
  {
    id: 'star',
    name: '未来队长星辰',
    title: 'Captain Star',
    emoji: '🚀',
    description: '领导力与目标的教练。帮你设定目标、制定计划、带领团队前进。',
    dimensions: ['leadership'],
    unlockCondition: { type: 'level', value: 3 }
  }
]

// ============================================
// Grade Options
// ============================================

export const GRADES = [
  { value: 'grade_4', label: '小学四年级' },
  { value: 'grade_5', label: '小学五年级' },
  { value: 'grade_6', label: '小学六年级' },
  { value: 'grade_7', label: '初中一年级' },
  { value: 'grade_8', label: '初中二年级' },
  { value: 'grade_9', label: '初中三年级' },
] as const

// ============================================
// Gender Options
// ============================================

export const GENDERS = [
  { value: 'male', label: '男生', emoji: '👦' },
  { value: 'female', label: '女生', emoji: '👧' },
  { value: 'other', label: '其他', emoji: '🧑' },
] as const

// ============================================
// K博士的鼓励语
// ============================================

export const DR_K_ENCOURAGEMENTS = [
  '太棒了！继续保持这份好奇心！',
  '你真的很有想法！',
  '这是一个很棒的发现！',
  '你的观察力真的很棒！',
  '我看到了你的进步！',
  '这个想法很有创意！',
  '你越来越厉害了！',
  '继续加油，你做得很好！',
] as const

// ============================================
// Empty State Messages
// ============================================

export const EMPTY_STATES = {
  noTasks: {
    emoji: '📋',
    message: '还没有任务呢，先去完成第一个任务吧！',
    action: '去看看任务'
  },
  noWorks: {
    emoji: '🎨',
    message: '还没有作品呢，去完成第一个任务吧！',
    action: '去做任务'
  },
  noChats: {
    emoji: '🦄',
    message: '嗨！我是K博士，你的成长伙伴。有什么想聊的吗？',
    action: ''
  },
  noInterests: {
    emoji: '🎯',
    message: '还没有添加兴趣呢，去探索页面补充吧！',
    action: '去补充'
  },
} as const

// ============================================
// Task Presets
// ============================================

export const TASKS = [
  {
    id: 1,
    title: '观察一种昆虫',
    description: '找到一只昆虫（蚂蚁、蜜蜂、蝴蝶等），观察15分钟，记录它的行为和特点。',
    emoji: '🐛',
    type: 'hands-on' as TaskType,
    points: 100,
    difficulty: 1,
    requirements: [
      '观察时间不少于15分钟',
      '记录至少3个行为特点',
      '可以配合照片或手绘图'
    ]
  },
  {
    id: 2,
    title: '采访家人',
    description: '采访爸爸或妈妈，了解他们的工作，记录3个最有趣的事情。',
    emoji: '🎤',
    type: 'social' as TaskType,
    points: 80,
    difficulty: 1,
    requirements: [
      '准备至少5个问题',
      '记录完整的对话过程',
      '总结3个最有趣的发现'
    ]
  },
  {
    id: 3,
    title: '读一本书',
    description: '读完一本你感兴趣的书，分享最喜欢的3句话和为什么喜欢。',
    emoji: '📚',
    type: 'knowledge' as TaskType,
    points: 50,
    difficulty: 1,
    requirements: [
      '完整读完一本书',
      '摘抄3句最喜欢的话',
      '写下喜欢的理由'
    ]
  },
  {
    id: 4,
    title: '做个小实验',
    description: '用家里的材料做一个科学小实验（比如：火山爆发、浮力测试等）。',
    emoji: '🔬',
    type: 'hands-on' as TaskType,
    points: 120,
    difficulty: 2,
    requirements: [
      '准备实验材料清单',
      '记录实验步骤',
      '拍照或录像记录过程',
      '写下实验结果和感受'
    ]
  },
  {
    id: 5,
    title: '写一首诗',
    description: '写一首小诗，可以关于自然、家人、梦想或任何你想表达的。',
    emoji: '✍️',
    type: 'creative' as TaskType,
    points: 100,
    difficulty: 2,
    requirements: [
      '不少于4行',
      '有自己的想法和感受',
      '可以不押韵，但要有意境'
    ]
  },
  {
    id: 6,
    title: '设计一个游戏',
    description: '设计一个简单的游戏（可以是纸牌、棋类或户外游戏），写下规则。',
    emoji: '🎮',
    type: 'creative' as TaskType,
    points: 150,
    difficulty: 2,
    requirements: [
      '写清楚游戏规则',
      '说明需要几个人玩',
      '画出游戏道具或场地图',
      '最好能试玩一次'
    ]
  },
  {
    id: 7,
    title: '社区调查',
    description: '在小区里做一个小调查（比如：大家喜欢什么花？最想改善什么？）',
    emoji: '📊',
    type: 'social' as TaskType,
    points: 120,
    difficulty: 2,
    requirements: [
      '设计3-5个调查问题',
      '采访至少5个人',
      '整理调查结果',
      '写一份简单的报告'
    ]
  },
  {
    id: 8,
    title: '学习一项新技能',
    description: '花一周时间学习一项新技能（折纸、魔方、简单编程等），记录学习过程。',
    emoji: '🎯',
    type: 'knowledge' as TaskType,
    points: 200,
    difficulty: 3,
    requirements: [
      '选择一项新技能',
      '坚持练习至少7天',
      '记录每天的进步',
      '最后展示学习成果'
    ]
  }
] as const
