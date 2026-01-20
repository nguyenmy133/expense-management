-- ===================================
-- EXPENSE MANAGEMENT SYSTEM - MySQL Schema
-- ===================================
-- Database: expense_management
-- Version: 1.0
-- Created: 2026-01-17
-- ===================================

-- Create database
CREATE DATABASE IF NOT EXISTS expense_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE expense_management;

-- ===================================
-- TABLE: profiles
-- Description: User profiles and authentication
-- ===================================
CREATE TABLE profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_profiles_email (email),
    INDEX idx_profiles_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABLE: categories
-- Description: Transaction categories (income/expense)
-- ===================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT '#3B82F6',
    is_default BOOLEAN DEFAULT FALSE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_name_type (name, type),
    INDEX idx_categories_type (type),
    INDEX idx_categories_created_by (created_by),
    
    FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABLE: transactions
-- Description: Financial transactions (income/expense)
-- ===================================
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    transaction_date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_transactions_user_id (user_id),
    INDEX idx_transactions_category_id (category_id),
    INDEX idx_transactions_date (transaction_date),
    INDEX idx_transactions_type (type),
    INDEX idx_transactions_user_date (user_id, transaction_date DESC),
    
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABLE: budgets
-- Description: Monthly budgets by category
-- ===================================
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL CHECK (year >= 2020),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_category_period (user_id, category_id, month, year),
    INDEX idx_budgets_user_id (user_id),
    INDEX idx_budgets_category_id (category_id),
    INDEX idx_budgets_month_year (month, year),
    INDEX idx_budgets_user_period (user_id, year, month),
    
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABLE: chat_history
-- Description: AI chatbot conversation history
-- ===================================
CREATE TABLE chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_chat_history_user_id (user_id),
    INDEX idx_chat_history_created_at (created_at DESC),
    INDEX idx_chat_history_user_date (user_id, created_at DESC),
    
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- DEFAULT DATA: Insert default categories
-- ===================================
INSERT INTO categories (name, type, icon, is_default) VALUES
    -- Income categories
    ('Lương', 'INCOME', '💰', TRUE),
    ('Thưởng', 'INCOME', '🎁', TRUE),
    ('Đầu tư', 'INCOME', '📈', TRUE),
    ('Khác', 'INCOME', '💵', TRUE),
    
    -- Expense categories
    ('Ăn uống', 'EXPENSE', '🍔', TRUE),
    ('Sinh hoạt', 'EXPENSE', '🏠', TRUE),
    ('Học tập', 'EXPENSE', '📚', TRUE),
    ('Mua sắm', 'EXPENSE', '🛍️', TRUE),
    ('Giải trí', 'EXPENSE', '🎮', TRUE),
    ('Y tế', 'EXPENSE', '⚕️', TRUE),
    ('Di chuyển', 'EXPENSE', '🚗', TRUE),
    ('Hóa đơn', 'EXPENSE', '📄', TRUE),
    ('Khác', 'EXPENSE', '📦', TRUE);

-- ===================================
-- VIEWS: Useful views for reporting
-- ===================================

-- View: Monthly summary by user
CREATE OR REPLACE VIEW v_monthly_summary AS
SELECT 
    user_id,
    YEAR(transaction_date) AS year,
    MONTH(transaction_date) AS month,
    type,
    SUM(amount) AS total_amount,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, year, month, type;

-- View: Category summary by user and month
CREATE OR REPLACE VIEW v_category_summary AS
SELECT 
    t.user_id,
    t.category_id,
    c.name AS category_name,
    c.type,
    YEAR(t.transaction_date) AS year,
    MONTH(t.transaction_date) AS month,
    SUM(t.amount) AS total_amount,
    COUNT(*) AS transaction_count
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, t.category_id, c.name, c.type, year, month;

-- ===================================
-- STORED PROCEDURES
-- ===================================

-- Procedure: Check budget status
DELIMITER //
CREATE PROCEDURE check_budget_status(
    IN p_user_id BIGINT,
    IN p_month INT,
    IN p_year INT
)
BEGIN
    SELECT 
        b.id AS budget_id,
        b.category_id,
        c.name AS category_name,
        b.amount AS budget_amount,
        COALESCE(SUM(t.amount), 0) AS spent_amount,
        b.amount - COALESCE(SUM(t.amount), 0) AS remaining,
        ROUND((COALESCE(SUM(t.amount), 0) / b.amount * 100), 2) AS percentage,
        CASE 
            WHEN COALESCE(SUM(t.amount), 0) > b.amount THEN TRUE 
            ELSE FALSE 
        END AS is_exceeded
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN transactions t ON 
        t.user_id = b.user_id 
        AND t.category_id = b.category_id
        AND MONTH(t.transaction_date) = b.month
        AND YEAR(t.transaction_date) = b.year
        AND t.type = 'EXPENSE'
    WHERE 
        b.user_id = p_user_id
        AND b.month = p_month
        AND b.year = p_year
    GROUP BY b.id, b.category_id, c.name, b.amount;
END //
DELIMITER ;

-- ===================================
-- SAMPLE DATA (Optional - for testing)
-- ===================================

-- Uncomment to insert sample data

-- INSERT INTO profiles (email, full_name, role) VALUES
--     ('admin@expense.com', 'Admin User', 'admin'),
--     ('user@expense.com', 'Test User', 'user');

-- INSERT INTO transactions (user_id, category_id, amount, type, transaction_date, note) VALUES
--     (2, 5, 50000, 'EXPENSE', '2024-01-15', 'Ăn trưa'),
--     (2, 1, 10000000, 'INCOME', '2024-01-01', 'Lương tháng 1');

-- INSERT INTO budgets (user_id, category_id, amount, month, year) VALUES
--     (2, 5, 3000000, 1, 2024);

-- ===================================
-- VERIFICATION QUERIES
-- ===================================

-- Show all tables
SHOW TABLES;

-- Show table structures
-- DESCRIBE profiles;
-- DESCRIBE categories;
-- DESCRIBE transactions;
-- DESCRIBE budgets;
-- DESCRIBE chat_history;

-- Count records
-- SELECT 'profiles' AS table_name, COUNT(*) AS count FROM profiles
-- UNION ALL
-- SELECT 'categories', COUNT(*) FROM categories
-- UNION ALL
-- SELECT 'transactions', COUNT(*) FROM transactions
-- UNION ALL
-- SELECT 'budgets', COUNT(*) FROM budgets
-- UNION ALL
-- SELECT 'chat_history', COUNT(*) FROM chat_history;

-- ===================================
-- END OF SCHEMA
-- ===================================
