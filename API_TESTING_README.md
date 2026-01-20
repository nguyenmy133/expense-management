# 🚀 HƯỚNG DẪN KIỂM TRA VÀ TEST API

## ✅ KIỂM TRA HỆ THỐNG

### 1. Kiểm tra MySQL
```powershell
# Kiểm tra MySQL service
Get-Service -Name MySQL80

# Kết quả mong đợi: Status = Running
```

**Trạng thái hiện tại:** ✅ MySQL80 đang chạy

### 2. Kiểm tra Java
```powershell
java -version
```

**Yêu cầu:** Java 17 trở lên

### 3. Kiểm tra Maven
```powershell
mvn -version
```

---

## 🔧 CẤU HÌNH ĐÃ KIỂM TRA

### ✅ File `application.properties`

| Cấu hình | Giá trị | Trạng thái |
|----------|---------|------------|
| **Database URL** | `jdbc:mysql://localhost:3306/expense_management` | ✅ Đúng |
| **Database User** | `root` | ✅ OK |
| **Database Password** | `123456` | ⚠️ Yếu (OK cho local) |
| **JPA DDL Auto** | `update` | ✅ Đã sửa (trước đó là `create`) |
| **Server Port** | `8080` | ✅ Đúng |
| **Context Path** | `/api` | ✅ Đúng |
| **CORS Origins** | `http://localhost:5173,http://localhost:3000` | ✅ Đúng |

### ⚠️ Lưu ý về OpenAI API Keys

**Dòng 28-29 trong application.properties:**
- OpenAI API keys đang được hardcode
- ⚠️ **KHÔNG ĐƯỢC PUSH LÊN GITHUB** nếu bạn có ý định public repo
- Hiện tại OK vì chỉ chạy local

---

## 🎯 CÁCH TEST API

### Phương án 1: Sử dụng PowerShell Script (Nhanh nhất)

```powershell
# Chạy script tự động test
cd d:\expense-management
.\test-api.ps1
```

**Script này sẽ:**
- ✅ Test health check
- ✅ Đăng ký user mới
- ✅ Lấy thông tin user
- ✅ Lấy danh sách categories
- ✅ Tạo transaction
- ✅ Cập nhật transaction
- ✅ Tạo budget
- ✅ Lấy reports
- ✅ Lấy statistics
- ✅ Hiển thị token để dùng cho Postman

### Phương án 2: Sử dụng Postman (Chi tiết nhất)

#### Bước 1: Import Collection
1. Mở Postman
2. Click **Import**
3. Chọn file `Expense_Management_API.postman_collection.json`
4. Click **Import**

#### Bước 2: Cấu hình Variables
Collection đã có sẵn 2 variables:
- `baseUrl`: `http://localhost:8080/api` (đã set sẵn)
- `token`: Sẽ tự động lưu sau khi login/register

#### Bước 3: Test theo thứ tự

**📁 Folder 0: Health Check**
1. ✅ Health Check - Kiểm tra server đang chạy

**📁 Folder 1: Authentication**
1. ✅ Register - Đăng ký tài khoản mới (token tự động lưu)
2. ✅ Login - Đăng nhập (token tự động lưu)
3. ✅ Get Current User - Lấy thông tin user

**📁 Folder 2: Categories**
1. ✅ Get All Categories
2. ✅ Get Categories by Type - INCOME
3. ✅ Get Categories by Type - EXPENSE

**📁 Folder 3: Transactions**
1. ✅ Create Transaction - Income
2. ✅ Create Transaction - Expense
3. ✅ Get All Transactions
4. ✅ Get Transaction by ID
5. ✅ Update Transaction
6. ✅ Get Transaction Statistics
7. ✅ Delete Transaction

**📁 Folder 4: Budgets**
1. ✅ Create Budget
2. ✅ Get Budgets
3. ✅ Delete Budget

**📁 Folder 5: Reports**
1. ✅ Get Monthly Report
2. ✅ Get Yearly Report

**📁 Folder 6: Chat AI**
1. ✅ Send Chat Message
2. ✅ Get Chat History
3. ✅ Clear Chat History

### Phương án 3: Đọc tài liệu chi tiết

Xem file `POSTMAN_API_TESTING_GUIDE.md` để có:
- ✅ Chi tiết từng endpoint
- ✅ Request/Response examples
- ✅ Error handling
- ✅ Troubleshooting guide

---

## 🏃 KHỞI ĐỘNG BACKEND

### Cách 1: Sử dụng Maven
```powershell
cd d:\expense-management\backend
mvn spring-boot:run
```

### Cách 2: Sử dụng IDE
- Mở project trong IntelliJ IDEA hoặc Eclipse
- Run `ExpenseManagementApplication.java`

### Kiểm tra backend đã chạy
```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "...",
    "service": "Expense Management API",
    "version": "1.0.0"
  }
}
```

---

## 📊 TỔNG QUAN API ENDPOINTS

### Authentication (3 endpoints)
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `GET /auth/me` - Thông tin user

### Categories (2 endpoints)
- `GET /categories` - Tất cả danh mục
- `GET /categories/type/{type}` - Danh mục theo loại

### Transactions (7 endpoints)
- `POST /transactions` - Tạo mới
- `PUT /transactions/{id}` - Cập nhật
- `DELETE /transactions/{id}` - Xóa
- `GET /transactions` - Danh sách (phân trang)
- `GET /transactions/{id}` - Chi tiết
- `GET /transactions/stats` - Thống kê

### Budgets (3 endpoints)
- `POST /budgets` - Tạo ngân sách
- `GET /budgets` - Danh sách ngân sách
- `DELETE /budgets/{id}` - Xóa ngân sách

### Reports (2 endpoints)
- `GET /reports/monthly` - Báo cáo tháng
- `GET /reports/yearly` - Báo cáo năm

### Chat AI (3 endpoints)
- `POST /chat` - Gửi tin nhắn
- `GET /chat/history` - Lịch sử chat
- `DELETE /chat/history` - Xóa lịch sử

### Health (1 endpoint)
- `GET /health` - Kiểm tra server

**Tổng cộng: 21 API endpoints**

---

## ⚠️ TROUBLESHOOTING

### Lỗi: "Connection refused"
**Nguyên nhân:** Backend chưa chạy
**Giải pháp:**
```powershell
cd d:\expense-management\backend
mvn spring-boot:run
```

### Lỗi: "Access denied for user 'root'@'localhost'"
**Nguyên nhân:** Password MySQL không đúng
**Giải pháp:** Sửa password trong `application.properties` (dòng 11)

### Lỗi: "Unknown database 'expense_management'"
**Nguyên nhân:** Database chưa được tạo
**Giải pháp:** Database sẽ tự động tạo khi chạy lần đầu (có `createDatabaseIfNotExist=true`)

### Lỗi: "401 Unauthorized"
**Nguyên nhân:** Token không hợp lệ hoặc hết hạn
**Giải pháp:** Login lại để lấy token mới

### Lỗi: "Port 8080 already in use"
**Nguyên nhân:** Port 8080 đang được sử dụng
**Giải pháp:**
```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process (thay <PID> bằng process ID)
taskkill /PID <PID> /F
```

---

## 📝 CHECKLIST KIỂM TRA

### Trước khi test
- [ ] MySQL đang chạy (MySQL80 service)
- [ ] Java 17+ đã cài đặt
- [ ] Maven đã cài đặt
- [ ] File `application.properties` đã được kiểm tra

### Khởi động backend
- [ ] Backend chạy thành công
- [ ] Không có lỗi trong console
- [ ] Health check trả về status "UP"

### Test API
- [ ] Đăng ký tài khoản thành công
- [ ] Đăng nhập thành công
- [ ] Lấy danh sách categories thành công
- [ ] Tạo transaction thành công
- [ ] Tạo budget thành công
- [ ] Lấy reports thành công

---

## 🎯 KẾT LUẬN

### ✅ Đã kiểm tra và sẵn sàng

1. **Cấu hình database:** ✅ Đúng
2. **Cấu hình server:** ✅ Đúng
3. **MySQL service:** ✅ Đang chạy
4. **API structure:** ✅ Hoàn chỉnh (21 endpoints)
5. **Tài liệu:** ✅ Đầy đủ
6. **Postman collection:** ✅ Sẵn sàng
7. **Test script:** ✅ Sẵn sàng

### 📦 Files đã tạo

1. `POSTMAN_API_TESTING_GUIDE.md` - Hướng dẫn chi tiết
2. `Expense_Management_API.postman_collection.json` - Postman collection
3. `test-api.ps1` - PowerShell test script
4. `API_TESTING_README.md` - File này

### 🚀 Bước tiếp theo

1. **Khởi động backend:**
   ```powershell
   cd d:\expense-management\backend
   mvn spring-boot:run
   ```

2. **Chạy test tự động:**
   ```powershell
   cd d:\expense-management
   .\test-api.ps1
   ```

3. **Hoặc test bằng Postman:**
   - Import collection
   - Test từng endpoint

---

**Chúc bạn test thành công! 🎉**

Nếu gặp vấn đề gì, hãy kiểm tra lại:
1. MySQL có đang chạy không
2. Backend có đang chạy không
3. Port 8080 có bị chiếm không
4. Token có hợp lệ không
