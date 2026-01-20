# 🗄️ Database Setup - Categories Seed Data

## Vấn đề

Ứng dụng không có categories nào trong database → Users không thể tạo transactions

## Giải pháp

Chạy SQL seed script để tạo categories mặc định

---

## Cách 1: Chạy SQL Script Trực Tiếp

### Bước 1: Kết nối MySQL
```bash
mysql -u root -p
```

### Bước 2: Chọn database
```sql
USE expense_management;
```

### Bước 3: Chạy seed script
```sql
SOURCE d:/expense-management/backend/src/main/resources/db/seed_categories.sql;
```

Hoặc copy-paste nội dung file vào MySQL:

```sql
-- Income Categories
INSERT INTO categories (name, type, icon, created_at, updated_at) VALUES
('Salary', 'INCOME', '💰', NOW(), NOW()),
('Freelance', 'INCOME', '💼', NOW(), NOW()),
('Investment', 'INCOME', '📈', NOW(), NOW()),
('Gift', 'INCOME', '🎁', NOW(), NOW()),
('Other Income', 'INCOME', '💵', NOW(), NOW());

-- Expense Categories
INSERT INTO categories (name, type, icon, created_at, updated_at) VALUES
('Food', 'EXPENSE', '🍔', NOW(), NOW()),
('Transport', 'EXPENSE', '🚗', NOW(), NOW()),
('Shopping', 'EXPENSE', '🛍️', NOW(), NOW()),
('Entertainment', 'EXPENSE', '🎮', NOW(), NOW()),
('Housing', 'EXPENSE', '🏠', NOW(), NOW()),
('Healthcare', 'EXPENSE', '🏥', NOW(), NOW()),
('Education', 'EXPENSE', '📚', NOW(), NOW()),
('Bills', 'EXPENSE', '💡', NOW(), NOW()),
('Other Expense', 'EXPENSE', '💸', NOW(), NOW());
```

### Bước 4: Verify
```sql
SELECT * FROM categories ORDER BY type, name;
```

Kết quả mong đợi: **14 categories** (5 INCOME + 9 EXPENSE)

---

## Cách 2: Sử dụng MySQL Workbench

1. Mở MySQL Workbench
2. Connect to database
3. Open SQL file: `backend/src/main/resources/db/seed_categories.sql`
4. Click **Execute** (⚡ icon)
5. Verify trong table `categories`

---

## Cách 3: Sử dụng phpMyAdmin

1. Mở phpMyAdmin
2. Chọn database `expense_management`
3. Click tab **SQL**
4. Paste nội dung seed script
5. Click **Go**

---

## Verify Trong Ứng Dụng

Sau khi chạy seed script:

1. Refresh frontend (`http://localhost:5173`)
2. Vào **Giao dịch** → Click **Thêm giao dịch**
3. Chọn loại: **Chi tiêu** hoặc **Thu nhập**
4. Dropdown **Danh mục** sẽ hiển thị:
   - **Chi tiêu**: Food, Transport, Shopping, Entertainment, Housing, Healthcare, Education, Bills, Other Expense
   - **Thu nhập**: Salary, Freelance, Investment, Gift, Other Income

---

## Categories Mặc Định

### Income Categories (5)
| Icon | Name | Type |
|------|------|------|
| 💰 | Salary | INCOME |
| 💼 | Freelance | INCOME |
| 📈 | Investment | INCOME |
| 🎁 | Gift | INCOME |
| 💵 | Other Income | INCOME |

### Expense Categories (9)
| Icon | Name | Type |
|------|------|------|
| 🍔 | Food | EXPENSE |
| 🚗 | Transport | EXPENSE |
| 🛍️ | Shopping | EXPENSE |
| 🎮 | Entertainment | EXPENSE |
| 🏠 | Housing | EXPENSE |
| 🏥 | Healthcare | EXPENSE |
| 📚 | Education | EXPENSE |
| 💡 | Bills | EXPENSE |
| 💸 | Other Expense | EXPENSE |

---

## Troubleshooting

### Lỗi: "Table 'categories' doesn't exist"
**Giải pháp:** Chạy migration/schema script trước:
```sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Lỗi: "Duplicate entry"
**Giải pháp:** Categories đã tồn tại. Xóa và chạy lại:
```sql
DELETE FROM categories;
-- Sau đó chạy lại seed script
```

### Dropdown vẫn trống
**Kiểm tra:**
1. Backend có chạy không? (`http://localhost:8080`)
2. API `/categories` có hoạt động không?
3. Check console log trong browser (F12)
4. Verify database:
   ```sql
   SELECT COUNT(*) FROM categories;
   -- Kết quả phải là 14
   ```

---

## Future: Admin Category Management

Trong tương lai, có thể implement:
1. **Admin page** để CRUD categories
2. **User-specific categories** - Mỗi user tạo categories riêng
3. **Category templates** - Preset categories cho new users

Nhưng hiện tại, **seed data là đủ** cho MVP!

---

## Quick Command

Chạy tất cả trong 1 command:

```bash
mysql -u root -p expense_management < d:/expense-management/backend/src/main/resources/db/seed_categories.sql
```

Nhập password → Done! ✅
