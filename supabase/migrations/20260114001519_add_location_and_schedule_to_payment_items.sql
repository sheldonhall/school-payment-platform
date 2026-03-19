/*
  # Add location and schedule fields to payment items

  1. Changes
    - Add `location` column to `payment_items` table
      - Type: text
      - Default: 'At school'
      - Description: Free text field for specifying where the payment item activity takes place
    
    - Add `schedule` column to `payment_items` table
      - Type: jsonb
      - Nullable: true
      - Description: Stores schedule information with flexible structure for multiple days and times
      - Example structure: [{"day": "Monday", "startTime": "09:00", "endTime": "10:30"}, ...]
  
  2. Notes
    - Both fields are optional during creation
    - Location has a sensible default of 'At school'
    - Schedule uses JSONB for flexibility to handle complex scheduling patterns
*/

-- Add location column with default value
ALTER TABLE payment_items 
ADD COLUMN IF NOT EXISTS location text DEFAULT 'At school';

-- Add schedule column as JSONB for flexible scheduling
ALTER TABLE payment_items 
ADD COLUMN IF NOT EXISTS schedule jsonb;
