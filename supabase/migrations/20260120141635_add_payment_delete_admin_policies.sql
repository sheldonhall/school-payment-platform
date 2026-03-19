/*
  # Add admin policies for guardians table

  1. Changes
    - Add DELETE policy to allow admins to delete payments

  2. Security
    - Only authenticated users with admin role can insert, update, or delete guardians
    - Uses JWT token to verify admin role from app_metadata
*/

CREATE POLICY "Admins can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    ((auth.jwt() -> 'app_metadata') ->> 'role' = 'admin')
  );