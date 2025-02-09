/*
  # Create vCards table

  1. New Tables
    - `vcards`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `organization` (text)
      - `title` (text)
      - `email` (text)
      - `phone` (text)
      - `website` (text)
      - `photo` (text)
      - `social` (jsonb)
      - `address` (jsonb)
      - `theme` (text)
      - `template` (text)
      - `brand_color` (text)
      - `logo` (text)
      - `custom_fields` (jsonb)
      - `additional_social` (jsonb)
      - `images` (text[])
      - `nfc_enabled` (boolean)
      - `shareable_link` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `vcards` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS vcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  organization text,
  title text,
  email text,
  phone text,
  website text,
  photo text,
  social jsonb DEFAULT '{"linkedin": "", "instagram": "", "whatsapp": ""}',
  address jsonb DEFAULT '{"street": "", "city": "", "state": "", "zip": "", "country": ""}',
  theme text DEFAULT 'light',
  template text DEFAULT 'modern',
  brand_color text DEFAULT '#0066ff',
  logo text,
  custom_fields jsonb DEFAULT '[]',
  additional_social jsonb DEFAULT '[]',
  images text[] DEFAULT ARRAY[]::text[],
  nfc_enabled boolean DEFAULT false,
  shareable_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE vcards ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own vCards
CREATE POLICY "Users can read own vcards"
  ON vcards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for users to insert their own vCards
CREATE POLICY "Users can insert own vcards"
  ON vcards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own vCards
CREATE POLICY "Users can update own vcards"
  ON vcards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own vCards
CREATE POLICY "Users can delete own vcards"
  ON vcards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for public access to shared vCards
CREATE POLICY "Public can view shared vcards"
  ON vcards
  FOR SELECT
  TO public
  USING (shareable_link IS NOT NULL);