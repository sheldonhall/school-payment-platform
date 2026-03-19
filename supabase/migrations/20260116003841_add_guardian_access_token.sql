/*
  # Add access_token to guardians table

  1. Changes
    - Add `access_token` column to `guardians` table
      - Type: text
      - Unique constraint
      - Indexed for fast lookups
      - Default: generates random token using gen_random_uuid()
    - Backfill existing guardians with unique access tokens
  
  2. Purpose
    - Allows guardians to be found quickly using a unique access token
    - More user-friendly than using UUIDs in URLs
    - Indexed for optimal query performance
*/

-- Add access_token column with unique constraint and index
ALTER TABLE guardians 
ADD COLUMN IF NOT EXISTS access_token text 
UNIQUE 
DEFAULT replace(gen_random_uuid()::text, '-', '');

-- Create an index on access_token for fast lookups
CREATE INDEX IF NOT EXISTS idx_guardians_access_token ON guardians(access_token);

-- Backfill existing guardians with unique tokens if they don't have one
UPDATE guardians 
SET access_token = replace(gen_random_uuid()::text, '-', '')
WHERE access_token IS NULL;

-- Make access_token NOT NULL after backfilling
ALTER TABLE guardians 
ALTER COLUMN access_token SET NOT NULL;
