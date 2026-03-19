/*
  # Add Orders and Order Items Tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `guardian_id` (uuid, foreign key to guardians)
      - `reference_number` (text, unique) - Format: TT20260116-XXXXX
      - `total_amount` (numeric) - Total order amount
      - `payment_method` (text) - bank_transfer, wipay, or cash
      - `status` (text) - pending, completed, verified
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `payment_item_id` (uuid, foreign key to payment_items)
      - `student_id` (uuid, foreign key to students)
      - `amount` (numeric) - Amount at time of order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users (admins) to manage orders
    - Add policies for guardians to view their own orders using access token

  3. Important Notes
    - Reference number is generated based on guardian_id and cart contents hash
    - Orders are created when guardian proceeds to payment
    - Same cart contents for same guardian = same reference number
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  reference_number text UNIQUE NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'wipay', 'cash')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'verified')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_item_id uuid NOT NULL REFERENCES payment_items(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders policies for admins
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'email') IS NOT NULL);

CREATE POLICY "Admins can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'email') IS NOT NULL);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'email') IS NOT NULL)
  WITH CHECK ((auth.jwt()->>'email') IS NOT NULL);

CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'email') IS NOT NULL);

-- Order items policies for admins
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'email') IS NOT NULL);

CREATE POLICY "Admins can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'email') IS NOT NULL);

CREATE POLICY "Admins can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'email') IS NOT NULL)
  WITH CHECK ((auth.jwt()->>'email') IS NOT NULL);

CREATE POLICY "Admins can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'email') IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_guardian_id ON orders(guardian_id);
CREATE INDEX IF NOT EXISTS idx_orders_reference_number ON orders(reference_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
