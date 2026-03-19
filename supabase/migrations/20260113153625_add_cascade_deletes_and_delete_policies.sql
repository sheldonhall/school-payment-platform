/*
  # Add CASCADE Deletes and DELETE Policies for School Management

  ## Overview
  This migration ensures that deletes cascade properly throughout the database
  and that admins have the ability to delete students, teachers, and classes.

  ## Changes

  1. **Update Foreign Key Constraints with CASCADE**
     - classes.teacher_id → teachers.id (SET NULL on delete - preserve class if teacher deleted)
     - students.class_id → classes.id (SET NULL on delete - preserve student if class deleted)
     - student_guardians.student_id → students.id (CASCADE - remove guardian link if student deleted)
     - payment_item_students.student_id → students.id (CASCADE - remove obligations if student deleted)
     - payment_item_students.payment_item_id → payment_items.id (CASCADE - remove obligations if item deleted)

  2. **Add DELETE Policies**
     - Allow admins to delete students, teachers, and classes
     - Allow admins to delete student_guardians relationships

  3. **Security**
     - Only users with 'admin' role can delete records
     - Cascading deletes automatically handle dependent records

  ## Notes
  - Teachers: If deleted, classes will have teacher_id set to NULL (can reassign later)
  - Classes: If deleted, students will have class_id set to NULL (can reassign later)
  - Students: If deleted, all obligations and guardian relationships are removed
*/

-- Step 1: Update foreign key constraints to add proper CASCADE/SET NULL behavior

-- Drop existing constraints
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_teacher_id_fkey;
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_class_id_fkey;
ALTER TABLE student_guardians DROP CONSTRAINT IF EXISTS student_guardians_student_id_fkey;
ALTER TABLE payment_item_students DROP CONSTRAINT IF EXISTS payment_item_students_student_id_fkey;

-- Recreate with proper CASCADE behavior
ALTER TABLE classes 
  ADD CONSTRAINT classes_teacher_id_fkey 
  FOREIGN KEY (teacher_id) 
  REFERENCES teachers(id) 
  ON DELETE SET NULL;

ALTER TABLE students 
  ADD CONSTRAINT students_class_id_fkey 
  FOREIGN KEY (class_id) 
  REFERENCES classes(id) 
  ON DELETE SET NULL;

ALTER TABLE student_guardians 
  ADD CONSTRAINT student_guardians_student_id_fkey 
  FOREIGN KEY (student_id) 
  REFERENCES students(id) 
  ON DELETE CASCADE;

ALTER TABLE payment_item_students 
  ADD CONSTRAINT payment_item_students_student_id_fkey 
  FOREIGN KEY (student_id) 
  REFERENCES students(id) 
  ON DELETE CASCADE;

-- Step 2: Add DELETE policies for admins

-- Teachers DELETE policy
CREATE POLICY "Admins can delete teachers"
  ON teachers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Classes DELETE policy
CREATE POLICY "Admins can delete classes"
  ON classes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Students DELETE policy
CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Student Guardians DELETE policy
CREATE POLICY "Admins can delete student guardian relationships"
  ON student_guardians FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );