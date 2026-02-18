'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ListTodo,
  MessageSquare,
  ClipboardList,
  Eye,
  LogOut,
  FolderOpen
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: '总览' },
  { href: '/admin/users', icon: Users, label: '用户管理' },
  { href: '/admin/works', icon: FolderOpen, label: '作品管理' },
  { href: '/admin/tasks', icon: ListTodo, label: '任务管理' },
  { href: '/admin/conversations', icon: MessageSquare, label: '对话记录' },
  { href: '/admin/assessments', icon: ClipboardList, label: '测评数据' },
  { href: '/admin/observations', icon: Eye, label: '观察记录' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Check admin authorization
  React.useEffect(() => {
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (!adminAuth || adminAuth !== 'true') {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🦄</span>
            <h1 className="text-xl font-bold text-gray-900">AI 未来家庭社群</h1>
          </div>
          <p className="text-sm text-gray-600">管理后台</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full"
            >
              <LogOut size={20} />
              <span>退出登录</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
