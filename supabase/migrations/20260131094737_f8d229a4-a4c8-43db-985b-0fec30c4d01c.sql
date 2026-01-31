-- Add phone column to alumni table
ALTER TABLE public.alumni ADD COLUMN IF NOT EXISTS phone TEXT;