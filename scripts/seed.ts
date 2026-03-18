import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@claimback.app' },
    update: {},
    create: {
      email: 'demo@claimback.app',
      name: 'Demo User',
      passwordHash,
    },
  })

  console.log(`Created user: ${user.email}`)

  // Create opportunities
  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'FORGOTTEN_SUBSCRIPTION',
        vendor: 'FitTracker Pro',
        description: 'Annual subscription of $79.99 with last login 8 months ago.',
        amount: 79.99,
        confidence: 92,
        emailMsgId: 'demo-003',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'FORGOTTEN_SUBSCRIPTION',
        vendor: 'DesignTool Pro',
        description: 'Annual renewal of $199.99 with last usage 11 months ago. Eligible for prorated refund.',
        amount: 199.99,
        confidence: 95,
        emailMsgId: 'demo-010',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'PRICE_DROP',
        vendor: 'TechMart',
        description: 'Laptop purchased for $1,299.99 now $1,099.99. $200 price adjustment within 30 days.',
        amount: 200.0,
        confidence: 90,
        emailMsgId: 'demo-005',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'FLIGHT_COMPENSATION',
        vendor: 'Sky Airlines',
        description: 'Flight SA-441 JFK→LHR delayed 4.5 hours. Eligible for €600 under EU261.',
        amount: 650.0,
        confidence: 88,
        emailMsgId: 'demo-006',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'OVERCHARGE',
        vendor: 'PowerCo Electric',
        description: 'Electricity bill 40% higher than average. Possible meter reading error.',
        amount: 82.5,
        confidence: 65,
        emailMsgId: 'demo-004',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'BANK_FEE',
        vendor: 'First National Bank',
        description: 'Overdraft fee of $35 on a -$12.50 balance.',
        amount: 35.0,
        confidence: 78,
        emailMsgId: 'demo-007',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'BANK_FEE',
        vendor: 'Global Bank',
        description: 'Wire transfer fee of $25 charged despite Premium account free transfers.',
        amount: 25.0,
        confidence: 92,
        emailMsgId: 'demo-013',
      },
    }),
    prisma.opportunity.create({
      data: {
        userId: user.id,
        category: 'FORGOTTEN_SUBSCRIPTION',
        vendor: 'MusicStream Premium Family',
        description: 'Family plan with only 1 of 6 slots used. Could save $6/month by downgrading.',
        amount: 72.0,
        confidence: 85,
        emailMsgId: 'demo-009',
        status: 'CLAIMED',
      },
    }),
  ])

  console.log(`Created ${opportunities.length} opportunities`)

  // Create claims
  const claims = await Promise.all([
    prisma.claim.create({
      data: {
        userId: user.id,
        opportunityId: opportunities[1].id, // DesignTool Pro
        status: 'DRAFT',
        draftBody: `Dear DesignTool Pro Support,

I am writing to request a cancellation and prorated refund for my DesignTool Pro annual subscription, which was recently renewed at $199.99.

I have not actively used the software for approximately 11 months. As your renewal notification indicates prorated refunds are available within 14 days of renewal, I would like to take advantage of this policy.

I kindly request immediate cancellation and a prorated refund for the unused portion.

Best regards`,
      },
    }),
    prisma.claim.create({
      data: {
        userId: user.id,
        opportunityId: opportunities[3].id, // Sky Airlines
        status: 'SUBMITTED',
        draftBody: `Dear Sky Airlines Customer Service,

I am writing regarding my flight SA-441 from JFK to LHR on March 16, 2026. The flight was delayed by 4 hours 30 minutes.

Under EU Regulation EC 261/2004, I am entitled to compensation of €600 for this delay.

I request compensation as per EU261/2004.

Best regards`,
      },
    }),
    prisma.claim.create({
      data: {
        userId: user.id,
        opportunityId: opportunities[7].id, // MusicStream
        status: 'RESOLVED',
        draftBody: 'Cancellation request for MusicStream Premium Family plan.',
        resolvedAmount: 42.0,
        resolvedAt: new Date(),
      },
    }),
  ])

  console.log(`Created ${claims.length} claims`)

  // Create scan log
  await prisma.scanLog.create({
    data: {
      userId: user.id,
      emailsFetched: 15,
      emailsAnalyzed: 15,
      opportunitiesFound: 8,
      status: 'completed',
      completedAt: new Date(),
    },
  })

  console.log('Created scan log')
  console.log('\nSeed complete!')
  console.log('Login: demo@claimback.app / demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
