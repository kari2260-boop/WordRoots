// Landing Page

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="text-8xl mb-4">🦄</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI 未来家庭社群
          </h1>
          <p className="text-2xl text-green-600 font-semibold mb-2">
            发现你的超能力
          </p>
          <p className="text-gray-600 text-lg">
            AI驱动的青少年成长平台
          </p>
        </div>

        {/* K博士介绍 */}
        <div className="bg-white rounded-3xl p-8 mb-12 card-shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-6xl flex-shrink-0">🦄</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                你好，我是K博士！
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                我是你的 AI 成长伙伴。我会帮你发现自己的优势，找到你真正热爱的事情，还有一群<span className="text-green-600 font-semibold">未来委员会</span>的导师等着和你见面！一起开启探索之旅吧！
              </p>
            </div>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          <FeatureCard
            emoji="🎯"
            title="发现优势"
            description="通过对话和任务，找到你最擅长的事"
            color="bg-blue-50 border-blue-200"
          />
          <FeatureCard
            emoji="🦄"
            title="K博士陪伴"
            description="你的专属 AI 成长教练，随时聊天"
            color="bg-green-50 border-green-200"
          />
          <FeatureCard
            emoji="🏆"
            title="成长档案"
            description="记录每一步成长，构建你的作品集"
            color="bg-purple-50 border-purple-200"
          />
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-block gradient-green text-white text-xl font-semibold px-12 py-4 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            开始探索 →
          </Link>
          <p className="text-gray-500 text-sm mt-6">
            适合 10-15 岁的你
          </p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  emoji,
  title,
  description,
  color,
}: {
  emoji: string
  title: string
  description: string
  color: string
}) {
  return (
    <div className={`${color} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <div className="text-5xl flex-shrink-0">{emoji}</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  )
}
