# Backend API - Spring Boot

## 3️⃣ Backend – Spring Boot

### Cấu trúc Project

```
expense-management-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── expense/
│   │   │           └── management/
│   │   │               ├── ExpenseManagementApplication.java
│   │   │               ├── config/
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── SupabaseConfig.java
│   │   │               │   ├── OpenAIConfig.java
│   │   │               │   └── CorsConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── TransactionController.java
│   │   │               │   ├── CategoryController.java
│   │   │               │   ├── BudgetController.java
│   │   │               │   ├── ReportController.java
│   │   │               │   ├── ChatController.java
│   │   │               │   └── AdminController.java
│   │   │               ├── service/
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── TransactionService.java
│   │   │               │   ├── CategoryService.java
│   │   │               │   ├── BudgetService.java
│   │   │               │   ├── ReportService.java
│   │   │               │   ├── ChatService.java
│   │   │               │   └── SupabaseAuthService.java
│   │   │               ├── repository/
│   │   │               │   ├── ProfileRepository.java
│   │   │               │   ├── TransactionRepository.java
│   │   │               │   ├── CategoryRepository.java
│   │   │               │   ├── BudgetRepository.java
│   │   │               │   └── ChatHistoryRepository.java
│   │   │               ├── model/
│   │   │               │   ├── entity/
│   │   │               │   │   ├── Profile.java
│   │   │               │   │   ├── Transaction.java
│   │   │               │   │   ├── Category.java
│   │   │               │   │   ├── Budget.java
│   │   │               │   │   └── ChatHistory.java
│   │   │               │   └── dto/
│   │   │               │       ├── request/
│   │   │               │       │   ├── TransactionRequest.java
│   │   │               │       │   ├── BudgetRequest.java
│   │   │               │       │   ├── ChatRequest.java
│   │   │               │       │   └── CategoryRequest.java
│   │   │               │       └── response/
│   │   │               │           ├── TransactionResponse.java
│   │   │               │           ├── BudgetResponse.java
│   │   │               │           ├── ReportResponse.java
│   │   │               │           ├── ChatResponse.java
│   │   │               │           └── ApiResponse.java
│   │   │               ├── security/
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── SupabaseTokenValidator.java
│   │   │               │   └── UserPrincipal.java
│   │   │               ├── exception/
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   ├── ResourceNotFoundException.java
│   │   │               │   ├── UnauthorizedException.java
│   │   │               │   └── BadRequestException.java
│   │   │               └── util/
│   │   │                   ├── DateUtil.java
│   │   │                   └── ResponseUtil.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
│       └── java/
│           └── com/
│               └── expense/
│                   └── management/
│                       ├── controller/
│                       ├── service/
│                       └── integration/
├── pom.xml
└── README.md
```

---

### Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    
    <groupId>com.expense</groupId>
    <artifactId>expense-management</artifactId>
    <version>1.0.0</version>
    <name>Expense Management API</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- OpenAI Java SDK -->
        <dependency>
            <groupId>com.theokanning.openai-gpt3-java</groupId>
            <artifactId>service</artifactId>
            <version>0.18.2</version>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

### Configuration (application.yml)

```yaml
spring:
  application:
    name: expense-management-api
  
  datasource:
    url: ${SUPABASE_DB_URL}
    username: ${SUPABASE_DB_USER}
    password: ${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${SUPABASE_URL}/auth/v1

# Supabase Configuration
supabase:
  url: ${SUPABASE_URL}
  api-key: ${SUPABASE_ANON_KEY}
  jwt-secret: ${SUPABASE_JWT_SECRET}

# OpenAI Configuration
openai:
  api-key: ${OPENAI_API_KEY}
  model: gpt-4-turbo-preview
  max-tokens: 1000
  temperature: 0.7

# Server Configuration
server:
  port: 8080
  servlet:
    context-path: /api

# CORS Configuration
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

---

## 📡 API Endpoints

### Base URL: `/api`

### 1. Authentication APIs

#### 1.1 Verify Token (Internal)
```http
GET /api/auth/verify
Authorization: Bearer {supabase_jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### 1.2 Get Current User Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://...",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 1.3 Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "avatarUrl": "https://..."
}
```

---

### 2. Transaction APIs

#### 2.1 Get All Transactions
```http
GET /api/transactions?page=0&size=20&type=expense&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 20)
- `type`: `income` | `expense` | `all` (default: all)
- `categoryId`: Filter by category UUID
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "amount": 50000,
        "type": "expense",
        "category": {
          "id": "uuid",
          "name": "Ăn uống",
          "icon": "🍔",
          "color": "#FF6B6B"
        },
        "transactionDate": "2024-01-15",
        "note": "Ăn trưa",
        "createdAt": "2024-01-15T12:00:00Z"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "currentPage": 0
  }
}
```

#### 2.2 Create Transaction
```http
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "uuid",
  "amount": 50000,
  "type": "expense",
  "transactionDate": "2024-01-15",
  "note": "Ăn trưa"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": "uuid",
    "amount": 50000,
    "type": "expense",
    "category": {...},
    "transactionDate": "2024-01-15",
    "note": "Ăn trưa"
  }
}
```

#### 2.3 Update Transaction
```http
PUT /api/transactions/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "uuid",
  "amount": 60000,
  "type": "expense",
  "transactionDate": "2024-01-15",
  "note": "Ăn trưa (updated)"
}
```

#### 2.4 Delete Transaction
```http
DELETE /api/transactions/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

#### 2.5 Get Transaction Statistics
```http
GET /api/transactions/statistics?month=1&year=2024
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 10000000,
    "totalExpense": 7500000,
    "balance": 2500000,
    "transactionCount": 45,
    "topCategories": [
      {
        "categoryId": "uuid",
        "categoryName": "Ăn uống",
        "amount": 2000000,
        "percentage": 26.67
      }
    ]
  }
}
```

---

### 3. Category APIs

#### 3.1 Get All Categories
```http
GET /api/categories?type=expense
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Ăn uống",
      "type": "expense",
      "icon": "🍔",
      "color": "#FF6B6B",
      "isDefault": true
    }
  ]
}
```

#### 3.2 Create Category (Admin only)
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Du lịch",
  "type": "expense",
  "icon": "✈️",
  "color": "#4ECDC4"
}
```

#### 3.3 Update Category (Admin only)
```http
PUT /api/categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Du lịch Updated",
  "icon": "🏖️",
  "color": "#95E1D3"
}
```

#### 3.4 Delete Category (Admin only)
```http
DELETE /api/categories/{id}
Authorization: Bearer {token}
```

---

### 4. Budget APIs

#### 4.1 Get Budgets
```http
GET /api/budgets?month=1&year=2024
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "category": {
        "id": "uuid",
        "name": "Ăn uống"
      },
      "amount": 3000000,
      "spent": 2500000,
      "remaining": 500000,
      "percentage": 83.33,
      "isExceeded": false,
      "month": 1,
      "year": 2024
    }
  ]
}
```

#### 4.2 Create/Update Budget
```http
POST /api/budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "uuid",
  "amount": 3000000,
  "month": 1,
  "year": 2024
}
```

#### 4.3 Delete Budget
```http
DELETE /api/budgets/{id}
Authorization: Bearer {token}
```

#### 4.4 Check Budget Status
```http
GET /api/budgets/status?month=1&year=2024
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBudget": 10000000,
    "totalSpent": 7500000,
    "totalRemaining": 2500000,
    "overallPercentage": 75,
    "exceededCategories": [
      {
        "categoryName": "Giải trí",
        "budgetAmount": 1000000,
        "spentAmount": 1200000,
        "exceededBy": 200000
      }
    ]
  }
}
```

---

### 5. Report APIs

#### 5.1 Get Monthly Report
```http
GET /api/reports/monthly?month=1&year=2024
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "month": 1,
      "year": 2024
    },
    "summary": {
      "totalIncome": 10000000,
      "totalExpense": 7500000,
      "balance": 2500000,
      "savingRate": 25
    },
    "categoryBreakdown": [
      {
        "categoryId": "uuid",
        "categoryName": "Ăn uống",
        "amount": 2000000,
        "percentage": 26.67,
        "transactionCount": 30
      }
    ],
    "dailyTrend": [
      {
        "date": "2024-01-01",
        "income": 0,
        "expense": 150000
      }
    ]
  }
}
```

#### 5.2 Get Yearly Report
```http
GET /api/reports/yearly?year=2024
Authorization: Bearer {token}
```

#### 5.3 Get Category Report
```http
GET /api/reports/category/{categoryId}?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

#### 5.4 Get Comparison Report
```http
GET /api/reports/comparison?period1=2024-01&period2=2024-02
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period1": {
      "label": "2024-01",
      "totalIncome": 10000000,
      "totalExpense": 7500000
    },
    "period2": {
      "label": "2024-02",
      "totalIncome": 12000000,
      "totalExpense": 8000000
    },
    "changes": {
      "incomeChange": 20,
      "expenseChange": 6.67,
      "balanceChange": 50
    }
  }
}
```

---

### 6. AI Chat APIs

#### 6.1 Send Chat Message
```http
POST /api/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Tháng này tôi chi tiêu bao nhiêu?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Tháng này tôi chi tiêu bao nhiêu?",
    "response": "Trong tháng 1/2024, bạn đã chi tiêu tổng cộng 7.500.000 VNĐ. Trong đó, danh mục chi tiêu nhiều nhất là Ăn uống với 2.000.000 VNĐ (26.67%), tiếp theo là Sinh hoạt với 1.500.000 VNĐ (20%).",
    "contextData": {
      "month": 1,
      "year": 2024,
      "totalExpense": 7500000,
      "topCategories": [...]
    },
    "timestamp": "2024-01-20T10:30:00Z"
  }
}
```

#### 6.2 Get Chat History
```http
GET /api/chat/history?page=0&size=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "message": "Tháng này tôi chi tiêu bao nhiêu?",
        "response": "Trong tháng 1/2024...",
        "createdAt": "2024-01-20T10:30:00Z"
      }
    ],
    "totalElements": 50,
    "totalPages": 3
  }
}
```

#### 6.3 Clear Chat History
```http
DELETE /api/chat/history
Authorization: Bearer {token}
```

---

### 7. Admin APIs

#### 7.1 Get All Users (Admin only)
```http
GET /api/admin/users?page=0&size=20
Authorization: Bearer {token}
```

#### 7.2 Update User Role (Admin only)
```http
PUT /api/admin/users/{userId}/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "admin"
}
```

#### 7.3 Get System Statistics (Admin only)
```http
GET /api/admin/statistics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "activeUsers": 750,
    "totalTransactions": 50000,
    "totalChatMessages": 10000,
    "systemHealth": "healthy"
  }
}
```

---

## 🔐 JWT & Supabase Auth Integration

### Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private SupabaseTokenValidator tokenValidator;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/verify").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(tokenValidator);
    }
}
```

### JWT Authentication Filter

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private SupabaseTokenValidator tokenValidator;
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        
        String token = extractToken(request);
        
        if (token != null && tokenValidator.validateToken(token)) {
            UserPrincipal user = tokenValidator.getUserFromToken(token);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities()
                );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

## 📊 Error Handling

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse> handleBadRequest(BadRequestException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneral(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("Internal server error"));
    }
}
```

### Standard Error Response

```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "NOT_FOUND",
    "details": "Transaction with id 'uuid' not found"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## Next Steps

✅ API Specification hoàn thành! Tiếp theo:
1. ✅ Kiến trúc tổng thể
2. ✅ Database Schema
3. ✅ API Specification
4. 📋 Frontend Structure (React)
5. 📋 AI Chatbot Integration
6. 📋 Security Implementation
7. 📋 Future Enhancements
