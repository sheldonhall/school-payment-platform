/*
  # Add Student Details Columns

  ## Overview
  Add missing columns to the students table to store complete student information.

  ## Changes

  1. **Add Columns to students table**
     - `student_id` (text, unique) - Student identification number
     - `date_of_birth` (date) - Student's date of birth

  ## Notes
  - student_id is required and must be unique
  - date_of_birth is required for proper student records
  - Existing students will be assigned auto-generated student IDs
*/

-- Add student_id column without constraints first
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE students ADD COLUMN student_id text;
  END IF;
END $$;

-- Add date_of_birth column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE students ADD COLUMN date_of_birth date;
  END IF;
END $$;

-- Update existing students with unique student IDs using a CTE
WITH numbered_students AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM students
  WHERE student_id IS NULL
)
UPDATE students 
SET student_id = 'STU' || LPAD(CAST(numbered_students.rn AS TEXT), 5, '0')
FROM numbered_students
WHERE students.id = numbered_students.id;

-- Set a default date of birth for existing students
UPDATE students 
SET date_of_birth = '2010-01-01'
WHERE date_of_birth IS NULL;

-- Now add the constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'students_student_id_unique'
  ) THEN
    ALTER TABLE students ADD CONSTRAINT students_student_id_unique UNIQUE (student_id);
  END IF;
END $$;

ALTER TABLE students ALTER COLUMN student_id SET NOT NULL;
ALTER TABLE students ALTER COLUMN date_of_birth SET NOT NULL;