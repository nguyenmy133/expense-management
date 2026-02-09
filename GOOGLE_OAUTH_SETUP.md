# Google OAuth Setup Guide

## Hướng dẫn cấu hình Google OAuth cho Expense Management

### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Nhập tên project: `Expense Management`
4. Click **"Create"**

### Bước 2: Enable Google+ API

1. Trong project vừa tạo, vào **"APIs & Services"** → **"Library"**
2. Tìm kiếm **"Google+ API"** hoặc **"Google Identity"**
3. Click **"Enable"**

### Bước 3: Configure OAuth Consent Screen

1. Vào **"APIs & Services"** → **"OAuth consent screen"**
2. Chọn **"External"** (hoặc Internal nếu dùng Google Workspace)
3. Click **"Create"**
4. Điền thông tin:
   - **App name**: `Expense Management`
   - **User support email**: Email của bạn
   - **Developer contact information**: Email của bạn
5. Click **"Save and Continue"**
6. **Scopes**: Click **"Add or Remove Scopes"**
   - Chọn: `userinfo.email`, `userinfo.profile`, `openid`
7. Click **"Save and Continue"**
8. **Test users** (nếu app ở chế độ Testing):
   - Thêm email accounts để test
9. Click **"Save and Continue"**

### Bước 4: Tạo OAuth 2.0 Credentials

1. Vào **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Chọn **Application type**: `Web application`
4. Nhập tên: `Expense Management Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:5173
   http://localhost:3000
   ```
7. Click **"Create"**
8. **QUAN TRỌNG**: Copy **Client ID** và **Client Secret**

### Bước 5: Cấu hình Backend

1. Mở file `backend/.env` (tạo mới nếu chưa có)
2. Thêm:
   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

3. **LƯU Ý**: KHÔNG commit file `.env` vào Git!

### Bước 6: Cấu hình Frontend

1. Mở file `frontend/.env` (tạo mới nếu chưa có)
2. Thêm:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```

3. **LƯU Ý**: KHÔNG commit file `.env` vào Git!

### Bước 7: Chạy Migration Database

Google OAuth yêu cầu thêm 2 columns mới vào bảng `profiles`:

```sql
ALTER TABLE profiles 
ADD COLUMN auth_provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
ADD COLUMN google_id VARCHAR(255) UNIQUE,
MODIFY COLUMN password VARCHAR(255) NULL;
```

Hoặc restart backend để Hibernate tự động tạo columns (nếu dùng `spring.jpa.hibernate.ddl-auto=update`)

### Bước 8: Test

1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Mở browser: `http://localhost:5173/login`
4. Click **"Đăng nhập với Google"**
5. Chọn Google account
6. Verify redirect về dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Kiểm tra lại **Authorized redirect URIs** trong Google Console
- Đảm bảo URL khớp chính xác (http vs https, port number)

### Error: "Invalid Google token"
- Kiểm tra `VITE_GOOGLE_CLIENT_ID` trong frontend `.env`
- Đảm bảo Client ID đúng và không có khoảng trắng

### Error: "Email already registered with password"
- User đã đăng ký bằng email/password
- Không thể login bằng Google với email đó
- Phải login bằng password

### Database Error
- Chạy migration SQL để thêm columns mới
- Hoặc set `spring.jpa.hibernate.ddl-auto=update` trong `application.properties`

## Security Notes

- ✅ Client Secret phải được bảo mật, KHÔNG commit vào Git
- ✅ Sử dụng `.env` files và thêm vào `.gitignore`
- ✅ Google tokens được verify ở backend
- ✅ Email phải được Google verify
- ✅ Không cho phép link Google account với email đã tồn tại

## Production Deployment

Khi deploy lên production:

1. Update **Authorized JavaScript origins** và **Authorized redirect URIs** với domain thật
2. Publish OAuth consent screen (chuyển từ Testing sang Production)
3. Set environment variables trên server
4. Sử dụng HTTPS (bắt buộc cho production)
