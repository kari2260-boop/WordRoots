// AI 未来家庭社群 - Onboarding Assessment Questions
// 基于积极心理学和青少年发展理论，聚焦优势发现

import type { AssessmentQuestion } from '@/types'
import { INTEREST_CATEGORIES } from './constants'

// ============================================
// Onboarding Assessment Questions
// ============================================

export const ONBOARDING_QUESTIONS: AssessmentQuestion[] = [
  // ====== 兴趣探索 (Interests) ======
  {
    id: 'interest_categories',
    step: 'interests',
    type: 'multi_choice',
    question: '你平时最喜欢做什么？',
    description: '可以选择多个选项（最多5个）',
    maxSelections: 5,
    required: true,
    options: Object.entries(INTEREST_CATEGORIES).map(([key, value]) => ({
      value: key,
      label: value.label,
      emoji: value.emoji
    }))
  },
  {
    id: 'interest_specific',
    step: 'interests',
    type: 'open_text',
    question: '具体说说你最喜欢的一件事是什么？为什么喜欢？',
    description: '比如：我喜欢观察昆虫，因为它们的行为很有趣...',
    required: true
  },
  {
    id: 'interest_time',
    step: 'interests',
    type: 'single_choice',
    question: '放学后你最常做什么？',
    required: true,
    options: [
      { value: 'reading', label: '看书学习', emoji: '📚' },
      { value: 'sports', label: '运动玩耍', emoji: '⚽' },
      { value: 'creative', label: '画画做手工', emoji: '🎨' },
      { value: 'gaming', label: '玩游戏', emoji: '🎮' },
      { value: 'socializing', label: '和朋友玩', emoji: '👫' },
      { value: 'watching', label: '看视频学东西', emoji: '📱' },
      { value: 'thinking', label: '发呆想事情', emoji: '💭' },
      { value: 'other', label: '其他活动', emoji: '✨' }
    ]
  },
  {
    id: 'interest_flow',
    step: 'interests',
    type: 'open_text',
    question: '什么事情会让你忘记时间，一做就停不下来？',
    description: '心理学家称之为"心流"状态，这往往指向你真正的热爱',
    required: false
  },

  // ====== 优势自评 (Strengths) ======
  {
    id: 'strength_self',
    step: 'strengths',
    type: 'multi_choice',
    question: '你觉得自己最厉害的是什么？',
    description: '选出你最自信的地方（最多4个）',
    maxSelections: 4,
    required: true,
    options: [
      { value: 'observation', label: '观察力强', emoji: '🔍' },
      { value: 'hands_on', label: '动手能力好', emoji: '🔨' },
      { value: 'expression', label: '善于表达', emoji: '💬' },
      { value: 'creativity', label: '有创意', emoji: '💡' },
      { value: 'logic', label: '逻辑思维好', emoji: '🧩' },
      { value: 'social', label: '善于交朋友', emoji: '🤝' },
      { value: 'patience', label: '有耐心', emoji: '🕰️' },
      { value: 'athletic', label: '运动能力强', emoji: '💪' },
      { value: 'listening', label: '善于倾听', emoji: '👂' },
      { value: 'organizing', label: '组织能力强', emoji: '📋' },
      { value: 'imagination', label: '想象力丰富', emoji: '🌈' },
      { value: 'problem_solving', label: '善于解决问题', emoji: '🎯' }
    ]
  },
  {
    id: 'strength_others',
    step: 'strengths',
    type: 'open_text',
    question: '别人（爸妈、老师、朋友）夸过你什么？',
    description: '别人眼中的你，往往能看到自己没注意到的优势',
    required: true
  },
  {
    id: 'strength_proud',
    step: 'strengths',
    type: 'open_text',
    question: '你最自豪的一件事是什么？',
    description: '可以是做成了什么事，克服了什么困难，或帮助了谁...',
    required: true
  },
  {
    id: 'strength_enjoy',
    step: 'strengths',
    type: 'open_text',
    question: '什么事情对别人来说很难，但你觉得很容易？',
    description: '这往往是你的天赋优势所在',
    required: false
  },

  // ====== 性格特质 (Personality) ======
  {
    id: 'personality_energy',
    step: 'personality',
    type: 'single_choice',
    question: '和很多人在一起时，你通常？',
    required: true,
    options: [
      { value: 'very_energized', label: '很开心很兴奋', emoji: '🎉' },
      { value: 'energized_but_tired', label: '还好但会有点累', emoji: '😊' },
      { value: 'prefer_small_group', label: '更喜欢和几个好朋友在一起', emoji: '👥' },
      { value: 'prefer_alone', label: '比较安静想自己待着', emoji: '🤫' }
    ]
  },
  {
    id: 'personality_challenge',
    step: 'personality',
    type: 'single_choice',
    question: '遇到困难的事情，你通常？',
    required: true,
    options: [
      { value: 'action_first', label: '马上开始尝试', emoji: '🚀' },
      { value: 'think_first', label: '先想清楚再做', emoji: '💭' },
      { value: 'seek_help', label: '找人帮忙一起做', emoji: '🤝' },
      { value: 'hesitate', label: '可能会犹豫一下', emoji: '🤔' }
    ]
  },
  {
    id: 'personality_learning',
    step: 'personality',
    type: 'single_choice',
    question: '你更喜欢哪种学习方式？',
    required: true,
    options: [
      { value: 'reading', label: '自己看书研究', emoji: '📚' },
      { value: 'doing', label: '动手做实验', emoji: '🔬' },
      { value: 'discussing', label: '和别人讨论', emoji: '💬' },
      { value: 'watching', label: '看视频或听讲解', emoji: '📺' }
    ]
  },
  {
    id: 'personality_traits',
    step: 'personality',
    type: 'multi_choice',
    question: '下面哪些词最像你？',
    description: '选出5个最符合的（都没有对错，做真实的自己就好）',
    maxSelections: 5,
    required: true,
    options: [
      { value: 'curious', label: '好奇', emoji: '🔍' },
      { value: 'serious', label: '认真', emoji: '📝' },
      { value: 'lively', label: '活泼', emoji: '🌟' },
      { value: 'quiet', label: '安静', emoji: '🤫' },
      { value: 'kind', label: '善良', emoji: '💝' },
      { value: 'brave', label: '勇敢', emoji: '🦁' },
      { value: 'patient', label: '有耐心', emoji: '🕰️' },
      { value: 'humorous', label: '幽默', emoji: '😄' },
      { value: 'careful', label: '细心', emoji: '🔎' },
      { value: 'generous', label: '大方', emoji: '🎁' },
      { value: 'independent', label: '独立', emoji: '🚶' },
      { value: 'enthusiastic', label: '热情', emoji: '🔥' }
    ]
  },
  {
    id: 'personality_decision',
    step: 'personality',
    type: 'single_choice',
    question: '做决定的时候，你更相信？',
    required: true,
    options: [
      { value: 'logic', label: '理性分析，用数据说话', emoji: '📊' },
      { value: 'feeling', label: '直觉感受，相信第一感觉', emoji: '💫' },
      { value: 'others', label: '参考别人的意见', emoji: '👥' },
      { value: 'mixed', label: '看情况，不同事情不同方式', emoji: '⚖️' }
    ]
  },

  // ====== 目标愿望 (Goals) ======
  {
    id: 'goals_dream',
    step: 'goals',
    type: 'open_text',
    question: '你长大后想做什么？或者你的梦想是什么？',
    description: '不用担心是否"现实"，想到什么就说什么',
    required: true
  },
  {
    id: 'goals_learn',
    step: 'goals',
    type: 'open_text',
    question: '你最想学会什么新技能？',
    description: '可以是任何你感兴趣的事情',
    required: true
  },
  {
    id: 'goals_this_year',
    step: 'goals',
    type: 'open_text',
    question: '今年你最想完成的一件事是什么？',
    description: '一个具体的、你真正想做的事情',
    required: true
  },
  {
    id: 'goals_become',
    step: 'goals',
    type: 'open_text',
    question: '你希望自己成为一个怎样的人？',
    description: '用几个词或一句话描述未来的自己',
    required: false
  },
  {
    id: 'goals_help',
    step: 'goals',
    type: 'open_text',
    question: '如果有机会，你最想帮助解决什么问题？',
    description: '可以是身边的小问题，也可以是更大的社会问题',
    required: false
  }
]

// ============================================
// Helper Functions
// ============================================

export function getQuestionsByStep(step: AssessmentQuestion['step']): AssessmentQuestion[] {
  return ONBOARDING_QUESTIONS.filter(q => q.step === step)
}

export function getQuestionById(id: string): AssessmentQuestion | undefined {
  return ONBOARDING_QUESTIONS.find(q => q.id === id)
}

export const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'K博士欢迎你', icon: '🦄' },
  { id: 'basic', title: '基本信息', icon: '👤' },
  { id: 'interests', title: '兴趣探索', icon: '🎯' },
  { id: 'strengths', title: '优势发现', icon: '💪' },
  { id: 'personality', title: '性格特点', icon: '🌈' },
  { id: 'goals', title: '目标愿望', icon: '🚀' },
  { id: 'complete', title: '完成', icon: '🎉' }
] as const
