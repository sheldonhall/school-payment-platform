/*
  # Fix Students RLS Policies to Use JWT

  ## Overview
  Replace policies that query auth.users directly with policies that use auth.jwt()
  to check the user role from their JWT token app_metadata.

  ## Changes

  1. Drop existing policies that cause permission errors
  2. Create new policies using auth.jwt() to check admin role

  ## Security
  - Only authenticated users with admin role can insert, update, or delete students
  - All authenticated users can view students
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view students" ON students;
DROP POLICY IF EXISTS "Admins can insert students" ON students;
DROP POLICY IF EXISTS "Admins can update students" ON students;
DROP POLICY IF EXISTS "Admins can delete students" ON students;

-- SELECT policy for authenticated users
CREATE POLICY "Authenticated users can view students"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT policy for admins
CREATE POLICY "Admins can insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );

-- UPDATE policy for admins
CREATE POLICY "Admins can update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  )
  WITH CHECK (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );

-- DELETE policy for admins
CREATE POLICY "Admins can delete students"
  ON students
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );