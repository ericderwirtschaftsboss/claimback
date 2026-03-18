import { Category } from '@prisma/client'

export interface DemoOpportunity {
  category: Category
  vendor: string
  description: string
  amount: number
  confidence: number
  emailMsgId: string
  emailDate: Date
}

export const demoOpportunities: DemoOpportunity[] = [
  {
    category: 'FORGOTTEN_SUBSCRIPTION',
    vendor: 'FitTracker Pro',
    description: 'Annual subscription of $79.99 with last login 8 months ago. High likelihood of being unused.',
    amount: 79.99,
    confidence: 92,
    emailMsgId: 'demo-003',
    emailDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'FORGOTTEN_SUBSCRIPTION',
    vendor: 'DesignTool Pro',
    description: 'Annual renewal of $199.99 with last usage 11 months ago. Eligible for prorated refund within 14 days.',
    amount: 199.99,
    confidence: 95,
    emailMsgId: 'demo-010',
    emailDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'FORGOTTEN_SUBSCRIPTION',
    vendor: 'MusicStream Premium Family',
    description: 'Family plan at $16.99/month with only 1 of 6 slots used. Could save $6/month by downgrading to Individual.',
    amount: 72.0,
    confidence: 85,
    emailMsgId: 'demo-009',
    emailDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'OVERCHARGE',
    vendor: 'PowerCo Electric',
    description: 'Electricity bill 40% higher than average ($287.50 vs $205 typical). Possible meter reading error.',
    amount: 82.50,
    confidence: 65,
    emailMsgId: 'demo-004',
    emailDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'PRICE_DROP',
    vendor: 'TechMart',
    description: 'TechPro Laptop X15 purchased for $1,299.99 now available for $1,099.99. $200 price adjustment available within 30 days.',
    amount: 200.0,
    confidence: 90,
    emailMsgId: 'demo-005',
    emailDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'FLIGHT_COMPENSATION',
    vendor: 'Sky Airlines',
    description: 'Flight SA-441 JFK→LHR delayed 4.5 hours. Eligible for up to €600 (~$650) under EU261/2004.',
    amount: 650.0,
    confidence: 88,
    emailMsgId: 'demo-006',
    emailDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'BANK_FEE',
    vendor: 'First National Bank',
    description: 'Overdraft fee of $35 on a -$12.50 balance. Banks often waive first-time overdraft fees upon request.',
    amount: 35.0,
    confidence: 78,
    emailMsgId: 'demo-007',
    emailDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    category: 'BANK_FEE',
    vendor: 'Global Bank',
    description: 'Wire transfer fee of $25 charged despite Premium account including 2 free transfers. Likely billing error.',
    amount: 25.0,
    confidence: 92,
    emailMsgId: 'demo-013',
    emailDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
]
