import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as { id: string }).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true },
  })

  const [totalOpportunities, totalClaims, emailConnection] = await Promise.all([
    prisma.opportunity.count({ where: { userId } }),
    prisma.claim.count({ where: { userId } }),
    prisma.emailConnection.findFirst({
      where: { userId },
      select: { email: true, provider: true, createdAt: true },
    }),
  ])

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <ProfileForm name={user?.name || ''} email={user?.email || ''} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since</span>
            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Opportunities found</span>
            <span>{totalOpportunities}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Claims filed</span>
            <span>{totalClaims}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected Email</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {emailConnection ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="capitalize">{emailConnection.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span>{emailConnection.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected</span>
                <span>{new Date(emailConnection.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No email connected yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
