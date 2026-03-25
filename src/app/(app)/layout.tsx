import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NavSidebar } from '@/components/nav-sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  // Verify user still exists in DB (handles DB reset with stale JWT)
  const userId = (session.user as { id: string }).id
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!user) {
    // User's session is stale — force re-login
    redirect('/api/auth/signout?callbackUrl=/login')
  }

  return (
    <div className="min-h-screen">
      <NavSidebar />
      <main className="md:ml-64 min-h-screen">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
