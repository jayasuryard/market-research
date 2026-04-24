# Market Validation & Opportunity Intelligence Platform

An autonomous system that validates startup ideas using real-world behavioral data signals and provides decision-grade reports.

## 🎯 Core Principle

**Behavioral data > Opinions**  
**Rejection accuracy > Idea approval rate**

The system is designed to confidently kill bad ideas early and identify real opportunities hidden in noise.

---

## 📊 Features

- **Autonomous Analysis**: Input an idea, get a data-backed verdict
- **Multi-Source Signal Extraction**: Analyzes demand from forums, reviews, search patterns, and content
- **Intelligent Scoring**: Demand Score, Buying Intent, Saturation Index, and final Validation Score
- **Decision Engine**: Provides BUILD/PIVOT/KILL verdicts based on validation metrics
- **Risk Analysis**: Unfiltered, critical assessment of why ideas may fail
- **Strategic Recommendations**: Evidence-backed pivots and positioning strategies
- **Validation Plans**: Actionable tests to validate before building

---

## 🚀 API Endpoints

### 1. Submit Idea for Validation

**POST** `/api/validation/submit`

Submit a new idea for market validation.

**Request Body:**
```json
{
  "ideaDescription": "A tool that helps developers...",
  "targetAudience": "indie developers, small dev teams", // optional
  "geography": "US, Canada", // optional
  "pricingAssumption": "$29/month", // optional
  "stage": "idea" // idea | mvp | live
}
```

**Response:**
```json
{
  "code": 1001,
  "message": "Created successfully",
  "data": {
    "submissionId": "clxxx...",
    "status": "clarification_needed",
    "questions": [
      {
        "id": "target_audience",
        "question": "Who is your primary target audience?",
        "type": "text"
      }
    ]
  }
}
```

---

### 2. Provide Clarification

**POST** `/api/validation/:id/clarify`

Answer clarification questions (max 5 questions).

**Request Body:**
```json
{
  "answers": [
    {
      "id": "target_audience",
      "answer": "B2B SaaS founders with less than 10 employees"
    }
  ]
}
```

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "submissionId": "clxxx...",
    "status": "ready_for_analysis",
    "message": "Clarification received. Ready for analysis."
  }
}
```

---

### 3. Start Analysis

**POST** `/api/validation/:id/analyze`

Trigger the full market validation analysis.

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "submissionId": "clxxx...",
    "status": "processing",
    "message": "Analysis started. This may take a few minutes."
  }
}
```

---

### 4. Check Analysis Status

**GET** `/api/validation/:id/status`

Check the current status of the analysis.

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "submissionId": "clxxx...",
    "status": "completed",
    "analysis": {
      "validationScore": 67,
      "verdict": "PIVOT"
    }
  }
}
```

**Status Values:**
- `pending` - Waiting to start
- `clarification_needed` - Requires user input
- `ready_for_analysis` - Ready to analyze
- `processing` - Analysis in progress
- `completed` - Analysis done
- `failed` - Analysis failed

---

### 5. Get Validation Report

**GET** `/api/validation/:id/report`

Retrieve the complete validation report.

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": {
    "verdict": {
      "decision": "⚠️ PIVOT",
      "validationScore": 67,
      "confidenceLevel": "MEDIUM",
      "reasoning": "Market shows interest but requires strategic refinement...",
      "scoreBreakdown": {
        "demandScore": 72,
        "buyingIntentScore": 65,
        "saturationIndex": 58
      }
    },
    "marketDemand": {
      "demandScore": 72,
      "interpretation": "Strong demand signals detected",
      "topProblems": [
        {
          "rank": 1,
          "problem": "...",
          "frequency": 145,
          "painIntensity": 8.5,
          "sources": ["reddit", "reviews"],
          "evidencePatterns": [...]
        }
      ],
      "totalSignalsAnalyzed": 23
    },
    "competition": {
      "keyPlayers": [...],
      "totalCompetitors": 8,
      "saturationLevel": "COMPETITIVE - Medium Saturation",
      "saturationIndex": 58,
      "marketAnalysis": "..."
    },
    "opportunityGaps": {
      "totalGapsIdentified": 5,
      "highImpactGaps": 2,
      "opportunityGaps": [...]
    },
    "risks": {
      "overallRiskLevel": "MEDIUM",
      "totalRisks": 3,
      "risks": [...]
    },
    "strategicDirection": {
      "recommendation": "...",
      "refinedApproach": {...},
      "specificActions": [...]
    },
    "validationPlan": {
      "test": {...},
      "successMetrics": {...},
      "timeline": "3-4 weeks"
    }
  }
}
```

---

### 6. Get User Submissions

**GET** `/api/validation/user/:userId`

Get all validation submissions for a user.

**Response:**
```json
{
  "code": 1000,
  "message": "Success",
  "data": [
    {
      "id": "clxxx...",
      "ideaDescription": "...",
      "stage": "idea",
      "status": "completed",
      "createdAt": "2024-04-20T10:30:00Z",
      "analysis": {
        "validationScore": 67,
        "verdict": "PIVOT"
      }
    }
  ]
}
```

---

## 📈 Scoring System

### Validation Score (0-100)

**Formula:** `(Demand Score × Buying Intent Score) ÷ Saturation Index (normalized)`

**Interpretation:**
- **80-100**: STRONG BUILD SIGNAL
- **60-79**: BUILD WITH NICHE/PIVOT
- **40-59**: HIGH RISK
- **0-39**: DO NOT BUILD

### Demand Score (0-100)

**Formula:** `(Problem Frequency × Pain Intensity × Recency Weight)`

Measures actual market demand based on discussion volume, pain intensity, and recency.

### Buying Intent Score (0-100)

Measures readiness to purchase based on "looking for tool", comparison queries, and switching signals.

### Saturation Index (0-100)

**Formula:** `(Number of Competitors × Market Maturity × Feature Overlap)`

**Classification:**
- **0-33**: Greenfield (Low saturation)
- **34-66**: Competitive (Medium saturation)
- **67-100**: Red Ocean (High saturation)

---

## 🔧 Setup & Installation

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd server
npm install
```

2. **Configure database:**

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/market_validation"
PORT=3000
```

3. **Run database migrations:**
```bash
npx prisma generate
npx prisma db push
```

4. **Start server:**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## 🧪 Testing the API

### Example: Complete Flow

```bash
# 1. Submit idea
curl -X POST http://localhost:3000/api/validation/submit \
  -H "Content-Type: application/json" \
  -d '{
    "ideaDescription": "A tool that helps indie developers track time spent on different projects and automatically generate invoices",
    "targetAudience": "freelance developers, indie hackers",
    "geography": "Global",
    "pricingAssumption": "$19/month",
    "stage": "idea"
  }'

# Response: {"data": {"submissionId": "clxxx...", "status": "ready_for_analysis"}}

# 2. Start analysis
curl -X POST http://localhost:3000/api/validation/clxxx.../analyze

# 3. Check status (wait a minute)
curl http://localhost:3000/api/validation/clxxx.../status

# 4. Get report (once completed)
curl http://localhost:3000/api/validation/clxxx.../report
```

---

## 📁 Project Structure

```
server/
├── config/
│   └── dbconnect.js              # Database connection with PG adapter
├── modules/
│   └── ideaValidation/
│       ├── ideaValidationController.js
│       ├── ideaValidationService.js
│       └── services/
│           ├── ideaStructuringService.js
│           ├── demandAnalysisService.js
│           ├── competitionAnalysisService.js
│           ├── scoringEngineService.js
│           └── reportGeneratorService.js
├── prisma/
│   └── schema.prisma            # Database schema
├── routes/
│   ├── index.js
│   └── validation.routes.js
└── server.js
```

---

## 🔌 External Data Integration (Production)

The current implementation includes **simulation** of data extraction. For production:

### Required Integrations:

1. **Reddit API** - Extract discussion signals
2. **Google Trends API** - Search pattern analysis
3. **ProductHunt API** - Competitor discovery
4. **Review Platforms** (G2, Capterra, Trustpilot) - Scraping weakness signals
5. **YouTube/Medium APIs** - Content demand analysis

### Data Sources Mapped:

- `demandAnalysisService.js` - Contains integration points for:
  - Reddit signals
  - Review analysis
  - Search patterns
  - Content demand

- `competitionAnalysisService.js` - Contains integration points for:
  - ProductHunt
  - Crunchbase
  - G2/Capterra

Each method includes **IMPLEMENTATION NOTES** showing exactly what real integration would look like.

---

## ⚠️ Important Notes

### Design Principles

1. **No Positive Bias**: System is biased toward rejecting weak ideas
2. **Evidence-Based**: Every conclusion backed by observed patterns
3. **No Generic Statements**: All outputs specific and actionable
4. **Behavioral Data Priority**: User actions > User opinions

### Current Limitations

- Demand signal extraction is simulated (see integration notes above)
- NLP for problem extraction is basic (use proper NLP in production)
- Competitor discovery is simulated (integrate real APIs)

### Production Recommendations

1. Implement job queue (Bull, BullMQ) for async processing
2. Add caching layer (Redis) for expensive operations
3. Implement rate limiting for external API calls
4. Add authentication/authorization middleware
5. Set up monitoring and logging (Sentry, DataDog)
6. Implement webhook notifications for completed analyses

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a production-grade architecture ready for:
- External API integrations
- Advanced NLP capabilities
- Machine learning models for better scoring
- Real-time data processing

Contributions welcome!
