'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showAdminCode, setShowAdminCode] = useState(false)
  const [adminCode, setAdminCode] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    age: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          console.error('Login error:', error)
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('邮箱或密码错误')
          }
          throw error
        }

        if (!data.user || !data.session) {
          throw new Error('登录失败：未获取到用户信息')
        }

        console.log('Login successful, user:', data.user.id)
        console.log('Session:', data.session ? 'exists' : 'missing')

        setSuccess('登录成功！正在跳转...')

        // Wait a moment for session to sync
        await new Promise(resolve => setTimeout(resolve, 800))

        // Check if onboarding is complete
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single()

        console.log('Profile:', profile, 'Error:', profileError)

        // Check for redirect target (for admin login)
        const redirectTo = sessionStorage.getItem('redirectTo')
        if (redirectTo) {
          sessionStorage.removeItem('redirectTo')
          console.log('Redirecting to:', redirectTo)
          window.location.href = redirectTo
          return
        }

        // Use window.location for hard navigation to ensure session is recognized
        if (profile && !profile.onboarding_completed) {
          console.log('Redirecting to onboarding')
          window.location.href = '/onboarding'
        } else {
          console.log('Redirecting to dashboard')
          window.location.href = '/dashboard'
        }
      } else if (mode === 'signup') {
        // Validate inputs
        if (!formData.nickname || formData.nickname.trim().length < 2) {
          throw new Error('昵称至少需要2个字符')
        }

        const age = parseInt(formData.age)
        if (isNaN(age) || age < 8 || age > 18) {
          throw new Error('年龄需要在8-18岁之间')
        }

        if (formData.password.length < 6) {
          throw new Error('密码至少需要6个字符')
        }

        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
            data: {
              nickname: formData.nickname.trim(),
              age: age,
            },
          },
        })

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('该邮箱已被注册')
          }
          throw error
        }

        if (data.user) {
          // Always redirect to onboarding after signup
          // User can complete onboarding even before email confirmation
          setSuccess('注册成功！正在进入系统...')
          setTimeout(() => {
            router.push('/onboarding')
            router.refresh()
          }, 500)
        }
      } else if (mode === 'reset') {
        // Password reset
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        })

        if (error) throw error

        setSuccess('密码重置邮件已发送，请查收邮箱')
        setFormData({ ...formData, email: '', password: '' })
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦄</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI 未来家庭社群</h1>
          <p className="text-gray-600">发现你的超能力</p>
        </div>

        {/* Admin Quick Access */}
        <div className="mb-4">
          {!showAdminCode ? (
            <button
              onClick={() => setShowAdminCode(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 font-medium transition-colors"
            >
              🔧 <span>管理员登录</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="请输入管理员授权码"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAdminCode(false)
                    setAdminCode('')
                  }}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (adminCode === '123') {
                      // Set admin authorization in session
                      sessionStorage.setItem('adminAuth', 'true')
                      // Redirect directly to admin
                      window.location.href = '/admin'
                    } else {
                      setError('授权码错误')
                      setAdminCode('')
                    }
                  }}
                  className="flex-1"
                >
                  进入管理后台
                </Button>
              </div>
            </div>
          )}
          {!showAdminCode && (
            <p className="text-xs text-gray-500 text-center mt-2">
              需要输入授权码才能访问管理后台
            </p>
          )}
        </div>

        <Card id="login-form">
          {mode !== 'reset' && (
            <div className="flex gap-2 mb-6">
              <Button
                variant={mode === 'login' ? 'primary' : 'secondary'}
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
                className="flex-1"
              >
                登录
              </Button>
              <Button
                variant={mode === 'signup' ? 'primary' : 'secondary'}
                onClick={() => {
                  setMode('signup')
                  setError('')
                  setSuccess('')
                }}
                className="flex-1"
              >
                注册
              </Button>
            </div>
          )}

          {mode === 'reset' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">重置密码</h2>
              <p className="text-sm text-gray-600">
                输入你的邮箱，我们会发送重置链接给你
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="邮箱"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {mode !== 'reset' && (
              <Input
                type="password"
                label="密码"
                placeholder="至少6个字符"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            )}

            {mode === 'signup' && (
              <>
                <Input
                  type="text"
                  label="昵称"
                  placeholder="你的名字"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  required
                  minLength={2}
                />
                <Input
                  type="number"
                  label="年龄"
                  placeholder="8-18岁"
                  min={8}
                  max={18}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
                {success}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {mode === 'login' && '登录'}
              {mode === 'signup' && '注册'}
              {mode === 'reset' && '发送重置邮件'}
            </Button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setMode('reset')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                忘记密码？
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccess('')
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                返回登录
              </button>
            )}
          </form>
        </Card>
      </div>
    </div>
  )
}
