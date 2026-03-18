import { z } from 'zod'

export const opportunitySchema = z.object({
  category: z.enum([
    'FORGOTTEN_SUBSCRIPTION',
    'OVERCHARGE',
    'PRICE_DROP',
    'FLIGHT_COMPENSATION',
    'BANK_FEE',
  ]),
  vendor: z.string().min(1),
  description: z.string().min(10),
  amount: z.number().positive(),
  confidence: z.number().min(0).max(100),
  emailMsgId: z.string(),
})

export const analysisResponseSchema = z.object({
  opportunities: z.array(opportunitySchema),
})

export type AnalyzedOpportunity = z.infer<typeof opportunitySchema>
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>
