# 💰 Hệ thống Quản lý Chi tiêu Cá nhân

Hệ thống quản lý chi tiêu cá nhân toàn diện với AI Chatbot tư vấn tài chính, được xây dựng với React, Spring Boot, Supabase và ChatGPT API.

## ✨ Tính năng chính

### 🔐 Quản lý tài khoản
- ✅ Đăng ký/Đăng nhập bằng Email & Password
- ✅ Đăng nhập với Google OAuth
- ✅ Quản lý thông tin cá nhân
- ✅ Phân quyền User/Admin

### 💸 Quản lý thu chi
- ✅ Thêm/sửa/xóa giao dịch tài chính
- ✅ Phân loại theo danh mục (ăn uống, sinh hoạt, học tập, v.v.)
- ✅ Ghi chú chi tiết cho mỗi giao dịch
- ✅ Lọc và tìm kiếm giao dịch

### 📊 Ngân sách
- ✅ Thiết lập ngân sách theo tháng
- ✅ Thiết lập ngân sách theo danh mục
- ✅ Theo dõi mức độ vượt ngân sách
- ✅ Cảnh báo khi sắp vượt ngân sách

### 📈 Thống kê & Báo cáo
- ✅ Báo cáo theo ngày/tháng/năm
- ✅ Phân tích theo danh mục
- ✅ Biểu đồ trực quan (cột, tròn, đường)
- ✅ So sánh giữa các kỳ

### 🤖 AI Chatbot
- ✅ Hỏi đáp về chi tiêu cá nhân
- ✅ Phân tích xu hướng chi tiêu
- ✅ Gợi ý tiết kiệm
- ✅ Tư vấn tài chính thông minh


## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP Client
- **Recharts** - Data Visualization
- **Lucide React** - Icons

### Backend
- **Java 17** - Programming Language
- **Spring Boot 3.2** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - ORM
- **PostgreSQL** - Database (via Supabase)
- **JWT** - Token Authentication


### AI
- **Gemini 2.0** - AI Chatbot

## 📦 Cấu trúc Project

```
expense-management/
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── pages/        # Page Components
│   │   ├── services/     # API Services
│   │   ├── contexts/     # React Contexts
│   │   └── App.jsx       # Main App
│   ├── package.json
│   └── README.md
│
├── backend/              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/expense/management/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       ├── security/
│   │   │   │       └── exception/
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
└── README.md             # This file
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- **Node.js** 18+
- **Java** 17+
- **Maven** 3.6+
- **Supabase Account** (miễn phí)
- **OpenAI API Key**

### 1. Clone Repository

```bash
git clone <repository-url>
cd expense-management
```

### 2. Cấu hình MySQL



### 3. Cấu hình Backend

```bash
cd backend
cp .env.example .env
# Cập nhật thông tin Supabase và OpenAI trong .env
mvn clean install
```

### 4. Cấu hình Frontend

```bash
cd frontend
cp .env.example .env
# Cập nhật thông tin Supabase trong .env
npm install
```

### 5. Chạy ứng dụng

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Truy cập: `http://localhost:5173`

## 📚 Documentation

- [System Architecture](./system-architecture.md) - Kiến trúc tổng thể
- [Database Schema](./database-schema.md) - Thiết kế database
- [API Documentation](./backend-api.md) - API endpoints
- [Frontend Guide](./frontend/README.md) - Frontend setup
- [Backend Guide](./backend/README.md) - Backend setup

## 🔐 Bảo mật

- ✅ HTTPS cho tất cả communications
- ✅ JWT token authentication
- ✅ Password hashing (Supabase bcrypt)
- ✅ Row Level Security (RLS) trong PostgreSQL
- ✅ CORS configuration
- ✅ Role-based access control (RBAC)

## 🧪 Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Heroku/Railway)
```bash
cd backend
mvn clean package
# Deploy JAR file to your platform
```

## 🎯 Roadmap

### Phase 1 (Hoàn thành) ✅
- [x] Authentication với Supabase
- [x] CRUD Transactions
- [x] Budget Management
- [x] Basic Reports
- [x] AI Chatbot Integration

### Phase 2 (Đang phát triển) 🚧
- [ ] Mobile App (React Native)
- [ ] Xuất báo cáo PDF
- [ ] Email notifications
- [ ] Recurring transactions
- [ ] Multi-currency support

### Phase 3 (Tương lai) 📋
- [ ] AI phân tích xu hướng nâng cao
- [ ] Tích hợp ngân hàng
- [ ] Chia sẻ báo cáo
- [ ] Social features
- [ ] Investment tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Supabase team for amazing BaaS platform
- OpenAI for GPT-4 API
- Spring Boot community
- React community

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

**Made with ❤️ by Your Name**
