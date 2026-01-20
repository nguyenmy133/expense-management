# Quick Start Guide - Admin Panel Testing

## 1. Chuẩn bị Database

### Tạo admin user đầu tiên
Chạy SQL sau để tạo một admin user để test:

```sql
-- Insert admin user (password: admin123)
INSERT INTO profiles (email, password, full_name, role, created_at, updated_at) 
VALUES (
    'admin@expense.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye1J7qX5iI5rYJhiwidqyOJzdtIoH6zqm', -- password: admin123
    'Admin User',
    'ADMIN',
    NOW(),
    NOW()
);

-- Insert regular user (password: user123)
INSERT INTO profiles (email, password, full_name, role, created_at, updated_at) 
VALUES (
    'user@expense.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: user123
    'Regular User',
    'USER',
    NOW(),
    NOW()
);
```

**Lưu ý**: Passwords đã được hash bằng BCrypt. Nếu muốn tạo password khác, sử dụng BCrypt online tool hoặc code Java.

## 2. Start Application

### Backend
```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` hoặc `http://localhost:5174`

## 3. Test Admin Features

### Login as Admin
1. Mở browser: `http://localhost:5173`
2. Login với:
   - Email: `admin@expense.com`
   - Password: `admin123`
3. Sau khi login, bạn sẽ thấy menu Admin trong sidebar

### Test Admin Categories
1. Click vào **Danh mục** trong Admin section
2. Thử các tính năng:
   - ✅ Xem danh sách categories
   - ✅ Search categories
   - ✅ Filter theo type (ALL/INCOME/EXPENSE)
   - ✅ Thêm category mới (click "Thêm danh mục")
   - ✅ Chỉnh sửa category (click icon Edit)
   - ✅ Xóa category (click icon Trash)

### Test Admin Users
1. Click vào **Người dùng** trong Admin section
2. Thử các tính năng:
   - ✅ Xem danh sách users
   - ✅ Search users
   - ✅ Xem stats (Total, Admins, Users)
   - ✅ Chỉnh sửa role của user (click icon Edit, chọn role mới)
   - ✅ Xóa user (click icon Trash)

### Test Admin System
1. Click vào **Hệ thống** trong Admin section
2. Thử các tính năng:
   - ✅ Cài đặt chung (Site name, timezone, language, currency)
   - ✅ Thông báo (Email notifications, budget alerts)
   - ✅ Bảo mật (2FA, session timeout, password requirements)
   - ✅ Database (Auto backup settings)
   - ✅ Lưu cài đặt

### Test Role-Based Access
1. Logout khỏi admin account
2. Login với regular user:
   - Email: `user@expense.com`
   - Password: `user123`
3. Kiểm tra:
   - ❌ Menu Admin KHÔNG hiển thị trong sidebar
   - ✅ Chỉ có menu thường: Dashboard, Giao dịch, Ngân sách, Báo cáo, AI Chatbot

## 4. API Testing với Postman

### Get All Users (Admin only)
```
GET http://localhost:8080/api/admin/users
Headers:
  Authorization: Bearer {your_jwt_token}
```

### Update User Role
```
PUT http://localhost:8080/api/admin/users/2/role?role=ADMIN
Headers:
  Authorization: Bearer {your_jwt_token}
```

### Delete User
```
DELETE http://localhost:8080/api/admin/users/2
Headers:
  Authorization: Bearer {your_jwt_token}
```

### Create Category
```
POST http://localhost:8080/api/categories
Headers:
  Authorization: Bearer {your_jwt_token}
  Content-Type: application/json
Body:
{
  "name": "Test Category",
  "type": "EXPENSE",
  "icon": "🎯"
}
```

### Update Category
```
PUT http://localhost:8080/api/categories/1
Headers:
  Authorization: Bearer {your_jwt_token}
  Content-Type: application/json
Body:
{
  "name": "Updated Category",
  "type": "INCOME",
  "icon": "💰"
}
```

### Delete Category
```
DELETE http://localhost:8080/api/categories/1
Headers:
  Authorization: Bearer {your_jwt_token}
```

## 5. Troubleshooting

### Frontend không hiển thị admin menu
- Kiểm tra user role trong localStorage:
  ```javascript
  JSON.parse(localStorage.getItem('user')).role
  ```
- Phải là `"ADMIN"` (uppercase)

### Backend trả về 401 Unauthorized
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra token có trong header Authorization không
- Kiểm tra token chưa hết hạn

### Database error khi login
- Kiểm tra đã chạy migration chưa
- Kiểm tra role column có đúng type không (VARCHAR)
- Kiểm tra data có đúng format không ('USER', 'ADMIN' - uppercase)

### Categories không load
- Kiểm tra backend đang chạy
- Kiểm tra API endpoint `/api/categories` có hoạt động không
- Kiểm tra console log trong browser

## 6. Expected Behavior

### Admin User
- ✅ Thấy tất cả menu items (Dashboard, Transactions, Budgets, Reports, Chat)
- ✅ Thấy Admin section với 3 items (Danh mục, Người dùng, Hệ thống)
- ✅ Có thể truy cập tất cả admin pages
- ✅ Có thể quản lý categories, users, system settings

### Regular User
- ✅ Thấy menu items thường (Dashboard, Transactions, Budgets, Reports, Chat)
- ❌ KHÔNG thấy Admin section
- ❌ KHÔNG thể truy cập admin pages (nếu có route guard)
- ✅ Chỉ có thể quản lý data của riêng mình

## 7. Next Steps

Sau khi test xong, có thể:
1. Implement backend security với Spring Security
2. Add route guards cho admin pages
3. Add audit logging cho admin actions
4. Customize admin features theo nhu cầu

## 8. Demo Credentials

### Admin Account
- Email: `admin@expense.com`
- Password: `admin123`
- Role: ADMIN

### User Account
- Email: `user@expense.com`
- Password: `user123`
- Role: USER

---

**Lưu ý**: Đây là môi trường development. Trong production, cần:
- Thay đổi default passwords
- Enable HTTPS
- Add rate limiting
- Add proper authentication & authorization
- Add input validation
- Add CSRF protection
