/*
  # Fix All RLS Policies to Use JWT Instead of auth.users

  ## Overview
  Replace all policies that query auth.users directly with policies that use auth.jwt()
  to avoid permission denied errors.

  ## Changes

  1. **Fix classes table policies**
     - Replace DELETE policy to use JWT

  2. **Fix payments table policies**
     - Replace "Admins can manage all payments" policy to use JWT

  3. **Fix student_guardians table policies**
     - Replace DELETE policy to use JWT

  4. **Fix teachers table policies**
     - Replace DELETE policy to use JWT

  ## Security
  - All policies maintain the same security level
  - Only admins can perform restricted operations
*/

-- Fix classes table
DROP POLICY IF EXISTS "Admins can delete classes" ON classes;

CREATE POLICY "Admins can delete classes"
  ON classes
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );

-- Fix payments table
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;

CREATE POLICY "Admins can manage all payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );

-- Fix student_guardians table
DROP POLICY IF EXISTS "Admins can delete student guardian relationships" ON student_guardians;

CREATE POLICY "Admins can delete student guardian relationships"
  ON student_guardians
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );

-- Fix teachers table
DROP POLICY IF EXISTS "Admins can delete teachers" ON teachers;

CREATE POLICY "Admins can delete teachers"
  ON teachers
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role' = 'admin' OR auth.jwt()->'app_metadata'->>'role' = 'admin')
  );