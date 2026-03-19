/*
  # Restructure Payments Table for Proper Relational Design

  ## Overview
  This migration restructures the payments system to follow proper relational design principles.
  The `payment_items_students` table becomes the single source of truth for obligations,
  and the `payments` table records individual payment transactions against those obligations.

  ## Changes

  1. **Restructure payments table**
     - Add `payment_item_student_id` as foreign key to `payment_items_students`
     - Remove redundant `payment_item_id` and `student_id` columns
     - Remove `status` column (will be calculated)
     - Remove `paid_amount` column (redundant - `amount` is the amount paid)
     - Rename `amount` to represent actual payment amount (not obligation amount)
     - Keep `guardian_id`, `method`, `reference_number`, `receipt_url`, `notes`, timestamps

  2. **Migrate existing data**
     - Map existing payments to their corresponding payment_items_students records
     - Preserve all payment transaction data
     - Ensure data integrity during migration

  3. **Update constraints**
     - Remove unique constraint on (payment_item_id, student_id) - no longer needed
     - Multiple payments per obligation are now supported

  ## Result
  - Clean relational structure
  - True multi-payment support
  - All amounts calculated from actual data:
    * Total Paid = SUM(payments.amount) for an obligation
    * Outstanding = payment_items.amount - Total Paid
    * Status = derived from Outstanding amount
*/

-- Step 1: Add the new payment_item_student_id column to payments
ALTER TABLE payments ADD COLUMN payment_item_student_id uuid;

-- Step 2: Populate the new column by matching existing payment records to payment_items_students
UPDATE payments p
SET payment_item_student_id = pis.id
FROM payment_item_students pis
WHERE p.payment_item_id = pis.payment_item_id 
  AND p.student_id = pis.student_id;

-- Step 3: For any payments that don't have a matching payment_items_students record, create one
INSERT INTO payment_item_students (payment_item_id, student_id, created_at)
SELECT DISTINCT p.payment_item_id, p.student_id, MIN(p.created_at)
FROM payments p
WHERE p.payment_item_student_id IS NULL
  AND p.payment_item_id IS NOT NULL
  AND p.student_id IS NOT NULL
GROUP BY p.payment_item_id, p.student_id
ON CONFLICT DO NOTHING;

-- Step 4: Update any remaining null payment_item_student_id values
UPDATE payments p
SET payment_item_student_id = pis.id
FROM payment_item_students pis
WHERE p.payment_item_student_id IS NULL
  AND p.payment_item_id = pis.payment_item_id 
  AND p.student_id = pis.student_id;

-- Step 5: Update amount column - if paid_amount exists and is > 0, use it; otherwise keep amount
UPDATE payments
SET amount = COALESCE(NULLIF(paid_amount, 0), amount)
WHERE paid_amount IS NOT NULL;

-- Step 6: Add foreign key constraint
ALTER TABLE payments 
ADD CONSTRAINT payments_payment_item_student_id_fkey 
FOREIGN KEY (payment_item_student_id) 
REFERENCES payment_item_students(id) 
ON DELETE CASCADE;

-- Step 7: Drop the unique constraint on old columns (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'payments_payment_item_id_student_id_key'
  ) THEN
    ALTER TABLE payments DROP CONSTRAINT payments_payment_item_id_student_id_key;
  END IF;
END $$;

-- Step 8: Drop old columns that are no longer needed
ALTER TABLE payments DROP COLUMN IF EXISTS payment_item_id;
ALTER TABLE payments DROP COLUMN IF EXISTS student_id;
ALTER TABLE payments DROP COLUMN IF EXISTS status;
ALTER TABLE payments DROP COLUMN IF EXISTS paid_amount;

-- Step 9: Add NOT NULL constraint to the new column
ALTER TABLE payments ALTER COLUMN payment_item_student_id SET NOT NULL;

-- Step 10: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_payment_item_student_id 
ON payments(payment_item_student_id);

-- Step 11: Update RLS policies for the payments table
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;
DROP POLICY IF EXISTS "Guardians can view their payments" ON payments;
DROP POLICY IF EXISTS "Guardians can create their payments" ON payments;
DROP POLICY IF EXISTS "Guardians can update their payments" ON payments;

CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Guardians can view payments for their students"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM payment_item_students pis
      JOIN student_guardians sg ON sg.student_id = pis.student_id
      WHERE pis.id = payments.payment_item_student_id
      AND sg.guardian_id = auth.uid()
    )
  );

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
    AND guardian_id = auth.uid()
  );

CREATE POLICY "Guardians can update their own payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (guardian_id = auth.uid())
  WITH CHECK (guardian_id = auth.uid());
