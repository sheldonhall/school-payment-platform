/*
  # Replace reference_number with order_id in Payments Table

  ## Overview
  This migration strengthens the relationship between payments and orders by replacing
  the loose reference_number link with a solid foreign key relationship. Going forward,
  every payment MUST be associated with an order.

  ## Changes

  1. **Add order_id column to payments table**
     - Add `order_id` as foreign key to `orders` table
     - Set up cascade deletion (if order is deleted, payments are deleted)

  2. **Remove reference_number column**
     - Drop the `reference_number` column from payments table
     - The relationship is now managed through the order_id foreign key

  3. **Update constraints**
     - Set order_id as NOT NULL (every payment must have an order)
     - Add foreign key constraint with CASCADE deletion

  4. **Security**
     - Update RLS policies to work with new structure
     - Guardians can still only access their own payments through the order relationship

  ## Important Notes
  - This is a breaking change: all new payments MUST have an associated order_id
  - The relationship is: one order can have 0 to many payments
  - Payment status calculation remains unchanged (based on payment_item_student)
  - Before creating a payment, ensure an order and order_item exist for the payment_item_student
*/

-- Step 1: Add order_id column (nullable initially for data migration)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_id uuid;

-- Step 2: Add foreign key constraint
ALTER TABLE payments 
ADD CONSTRAINT payments_order_id_fkey 
FOREIGN KEY (order_id) 
REFERENCES orders(id) 
ON DELETE CASCADE;

-- Step 3: Drop reference_number column if it exists
ALTER TABLE payments DROP COLUMN IF EXISTS reference_number;

-- Step 4: Make order_id NOT NULL (all future payments must have an order)
-- Note: This will fail if there are existing rows with null order_id
-- In production, you would need to migrate existing data first
ALTER TABLE payments ALTER COLUMN order_id SET NOT NULL;

-- Step 5: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- Step 6: Update RLS policies to reflect new structure
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all payments" ON payments;
DROP POLICY IF EXISTS "Guardians can view payments for their students" ON payments;
DROP POLICY IF EXISTS "Guardians can create payments for their students" ON payments;
DROP POLICY IF EXISTS "Guardians can update their own payments" ON payments;

-- Recreate policies with updated logic
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

CREATE POLICY "Guardians can view payments for their orders"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM orders o
      WHERE o.id = payments.order_id
      AND o.guardian_id = auth.uid()
    )
  );

CREATE POLICY "Guardians can create payments for their orders"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.id = order_id
      AND o.guardian_id = auth.uid()
      AND oi.payment_item_id IN (
        SELECT pis.payment_item_id 
        FROM payment_item_students pis
        WHERE pis.id = payment_item_student_id
      )
      AND oi.student_id IN (
        SELECT pis.student_id 
        FROM payment_item_students pis
        WHERE pis.id = payment_item_student_id
      )
    )
  );

CREATE POLICY "Guardians can update payments for their orders"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM orders o
      WHERE o.id = payments.order_id
      AND o.guardian_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM orders o
      WHERE o.id = order_id
      AND o.guardian_id = auth.uid()
    )
  );
