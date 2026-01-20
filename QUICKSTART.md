# 🚀 Quick Start Guide - Chạy Backend & Frontend

## ⚠️ Trạng thái hiện tại

- ✅ **Frontend**: Đang chạy tại `http://localhost:5173`
- ⏳ **Backend**: Cần setup MySQL và chạy
- ⚠️ **Authentication**: Tạm thời DISABLED (cho phép tất cả requests)

---

## Bước 1: Setup MySQL (BẮT BUỘC)

### Cài đặt MySQL

1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Chọn "mysql-installer-community-8.0.xx.msi"
3. Cài đặt với password root: `123456`

### Tạo Database

**Option A: MySQL Workbench (Recommended)**

1. Mở MySQL Workbench
2. Click "Local instance MySQL80"
3. Nhập password: `123456`
4. Click icon "Open SQL Script" 📂
5. Chọn file: `d:\expense-management\backend\src\main\resources\schema.sql`
6. Click "Execute" ⚡

**Option B: Command Line**

```bash
mysql -u root -p
# Nhập password: 123456

source d:/expense-management/backend/src/main/resources/schema.sql;

# Verify
USE expense_management;
SHOW TABLES;
```

**Expected result:**
```
+-----------------------------+
| Tables_in_expense_management|
+-----------------------------+
| budgets                     |
| categories                  |
| chat_history                |
| profiles                    |
| transactions                |
+-----------------------------+
```

---

## Bước 2: Chạy Backend

### Option A: IntelliJ IDEA (Recommended)

1. Download IntelliJ IDEA Community: https://www.jetbrains.com/idea/download/
2. Cài đặt IntelliJ
3. Open Project: `File` → `Open` → `d:\expense-management\backend`
4. Đợi IntelliJ download dependencies (2-5 phút)
5. Mở file: `ExpenseManagementApplication.java`
6. Click nút ▶️ Run (hoặc `Shift + F10`)

### Option B: Maven Command Line

**Cài đặt Maven:**
1. Download: https://maven.apache.org/download.cgi
2. Giải nén vào: `C:\Program Files\Apache\maven`
3. Thêm vào PATH: `C:\Program Files\Apache\maven\bin`
4. Verify: `mvn -version`

**Chạy:**
```bash
cd d:\expense-management\backend
mvn spring-boot:run
```

### Expected Output

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
...
Started ExpenseManagementApplication in 3.456 seconds (JVM running for 4.123)
```

✅ **Backend đang chạy tại: `http://localhost:8080`**

---

## Bước 3: Test Backend

Mở browser hoặc PowerShell:

```bash
# Test health endpoint
curl http://localhost:8080/api/health
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "status": "UP",
    "timestamp": "2024-01-17T...",
    "service": "Expense Management API",
    "version": "1.0.0"
  }
}
```

---

## Bước 4: Test Frontend

Frontend đã chạy tại: `http://localhost:5173`

### Mở browser:

```
http://localhost:5173
```

**Bạn sẽ thấy:**
- Login page hoặc Dashboard
- Nếu không hiển thị gì → Mở Console (F12) xem lỗi

### Nếu Frontend không hiển thị:

```bash
# Stop frontend
Ctrl + C

# Restart
cd d:\expense-management\frontend
npm run dev
```

**Check console trong browser (F12):**
- Không có lỗi đỏ → OK
- Có lỗi → Copy lỗi và báo tôi

---

## 🐛 Troubleshooting

### Backend: MySQL Connection Error

**Error:**
```
Communications link failure
```

**Solution:**
1. Kiểm tra MySQL đang chạy:
   - Windows: `net start MySQL80`
2. Verify password trong `application.properties`:
   ```properties
   spring.datasource.password=123456
   ```

### Backend: Database Not Found

**Error:**
```
Unknown database 'expense_management'
```

**Solution:**
Chạy lại `schema.sql` trong MySQL Workbench

### Frontend: Blank Page

**Solution:**
1. Mở Console (F12)
2. Check tab "Console" có lỗi gì
3. Check tab "Network" → API calls có fail không

### Frontend: Cannot connect to backend

**Error trong Console:**
```
Failed to fetch
Network Error
```

**Solution:**
1. Verify backend đang chạy: `curl http://localhost:8080/api/health`
2. Check CORS trong `application.properties`

---

## ✅ Checklist

- [ ] MySQL đã cài đặt
- [ ] Database `expense_management` đã tạo (5 tables)
- [ ] Backend đang chạy (port 8080)
- [ ] Health endpoint responds: `http://localhost:8080/api/health`
- [ ] Frontend đang chạy (port 5173)
- [ ] Frontend hiển thị UI (không blank)

---

## 📞 Cần Help?

Nếu gặp lỗi, hãy:
1. Copy error message
2. Screenshot nếu có
3. Cho tôi biết bước nào bị lỗi

---

## 🎯 Next Steps

Sau khi cả 2 chạy được:

1. ✅ Test các chức năng cơ bản
2. ✅ Implement Custom Authentication (register/login)
3. ✅ Kết nối Frontend với Backend
4. ✅ Test full flow

**Bạn đã sẵn sàng chưa? Hãy thử chạy backend ngay!**
