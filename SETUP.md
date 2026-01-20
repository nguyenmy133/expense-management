# 🚀 Hướng dẫn Setup Nhanh

## Bước 1: Chuẩn bị

### Tạo Supabase Project

1. Truy cập https://app.supabase.com
2. Click "New Project"
3. Điền thông tin:
   - Name: expense-management
   - Database Password: (tạo password mạnh)
   - Region: Southeast Asia (Singapore)
4. Click "Create new project"

### Lấy thông tin Supabase

Sau khi project được tạo:

1. Vào **Settings** > **API**
   - Copy `Project URL` → Đây là `SUPABASE_URL`
   - Copy `anon public` key → Đây là `SUPABASE_ANON_KEY`

2. Vào **Settings** > **API** > **JWT Settings**
   - Copy `JWT Secret` → Đây là `SUPABASE_JWT_SECRET`

3. Vào **Settings** > **Database** > **Connection string**
   - Chọn tab "URI"
   - Copy connection string → Đây là `SUPABASE_DB_URL`
   - Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
   - Thay `[password]` bằng database password bạn đã tạo

### Tạo Database Schema

1. Vào **SQL Editor** trong Supabase Dashboard
2. Mở file `database-schema.md` trong thư mục docs
3. Copy và paste từng đoạn SQL vào SQL Editor
4. Click "Run" để execute

### Lấy OpenAI API Key

1. Truy cập https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy key → Đây là `OPENAI_API_KEY`
4. **Lưu ý:** Bạn cần có credits trong tài khoản OpenAI

---

## Bước 2: Cấu hình Backend

```bash
cd backend
```

Tạo file `.env`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Mở file `.env` và điền thông tin:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
SUPABASE_DB_URL=postgresql://postgres.xxxxx:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-database-password

OPENAI_API_KEY=sk-proj-xxxxx

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Bước 3: Cấu hình Frontend

```bash
cd frontend
```

Tạo file `.env`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Mở file `.env` và điền:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Bước 4: Chạy ứng dụng

### Terminal 1 - Backend

```bash
cd backend
mvn spring-boot:run
```

Đợi cho đến khi thấy:
```
Started ExpenseManagementApplication in X.XXX seconds
```

Backend sẽ chạy tại: `http://localhost:8080`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## Bước 5: Test ứng dụng

1. Mở browser và truy cập `http://localhost:5173`
2. Click "Đăng ký ngay"
3. Điền thông tin:
   - Họ và tên: Test User
   - Email: test@example.com
   - Mật khẩu: test123456
4. Check email để verify (nếu Supabase yêu cầu)
5. Đăng nhập và test các chức năng

---

## Troubleshooting

### Backend không start được

**Lỗi:** `Unable to connect to database`

**Giải pháp:**
- Kiểm tra `SUPABASE_DB_URL` có đúng không
- Kiểm tra database password
- Kiểm tra network connection

**Lỗi:** `JWT Secret is invalid`

**Giải pháp:**
- Kiểm tra `SUPABASE_JWT_SECRET` phải đủ dài (>= 32 ký tự)
- Copy lại từ Supabase Dashboard

### Frontend không kết nối được Backend

**Lỗi:** `Network Error` hoặc `CORS Error`

**Giải pháp:**
- Kiểm tra Backend đã chạy chưa
- Kiểm tra `VITE_API_BASE_URL` trong frontend `.env`
- Kiểm tra `CORS_ALLOWED_ORIGINS` trong backend `.env`

### Authentication không hoạt động

**Lỗi:** `Invalid JWT token`

**Giải pháp:**
- Kiểm tra `SUPABASE_URL` và `SUPABASE_ANON_KEY` giống nhau ở Frontend và Backend
- Clear browser cache và cookies
- Đăng xuất và đăng nhập lại

---

## Kiểm tra Health

### Backend Health Check

```bash
curl http://localhost:8080/api/health
```

Kết quả mong đợi:
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

### Frontend

Mở browser console (F12) và kiểm tra không có errors.

---

## Next Steps

Sau khi setup thành công:

1. ✅ Tạo tài khoản admin đầu tiên
2. ✅ Thêm categories mặc định (đã có trong database schema)
3. ✅ Test thêm transactions
4. ✅ Test budget management
5. ✅ Test AI chatbot

---

## Cần hỗ trợ?

- Check [README.md](./README.md) cho thông tin chi tiết
- Check [database-schema.md](./database-schema.md) cho database setup
- Check [backend-api.md](./backend-api.md) cho API documentation

Happy coding! 🎉
