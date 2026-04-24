# 🚀 Quick Setup Guide

## Prerequisites

1. **Node.js** v18+ installed
2. **PostgreSQL** database running
3. **npm** or **yarn** package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Database

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/market_validation"
PORT=3000
```

Replace `username`, `password` with your PostgreSQL credentials.

## Step 3: Setup Database

```bash
cd server
npx prisma generate
npx prisma db push
```

This will:
- Generate the Prisma client
- Create all database tables

## Step 4: Start Development Server

```bash
# From the root directory
npm run dev
```

The server will start on `http://localhost:3000`

## Step 5: Test the API

### Option A: Using curl

```bash
# Submit an idea
curl -X POST http://localhost:3000/api/validation/submit \
  -H "Content-Type: application/json" \
  -d '{
    "ideaDescription": "Your idea here...",
    "targetAudience": "your target audience",
    "geography": "Global",
    "pricingAssumption": "$29/month",
    "stage": "idea"
  }'

# Save the submissionId from the response, then:

# Start analysis
curl -X POST http://localhost:3000/api/validation/<submissionId>/analyze

# Check status
curl http://localhost:3000/api/validation/<submissionId>/status

# Get report (when status is "completed")
curl http://localhost:3000/api/validation/<submissionId>/report
```

### Option B: Using the test script

```bash
cd server
node test-validation-api.js
```

This will run a complete validation flow and display the results.

## 📊 Understanding the Output

The validation report includes:

1. **Verdict**: BUILD / PIVOT / KILL decision
2. **Validation Score**: 0-100 (80+ = Strong Build Signal)
3. **Market Demand**: Evidence of actual demand
4. **Competition Analysis**: Saturation level and key players
5. **Opportunity Gaps**: Validated market gaps
6. **Risks**: Critical and unfiltered risk assessment
7. **Strategic Direction**: Actionable recommendations
8. **Validation Plan**: Real-world test to run before building

## 🔧 Troubleshooting

### Database Connection Error

Make sure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Port Already in Use

Change the port in `server/.env`:
```env
PORT=3001
```

### Prisma Client Not Generated

```bash
cd server
npx prisma generate
```

## 📚 Next Steps

1. Review the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
2. Check the [README.md](./README.md) for system architecture
3. Explore the code in `server/modules/ideaValidation/` to understand the flow
4. Integrate real data sources (see implementation notes in service files)

## 🎯 Production Deployment

For production deployment:

1. Set up a production PostgreSQL database
2. Configure environment variables
3. Add job queue (Bull/BullMQ) for async processing
4. Add Redis for caching
5. Implement authentication middleware
6. Set up monitoring (Sentry, DataDog)
7. Configure CORS properly
8. Add rate limiting
9. Integrate real data APIs (Reddit, Google Trends, etc.)
10. Deploy to your preferred platform (Railway, Render, AWS, etc.)

---

**Need help?** Check the documentation or open an issue.
