-- Add features columns to courses table for 3 languages
ALTER TABLE public.courses
ADD COLUMN features_en TEXT[] DEFAULT '{}',
ADD COLUMN features_bn TEXT[] DEFAULT '{}',
ADD COLUMN features_zh TEXT[] DEFAULT '{}';