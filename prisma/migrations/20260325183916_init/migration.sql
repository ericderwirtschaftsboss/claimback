-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractScan" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT,
    "contractType" TEXT,
    "signerRole" TEXT,
    "sourceType" TEXT NOT NULL,
    "sourceFileName" TEXT,
    "sourceUrl" TEXT,
    "language" TEXT,
    "jurisdictionDetected" TEXT,
    "jurisdictionCode" TEXT,
    "riskScore" DOUBLE PRECISION,
    "powerImbalanceScore" DOUBLE PRECISION,
    "riskLevel" TEXT,
    "recommendation" TEXT,
    "executiveSummary" TEXT,
    "executiveSummaryEn" TEXT,
    "financialSummary" TEXT,
    "flags" TEXT,
    "negotiationPlaybook" TEXT,
    "missingProtections" TEXT,
    "flagsEn" TEXT,
    "negotiationPlaybookEn" TEXT,
    "missingProtectionsEn" TEXT,
    "flagCountCritical" INTEGER NOT NULL DEFAULT 0,
    "flagCountWarning" INTEGER NOT NULL DEFAULT 0,
    "flagCountInfo" INTEGER NOT NULL DEFAULT 0,
    "analysisCompleteness" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanFeedback" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "flagId" INTEGER NOT NULL,
    "userId" TEXT,
    "feedback" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ContractScan_userId_idx" ON "ContractScan"("userId");

-- CreateIndex
CREATE INDEX "ScanFeedback_scanId_idx" ON "ScanFeedback"("scanId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractScan" ADD CONSTRAINT "ContractScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanFeedback" ADD CONSTRAINT "ScanFeedback_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "ContractScan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
