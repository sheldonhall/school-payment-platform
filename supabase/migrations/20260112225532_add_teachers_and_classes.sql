/*
  # Add Teachers and Classes Tables

  1. New Tables
    - `teachers`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text, optional)
      - `created_at` (timestamptz)
    
    - `classes`
      - `id` (uuid, primary key)
      - `grade` (text) - e.g., "Standard 1", "Standard 2"
      - `section` (text) - e.g., "A", "B"
      - `teacher_id` (uuid, foreign key to teachers)
      - `created_at` (timestamptz)
  
  2. Changes to Existing Tables
    - Add `class_id` column to `students` table (references classes)
  
  3. Data Migration
    - Create mock teachers for each existing class
    - Create class records for each unique grade/section combination
    - Update students to reference their class_id
    - Remove old `grade` and `class_section` columns from students
  
  4. Security
    - Enable RLS on `teachers` and `classes` tables
    - Add policies for authenticated users to read data
*/

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade text NOT NULL,
  section text NOT NULL,
  teacher_id uuid REFERENCES teachers(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(grade, section)
);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for teachers
CREATE POLICY "Authenticated users can view teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert teachers"
  ON teachers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update teachers"
  ON teachers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add RLS policies for classes
CREATE POLICY "Authenticated users can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert mock teachers
INSERT INTO teachers (first_name, last_name, email, phone) VALUES
  ('Sarah', 'Johnson', 'sarah.johnson@mrgs.edu.tt', '868-555-0101'),
  ('Michael', 'Chen', 'michael.chen@mrgs.edu.tt', '868-555-0102'),
  ('Priya', 'Sharma', 'priya.sharma@mrgs.edu.tt', '868-555-0103'),
  ('David', 'Martinez', 'david.martinez@mrgs.edu.tt', '868-555-0104'),
  ('Jennifer', 'Williams', 'jennifer.williams@mrgs.edu.tt', '868-555-0105'),
  ('Rajesh', 'Patel', 'rajesh.patel@mrgs.edu.tt', '868-555-0106'),
  ('Michelle', 'Lee', 'michelle.lee@mrgs.edu.tt', '868-555-0107'),
  ('Kevin', 'Brown', 'kevin.brown@mrgs.edu.tt', '868-555-0108'),
  ('Amanda', 'Davis', 'amanda.davis@mrgs.edu.tt', '868-555-0109'),
  ('Carlos', 'Rodriguez', 'carlos.rodriguez@mrgs.edu.tt', '868-555-0110');

-- Insert classes with teachers
INSERT INTO classes (grade, section, teacher_id)
SELECT 'Standard 1', 'A', id FROM teachers WHERE email = 'sarah.johnson@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 1', 'B', id FROM teachers WHERE email = 'michael.chen@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 2', 'A', id FROM teachers WHERE email = 'priya.sharma@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 2', 'B', id FROM teachers WHERE email = 'david.martinez@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 3', 'A', id FROM teachers WHERE email = 'jennifer.williams@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 3', 'B', id FROM teachers WHERE email = 'rajesh.patel@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 4', 'A', id FROM teachers WHERE email = 'michelle.lee@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 4', 'B', id FROM teachers WHERE email = 'kevin.brown@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 5', 'A', id FROM teachers WHERE email = 'amanda.davis@mrgs.edu.tt'
UNION ALL
SELECT 'Standard 5', 'B', id FROM teachers WHERE email = 'carlos.rodriguez@mrgs.edu.tt';

-- Add class_id column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES classes(id);

-- Update students to reference their class
UPDATE students s
SET class_id = c.id
FROM classes c
WHERE s.grade = c.grade AND s.class_section = c.section;

-- Drop old columns (after ensuring all data is migrated)
ALTER TABLE students DROP COLUMN IF EXISTS grade;
ALTER TABLE students DROP COLUMN IF EXISTS class_section;