/*
  # Add INSERT and UPDATE policies for student_guardians table

  1. Changes
    - Add INSERT policy to allow admins to create student-guardian relationships
    - Add UPDATE policy to allow admins to update student-guardian relationships (e.g., changing relationship type or primary status)

  2. Security
    - Only authenticated users with admin role can insert or update student-guardian relationships
    - Uses JWT token to verify admin role from app_metadata
*/

CREATE POLICY "Admins can insert student guardian relationships"
  ON student_guardians FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can update student guardian relationships"
  ON student_guardians FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  );
