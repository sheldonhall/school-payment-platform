/*
  # Add Shopping Cart Items Table

  1. New Tables
    - `shopping_cart_items`
      - `id` (uuid, primary key) - Unique identifier for cart item
      - `guardian_id` (uuid, foreign key) - References guardians table
      - `payment_item_id` (uuid, foreign key) - References payment_items table
      - `student_id` (uuid, foreign key) - References students table
      - `created_at` (timestamptz) - When item was added to cart
      - Unique constraint on (guardian_id, payment_item_id, student_id) to prevent duplicates

  2. Security
    - Enable RLS on `shopping_cart_items` table
    - Add policy for public SELECT access (guardians use token-based auth)
    - Add policy for public INSERT access
    - Add policy for public DELETE access
    
  3. Important Notes
    - Shopping cart is per-guardian, per-student, per-payment-item
    - Prevents duplicate entries in cart
    - Cascade deletes when guardian, student, or payment_item is deleted
*/

CREATE TABLE IF NOT EXISTS shopping_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  payment_item_id uuid NOT NULL REFERENCES payment_items(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guardian_id, payment_item_id, student_id)
);

ALTER TABLE shopping_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view shopping cart items"
  ON shopping_cart_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can add shopping cart items"
  ON shopping_cart_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can remove shopping cart items"
  ON shopping_cart_items FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_shopping_cart_guardian ON shopping_cart_items(guardian_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_payment_item ON shopping_cart_items(payment_item_id);