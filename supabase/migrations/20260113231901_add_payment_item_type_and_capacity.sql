/*
  # Add Payment Item Type and Max Capacity

  1. Changes
    - Add `is_mandatory` column to `payment_items` table (boolean, defaults to true)
    - Add `max_capacity` column to `payment_items` table (integer, defaults to 0)
    
  2. Description
    - `is_mandatory`: Indicates whether the payment item is mandatory for all students or opt-in
    - `max_capacity`: For opt-in payment items, this defines the maximum number of students that can enroll
    - Mandatory items work as before - all assigned students must pay
    - Opt-in items start with no student associations and students are added when they pay (up to max_capacity)
    
  3. Notes
    - Defaults to mandatory (true) to maintain backward compatibility
    - Max capacity only applies to opt-in items
    - For mandatory items, max_capacity is ignored
*/

-- Add columns to payment_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_items' AND column_name = 'is_mandatory'
  ) THEN
    ALTER TABLE payment_items ADD COLUMN is_mandatory boolean DEFAULT true NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_items' AND column_name = 'max_capacity'
  ) THEN
    ALTER TABLE payment_items ADD COLUMN max_capacity integer DEFAULT 0 NOT NULL;
  END IF;
END $$;