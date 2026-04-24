#!/bin/bash

# Market Validation API Test Script
# Quick curl-based test of the validation endpoints

API_BASE="http://localhost:3000/api/validation"

echo "🚀 Market Validation API Test"
echo "=============================="
echo ""

# Step 1: Submit idea
echo "1️⃣  Submitting idea..."
RESPONSE=$(curl -s -X POST "$API_BASE/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "ideaDescription": "A tool that helps freelance developers track time spent on client projects and automatically generate professional invoices based on hourly rates. Also includes expense tracking and project profitability analysis.",
    "targetAudience": "freelance developers, indie hackers, solo consultants",
    "geography": "Global, primarily US and Europe",
    "pricingAssumption": "$19/month for individuals, $49/month for teams",
    "stage": "idea"
  }')

echo "Response: $RESPONSE"
echo ""

# Extract submission ID (requires jq)
if command -v jq &> /dev/null; then
  SUBMISSION_ID=$(echo $RESPONSE | jq -r '.data.submissionId')
  STATUS=$(echo $RESPONSE | jq -r '.data.status')
  
  echo "✅ Submission ID: $SUBMISSION_ID"
  echo "📊 Status: $STATUS"
  echo ""
  
  # Step 2: Start analysis
  echo "2️⃣  Starting analysis..."
  curl -s -X POST "$API_BASE/$SUBMISSION_ID/analyze" | jq '.'
  echo ""
  
  # Step 3: Wait and check status
  echo "3️⃣  Waiting for analysis (checking every 3 seconds)..."
  for i in {1..20}; do
    sleep 3
    STATUS_RESPONSE=$(curl -s "$API_BASE/$SUBMISSION_ID/status")
    CURRENT_STATUS=$(echo $STATUS_RESPONSE | jq -r '.data.status')
    echo "   Check $i: $CURRENT_STATUS"
    
    if [ "$CURRENT_STATUS" = "completed" ]; then
      echo ""
      echo "✅ Analysis completed!"
      echo ""
      
      # Step 4: Get report
      echo "4️⃣  Fetching validation report..."
      curl -s "$API_BASE/$SUBMISSION_ID/report" | jq '.'
      echo ""
      echo "=============================="
      echo "✅ Test Complete!"
      exit 0
    fi
    
    if [ "$CURRENT_STATUS" = "failed" ]; then
      echo ""
      echo "❌ Analysis failed"
      exit 1
    fi
  done
  
  echo ""
  echo "⏱️  Analysis still processing. Check manually:"
  echo "   curl $API_BASE/$SUBMISSION_ID/status"
  echo "   curl $API_BASE/$SUBMISSION_ID/report"
  
else
  echo "⚠️  jq not installed. Install with: brew install jq"
  echo ""
  echo "Manual steps:"
  echo "Extract submissionId from above response, then:"
  echo "  curl -X POST $API_BASE/<submissionId>/analyze"
  echo "  curl $API_BASE/<submissionId>/status"
  echo "  curl $API_BASE/<submissionId>/report"
fi
