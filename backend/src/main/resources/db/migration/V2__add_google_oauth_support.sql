-- Migration for Google OAuth Support
-- Add auth_provider and google_id columns to profiles table
-- Make password nullable for Google OAuth users

-- Add auth_provider column (default to LOCAL for existing users)
ALTER TABLE profiles 
ADD COLUMN auth_provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL' COMMENT 'Authentication provider: LOCAL or GOOGLE';

-- Add google_id column (unique for Google users)
ALTER TABLE profiles 
ADD COLUMN google_id VARCHAR(255) UNIQUE COMMENT 'Google user ID for OAuth authentication';

-- Make password nullable (Google users don't have password)
ALTER TABLE profiles 
MODIFY COLUMN password VARCHAR(255) NULL COMMENT 'Hashed password (null for OAuth users)';

-- Add index for faster Google ID lookups
CREATE INDEX idx_profiles_google_id ON profiles(google_id);

-- Add index for auth_provider
CREATE INDEX idx_profiles_auth_provider ON profiles(auth_provider);
