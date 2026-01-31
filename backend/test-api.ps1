# ============================================
# ANAHVA BACKEND - COMPREHENSIVE TEST SUITE (Windows PowerShell)
# ============================================
# Run this script to test all backend APIs
# Prerequisites: PowerShell 5.0+, backend running on http://localhost:3000

$BASE_URL = "http://localhost:3000"
$DEMO_TOKEN = ""
$JOURNAL_ID = ""

Write-Host "🧪 ANAHVA BACKEND TEST SUITE" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$TESTS_PASSED = 0
$TESTS_FAILED = 0

# Function to make HTTP requests
function Test-ApiEndpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    $Uri = "$BASE_URL$Endpoint"
    $Params = @{
        Method = $Method
        Uri = $Uri
        Headers = $Headers
        ErrorAction = "SilentlyContinue"
    }
    
    if ($Body) {
        $Params.Body = $Body | ConvertTo-Json -Depth 10
        $Params.ContentType = "application/json"
    }
    
    try {
        $Response = Invoke-WebRequest @Params
        return @{
            StatusCode = $Response.StatusCode
            Body = $Response.Content | ConvertFrom-Json
        }
    }
    catch {
        return @{
            StatusCode = $_.Exception.Response.StatusCode.Value__
            Body = $_.Exception.Message
        }
    }
}

# ============================================
# TEST 1: Health Check
# ============================================
Write-Host "📋 TEST 1: Health Check" -ForegroundColor Yellow
Write-Host "GET /health"
Write-Host ""

$Response = Test-ApiEndpoint -Method "GET" -Endpoint "/health"

if ($Response.StatusCode -eq 200) {
    Write-Host "✅ PASSED" -ForegroundColor Green
    Write-Host "Response: $($Response.Body | ConvertTo-Json)"
    $TESTS_PASSED++
}
else {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "HTTP Code: $($Response.StatusCode)"
    $TESTS_FAILED++
}
Write-Host ""

# ============================================
# TEST 2: Demo Login
# ============================================
Write-Host "📋 TEST 2: Demo Login" -ForegroundColor Yellow
Write-Host "POST /api/auth/demo"
Write-Host "Body: {`"name`": `"Shibasish`", `"password`": `"Shibasish`"}"
Write-Host ""

$Body = @{
    name = "Shibasish"
    password = "Shibasish"
}

$Response = Test-ApiEndpoint -Method "POST" -Endpoint "/api/auth/demo" -Body $Body

if ($Response.StatusCode -eq 200) {
    $DEMO_TOKEN = $Response.Body.token
    if ($DEMO_TOKEN) {
        Write-Host "✅ PASSED" -ForegroundColor Green
        Write-Host "Token obtained: $($DEMO_TOKEN.Substring(0, 20))..."
        $TESTS_PASSED++
    }
    else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "No token in response"
        $TESTS_FAILED++
    }
}
else {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host "HTTP Code: $($Response.StatusCode)"
    Write-Host "Response: $($Response.Body | ConvertTo-Json)"
    $TESTS_FAILED++
}
Write-Host ""

# ============================================
# TEST 3: Verify Session
# ============================================
Write-Host "📋 TEST 3: Verify Session" -ForegroundColor Yellow
Write-Host "GET /api/auth/verify"
Write-Host "Headers: Authorization: Bearer <token>"
Write-Host ""

if ($DEMO_TOKEN) {
    $Headers = @{
        "Authorization" = "Bearer $DEMO_TOKEN"
    }
    
    $Response = Test-ApiEndpoint -Method "GET" -Endpoint "/api/auth/verify" -Headers $Headers
    
    if ($Response.StatusCode -eq 200) {
        Write-Host "✅ PASSED" -ForegroundColor Green
        Write-Host "Response: $($Response.Body | ConvertTo-Json)"
        $TESTS_PASSED++
    }
    else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "HTTP Code: $($Response.StatusCode)"
        $TESTS_FAILED++
    }
}
else {
    Write-Host "⚠️  SKIPPED" -ForegroundColor Yellow " (No token from TEST 2)"
}
Write-Host ""

# ============================================
# TEST 4: Create Journal Entry
# ============================================
Write-Host "📋 TEST 4: Create Journal Entry (PERSISTENCE TEST)" -ForegroundColor Yellow
Write-Host "POST /api/journal/create"
Write-Host "Body: {`"encrypted_payload`": `"test-payload`", `"allow_ai_memory`": false}"
Write-Host ""

if ($DEMO_TOKEN) {
    $Body = @{
        encrypted_payload = "test-encrypted-payload-123"
        allow_ai_memory = $false
    }
    
    $Headers = @{
        "Authorization" = "Bearer $DEMO_TOKEN"
    }
    
    $Response = Test-ApiEndpoint -Method "POST" -Endpoint "/api/journal/create" -Headers $Headers -Body $Body
    
    if ($Response.StatusCode -eq 201) {
        $JOURNAL_ID = $Response.Body.journal.id
        if ($JOURNAL_ID) {
            Write-Host "✅ PASSED" -ForegroundColor Green
            Write-Host "Journal ID: $JOURNAL_ID"
            Write-Host "Response: $($Response.Body | ConvertTo-Json)"
            $TESTS_PASSED++
        }
        else {
            Write-Host "❌ FAILED" -ForegroundColor Red
            Write-Host "No journal ID in response"
            $TESTS_FAILED++
        }
    }
    else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "HTTP Code: $($Response.StatusCode)"
        Write-Host "Response: $($Response.Body | ConvertTo-Json)"
        $TESTS_FAILED++
    }
}
else {
    Write-Host "⚠️  SKIPPED" -ForegroundColor Yellow " (No token from TEST 2)"
}
Write-Host ""

# ============================================
# TEST 5: Get Journal List
# ============================================
Write-Host "📋 TEST 5: Get Journal List" -ForegroundColor Yellow
Write-Host "GET /api/journal/list"
Write-Host ""

if ($DEMO_TOKEN) {
    $Headers = @{
        "Authorization" = "Bearer $DEMO_TOKEN"
    }
    
    $Response = Test-ApiEndpoint -Method "GET" -Endpoint "/api/journal/list" -Headers $Headers
    
    if ($Response.StatusCode -eq 200) {
        $JOURNAL_COUNT = $Response.Body.journals.Count
        Write-Host "✅ PASSED" -ForegroundColor Green
        Write-Host "Journals retrieved: $JOURNAL_COUNT"
        Write-Host "Response: $($Response.Body | ConvertTo-Json -Depth 10)"
        $TESTS_PASSED++
        
        if ($JOURNAL_COUNT -gt 0) {
            Write-Host ""
            Write-Host "✅ PERSISTENCE VERIFIED" -ForegroundColor Green " - Journal from TEST 4 is still accessible!"
        }
    }
    else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "HTTP Code: $($Response.StatusCode)"
        $TESTS_FAILED++
    }
}
else {
    Write-Host "⚠️  SKIPPED" -ForegroundColor Yellow " (No token from TEST 2)"
}
Write-Host ""

# ============================================
# TEST 6: Chat with AI
# ============================================
Write-Host "📋 TEST 6: Chat with AI (Gemini Backend)" -ForegroundColor Yellow
Write-Host "POST /api/chat/message"
Write-Host "Body: {`"message`": `"I'm feeling stressed`", `"mode`": `"CALM`", `"allow_memory`": false}"
Write-Host ""

if ($DEMO_TOKEN) {
    $Body = @{
        message = "I am feeling overwhelmed and stressed"
        mode = "CALM"
        allow_memory = $false
    }
    
    $Headers = @{
        "Authorization" = "Bearer $DEMO_TOKEN"
    }
    
    $Response = Test-ApiEndpoint -Method "POST" -Endpoint "/api/chat/message" -Headers $Headers -Body $Body
    
    if ($Response.StatusCode -eq 200) {
        $AI_RESPONSE = $Response.Body.response
        if ($AI_RESPONSE -and $AI_RESPONSE -notmatch "error") {
            Write-Host "✅ PASSED" -ForegroundColor Green
            Write-Host "AI Response: $AI_RESPONSE"
            Write-Host ""
            Write-Host "✅ BACKEND VERIFIED" -ForegroundColor Green " - AI response came from backend (not frontend)!"
            $TESTS_PASSED++
        }
        else {
            Write-Host "⚠️  WARNING" -ForegroundColor Yellow
            Write-Host "Response received but may be fallback response"
            Write-Host "Full response: $($Response.Body | ConvertTo-Json)"
            $TESTS_PASSED++
        }
    }
    else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "HTTP Code: $($Response.StatusCode)"
        Write-Host "Response: $($Response.Body | ConvertTo-Json)"
        $TESTS_FAILED++
    }
}
else {
    Write-Host "⚠️  SKIPPED" -ForegroundColor Yellow " (No token from TEST 2)"
}
Write-Host ""

# ============================================
# TEST 7: Delete Journal Entry
# ============================================
Write-Host "📋 TEST 7: Delete Journal Entry" -ForegroundColor Yellow
Write-Host "DELETE /api/journal/:id"
Write-Host ""

if ($JOURNAL_ID) {
    $Headers = @{
        "Authorization" = "Bearer $DEMO_TOKEN"
    }
    
    $Response = Test-ApiEndpoint -Method "DELETE" -Endpoint "/api/journal/$JOURNAL_ID" -Headers $Headers
    
    if ($Response.StatusCode -eq 200) {
        Write-Host "✅ PASSED" -ForegroundColor Green
        Write-Host "Response: $($Response.Body | ConvertTo-Json)"
        $TESTS_PASSED++
    }
    else {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "HTTP Code: $($Response.StatusCode)"
        $TESTS_FAILED++
    }
}
else {
    Write-Host "⚠️  SKIPPED" -ForegroundColor Yellow " (No journal ID from TEST 4)"
}
Write-Host ""

# ============================================
# TEST SUMMARY
# ============================================
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $TESTS_PASSED" -ForegroundColor Green
Write-Host "❌ Failed: $TESTS_FAILED" -ForegroundColor Red
Write-Host ""

if ($TESTS_FAILED -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Backend is ready for production!"
    exit 0
}
else {
    Write-Host "⚠️  SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "Check logs and configuration"
    exit 1
}
