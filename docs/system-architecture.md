# Hệ thống Quản lý Chi tiêu Cá nhân - Kiến trúc Tổng thể

## 1️⃣ Kiến trúc Tổng thể Hệ thống

### Sơ đồ Kiến trúc

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>SPA Application]
    end
    
    subgraph "API Gateway Layer"
        B[Spring Boot Backend<br/>REST API Server]
    end
    
    subgraph "Authentication Layer"
        C[Supabase Auth<br/>Email/Password + Google OAuth]
    end
    
    subgraph "Data Layer"
        D[(Supabase PostgreSQL<br/>Database)]
    end
    
    subgraph "AI Layer"
        E[OpenAI ChatGPT API<br/>Financial Advisor]
    end
    
    subgraph "External Services"
        F[Google OAuth Provider]
    end
    
    A -->|HTTP/HTTPS<br/>REST API Calls| B
    A -->|Auth Requests| C
    B -->|Query/Update Data| D
    B -->|AI Chat Requests| E
    C -->|Store User Data| D
    C -->|OAuth Flow| F
    B -->|Verify JWT Token| C
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px,color:#000
    style B fill:#6db33f,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#3ecf8e,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#3ecf8e,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#10a37f,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#4285f4,stroke:#333,stroke-width:2px,color:#fff
```

### Luồng Hoạt động Chính

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React Frontend
    participant BE as Spring Boot API
    participant SA as Supabase Auth
    participant DB as PostgreSQL
    participant AI as ChatGPT API
    
    Note over U,AI: Authentication Flow
    U->>FE: Login Request
    FE->>SA: Authenticate (Email/Google)
    SA->>SA: Verify Credentials
    SA->>FE: Return JWT Token
    FE->>FE: Store Token (LocalStorage)
    
    Note over U,AI: Transaction Management Flow
    U->>FE: Add Transaction
    FE->>BE: POST /api/transactions<br/>(with JWT)
    BE->>SA: Verify JWT
    SA->>BE: Token Valid + User Info
    BE->>DB: Insert Transaction
    DB->>BE: Success
    BE->>FE: Response
    FE->>U: Update UI
    
    Note over U,AI: AI Chatbot Flow
    U->>FE: Ask Question
    FE->>BE: POST /api/chat<br/>(Question + JWT)
    BE->>SA: Verify JWT
    BE->>DB: Fetch User's Financial Data
    DB->>BE: Return Data
    BE->>BE: Build Context Prompt
    BE->>AI: Send Prompt + Question
    AI->>BE: AI Response
    BE->>DB: Save Chat History
    BE->>FE: Return Answer
    FE->>U: Display Answer
```

---

## 2️⃣ Luồng Xác thực (Authentication Flow)

### Email/Password Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant SA as Supabase Auth
    participant DB as PostgreSQL
    
    Note over U,DB: Registration Flow
    U->>FE: Enter Email + Password
    FE->>SA: signUp(email, password)
    SA->>SA: Hash Password (bcrypt)
    SA->>DB: Create User Record
    SA->>U: Send Verification Email
    U->>U: Click Verification Link
    SA->>DB: Mark Email as Verified
    SA->>FE: Return JWT + Refresh Token
    
    Note over U,DB: Login Flow
    U->>FE: Enter Email + Password
    FE->>SA: signIn(email, password)
    SA->>DB: Verify Credentials
    SA->>SA: Generate JWT Token
    SA->>FE: Return JWT + Refresh Token
    FE->>FE: Store in LocalStorage
```

### Google OAuth Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as React App
    participant SA as Supabase Auth
    participant G as Google OAuth
    participant DB as PostgreSQL
    
    U->>FE: Click "Login with Google"
    FE->>SA: signInWithOAuth({provider: 'google'})
    SA->>G: Redirect to Google Login
    U->>G: Authorize App
    G->>SA: Return Authorization Code
    SA->>G: Exchange Code for Token
    G->>SA: Return User Info
    SA->>DB: Create/Update User
    SA->>FE: Redirect with JWT Token
    FE->>FE: Store Token
    FE->>U: Redirect to Dashboard
```

### Token Management

```mermaid
graph LR
    A[User Login] --> B[Supabase Issues JWT]
    B --> C[Frontend Stores Token]
    C --> D{Token Expired?}
    D -->|No| E[Use Token for API Calls]
    D -->|Yes| F[Use Refresh Token]
    F --> G[Get New JWT]
    G --> C
    E --> H[Spring Boot Validates JWT]
    H --> I{Valid?}
    I -->|Yes| J[Process Request]
    I -->|No| K[Return 401 Unauthorized]
    
    style B fill:#3ecf8e,stroke:#333,stroke-width:2px
    style H fill:#6db33f,stroke:#333,stroke-width:2px
```

---

## 3️⃣ Phân tầng Ứng dụng

### Frontend Layer (React)
- **Responsibility**: UI/UX, User Interaction, Client-side Validation
- **Technology**: React 18+, React Router, Axios, Chart.js/Recharts
- **Communication**: REST API calls to Spring Boot backend

### Backend Layer (Spring Boot)
- **Responsibility**: Business Logic, API Endpoints, Authentication, Authorization
- **Technology**: Spring Boot 3.x, Spring Security, Spring Data JPA
- **Communication**: 
  - REST API for Frontend
  - Supabase SDK for Auth verification
  - OpenAI SDK for ChatGPT

### Database Layer (Supabase PostgreSQL)
- **Responsibility**: Data Persistence, User Management
- **Technology**: PostgreSQL 15+, Supabase Auth
- **Features**: Row Level Security (RLS), Real-time subscriptions

### AI Layer (ChatGPT API)
- **Responsibility**: Financial Analysis, Recommendations
- **Technology**: OpenAI GPT-4/GPT-3.5-turbo
- **Integration**: Via Spring Boot backend

---

## 4️⃣ Bảo mật & Phân quyền

### Security Layers

```mermaid
graph TB
    A[User Request] --> B{HTTPS?}
    B -->|No| C[Reject]
    B -->|Yes| D{Valid JWT?}
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F{User Role?}
    F -->|Admin| G[Full Access]
    F -->|User| H{Own Data?}
    H -->|Yes| I[Allow]
    H -->|No| J[403 Forbidden]
    
    style B fill:#ff6b6b,stroke:#333,stroke-width:2px
    style D fill:#ffd93d,stroke:#333,stroke-width:2px
    style F fill:#6bcf7f,stroke:#333,stroke-width:2px
```

### Authentication Strategy
1. **Supabase Auth** handles user authentication
2. **JWT Token** issued by Supabase
3. **Spring Boot** validates JWT on each request
4. **Role-based Access Control** (RBAC) for User/Admin

### Data Security
- **Encryption**: HTTPS for all communications
- **Password Hashing**: Handled by Supabase (bcrypt)
- **Token Storage**: LocalStorage with HttpOnly cookies option
- **Row Level Security**: PostgreSQL RLS policies

---

## 5️⃣ Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Frontend Hosting"
            A[Vercel/Netlify<br/>React SPA]
        end
        
        subgraph "Backend Hosting"
            B[AWS/Heroku/Railway<br/>Spring Boot API]
        end
        
        subgraph "Database & Auth"
            C[Supabase Cloud<br/>PostgreSQL + Auth]
        end
        
        subgraph "CDN"
            D[CloudFlare<br/>Static Assets]
        end
    end
    
    E[Users] --> D
    D --> A
    A --> B
    B --> C
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style B fill:#6db33f,stroke:#333,stroke-width:2px
    style C fill:#3ecf8e,stroke:#333,stroke-width:2px
    style D fill:#f38020,stroke:#333,stroke-width:2px
```

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS Elastic Beanstalk, Heroku, Railway, or Render
- **Database**: Supabase Cloud (managed PostgreSQL)
- **CDN**: CloudFlare for static assets

---

## 6️⃣ Scalability Considerations

### Horizontal Scaling
- **Frontend**: CDN distribution, multiple edge locations
- **Backend**: Load balancer + multiple Spring Boot instances
- **Database**: Supabase handles scaling automatically

### Caching Strategy
```mermaid
graph LR
    A[Client Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached Data]
    B -->|No| D[Query Database]
    D --> E[Cache Result]
    E --> F[Return Data]
    
    style B fill:#ffd93d,stroke:#333,stroke-width:2px
    style C fill:#6bcf7f,stroke:#333,stroke-width:2px
```

- **Redis** for session management and frequently accessed data
- **Browser Cache** for static assets
- **API Response Cache** for reports and statistics

---

## 7️⃣ Monitoring & Logging

### Monitoring Stack
- **Application Monitoring**: Spring Boot Actuator + Prometheus
- **Error Tracking**: Sentry
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Performance**: New Relic or DataDog

### Key Metrics
- API response time
- Database query performance
- Authentication success/failure rate
- ChatGPT API usage and cost
- User activity patterns

---

## 8️⃣ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI Framework |
| | React Router | Client-side Routing |
| | Axios | HTTP Client |
| | Chart.js/Recharts | Data Visualization |
| | TailwindCSS/MUI | UI Components |
| **Backend** | Spring Boot 3.x | REST API Server |
| | Spring Security | Authentication & Authorization |
| | Spring Data JPA | Database ORM |
| | Lombok | Reduce Boilerplate |
| **Database** | Supabase PostgreSQL | Primary Database |
| | Supabase Auth | User Authentication |
| **AI** | OpenAI GPT-4 | Chatbot Intelligence |
| **DevOps** | Docker | Containerization |
| | GitHub Actions | CI/CD Pipeline |
| | Vercel/AWS | Hosting |

---

## Next Steps

Tiếp theo, tôi sẽ tạo các tài liệu chi tiết cho:
1. ✅ Kiến trúc tổng thể (hoàn thành)
2. 📋 Database Schema & ERD
3. 📋 API Specification
4. 📋 Frontend Structure
5. 📋 AI Chatbot Integration
6. 📋 Security Implementation
7. 📋 Future Enhancements
