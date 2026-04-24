# 🎯 Autonomous Market Validation Platform

A production-grade system that validates startup ideas using real-world behavioral data, providing decision-grade reports with BUILD/PIVOT/KILL verdicts.

## ⚡ Quick Start

```bash
# Start the development server
npm run dev

# Server runs on: http://localhost:3000
# Client runs on: http://localhost:5173
```

## 🧪 Test the API

```bash
# Submit an idea
curl -X POST http://localhost:3000/api/validation/submit \
  -H "Content-Type: application/json" \
  -d '{
    "ideaDescription": "A tool that helps freelance developers track time and generate invoices automatically",
    "targetAudience": "freelance developers, indie hackers",
    "geography": "Global",
    "pricingAssumption": "$19/month",
    "stage": "idea"
  }'

# You'll get back a submissionId - use it for the next steps
# Start analysis (replace <submissionId> with actual ID)
curl -X POST http://localhost:3000/api/validation/<submissionId>/analyze

# Check status
curl http://localhost:3000/api/validation/<submissionId>/status

# Get full report (once status is "completed")
curl http://localhost:3000/api/validation/<submissionId>/report
```

Or run the automated test:
```bash
cd server
node test-validation-api.js
```

## 📊 What It Does

1. **Idea Structuring**: Converts raw input into structured problem statements and target segments
2. **Demand Analysis**: Extracts signals from forums, reviews, search patterns, and content
3. **Competition Analysis**: Identifies competitors and their weaknesses
4. **Intelligent Scoring**: 
   - Demand Score (0-100)
   - Buying Intent Score (0-100)
   - Saturation Index (0-100)
   - **Validation Score (0-100)** - Final metric
5. **Decision Engine**: BUILD (80+) / PIVOT (60-79) / KILL (<60)
6. **Risk Analysis**: Unfiltered assessment of failure probability
7. **Strategic Recommendations**: Evidence-backed pivots and positioning
8. **Validation Plan**: Actionable tests before building

## 🎯 Core Principles

- **Behavioral data > Opinions**
- **Rejection accuracy > Idea approval rate**
- **Evidence-based decisions only**
- **No positive bias** - designed to kill bad ideas early

## 📁 System Architecture

```
server/
├── config/
│   └── dbconnect.js                    # PostgreSQL connection with pooling
├── modules/
│   └── ideaValidation/
│       ├── ideaValidationController.js  # API controllers
│       ├── ideaValidationService.js     # Main orchestrator
│       └── services/
│           ├── ideaStructuringService.js      # Converts raw input
│           ├── demandAnalysisService.js       # Signal extraction
│           ├── competitionAnalysisService.js  # Competitor research
│           ├── scoringEngineService.js        # All scoring algorithms
│           └── reportGeneratorService.js      # Report formatting
├── prisma/
│   └── schema.prisma                    # Complete database schema
└── routes/
    └── validation.routes.js             # API endpoints
```

## 🗄️ Database Schema

**8 Core Models:**
- `IdeaSubmission` - Raw user inputs
- `IdeaAnalysis` - Structured analysis
- `DemandSignal` - Extracted demand signals
- `Competitor` - Competitor data with weaknesses
- `GapOpportunity` - Identified market gaps
- `RiskFactor` - Failure risks
- `StrategicRecommendation` - Actionable recommendations
- `ValidationReport` - Final formatted report

## 📈 Scoring Formulas

### Demand Score
```
(Problem Frequency × Pain Intensity × Recency Weight)
Normalized to 0-100
```

### Saturation Index
```
(Number of Competitors × Market Maturity × Feature Overlap)
0-33: Greenfield | 34-66: Competitive | 67-100: Red Ocean
```

### Validation Score (Final)
```
(Demand Score × Buying Intent Score) ÷ Saturation Index
0-100 scale
```

## 🔌 External Integrations (Production Ready)

The codebase is structured for real data integration:

**Integration Points Mapped:**
- Reddit API (demand signals)
- Google Trends (search patterns)
- ProductHunt API (competitor discovery)
- G2/Capterra (review analysis)
- YouTube/Medium APIs (content demand)

Each service file includes detailed **IMPLEMENTATION NOTES** showing exactly how to integrate real APIs.

## 📚 Full Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for:
- Complete API reference
- Request/response examples
- Integration guides
- Production deployment notes

## 🚀 Production Considerations

**Current State:** Fully functional with simulated data extraction

**For Production:**
1. ✅ Database schema - Production ready
2. ✅ API architecture - Production ready
3. ✅ Scoring algorithms - Production ready
4. ✅ Report generation - Production ready
5. 🔄 Data extraction - Needs real API integration
6. 🔄 Job queue - Add Bull/BullMQ for async processing
7. 🔄 Caching - Add Redis for performance
8. 🔄 Auth - Add authentication middleware
9. 🔄 Monitoring - Add Sentry/DataDog

## 🛠️ Tech Stack

- **Backend:** Node.js, Express (ES Modules)
- **Database:** PostgreSQL with Prisma ORM
- **Connection:** PostgreSQL adapter with pooling
- **Architecture:** Service-oriented with orchestration pattern

## 📝 Example Report Output

```
=================================
📊 MARKET VALIDATION REPORT
=================================

1️⃣  VERDICT
Decision: ⚠️ PIVOT
Validation Score: 67/100
Confidence: MEDIUM

2️⃣  MARKET DEMAND
Demand Score: 72/100
Strong demand signals detected
Top Problems: [Evidence-backed list]

3️⃣  COMPETITION
Saturation: COMPETITIVE - Medium
Key Players: [With weaknesses identified]

4️⃣  OPPORTUNITY GAPS
High Impact Gaps: 2
[Validated gaps with evidence]

5️⃣  RISKS
Overall Risk: MEDIUM
[Unfiltered risk analysis]

6️⃣  STRATEGIC DIRECTION
[Specific, actionable recommendations]

7️⃣  VALIDATION PLAN
Test: MVP Pre-sale
Timeline: 2-4 weeks
Success Metrics: [Clear metrics]
```

## 🎓 Design Philosophy

This system follows a **behavioral data-first** approach:

1. **No assumptions allowed** - Everything must be validated by signals
2. **Pessimistic by design** - Better to reject good ideas than approve bad ones
3. **Actionable outputs only** - All recommendations must be specific and testable
4. **Evidence-based scoring** - All numbers derived from observed patterns

## 🤝 Contributing

The codebase is designed for easy extension:

- Add new signal sources in `demandAnalysisService.js`
- Extend scoring logic in `scoringEngineService.js`
- Customize report format in `reportGeneratorService.js`
- Add new risk factors in scoring engine

## 📄 License

ISC

---

**Built to confidently kill bad ideas and find real opportunities.**
  "responseData": {
    "result": {
      // Your data here
    }
  }
}
```

### Response Codes
- **1000-1099**: Success responses
- **2000-2099**: Client errors (validation, not found)
- **3000-3099**: Server errors
- **4000-4099**: Authentication/Authorization errors

### ApiResponse Utility
```javascript
const ApiResponse = require('./utility/ApiResponse');

// Success
return ApiResponse(res, 'SUCCESS', data);

// Error
return ApiResponse(res, 'NOT_FOUND');
```

### Module Generator CLI
Automatically generate new modules with MVC pattern:
```bash
cd server && npm run generate:module
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install root dependencies:**
   ```bash
   npm install
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure database:**
   
   **Option A: Local Prisma Postgres (Recommended)**
   ```bash
   cd server
   npx prisma dev
   ```
   
   **Option B: Custom Database**
   - Copy `server/.env.example` to `server/.env`
   - Update `DATABASE_URL` with your connection string
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   ```

4. **Run database migrations:**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma Client:**
   ```bash
   cd server
   npx prisma generate
   ```

## 🚦 Running the Application

### Development Mode
Start both frontend and backend simultaneously:
```bash
npm run dev
```

This runs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

### Individual Services

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

### Production Build
```bash
npm run build
npm run preview
```

## 🗄️ Database

### View Database
Open Prisma Studio to view/edit data:
```bash
cd server
npx prisma studio
```

### Common Prisma Commands
```bash
npx prisma migrate dev       # Create & apply migration
npx prisma generate          # Regenerate Prisma Client
npx prisma db push           # Push schema without migration
npx prisma db pull           # Pull schema from database
npx prisma migrate reset     # Reset database
```

## 📝 Environment Variables

### Server (`server/.env`)
```env
PORT=3000
DATABASE_URL="your_database_connection_string"
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express server only |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

**Server Scripts:**
| Command | Description |
|---------|-------------|
| `cd server && npm run generate:module` | Generate new module with CLI |

## 🎨 Development Workflow

### 1. Generate a New Module
```bash
cd server
npm run generate:module
# Follow prompts to create controller, service, and routes
```

### 2. Define Database Model
Edit `server/prisma/schema.prisma`:
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. Apply Migration
```bash
cd server
npx prisma migrate dev --name add_product
npx prisma generate
```

### 4. Use Standardized Responses
All controllers automatically use `ApiResponse`:
```javascript
const ApiResponse = require('../../utility/ApiResponse');

// In controller
return ApiResponse(res, 'SUCCESS', data);
return ApiResponse(res, 'NOT_FOUND');
return ApiResponse(res, 'CREATED', newItem);
```

### 5. Frontend API Calls
```javascript
import { exampleApi } from './api';

// Fetch data
const result = await exampleApi.getAll();
if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Error:', result.message);
}
```

## 📚 Documentation

- **[CODING_STANDARDS.txt](server/CODING_STANDARDS.txt)** - Complete coding standards and conventions
- **[QUICK_REFERENCE.md](server/QUICK_REFERENCE.md)** - Quick reference for common patterns
- **[MODULE-GENERATOR.md](server/MODULE-GENERATOR.md)** - Module generator usage guide

## 🎯 Coding Standards

This project follows strict coding standards. Key points:

- **Response Format**: All API responses use standardized format with response codes 1000+
- **MVC Pattern**: Services handle logic, controllers handle HTTP
- **Naming**: camelCase for variables, PascalCase for classes, UPPER_SNAKE_CASE for constants
- **Error Handling**: Services return `{ success, data/error }`, controllers use `ApiResponse`
- **Documentation**: JSDoc comments for all public functions

**See [CODING_STANDARDS.txt](server/CODING_STANDARDS.txt) for complete guidelines.**

## 🔍 API Response Format

All endpoints return responses in this format:
```json
{
  "responseCode": 1000,
  "responseMessage": "Success",
  "responseData": {
    "result": {
      "id": "123",
      "name": "Example"
    }
  }
}
```

**Response Codes:**
- `1000-1099`: Success
- `2000-2099`: Client errors
- `3000-3099`: Server errors
- `4000-4099`: Auth errors
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📄 License

ISC
