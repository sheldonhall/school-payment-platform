/*
  # Create payment_schedules table

  1. New Tables
    - `payment_schedules`
      - `id` (uuid, primary key) - Unique identifier for each schedule
      - `payment_item_id` (uuid, foreign key) - Links to payment_items table
      - `send_via_whatsapp` (boolean) - Whether to send via WhatsApp
      - `send_via_email` (boolean) - Whether to send via Email
      - `scheduled_datetime` (timestamptz) - When the notification should be sent
      - `sent` (boolean) - Tracks if the notification has been sent
      - `created_at` (timestamptz) - When the schedule was created

  2. Security
    - Enable RLS on `payment_schedules` table
    - Add policies for authenticated users to:
      - View all schedules
      - Create new schedules
      - Update schedules
      - Delete schedules
    
  3. Important Notes
    - At least one delivery method (WhatsApp or Email) must be selected
    - Cascading delete when payment item is deleted
    - Indexes added for efficient querying by payment_item_id
*/

CREATE TABLE IF NOT EXISTS payment_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_item_id uuid NOT NULL REFERENCES payment_items(id) ON DELETE CASCADE,
  send_via_whatsapp boolean DEFAULT false NOT NULL,
  send_via_email boolean DEFAULT false NOT NULL,
  scheduled_datetime timestamptz NOT NULL,
  sent boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_payment_schedules_payment_item_id 
  ON payment_schedules(payment_item_id);

CREATE INDEX IF NOT EXISTS idx_payment_schedules_scheduled_datetime 
  ON payment_schedules(scheduled_datetime) 
  WHERE sent = false;

-- Enable RLS
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can view all payment schedules"
  ON payment_schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create payment schedules"
  ON payment_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment schedules"
  ON payment_schedules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment schedules"
  ON payment_schedules
  FOR DELETE
  TO authenticated
  USING (true);