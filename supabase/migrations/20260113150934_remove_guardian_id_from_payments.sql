/*
  # Remove redundant guardian_id from payments table

  ## Overview
  The `guardian_id` column in the payments table is redundant since guardian information
  can always be derived through the relationship:
  payments -> payment_item_students -> students -> student_guardians -> guardians

  ## Changes

  1. **Drop existing RLS policies that reference guardian_id**
     - Drop policies that use the guardian_id column

  2. **Drop guardian_id column**
     - Remove the redundant guardian_id column from payments table

  3. **Recreate RLS policies**
     - Update INSERT policy to rely solely on relationship-based checks
     - Update UPDATE policy to use relationship-based guardian verification
     - Both policies verify guardian ownership through proper relationships

  ## Security
  RLS policies remain secure by verifying guardian ownership through the proper relationships:
  - For INSERT: Verify the payment_item_student belongs to a student linked to the guardian
  - For UPDATE: Verify the payment belongs to an obligation for the guardian's student
*/

-- Step 1: Drop existing policies that reference guardian_id
DROP POLICY IF EXISTS "Guardians can create payments for their students" ON payments;
DROP POLICY IF EXISTS "Guardians can update their own payments" ON payments;

-- Step 2: Drop the redundant guardian_id column
ALTER TABLE payments DROP COLUMN IF EXISTS guardian_id;

-- Step 3: Recreate INSERT policy without guardian_id check (relationship check is sufficient)
CREATE POLICY "Guardians can create payments for their students"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM payment_item_students pis
      JOIN student_guardians sg ON sg.student_id = pis.student_id
      WHERE pis.id = payment_item_student_id
      AND sg.guardian_id = auth.uid()
    )
  );

-- Step 4: Recreate UPDATE policy using relationship-based check instead of guardian_id
CREATE POLICY "Guardians can update their own payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM payment_item_students pis
      JOIN student_guardians sg ON sg.student_id = pis.student_id
      WHERE pis.id = payments.payment_item_student_id
      AND sg.guardian_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM payment_item_students pis
      JOIN student_guardians sg ON sg.student_id = pis.student_id
      WHERE pis.id = payment_item_student_id
      AND sg.guardian_id = auth.uid()
    )
  );