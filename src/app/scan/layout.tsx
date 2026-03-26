import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NavSidebar } from '@/components/nav-sidebar'

export default async function ScanLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Always show sidebar — for logged-in users it has full nav,
  // for guests the sidebar still shows with sign-in option
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

  // Guest: no sidebar, just render content directly
  // The scan page and result page handle their own headers when needed
  return <>{children}</>
}
