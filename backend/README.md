# Expense Management Backend - MySQL Version

Backend cho hệ thống quản lý chi tiêu cá nhân với **MySQL Database** và **Custom Authentication**.

## 🚀 Công nghệ

- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security** - Custom JWT Authentication
- **Spring Data JPA** - Database ORM
- **MySQL 8.0+** - Database
- **JWT** - Token-based authentication
- **OpenAI GPT-4** - AI Chatbot
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool

## 📋 Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Maven 3.6+
- MySQL 8.0+ (hoặc MySQL Workbench)
- OpenAI API key

## ⚙️ Cấu hình

### 1. Cài đặt MySQL

Xem hướng dẫn chi tiết trong [MYSQL_SETUP.md](../MYSQL_SETUP.md)

**Quick start:**
```bash
# Windows: Download từ https://dev.mysql.com/downloads/installer/
# Mac: brew install mysql
# Linux: sudo apt-get install mysql-server
```

### 2. Tạo Database

**Option 1: Sử dụng MySQL Workbench (Recommended)**
1. Mở MySQL Workbench
2. Connect to Local instance
3. Open SQL Script: `src/main/resources/schema.sql`
4. Execute script

**Option 2: Command Line**
```bash
mysql -u root -p
source /path/to/backend/src/main/resources/schema.sql
```

### 3. Cấu hình Environment Variables

File `application.properties` đã được cấu hình sẵn với:
- Database: `expense_management`
- User: `root`
- Password: `123456`

**Nếu bạn dùng password khác**, update trong `application.properties`:

```properties
spring.datasource.password=your_password
```

Hoặc tạo file `.env` (optional):
```env
MYSQL_PASSWORD=your_password
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-secret-key-min-256-bits
```

## 🏃 Chạy ứng dụng

### Development Mode

```bash
mvn spring-boot:run
```

**Expected output:**
```
Hibernate: create table if not exists budgets ...
Hibernate: create table if not exists categories ...
...
Started ExpenseManagementApplication in 3.456 seconds
```

### Build Production

```bash
mvn clean package
java -jar target/expense-management-1.0.0.jar
```

## 📡 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
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

### Authentication (Custom JWT)
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Transactions
```http
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}
GET    /api/transactions/statistics
```

### Categories
```http
GET    /api/categories
POST   /api/categories (Admin only)
PUT    /api/categories/{id} (Admin only)
DELETE /api/categories/{id} (Admin only)
```

### Budgets
```http
GET    /api/budgets
POST   /api/budgets
DELETE /api/budgets/{id}
GET    /api/budgets/status
```

### Reports
```http
GET /api/reports/monthly
GET /api/reports/yearly
GET /api/reports/category/{categoryId}
```

### AI Chat
```http
POST /api/chat
GET  /api/chat/history
DELETE /api/chat/history
```

## 🔐 Authentication

API sử dụng **Custom JWT Authentication** (không dùng Supabase).

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "user"
    }
  }
}
```

### Use Token
```http
GET /api/transactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testing

```bash
mvn test
```

## 📦 Project Structure

```
src/
├── main/
│   ├── java/com/expense/management/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access layer
│   │   ├── model/           # Entities & DTOs
│   │   ├── security/        # Security components
│   │   ├── exception/       # Exception handling
│   │   └── util/            # Utility classes
│   └── resources/
│       ├── application.properties  # Configuration
│       └── schema.sql              # MySQL schema
└── test/                    # Unit & Integration tests
```

## 🗄️ Database Schema

```
expense_management
├── profiles (5 columns)      # User accounts
├── categories (7 columns)    # Income/Expense categories
├── transactions (9 columns)  # Financial transactions
├── budgets (8 columns)       # Monthly budgets
└── chat_history (6 columns)  # AI chat conversations
```

**Default Categories:** 13 categories (4 INCOME + 9 EXPENSE)

## 🔧 Development

### Code Style
- Sử dụng Lombok để giảm boilerplate
- Follow Java naming conventions
- Write meaningful commit messages

### Git Workflow
```bash
git checkout -b feature/your-feature-name
# Make changes
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

## 🐛 Troubleshooting

### MySQL Connection Error

**Error:** `Communications link failure`

**Solution:**
- Kiểm tra MySQL service đang chạy
- Verify username/password trong `application.properties`
- Check port 3306 không bị block

### Database Not Found

**Error:** `Unknown database 'expense_management'`

**Solution:**
```bash
mysql -u root -p
source /path/to/schema.sql
```

### JWT Secret Error

**Error:** `JWT secret key must be at least 256 bits`

**Solution:**
Update `jwt.secret` trong `application.properties` với key dài hơn (>= 32 characters)

## 📝 License

MIT License

## 👥 Contributors

- Your Name - Initial work

## 📞 Support

For issues and questions, please create an issue on GitHub.
