/*
  # Add Unique Constraint to Payments Table

  ## Overview
  This migration adds a unique constraint to prevent duplicate payment entries
  for the same order and payment_item_student combination.

  ## Changes

  1. **Remove any existing duplicate payments**
     - Keep only the earliest payment for each order_id + payment_item_student_id combination
     - Delete duplicate entries

  2. **Add unique constraint**
     - Add unique constraint on (order_id, payment_item_student_id)
     - Ensures one payment record per order-item combination
     - Prevents race conditions and duplicate submissions

  ## Important Notes
  - This is a data integrity enhancement
  - Prevents accidental duplicate payment records
  - The constraint is at the database level, providing atomic protection
*/

-- Step 1: Remove duplicate payments (keep the earliest one for each combination)
DELETE FROM payments
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY order_id, payment_item_student_id 
        ORDER BY created_at ASC, id ASC
      ) AS rn
    FROM payments
  ) t
  WHERE rn > 1
);

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE payments
ADD CONSTRAINT payments_order_id_payment_item_student_id_key 
UNIQUE (order_id, payment_item_student_id);

-- Step 3: Create index for better query performance (if not already exists)
CREATE INDEX IF NOT EXISTS idx_payments_order_payment_item 
ON payments(order_id, payment_item_student_id);
