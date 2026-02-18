// AI 未来家庭社群 - Council (Future Committee) Unlock Logic

import { COUNCIL_MENTORS } from './constants'
import type { CouncilMentor, TaskType } from '@/types'

// ============================================
// Unlock Check Parameters
// ============================================

export interface UnlockCheckParams {
  userLevel: number
  completedTasksByType: Record<string, number> // { 'creative': 3, 'social': 1, ... }
  alreadyUnlocked: string[] // mentor ids
}

// ============================================
// Check for New Unlocks
// ============================================

export function checkNewUnlocks(params: UnlockCheckParams): CouncilMentor[] {
  const newUnlocks: CouncilMentor[] = []

  for (const mentor of COUNCIL_MENTORS) {
    // Skip if already unlocked
    if (params.alreadyUnlocked.includes(mentor.id)) continue

    const condition = mentor.unlockCondition

    // Check level-based unlock
    if (condition.type === 'level' && params.userLevel >= condition.value) {
      newUnlocks.push(mentor)
    }

    // Check tasks-completed unlock
    if (condition.type === 'tasks_completed' && condition.taskTypes) {
      const totalCompleted = condition.taskTypes.reduce(
        (sum, type) => sum + (params.completedTasksByType[type] || 0),
        0
      )
      if (totalCompleted >= condition.value) {
        newUnlocks.push(mentor)
      }
    }
  }

  return newUnlocks
}

// ============================================
// Get Unlock Progress for a Mentor
// ============================================

export function getUnlockProgress(
  mentor: CouncilMentor,
  userLevel: number,
  completedTasksByType: Record<string, number>
): { current: number; required: number; percentage: number; description: string } {
  const condition = mentor.unlockCondition

  if (condition.type === 'level') {
    return {
      current: userLevel,
      required: condition.value,
      percentage: Math.min(100, (userLevel / condition.value) * 100),
      description: `达到 Lv.${condition.value}`
    }
  }

  if (condition.type === 'tasks_completed' && condition.taskTypes) {
    const current = condition.taskTypes.reduce(
      (sum, type) => sum + (completedTasksByType[type] || 0),
      0
    )

    // Generate description
    const typeLabels = condition.taskTypes.join(' 或 ')
    const description = `完成 ${condition.value} 个 ${typeLabels} 任务`

    return {
      current,
      required: condition.value,
      percentage: Math.min(100, (current / condition.value) * 100),
      description
    }
  }

  return { current: 0, required: 1, percentage: 0, description: '' }
}

// ============================================
// Get All Mentors with Status
// ============================================

export interface MentorWithStatus extends CouncilMentor {
  unlocked: boolean
  progress: ReturnType<typeof getUnlockProgress>
}

export function getMentorsWithStatus(
  userLevel: number,
  completedTasksByType: Record<string, number>,
  alreadyUnlocked: string[]
): MentorWithStatus[] {
  return COUNCIL_MENTORS.map(mentor => ({
    ...mentor,
    unlocked: alreadyUnlocked.includes(mentor.id),
    progress: getUnlockProgress(mentor, userLevel, completedTasksByType)
  }))
}

// ============================================
// Get Next Mentor to Unlock
// ============================================

export function getNextMentorToUnlock(
  userLevel: number,
  completedTasksByType: Record<string, number>,
  alreadyUnlocked: string[]
): MentorWithStatus | null {
  const mentorsWithStatus = getMentorsWithStatus(userLevel, completedTasksByType, alreadyUnlocked)

  // Filter locked mentors and sort by progress
  const lockedMentors = mentorsWithStatus
    .filter(m => !m.unlocked)
    .sort((a, b) => b.progress.percentage - a.progress.percentage)

  return lockedMentors[0] || null
}
