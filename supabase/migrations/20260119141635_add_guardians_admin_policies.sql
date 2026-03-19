/*
  # Add admin policies for guardians table

  1. Changes
    - Add INSERT policy to allow admins to create guardians
    - Add UPDATE policy to allow admins to update guardian information
    - Add DELETE policy to allow admins to delete guardians

  2. Security
    - Only authenticated users with admin role can insert, update, or delete guardians
    - Uses JWT token to verify admin role from app_metadata
*/

CREATE POLICY "Admins can insert guardians"
  ON guardians FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can update guardians"
  ON guardians FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  );

CREATE POLICY "Admins can delete guardians"
  ON guardians FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  );
