/*
  # Add INSERT and UPDATE Policies for Students

  ## Overview
  Add missing RLS policies to allow admins to create and update students.

  ## Changes

  1. **Add Policies to students table**
     - INSERT policy for admins
     - UPDATE policy for admins

  ## Security
  - Only authenticated users with admin role can insert students
  - Only authenticated users with admin role can update students
*/

-- Add INSERT policy for admins
CREATE POLICY "Admins can insert students"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Add UPDATE policy for admins
CREATE POLICY "Admins can update students"
  ON students
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND users.raw_app_meta_data->>'role' = 'admin'
    )
  );