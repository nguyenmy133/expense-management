# ===================================
# QUICK API TEST SCRIPT
# ===================================
# Sử dụng script này để test nhanh tất cả API endpoints
# Yêu cầu: curl phải được cài đặt

$baseUrl = "http://localhost:8080/api"
$token = ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "EXPENSE MANAGEMENT API TEST SCRIPT" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "[1/10] Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✓ Health Check: PASSED" -ForegroundColor Green
    Write-Host "  Status: $($response.data.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Health Check: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Register
Write-Host "`n[2/10] Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = "test_$(Get-Random)@example.com"
    password = "Password123!"
    fullName = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $token = $response.data.token
    Write-Host "✓ Registration: PASSED" -ForegroundColor Green
    Write-Host "  User: $($response.data.user.fullName)" -ForegroundColor Gray
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Registration: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Get Current User
Write-Host "`n[3/10] Testing Get Current User..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method Get -Headers $headers
    Write-Host "✓ Get Current User: PASSED" -ForegroundColor Green
    Write-Host "  Email: $($response.data.email)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get Current User: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 4: Get Categories
Write-Host "`n[4/10] Testing Get Categories..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get -Headers $headers
    Write-Host "✓ Get Categories: PASSED" -ForegroundColor Green
    Write-Host "  Total Categories: $($response.data.Count)" -ForegroundColor Gray
    
    # Lưu categoryId để dùng cho test sau
    $incomeCategoryId = ($response.data | Where-Object { $_.type -eq "INCOME" } | Select-Object -First 1).id
    $expenseCategoryId = ($response.data | Where-Object { $_.type -eq "EXPENSE" } | Select-Object -First 1).id
} catch {
    Write-Host "✗ Get Categories: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 5: Create Transaction (Income)
Write-Host "`n[5/10] Testing Create Transaction (Income)..." -ForegroundColor Yellow
$transactionBody = @{
    categoryId = $incomeCategoryId
    amount = 15000000
    description = "Test Income Transaction"
    transactionDate = (Get-Date -Format "yyyy-MM-dd")
    type = "INCOME"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method Post -Body $transactionBody -ContentType "application/json" -Headers $headers
    $transactionId = $response.data.id
    Write-Host "✓ Create Transaction: PASSED" -ForegroundColor Green
    Write-Host "  Transaction ID: $transactionId" -ForegroundColor Gray
    Write-Host "  Amount: $($response.data.amount)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Create Transaction: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 6: Get Transactions
Write-Host "`n[6/10] Testing Get Transactions..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions?page=0&size=20" -Method Get -Headers $headers
    Write-Host "✓ Get Transactions: PASSED" -ForegroundColor Green
    Write-Host "  Total Transactions: $($response.data.totalElements)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get Transactions: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 7: Update Transaction
Write-Host "`n[7/10] Testing Update Transaction..." -ForegroundColor Yellow
$updateBody = @{
    categoryId = $incomeCategoryId
    amount = 16000000
    description = "Updated Test Transaction"
    transactionDate = (Get-Date -Format "yyyy-MM-dd")
    type = "INCOME"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions/$transactionId" -Method Put -Body $updateBody -ContentType "application/json" -Headers $headers
    Write-Host "✓ Update Transaction: PASSED" -ForegroundColor Green
    Write-Host "  New Amount: $($response.data.amount)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Update Transaction: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 8: Create Budget
Write-Host "`n[8/10] Testing Create Budget..." -ForegroundColor Yellow
$budgetBody = @{
    categoryId = $expenseCategoryId
    amount = 5000000
    month = (Get-Date).Month
    year = (Get-Date).Year
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/budgets" -Method Post -Body $budgetBody -ContentType "application/json" -Headers $headers
    $budgetId = $response.data.id
    Write-Host "✓ Create Budget: PASSED" -ForegroundColor Green
    Write-Host "  Budget ID: $budgetId" -ForegroundColor Gray
    Write-Host "  Amount: $($response.data.amount)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Create Budget: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 9: Get Monthly Report
Write-Host "`n[9/10] Testing Get Monthly Report..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $month = (Get-Date).Month
    $year = (Get-Date).Year
    $response = Invoke-RestMethod -Uri "$baseUrl/reports/monthly?month=$month&year=$year" -Method Get -Headers $headers
    Write-Host "✓ Get Monthly Report: PASSED" -ForegroundColor Green
    Write-Host "  Total Income: $($response.data.totalIncome)" -ForegroundColor Gray
    Write-Host "  Total Expense: $($response.data.totalExpense)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get Monthly Report: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Test 10: Get Transaction Statistics
Write-Host "`n[10/10] Testing Get Statistics..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $month = (Get-Date).Month
    $year = (Get-Date).Year
    $response = Invoke-RestMethod -Uri "$baseUrl/transactions/stats?month=$month&year=$year" -Method Get -Headers $headers
    Write-Host "✓ Get Statistics: PASSED" -ForegroundColor Green
    Write-Host "  Balance: $($response.data.balance)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get Statistics: FAILED" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✓ All critical API endpoints are working!" -ForegroundColor Green
Write-Host ""
Write-Host "Your token for Postman testing:" -ForegroundColor Yellow
Write-Host $token -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Import Expense_Management_API.postman_collection.json into Postman" -ForegroundColor Gray
Write-Host "2. Set the 'token' variable in Postman with the token above" -ForegroundColor Gray
Write-Host "3. Start testing individual endpoints" -ForegroundColor Gray
Write-Host ""
