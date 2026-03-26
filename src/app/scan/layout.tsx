import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NavSidebar } from '@/components/nav-sidebar'
import { GuestNav } from '@/components/guest-nav'

export default async function ScanLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (session) {
    return (
      <div className="min-h-screen">
        <NavSidebar />
        <main className="md:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    )
  }

  // Guest: top navigation bar with logo, pricing link, language toggle
  return (
    <div className="min-h-screen">
      <GuestNav />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">{children}</div>
    </div>
  )
}
