-- ============================================
-- UPDATE DATABASE SCHEMA FOR SESSION MANAGEMENT
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Add session_id column to chats table
ALTER TABLE chats 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Step 2: Add user_id column for future user management
ALTER TABLE chats 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Step 3: Create index for session_id performance
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats(session_id);

-- Step 4: Create index for created_at (for history queries)
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);

-- Step 5: Create index for user_id (for future user management)
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);

-- Step 6: Verify the schema update
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'chats' 
ORDER BY ordinal_position;

-- Expected output should show:
-- - id (bigint, NO)
-- - created_at (timestamp with time zone, YES)
-- - session_id (text, YES)  <-- NEW
-- - user_id (text, YES)      <-- NEW
-- - user_message (text, YES)
-- - ai_reply (text, YES)
-- - mode (text, YES)
-- - message (text, YES) - might exist from old schema

-- ============================================
-- CLEANUP OLD DATA (OPTIONAL)
-- ============================================
-- If you want to clean up old mixed data, uncomment:
-- DELETE FROM chats WHERE session_id IS NULL;
-- ============================================