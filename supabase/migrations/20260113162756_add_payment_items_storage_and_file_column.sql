/*
  # Add Storage and File Column for Payment Items

  1. Storage Setup
    - Create storage bucket 'payment-item-files' for storing payment item attachments
    - Set up RLS policies for the bucket to allow admins to upload/view files
  
  2. Database Changes
    - Add `file_url` column to `payment_items` table to store file references
  
  3. Security
    - Admins can upload files to the bucket
    - Admins can view/delete files from the bucket
    - Files are publicly readable (for guardian viewing)
*/

-- Create storage bucket for payment item files
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-item-files', 'payment-item-files', true)
ON CONFLICT (id) DO NOTHING;

-- Add file_url column to payment_items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payment_items' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE payment_items ADD COLUMN file_url text;
  END IF;
END $$;

-- Storage policies for payment-item-files bucket

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload payment item files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update payment item files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment item files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view payment item files" ON storage.objects;

-- Allow admins to upload files
CREATE POLICY "Admins can upload payment item files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-item-files' AND
    (
      ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
      (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text)
    )
  );

-- Allow admins to update files
CREATE POLICY "Admins can update payment item files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'payment-item-files' AND
    (
      ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
      (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text)
    )
  );

-- Allow admins to delete files
CREATE POLICY "Admins can delete payment item files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'payment-item-files' AND
    (
      ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
      (((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text)
    )
  );

-- Allow public read access for guardians to view files
CREATE POLICY "Public can view payment item files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'payment-item-files');