-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaDescription" TEXT NOT NULL,
    "targetAudience" TEXT,
    "geography" TEXT,
    "pricingAssumption" TEXT,
    "stage" TEXT NOT NULL,
    "clarificationAsked" JSONB,
    "clarificationAnswers" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaAnalysis" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "targetSegments" JSONB NOT NULL,
    "jobToBeDone" TEXT NOT NULL,
    "primaryUseCases" JSONB NOT NULL,
    "substituteSolutions" JSONB NOT NULL,
    "demandScore" DOUBLE PRECISION NOT NULL,
    "buyingIntentScore" DOUBLE PRECISION NOT NULL,
    "saturationIndex" DOUBLE PRECISION NOT NULL,
    "validationScore" DOUBLE PRECISION NOT NULL,
    "verdict" TEXT NOT NULL,
    "confidenceLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandSignal" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "painIntensity" DOUBLE PRECISION NOT NULL,
    "recencyWeight" DOUBLE PRECISION NOT NULL,
    "evidencePatterns" JSONB NOT NULL,
    "dateCollected" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "coreOffering" TEXT NOT NULL,
    "pricingModel" TEXT NOT NULL,
    "positioning" TEXT NOT NULL,
    "weaknessSignals" JSONB NOT NULL,
    "userFrustrations" JSONB NOT NULL,
    "featureGaps" JSONB NOT NULL,
    "marketShare" TEXT,
    "userBase" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GapOpportunity" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "gapType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "validationEvidence" JSONB NOT NULL,
    "impactPotential" TEXT NOT NULL,
    "effortToAddress" TEXT NOT NULL,
    "competitiveAdvantage" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GapOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFactor" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "evidence" JSONB NOT NULL,
    "probabilityOfFailure" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategicRecommendation" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specificActions" JSONB NOT NULL,
    "refinedICP" JSONB,
    "basedOnGaps" JSONB NOT NULL,
    "expectedOutcome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategicRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationReport" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "verdict" JSONB NOT NULL,
    "marketDemand" JSONB NOT NULL,
    "competition" JSONB NOT NULL,
    "opportunityGaps" JSONB NOT NULL,
    "risks" JSONB NOT NULL,
    "strategicDirection" JSONB NOT NULL,
    "validationPlan" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidationReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "IdeaSubmission_userId_idx" ON "IdeaSubmission"("userId");

-- CreateIndex
CREATE INDEX "IdeaSubmission_status_idx" ON "IdeaSubmission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaAnalysis_submissionId_key" ON "IdeaAnalysis"("submissionId");

-- CreateIndex
CREATE INDEX "IdeaAnalysis_validationScore_idx" ON "IdeaAnalysis"("validationScore");

-- CreateIndex
CREATE INDEX "IdeaAnalysis_verdict_idx" ON "IdeaAnalysis"("verdict");

-- CreateIndex
CREATE INDEX "DemandSignal_analysisId_idx" ON "DemandSignal"("analysisId");

-- CreateIndex
CREATE INDEX "DemandSignal_source_idx" ON "DemandSignal"("source");

-- CreateIndex
CREATE INDEX "Competitor_analysisId_idx" ON "Competitor"("analysisId");

-- CreateIndex
CREATE INDEX "Competitor_type_idx" ON "Competitor"("type");

-- CreateIndex
CREATE INDEX "GapOpportunity_analysisId_idx" ON "GapOpportunity"("analysisId");

-- CreateIndex
CREATE INDEX "GapOpportunity_impactPotential_idx" ON "GapOpportunity"("impactPotential");

-- CreateIndex
CREATE INDEX "RiskFactor_analysisId_idx" ON "RiskFactor"("analysisId");

-- CreateIndex
CREATE INDEX "RiskFactor_severity_idx" ON "RiskFactor"("severity");

-- CreateIndex
CREATE INDEX "StrategicRecommendation_analysisId_idx" ON "StrategicRecommendation"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "ValidationReport_analysisId_key" ON "ValidationReport"("analysisId");

-- CreateIndex
CREATE INDEX "ValidationReport_generatedAt_idx" ON "ValidationReport"("generatedAt");

-- AddForeignKey
ALTER TABLE "IdeaSubmission" ADD CONSTRAINT "IdeaSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdeaAnalysis" ADD CONSTRAINT "IdeaAnalysis_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "IdeaSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandSignal" ADD CONSTRAINT "DemandSignal_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "IdeaAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "IdeaAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GapOpportunity" ADD CONSTRAINT "GapOpportunity_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "IdeaAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFactor" ADD CONSTRAINT "RiskFactor_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "IdeaAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategicRecommendation" ADD CONSTRAINT "StrategicRecommendation_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "IdeaAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationReport" ADD CONSTRAINT "ValidationReport_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "IdeaAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
