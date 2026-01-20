# 🔧 Backend Fix - Đã xóa Supabase references

## ✅ Đã fix:

1. **Xóa các file Supabase cũ:**
   - ❌ `JwtAuthenticationFilter.java` (dùng SupabaseTokenValidator)
   - ❌ `SupabaseTokenValidator.java`
   - ❌ `UserPrincipal.java`

2. **SecurityConfig đã disable authentication tạm thời**
   - Cho phép tất cả requests
   - Không cần JWT token để test

## 🚀 Cách chạy Backend:

### Option 1: IntelliJ IDEA (Recommended)

1. **Clean project:**
   ```
   Maven → Lifecycle → clean
   ```

2. **Compile:**
   ```
   Maven → Lifecycle → compile
   ```

3. **Run:**
   - Mở `ExpenseManagementApplication.java`
   - Click nút Run ▶️

### Option 2: Maven Command Line

```bash
cd d:\expense-management\backend

# Clean
mvn clean

# Compile
mvn compile

# Run
mvn spring-boot:run
```

## ✅ Expected Output:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.1)

...
Hibernate: create table if not exists budgets ...
Hibernate: create table if not exists categories ...
Hibernate: create table if not exists chat_history ...
Hibernate: create table if not exists profiles ...
Hibernate: create table if not exists transactions ...
...
Started ExpenseManagementApplication in 3.456 seconds
```

## 🧪 Test Backend:

### 1. Health Check
```bash
curl http://localhost:8080/api/health
```

**Expected:**
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

### 2. Get Categories (No auth needed - Security disabled)
```bash
curl http://localhost:8080/api/categories
```

**Expected:**
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
      "color": "#3B82F6",
      "isDefault": true
    },
    ...
  ]
}
```

### 3. Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456",
    "fullName": "Test User"
  }'
```

**Expected:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@test.com",
      "fullName": "Test User",
      "role": "user"
    }
  }
}
```

### 4. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123456"
  }'
```

## 🐛 Nếu vẫn lỗi:

### Lỗi: "Table doesn't exist"
**Fix:**
```sql
DROP DATABASE IF EXISTS expense_management;
source d:/expense-management/backend/src/main/resources/schema.sql;
```

### Lỗi: "Port 8080 already in use"
**Fix:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Hoặc đổi port trong application.properties
server.port=8081
```

### Lỗi: "Cannot connect to MySQL"
**Fix:**
1. Kiểm tra MySQL đang chạy:
   ```bash
   net start MySQL80
   ```
2. Verify password trong `application.properties`:
   ```properties
   spring.datasource.password=123456
   ```

### Lỗi: "Bean creation failed"
**Fix:**
```bash
# Clean Maven cache
mvn clean install -U

# Hoặc trong IntelliJ:
File → Invalidate Caches → Invalidate and Restart
```

## 📝 Checklist:

- [ ] MySQL đang chạy
- [ ] Database `expense_management` đã tạo
- [ ] `mvn clean` đã chạy
- [ ] Backend start thành công
- [ ] Health endpoint responds
- [ ] Categories endpoint returns data
- [ ] Register/Login works

## 🎯 Sau khi Backend chạy:

1. **Test với Postman/curl**
2. **Start Frontend**: `npm run dev`
3. **Open browser**: `http://localhost:5173`
4. **Register → Login → Use app!**

---

**Backend đã sẵn sàng! Hãy thử chạy ngay! 🚀**
