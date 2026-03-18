# ClaimBack

AI-powered money recovery web app. Scans your Gmail inbox to find forgotten subscriptions, overcharges, price drops, flight compensation, and bank fees — then helps you draft claim letters to recover that money.

## Quick Start

### Prerequisites
- Node.js 20+ (via nvm)
- PostgreSQL (via Postgres.app or Docker)

### Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your settings

# Create .env for Prisma CLI
echo 'DATABASE_URL="postgresql://claimback@localhost:5432/claimback"' > .env

# Run migrations
npx prisma migrate dev

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

### Demo Mode

Set `DEMO_MODE=true` in `.env.local` to run the full flow without real API keys. Only `DATABASE_URL` and `NEXTAUTH_SECRET` are needed.

Demo login: `demo@claimback.app` / `demo123`

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v4 (Google OAuth + Credentials)
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Email**: Gmail API (read-only)

### Key directories

```
src/
├── app/                    # Next.js pages and API routes
│   ├── (auth)/             # Login, register (public)
│   ├── (app)/              # Dashboard, opportunities, claims (auth required)
│   └── api/                # REST API endpoints
├── components/             # React components
├── hooks/                  # Client-side hooks
└── lib/
    ├── ai/                 # Claude AI analysis + claim drafting
    ├── demo/               # Demo fixtures (emails, opportunities, claims)
    ├── gmail/              # Gmail OAuth + email fetching + parsing
    ├── scanner/            # Orchestrator + deduplicator
    ├── auth.ts             # NextAuth configuration
    ├── crypto.ts           # AES-256-GCM encryption for OAuth tokens
    ├── prisma.ts           # Prisma client singleton
    └── utils.ts            # Shared utilities
```

### DEMO_MODE boundaries

| Boundary | File | Demo behavior |
|----------|------|---------------|
| Email fetch | `src/lib/gmail/fetcher.ts` | Returns demo email fixtures |
| AI analysis | `src/lib/scanner/orchestrator.ts` | Loads demo opportunities directly |
| Claim draft | `src/lib/ai/claim-drafter.ts` | Returns demo claim templates |

All internal logic (auth, DB, dedup, UI) runs identically in both modes.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Session encryption secret |
| `NEXTAUTH_URL` | Yes | App URL (http://localhost:3000) |
| `GOOGLE_CLIENT_ID` | No* | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No* | Google OAuth client secret |
| `ANTHROPIC_API_KEY` | No* | Claude API key |
| `ENCRYPTION_KEY` | No* | 32-byte hex key for token encryption |
| `DEMO_MODE` | No | Set to "true" for demo mode |

*Not required when `DEMO_MODE=true`

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm test` — Run tests
- `npm run db:migrate` — Run Prisma migrations
- `npm run db:seed` — Seed demo data
- `npm run db:studio` — Open Prisma Studio
