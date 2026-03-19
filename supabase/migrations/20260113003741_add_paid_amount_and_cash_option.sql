/*
  # Add Payment Tracking Enhancements
  
  1. Changes to `payments` table
    - Add `paid_amount` column (numeric, default 0) - tracks the actual amount paid
    - This allows tracking partial payments
  
  2. Changes to `payment_items` table
    - Add `cash_enabled` column (boolean, default false) - enables cash payment option
  
  3. Notes
    - `paid_amount` defaults to 0 for new payments
    - Cash payment option is disabled by default for new payment items
    - Partial payments are supported when paid_amount < amount
*/

-- Add paid_amount to payments table to track actual amount paid
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'paid_amount'
  ) THEN
    ALTER TABLE payments ADD COLUMN paid_amount numeric DEFAULT 0;
  END IF;
END $$;

-- Add cash_enabled to payment_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_items' AND column_name = 'cash_enabled'
  ) THEN
    ALTER TABLE payment_items ADD COLUMN cash_enabled boolean DEFAULT false;
  END IF;
END $$;