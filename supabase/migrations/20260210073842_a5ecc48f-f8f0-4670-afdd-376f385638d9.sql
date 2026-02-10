
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  photo_url TEXT,
  designation_en TEXT,
  designation_bn TEXT,
  designation_zh TEXT,
  bio_en TEXT,
  bio_bn TEXT,
  bio_zh TEXT,
  specialization_en TEXT,
  specialization_bn TEXT,
  specialization_zh TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active teachers"
ON public.teachers
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage teachers"
ON public.teachers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
