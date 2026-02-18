import { BottomNav } from '@/components/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
