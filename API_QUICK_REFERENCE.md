# 📋 API ENDPOINTS QUICK REFERENCE

## Base URL
```
http://localhost:8080/api
```

## 🔓 Public Endpoints (Không cần Authentication)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/health` | Health check | - |
| POST | `/auth/register` | Đăng ký tài khoản | `{ email, password, fullName }` |
| POST | `/auth/login` | Đăng nhập | `{ email, password }` |

## 🔒 Protected Endpoints (Cần Authentication)

### Authentication
| Method | Endpoint | Description | Headers |
|--------|----------|-------------|---------|
| GET | `/auth/me` | Lấy thông tin user hiện tại | `Authorization: Bearer {token}` |

### Categories
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/categories` | Lấy tất cả danh mục | - |
| GET | `/categories/type/{type}` | Lấy danh mục theo loại | `type: INCOME or EXPENSE` |

### Transactions
| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|----------------------|
| POST | `/transactions` | Tạo giao dịch mới | `{ categoryId, amount, description, transactionDate, type }` |
| GET | `/transactions` | Lấy danh sách giao dịch | `?page=0&size=20` |
| GET | `/transactions/{id}` | Lấy chi tiết giao dịch | - |
| PUT | `/transactions/{id}` | Cập nhật giao dịch | `{ categoryId, amount, description, transactionDate, type }` |
| DELETE | `/transactions/{id}` | Xóa giao dịch | - |
| GET | `/transactions/stats` | Thống kê giao dịch | `?month=1&year=2026` |

### Budgets
| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|----------------------|
| POST | `/budgets` | Tạo ngân sách | `{ categoryId, amount, month, year }` |
| GET | `/budgets` | Lấy danh sách ngân sách | `?month=1&year=2026` |
| DELETE | `/budgets/{id}` | Xóa ngân sách | - |

### Reports
| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/reports/monthly` | Báo cáo theo tháng | `?month=1&year=2026` |
| GET | `/reports/yearly` | Báo cáo theo năm | `?year=2026` |

### Chat AI
| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|----------------------|
| POST | `/chat` | Gửi tin nhắn chat | `{ message }` |
| GET | `/chat/history` | Lấy lịch sử chat | `?page=0&size=20` |
| DELETE | `/chat/history` | Xóa lịch sử chat | - |

---

## 📝 Request/Response Examples

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "fullName": "Nguyen Van Test"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "fullName": "Nguyen Van Test"
    }
  }
}
```

### Create Transaction
```http
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": 1,
  "amount": 15000000,
  "description": "Lương tháng 1",
  "transactionDate": "2026-01-15",
  "type": "INCOME"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "category": {
      "id": 1,
      "name": "Lương",
      "type": "INCOME"
    },
    "amount": 15000000,
    "description": "Lương tháng 1",
    "transactionDate": "2026-01-15",
    "type": "INCOME"
  }
}
```

---

## 🎯 Common Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Request thành công |
| 201 | Created | Tạo resource thành công |
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 401 | Unauthorized | Token không hợp lệ hoặc thiếu |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Dữ liệu bị trùng (ví dụ: email) |
| 500 | Server Error | Lỗi server |

---

## 🔑 Authentication Flow

1. **Register** → Nhận token
2. **Login** → Nhận token
3. Sử dụng token cho các request tiếp theo:
   ```
   Authorization: Bearer {your_token}
   ```

---

## 📊 Data Types

### Category Types
- `INCOME` - Thu nhập
- `EXPENSE` - Chi tiêu

### Transaction Types
- `INCOME` - Giao dịch thu
- `EXPENSE` - Giao dịch chi

### Date Format
- `YYYY-MM-DD` (ví dụ: `2026-01-18`)

---

## ⚡ Quick Test Commands (PowerShell)

### Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
```

### Register
```powershell
$body = @{
    email = "test@example.com"
    password = "Password123!"
    fullName = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

### Login
```powershell
$body = @{
    email = "test@example.com"
    password = "Password123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
```

### Get Categories
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method Get -Headers $headers
```

---

**Tổng số endpoints: 21**
- Public: 3
- Protected: 18
