/*
  # Create photo analyses table

  1. New Tables
    - `photo_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_name` (text)
      - `image_url` (text)
      - `ai_description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `photo_analyses` table
    - Add policy for users to read their own analyses
    - Add policy for users to insert their own analyses
    - Add policy for users to update their own analyses
    - Add policy for users to delete their own analyses
*/

CREATE TABLE IF NOT EXISTS photo_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_name text NOT NULL,
  image_url text,
  ai_description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE photo_analyses ENABLE ROW LEVEL SECURITY;

-- Users can read their own photo analyses
CREATE POLICY "Users can read own photo analyses"
  ON photo_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own photo analyses
CREATE POLICY "Users can insert own photo analyses"
  ON photo_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own photo analyses
CREATE POLICY "Users can update own photo analyses"
  ON photo_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own photo analyses
CREATE POLICY "Users can delete own photo analyses"
  ON photo_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS photo_analyses_user_id_idx ON photo_analyses(user_id);
CREATE INDEX IF NOT EXISTS photo_analyses_created_at_idx ON photo_analyses(created_at DESC);