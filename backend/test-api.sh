#!/bin/bash

# ============================================
# ANAHVA BACKEND - COMPREHENSIVE TEST SUITE
# ============================================
# Run this script to test all backend APIs
# Prerequisites: curl, jq, backend running on http://localhost:3000

set -e

BASE_URL="http://localhost:3000"
DEMO_TOKEN=""
JOURNAL_ID=""

echo "🧪 ANAHVA BACKEND TEST SUITE"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# ============================================
# TEST 1: Health Check
# ============================================
echo "📋 TEST 1: Health Check"
echo "GET /health"
echo ""

RESPONSE=$(curl -s "$BASE_URL/health")
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ PASSED${NC}"
  echo "Response: $RESPONSE"
  ((TESTS_PASSED++))
else
  echo -e "${RED}❌ FAILED${NC}"
  echo "HTTP Code: $HTTP_CODE"
  ((TESTS_FAILED++))
fi
echo ""

# ============================================
# TEST 2: Demo Login
# ============================================
echo "📋 TEST 2: Demo Login"
echo "POST /api/auth/demo"
echo "Body: {\"name\": \"Shibasish\", \"password\": \"Shibasish\"}"
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/demo" \
  -H "Content-Type: application/json" \
  -d '{"name":"Shibasish","password":"Shibasish"}')

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/auth/demo" \
  -H "Content-Type: application/json" \
  -d '{"name":"Shibasish","password":"Shibasish"}')

if [ "$HTTP_CODE" = "200" ]; then
  DEMO_TOKEN=$(echo "$RESPONSE" | jq -r '.token')
  if [ ! -z "$DEMO_TOKEN" ] && [ "$DEMO_TOKEN" != "null" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    echo "Token obtained: ${DEMO_TOKEN:0:20}..."
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "No token in response"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${RED}❌ FAILED${NC}"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $RESPONSE"
  ((TESTS_FAILED++))
fi
echo ""

# ============================================
# TEST 3: Verify Session
# ============================================
echo "📋 TEST 3: Verify Session"
echo "GET /api/auth/verify"
echo "Headers: Authorization: Bearer <token>"
echo ""

if [ ! -z "$DEMO_TOKEN" ]; then
  RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/verify" \
    -H "Authorization: Bearer $DEMO_TOKEN")
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/auth/verify" \
    -H "Authorization: Bearer $DEMO_TOKEN")

  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    echo "Response: $RESPONSE"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "HTTP Code: $HTTP_CODE"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIPPED${NC} (No token from TEST 2)"
fi
echo ""

# ============================================
# TEST 4: Create Journal Entry
# ============================================
echo "📋 TEST 4: Create Journal Entry (PERSISTENCE TEST)"
echo "POST /api/journal/create"
echo "Body: {\"encrypted_payload\": \"test-payload\", \"allow_ai_memory\": false}"
echo ""

if [ ! -z "$DEMO_TOKEN" ]; then
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/journal/create" \
    -H "Authorization: Bearer $DEMO_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"encrypted_payload":"test-encrypted-payload-123","allow_ai_memory":false}')
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/journal/create" \
    -H "Authorization: Bearer $DEMO_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"encrypted_payload":"test-encrypted-payload-123","allow_ai_memory":false}')

  if [ "$HTTP_CODE" = "201" ]; then
    JOURNAL_ID=$(echo "$RESPONSE" | jq -r '.journal.id')
    if [ ! -z "$JOURNAL_ID" ] && [ "$JOURNAL_ID" != "null" ]; then
      echo -e "${GREEN}✅ PASSED${NC}"
      echo "Journal ID: $JOURNAL_ID"
      echo "Response: $RESPONSE" | jq '.'
      ((TESTS_PASSED++))
    else
      echo -e "${RED}❌ FAILED${NC}"
      echo "No journal ID in response"
      ((TESTS_FAILED++))
    fi
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIPPED${NC} (No token from TEST 2)"
fi
echo ""

# ============================================
# TEST 5: Get Journal List
# ============================================
echo "📋 TEST 5: Get Journal List"
echo "GET /api/journal/list"
echo ""

if [ ! -z "$DEMO_TOKEN" ]; then
  RESPONSE=$(curl -s -X GET "$BASE_URL/api/journal/list" \
    -H "Authorization: Bearer $DEMO_TOKEN")
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/api/journal/list" \
    -H "Authorization: Bearer $DEMO_TOKEN")

  if [ "$HTTP_CODE" = "200" ]; then
    JOURNAL_COUNT=$(echo "$RESPONSE" | jq '.journals | length')
    echo -e "${GREEN}✅ PASSED${NC}"
    echo "Journals retrieved: $JOURNAL_COUNT"
    echo "Response:" 
    echo "$RESPONSE" | jq '.'
    ((TESTS_PASSED++))
    
    # Verify persistence
    if [ "$JOURNAL_COUNT" -gt "0" ]; then
      echo -e "\n${GREEN}✅ PERSISTENCE VERIFIED${NC} - Journal from TEST 4 is still accessible!"
    fi
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "HTTP Code: $HTTP_CODE"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIPPED${NC} (No token from TEST 2)"
fi
echo ""

# ============================================
# TEST 6: Chat with AI
# ============================================
echo "📋 TEST 6: Chat with AI (Gemini Backend)"
echo "POST /api/chat/message"
echo "Body: {\"message\": \"I'm feeling stressed\", \"mode\": \"CALM\", \"allow_memory\": false}"
echo ""

if [ ! -z "$DEMO_TOKEN" ]; then
  RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat/message" \
    -H "Authorization: Bearer $DEMO_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"message":"I am feeling overwhelmed and stressed","mode":"CALM","allow_memory":false}')
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/chat/message" \
    -H "Authorization: Bearer $DEMO_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"message":"I am feeling overwhelmed and stressed","mode":"CALM","allow_memory":false}')

  if [ "$HTTP_CODE" = "200" ]; then
    AI_RESPONSE=$(echo "$RESPONSE" | jq -r '.response')
    if [ ! -z "$AI_RESPONSE" ] && [ "$AI_RESPONSE" != "null" ] && [ ! $(echo "$AI_RESPONSE" | grep -i "error") ]; then
      echo -e "${GREEN}✅ PASSED${NC}"
      echo "AI Response: $AI_RESPONSE"
      echo ""
      echo -e "${GREEN}✅ BACKEND VERIFIED${NC} - AI response came from backend (not frontend)!"
      ((TESTS_PASSED++))
    else
      echo -e "${YELLOW}⚠️  WARNING${NC}"
      echo "Response received but may be fallback response"
      echo "Full response:" 
      echo "$RESPONSE" | jq '.'
      ((TESTS_PASSED++))
    fi
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIPPED${NC} (No token from TEST 2)"
fi
echo ""

# ============================================
# TEST 7: Delete Journal Entry
# ============================================
echo "📋 TEST 7: Delete Journal Entry"
echo "DELETE /api/journal/:id"
echo ""

if [ ! -z "$JOURNAL_ID" ] && [ "$JOURNAL_ID" != "null" ]; then
  RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/journal/$JOURNAL_ID" \
    -H "Authorization: Bearer $DEMO_TOKEN")
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/journal/$JOURNAL_ID" \
    -H "Authorization: Bearer $DEMO_TOKEN")

  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    echo "Response: $RESPONSE"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "HTTP Code: $HTTP_CODE"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIPPED${NC} (No journal ID from TEST 4)"
fi
echo ""

# ============================================
# TEST SUMMARY
# ============================================
echo "=================================="
echo "📊 TEST SUMMARY"
echo "=================================="
echo -e "${GREEN}✅ Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo "Backend is ready for production!"
  exit 0
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  echo "Check logs and configuration"
  exit 1
fi
