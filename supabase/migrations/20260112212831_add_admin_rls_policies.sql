/*
  # Add RLS Policies for Admin Access

  1. Security Changes
    - Add SELECT policies for authenticated users on:
      - payment_items (allow admins to view all payment items)
      - payment_item_students (allow counting students per payment item)
      - payments (allow viewing payment status and counts)
      - students (allow viewing student information)
      - guardians (allow viewing guardian information)
      - student_guardians (allow viewing relationships)
      - bank_transactions (allow viewing transactions for reconciliation)
      - activity_logs (allow viewing activity logs)

  2. Notes
    - All policies are for authenticated users only
    - These policies enable admin dashboard functionality
    - Includes INSERT, UPDATE, DELETE permissions for full admin access
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can view payment items" ON payment_items;
DROP POLICY IF EXISTS "Authenticated users can insert payment items" ON payment_items;
DROP POLICY IF EXISTS "Authenticated users can update payment items" ON payment_items;
DROP POLICY IF EXISTS "Authenticated users can delete payment items" ON payment_items;

-- Payment Items policies
CREATE POLICY "Authenticated users can view payment items"
  ON payment_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payment items"
  ON payment_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment items"
  ON payment_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment items"
  ON payment_items FOR DELETE
  TO authenticated
  USING (true);

-- Payment Item Students policies
DROP POLICY IF EXISTS "Authenticated users can view payment item students" ON payment_item_students;
DROP POLICY IF EXISTS "Authenticated users can insert payment item students" ON payment_item_students;
DROP POLICY IF EXISTS "Authenticated users can delete payment item students" ON payment_item_students;

CREATE POLICY "Authenticated users can view payment item students"
  ON payment_item_students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payment item students"
  ON payment_item_students FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment item students"
  ON payment_item_students FOR DELETE
  TO authenticated
  USING (true);

-- Payments policies
DROP POLICY IF EXISTS "Authenticated users can view payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON payments;

CREATE POLICY "Authenticated users can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Students policies
DROP POLICY IF EXISTS "Authenticated users can view students" ON students;

CREATE POLICY "Authenticated users can view students"
  ON students FOR SELECT
  TO authenticated
  USING (true);

-- Guardians policies
DROP POLICY IF EXISTS "Authenticated users can view guardians" ON guardians;

CREATE POLICY "Authenticated users can view guardians"
  ON guardians FOR SELECT
  TO authenticated
  USING (true);

-- Student Guardians policies
DROP POLICY IF EXISTS "Authenticated users can view student guardians" ON student_guardians;

CREATE POLICY "Authenticated users can view student guardians"
  ON student_guardians FOR SELECT
  TO authenticated
  USING (true);

-- Bank Transactions policies
DROP POLICY IF EXISTS "Authenticated users can view bank transactions" ON bank_transactions;
DROP POLICY IF EXISTS "Authenticated users can insert bank transactions" ON bank_transactions;
DROP POLICY IF EXISTS "Authenticated users can update bank transactions" ON bank_transactions;

CREATE POLICY "Authenticated users can view bank transactions"
  ON bank_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bank transactions"
  ON bank_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bank transactions"
  ON bank_transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Activity Logs policies
DROP POLICY IF EXISTS "Authenticated users can view activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON activity_logs;

CREATE POLICY "Authenticated users can view activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
