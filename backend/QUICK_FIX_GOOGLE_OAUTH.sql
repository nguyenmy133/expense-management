-- =====================================================
-- QUICK FIX: Make password column nullable for Google OAuth
-- Run this SQL directly in your MySQL database
-- =====================================================

USE expense_management;

-- Step 1: Make password nullable (CRITICAL FIX)
ALTER TABLE profiles 
MODIFY COLUMN password VARCHAR(255) NULL COMMENT 'Hashed password (null for OAuth users)';

-- Step 2: Add auth_provider column if not exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL' COMMENT 'Authentication provider: LOCAL or GOOGLE';

-- Step 3: Add google_id column if not exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE COMMENT 'Google user ID for OAuth authentication';

-- Step 4: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_google_id ON profiles(google_id);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_provider ON profiles(auth_provider);

-- Verify the changes
DESCRIBE profiles;

SELECT 'Migration completed successfully!' AS status;
