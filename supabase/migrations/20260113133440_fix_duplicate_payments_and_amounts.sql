/*
  # Fix Duplicate Payments and Inconsistent Amounts

  ## Changes Made
  
  1. **Clean Up Duplicate Payments**
     - Identifies duplicate payment records (same payment_item_id and student_id)
     - Keeps the most recent payment record for each student/payment_item combination
     - Deletes older duplicate records
  
  2. **Synchronize Payment Amounts**
     - Updates all payment records to match their parent payment_item amount
     - Ensures consistency between payment_items.amount and payments.amount
     - Applies to all existing payment records
  
  3. **Add Unique Constraint**
     - Adds a unique constraint on (payment_item_id, student_id) in the payments table
     - Prevents future duplicate payment records from being created
     - Ensures data integrity going forward

  ## Important Notes
  - This migration will delete duplicate payment records, keeping only the most recent one
  - All payment amounts will be updated to match their payment item amounts
  - After this migration, it will be impossible to create duplicate payments for the same student and payment item
*/

-- Step 1: Delete duplicate payments, keeping only the most recent one
WITH duplicates AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY payment_item_id, student_id 
           ORDER BY created_at DESC, id DESC
         ) as row_num
  FROM payments
)
DELETE FROM payments
WHERE id IN (
  SELECT id FROM duplicates WHERE row_num > 1
);

-- Step 2: Update all payment amounts to match their payment_item amounts
UPDATE payments
SET amount = payment_items.amount
FROM payment_items
WHERE payments.payment_item_id = payment_items.id
  AND payments.amount != payment_items.amount;

-- Step 3: Add unique constraint to prevent future duplicates
ALTER TABLE payments
ADD CONSTRAINT payments_payment_item_id_student_id_key 
UNIQUE (payment_item_id, student_id);