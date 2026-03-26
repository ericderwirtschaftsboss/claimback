import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NavSidebar } from '@/components/nav-sidebar'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function ScanLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session

  if (isLoggedIn) {
    return (
      <div className="min-h-screen">
        <NavSidebar />
        <main className="md:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SignGuard</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="text-sm text-primary hover:underline">Sign in</Link>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">{children}</div>
    </div>
  )
}
