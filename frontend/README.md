# Expense Management Frontend

Frontend cho hệ thống quản lý chi tiêu cá nhân với React, Supabase Authentication và tích hợp AI Chatbot.

## 🚀 Công nghệ

- **React 18** - UI Library
- **Vite** - Build tool & Dev server
- **React Router** - Client-side routing
- **Supabase** - Authentication & Database
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **TailwindCSS** (via inline styles) - Styling

## 📋 Yêu cầu

- Node.js 18+ 
- npm hoặc yarn
- Supabase account

## ⚙️ Cài đặt

### 1. Install dependencies

```bash
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các giá trị:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🏃 Chạy ứng dụng

### Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Cấu trúc Project

```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── transactions/   # Transaction components
│   ├── budget/         # Budget components
│   ├── reports/        # Report components
│   └── chat/           # AI Chat components
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── BudgetPage.jsx
│   ├── ReportsPage.jsx
│   └── ChatPage.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── services/           # API services
│   ├── supabase.js
│   └── api.js
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## 🔐 Authentication Flow

1. User đăng ký/đăng nhập qua Supabase
2. Supabase trả về JWT token
3. Token được lưu trong session
4. Mọi API call đều gửi kèm token trong header
5. Backend verify token và xử lý request

## 📡 API Integration

Tất cả API calls đều thông qua `apiService` trong `src/services/api.js`:

```javascript
import { apiService } from './services/api';

// Example usage
const transactions = await apiService.getTransactions({
  page: 0,
  size: 20,
  type: 'expense'
});
```

## 🎨 Styling

Project sử dụng inline Tailwind-style classes. Để thêm Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 🧪 Testing

```bash
npm run test
```

## 📦 Build & Deploy

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

## 🔧 Development Tips

- Sử dụng React DevTools để debug
- Check console cho errors
- Verify API endpoints trong Network tab
- Test authentication flow thoroughly

## 📝 License

MIT

## 👥 Contributors

- Your Name
