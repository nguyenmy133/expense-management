-- Seed Categories for Expense Management App
-- Run this SQL script to populate initial categories

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

-- Verify
SELECT * FROM categories ORDER BY type, name;
