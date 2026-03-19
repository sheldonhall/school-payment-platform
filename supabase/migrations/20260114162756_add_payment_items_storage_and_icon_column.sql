/*
  # Add Storage and Icon Column for Payment Items

  1. Storage Setup
    - Create storage bucket 'payment-item-icons' for storing payment item attachments
    - Set up RLS policies for the bucket to allow admins to upload/view icons
  
  2. Database Changes
    - Add `icon_url` column to `payment_items` table to store file references
  
  3. Security
    - Admins can upload icons to the bucket
    - Admins can view/delete icons from the bucket
    - Icons are publicly readable (for guardian viewing)
*/

-- Create storage bucket for payment item icons
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-item-icons', 'payment-item-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Add file_url column to payment_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_items' AND column_name = 'icon_url'
  ) THEN
    ALTER TABLE payment_items ADD COLUMN icon_url text;
  END IF;
END $$;

-- Storage policies for payment-item-icons bucket

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload payment item icons" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update payment item icons" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment item icons" ON storage.objects;
DROP POLICY IF EXISTS "Public can view payment item icons" ON storage.objects;

-- Allow admins to upload icons
CREATE POLICY "Admins can upload payment item icons"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-item-icons' AND
    (
      ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
      (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text)
    )
  );

-- Allow admins to update icons
CREATE POLICY "Admins can update payment item icons"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = '' AND
    (
      ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
      (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text)
    )
  );

-- Allow admins to delete icons
CREATE POLICY "Admins can delete payment item icons"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'payment-item-icons' AND
    (
      ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
      (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text)
    )
  );

-- Allow public read access for guardians to view icons
CREATE POLICY "Public can view payment item icons"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'payment-item-icons');