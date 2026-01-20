# 📋 HƯỚNG DẪN TEST API TRÊN POSTMAN

## 🔧 Cấu hình ban đầu

### Base URL
```
http://localhost:8080/api
```

### Headers chung cho tất cả request
```
Content-Type: application/json
```

### Headers cho các API cần authentication
```
Content-Type: application/json
Authorization: Bearer {your_token_here}
```

---

## 📊 TỔNG QUAN CÁC API ENDPOINTS

### 1. **Health Check** (Không cần auth)
- `GET /health` - Kiểm tra trạng thái server

### 2. **Authentication** (Không cần auth)
- `POST /auth/register` - Đăng ký tài khoản
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Lấy thông tin user hiện tại (Cần auth)

### 3. **Categories** (Cần auth)
- `GET /categories` - Lấy tất cả danh mục
- `GET /categories/type/{type}` - Lấy danh mục theo loại (INCOME/EXPENSE)

### 4. **Transactions** (Cần auth)
- `POST /transactions` - Tạo giao dịch mới
- `PUT /transactions/{id}` - Cập nhật giao dịch
- `DELETE /transactions/{id}` - Xóa giao dịch
- `GET /transactions` - Lấy danh sách giao dịch (có phân trang)
- `GET /transactions/{id}` - Lấy chi tiết giao dịch
- `GET /transactions/stats` - Lấy thống kê giao dịch

### 5. **Budgets** (Cần auth)
- `POST /budgets` - Tạo ngân sách
- `DELETE /budgets/{id}` - Xóa ngân sách
- `GET /budgets` - Lấy danh sách ngân sách

### 6. **Reports** (Cần auth)
- `GET /reports/monthly` - Báo cáo theo tháng
- `GET /reports/yearly` - Báo cáo theo năm

### 7. **Chat AI** (Cần auth)
- `POST /chat` - Gửi tin nhắn chat
- `GET /chat/history` - Lấy lịch sử chat
- `DELETE /chat/history` - Xóa lịch sử chat

---

## 🧪 CHI TIẾT TEST TỪNG API

### ✅ BƯỚC 1: HEALTH CHECK (Không cần auth)

#### Request
```http
GET http://localhost:8080/api/health
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": null,
  "data": {
    "status": "UP",
    "timestamp": "2026-01-18T09:30:00",
    "service": "Expense Management API",
    "version": "1.0.0"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 2: ĐĂNG KÝ TÀI KHOẢN

#### Request
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!",
  "fullName": "Nguyen Van Test"
}
```

#### Expected Response (201 CREATED)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "fullName": "Nguyen Van Test",
      "createdAt": "2026-01-18T09:30:00"
    }
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

**⚠️ LƯU Ý: Copy token từ response để dùng cho các request tiếp theo!**

---

### ✅ BƯỚC 3: ĐĂNG NHẬP

#### Request
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123!"
}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "fullName": "Nguyen Van Test",
      "createdAt": "2026-01-18T09:30:00"
    }
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 4: LẤY THÔNG TIN USER HIỆN TẠI

#### Request
```http
GET http://localhost:8080/api/auth/me
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Nguyen Van Test",
    "createdAt": "2026-01-18T09:30:00"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 5: LẤY TẤT CẢ DANH MỤC

#### Request
```http
GET http://localhost:8080/api/categories
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Lương",
      "type": "INCOME",
      "icon": "💰",
      "color": "#4CAF50"
    },
    {
      "id": 2,
      "name": "Ăn uống",
      "type": "EXPENSE",
      "icon": "🍔",
      "color": "#F44336"
    }
  ],
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 6: LẤY DANH MỤC THEO LOẠI

#### Request (Lấy danh mục INCOME)
```http
GET http://localhost:8080/api/categories/type/INCOME
Authorization: Bearer {your_token}
```

#### Request (Lấy danh mục EXPENSE)
```http
GET http://localhost:8080/api/categories/type/EXPENSE
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Lương",
      "type": "INCOME",
      "icon": "💰",
      "color": "#4CAF50"
    }
  ],
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 7: TẠO GIAO DỊCH MỚI

#### Request (Thu nhập)
```http
POST http://localhost:8080/api/transactions
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "categoryId": 1,
  "amount": 15000000,
  "description": "Lương tháng 1",
  "transactionDate": "2026-01-15",
  "type": "INCOME"
}
```

#### Request (Chi tiêu)
```http
POST http://localhost:8080/api/transactions
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "categoryId": 2,
  "amount": 500000,
  "description": "Ăn trưa với đồng nghiệp",
  "transactionDate": "2026-01-18",
  "type": "EXPENSE"
}
```

#### Expected Response (201 CREATED)
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "category": {
      "id": 1,
      "name": "Lương",
      "type": "INCOME",
      "icon": "💰",
      "color": "#4CAF50"
    },
    "amount": 15000000,
    "description": "Lương tháng 1",
    "transactionDate": "2026-01-15",
    "type": "INCOME",
    "createdAt": "2026-01-18T09:30:00"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 8: LẤY DANH SÁCH GIAO DỊCH (CÓ PHÂN TRANG)

#### Request (Trang đầu tiên, 20 items)
```http
GET http://localhost:8080/api/transactions?page=0&size=20
Authorization: Bearer {your_token}
```

#### Request (Trang thứ 2, 10 items)
```http
GET http://localhost:8080/api/transactions?page=1&size=10
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "category": {
          "id": 1,
          "name": "Lương",
          "type": "INCOME",
          "icon": "💰",
          "color": "#4CAF50"
        },
        "amount": 15000000,
        "description": "Lương tháng 1",
        "transactionDate": "2026-01-15",
        "type": "INCOME",
        "createdAt": "2026-01-18T09:30:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalPages": 1,
    "totalElements": 1,
    "last": true,
    "first": true
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 9: LẤY CHI TIẾT GIAO DỊCH

#### Request
```http
GET http://localhost:8080/api/transactions/1
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Transaction retrieved successfully",
  "data": {
    "id": 1,
    "category": {
      "id": 1,
      "name": "Lương",
      "type": "INCOME",
      "icon": "💰",
      "color": "#4CAF50"
    },
    "amount": 15000000,
    "description": "Lương tháng 1",
    "transactionDate": "2026-01-15",
    "type": "INCOME",
    "createdAt": "2026-01-18T09:30:00"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 10: CẬP NHẬT GIAO DỊCH

#### Request
```http
PUT http://localhost:8080/api/transactions/1
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "categoryId": 1,
  "amount": 16000000,
  "description": "Lương tháng 1 + thưởng",
  "transactionDate": "2026-01-15",
  "type": "INCOME"
}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": 1,
    "category": {
      "id": 1,
      "name": "Lương",
      "type": "INCOME",
      "icon": "💰",
      "color": "#4CAF50"
    },
    "amount": 16000000,
    "description": "Lương tháng 1 + thưởng",
    "transactionDate": "2026-01-15",
    "type": "INCOME",
    "createdAt": "2026-01-18T09:30:00"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 11: LẤY THỐNG KÊ GIAO DỊCH

#### Request
```http
GET http://localhost:8080/api/transactions/stats?month=1&year=2026
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalIncome": 16000000,
    "totalExpense": 500000,
    "balance": 15500000,
    "transactionCount": 2,
    "categoryBreakdown": [
      {
        "categoryName": "Lương",
        "amount": 16000000,
        "percentage": 96.97
      },
      {
        "categoryName": "Ăn uống",
        "amount": 500000,
        "percentage": 3.03
      }
    ]
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 12: TẠO NGÂN SÁCH

#### Request
```http
POST http://localhost:8080/api/budgets
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "categoryId": 2,
  "amount": 5000000,
  "month": 1,
  "year": 2026
}
```

#### Expected Response (201 CREATED)
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": 1,
    "category": {
      "id": 2,
      "name": "Ăn uống",
      "type": "EXPENSE",
      "icon": "🍔",
      "color": "#F44336"
    },
    "amount": 5000000,
    "spent": 500000,
    "remaining": 4500000,
    "percentage": 10.0,
    "month": 1,
    "year": 2026,
    "createdAt": "2026-01-18T09:30:00"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 13: LẤY DANH SÁCH NGÂN SÁCH

#### Request
```http
GET http://localhost:8080/api/budgets?month=1&year=2026
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Budgets retrieved successfully",
  "data": [
    {
      "id": 1,
      "category": {
        "id": 2,
        "name": "Ăn uống",
        "type": "EXPENSE",
        "icon": "🍔",
        "color": "#F44336"
      },
      "amount": 5000000,
      "spent": 500000,
      "remaining": 4500000,
      "percentage": 10.0,
      "month": 1,
      "year": 2026,
      "createdAt": "2026-01-18T09:30:00"
    }
  ],
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 14: BÁO CÁO THEO THÁNG

#### Request
```http
GET http://localhost:8080/api/reports/monthly?month=1&year=2026
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Monthly report retrieved successfully",
  "data": {
    "month": 1,
    "year": 2026,
    "totalIncome": 16000000,
    "totalExpense": 500000,
    "balance": 15500000,
    "savingsRate": 96.88,
    "topExpenseCategories": [
      {
        "categoryName": "Ăn uống",
        "amount": 500000,
        "percentage": 100.0
      }
    ],
    "dailyExpenses": [
      {
        "date": "2026-01-18",
        "amount": 500000
      }
    ]
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 15: BÁO CÁO THEO NĂM

#### Request
```http
GET http://localhost:8080/api/reports/yearly?year=2026
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Yearly report retrieved successfully",
  "data": {
    "year": 2026,
    "totalIncome": 16000000,
    "totalExpense": 500000,
    "balance": 15500000,
    "savingsRate": 96.88,
    "monthlyBreakdown": [
      {
        "month": 1,
        "income": 16000000,
        "expense": 500000,
        "balance": 15500000
      }
    ],
    "categoryBreakdown": [
      {
        "categoryName": "Lương",
        "amount": 16000000,
        "type": "INCOME"
      },
      {
        "categoryName": "Ăn uống",
        "amount": 500000,
        "type": "EXPENSE"
      }
    ]
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 16: CHAT VỚI AI

#### Request
```http
POST http://localhost:8080/api/chat
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "message": "Tôi nên tiết kiệm bao nhiêu mỗi tháng?"
}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "id": 1,
    "userMessage": "Tôi nên tiết kiệm bao nhiêu mỗi tháng?",
    "aiResponse": "Dựa trên thu nhập của bạn, tôi khuyên bạn nên tiết kiệm ít nhất 20-30% thu nhập hàng tháng...",
    "createdAt": "2026-01-18T09:30:00"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 17: LẤY LỊCH SỬ CHAT

#### Request
```http
GET http://localhost:8080/api/chat/history?page=0&size=20
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Chat history retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "userMessage": "Tôi nên tiết kiệm bao nhiêu mỗi tháng?",
        "aiResponse": "Dựa trên thu nhập của bạn...",
        "createdAt": "2026-01-18T09:30:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalPages": 1,
    "totalElements": 1
  },
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 18: XÓA LỊCH SỬ CHAT

#### Request
```http
DELETE http://localhost:8080/api/chat/history
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Chat history cleared successfully",
  "data": null,
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 19: XÓA NGÂN SÁCH

#### Request
```http
DELETE http://localhost:8080/api/budgets/1
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Budget deleted successfully",
  "data": null,
  "timestamp": "2026-01-18T09:30:00"
}
```

---

### ✅ BƯỚC 20: XÓA GIAO DỊCH

#### Request
```http
DELETE http://localhost:8080/api/transactions/1
Authorization: Bearer {your_token}
```

#### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "data": null,
  "timestamp": "2026-01-18T09:30:00"
}
```

---

## ⚠️ CÁC LỖI THƯỜNG GẶP

### 1. 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "timestamp": "2026-01-18T09:30:00"
}
```
**Nguyên nhân:** Token không hợp lệ hoặc đã hết hạn
**Giải pháp:** Đăng nhập lại để lấy token mới

### 2. 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  },
  "timestamp": "2026-01-18T09:30:00"
}
```
**Nguyên nhân:** Dữ liệu đầu vào không hợp lệ
**Giải pháp:** Kiểm tra lại format và required fields

### 3. 404 Not Found
```json
{
  "success": false,
  "message": "Transaction not found",
  "data": null,
  "timestamp": "2026-01-18T09:30:00"
}
```
**Nguyên nhân:** Resource không tồn tại
**Giải pháp:** Kiểm tra lại ID

### 4. 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists",
  "data": null,
  "timestamp": "2026-01-18T09:30:00"
}
```
**Nguyên nhân:** Email đã được sử dụng
**Giải pháp:** Sử dụng email khác

---

## 🎯 CHECKLIST KIỂM TRA

- [ ] Server đang chạy trên port 8080
- [ ] MySQL đang chạy và database đã được tạo
- [ ] Health check trả về status "UP"
- [ ] Đăng ký tài khoản thành công
- [ ] Đăng nhập thành công và nhận được token
- [ ] Lấy thông tin user hiện tại thành công
- [ ] Lấy danh sách categories thành công
- [ ] Tạo transaction thành công
- [ ] Lấy danh sách transactions thành công
- [ ] Cập nhật transaction thành công
- [ ] Xóa transaction thành công
- [ ] Tạo budget thành công
- [ ] Lấy statistics thành công
- [ ] Lấy monthly report thành công
- [ ] Chat với AI thành công (nếu có OpenAI key)

---

## 📝 GHI CHÚ

1. **Token expiration:** Token có thời hạn 24 giờ (86400000ms)
2. **Pagination:** Mặc định page=0, size=20
3. **Date format:** Sử dụng format "YYYY-MM-DD" (ví dụ: "2026-01-18")
4. **Category types:** Chỉ có 2 loại: "INCOME" và "EXPENSE"
5. **OpenAI:** Nếu không có API key, các endpoint chat sẽ báo lỗi

---

## 🚀 KHỞI ĐỘNG SERVER

```bash
cd backend
mvn spring-boot:run
```

Hoặc nếu đã build:
```bash
java -jar target/expense-management-api.jar
```

---

**Chúc bạn test thành công! 🎉**
