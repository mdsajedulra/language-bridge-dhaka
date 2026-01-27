
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Site Settings table (logo, site name, etc.)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value_en TEXT,
    value_bn TEXT,
    value_zh TEXT,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Navigation items table
CREATE TABLE public.nav_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    label_en TEXT NOT NULL,
    label_bn TEXT NOT NULL,
    label_zh TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view nav items"
ON public.nav_items FOR SELECT USING (true);

CREATE POLICY "Admins can manage nav items"
ON public.nav_items FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Hero section settings
CREATE TABLE public.hero_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tagline_en TEXT NOT NULL,
    tagline_bn TEXT NOT NULL,
    tagline_zh TEXT NOT NULL,
    subtitle_en TEXT NOT NULL,
    subtitle_bn TEXT NOT NULL,
    subtitle_zh TEXT NOT NULL,
    badge_text TEXT,
    background_image_url TEXT,
    stat_students TEXT DEFAULT '5000+',
    stat_teachers TEXT DEFAULT '25+',
    stat_years TEXT DEFAULT '9+',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero settings"
ON public.hero_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage hero settings"
ON public.hero_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    description_zh TEXT,
    duration_en TEXT,
    duration_bn TEXT,
    duration_zh TEXT,
    icon TEXT DEFAULT 'BookOpen',
    image_url TEXT,
    price DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses"
ON public.courses FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses"
ON public.courses FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role_en TEXT,
    role_bn TEXT,
    role_zh TEXT,
    content_en TEXT NOT NULL,
    content_bn TEXT NOT NULL,
    content_zh TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
ON public.testimonials FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Notices table
CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    content_en TEXT,
    content_bn TEXT,
    content_zh TEXT,
    category TEXT DEFAULT 'general',
    is_pinned BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active notices"
ON public.notices FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage notices"
ON public.notices FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    description_zh TEXT,
    location_en TEXT,
    location_bn TEXT,
    location_zh TEXT,
    job_type TEXT DEFAULT 'full-time',
    salary_range TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs"
ON public.jobs FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage jobs"
ON public.jobs FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Partners table
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description_en TEXT,
    description_bn TEXT,
    description_zh TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partners"
ON public.partners FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage partners"
ON public.partners FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Gallery table
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT,
    title_bn TEXT,
    title_zh TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gallery items"
ON public.gallery FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Books table
CREATE TABLE public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    author TEXT,
    description_en TEXT,
    description_bn TEXT,
    description_zh TEXT,
    cover_image_url TEXT,
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active books"
ON public.books FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage books"
ON public.books FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Media/News table
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    content_en TEXT,
    content_bn TEXT,
    content_zh TEXT,
    image_url TEXT,
    source TEXT,
    external_url TEXT,
    is_active BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active media"
ON public.media FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage media"
ON public.media FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Videos table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    description_zh TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active videos"
ON public.videos FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage videos"
ON public.videos FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Alumni table
CREATE TABLE public.alumni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    batch_year INTEGER,
    current_position_en TEXT,
    current_position_bn TEXT,
    current_position_zh TEXT,
    company TEXT,
    story_en TEXT,
    story_bn TEXT,
    story_zh TEXT,
    photo_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active alumni"
ON public.alumni FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage alumni"
ON public.alumni FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    description_zh TEXT,
    icon TEXT DEFAULT 'Star',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Contact submissions table
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admission applications table
CREATE TABLE public.admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    address TEXT,
    education_level TEXT,
    course_id UUID REFERENCES public.courses(id),
    preferred_schedule TEXT,
    how_did_you_hear TEXT,
    additional_notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit admission application"
ON public.admission_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view admission applications"
ON public.admission_applications FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admission applications"
ON public.admission_applications FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Translations table for custom language management
CREATE TABLE public.translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value_en TEXT NOT NULL,
    value_bn TEXT NOT NULL,
    value_zh TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view translations"
ON public.translations FOR SELECT USING (true);

CREATE POLICY "Admins can manage translations"
ON public.translations FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default site settings
INSERT INTO public.site_settings (key, value_en, value_bn, value_zh) VALUES
('site_name', 'Yidai Yilu', 'ইদাই ইলু', '一带一路'),
('site_tagline', 'Chinese Language Institute', '一带一路中文学院', '一带一路中文学院'),
('footer_description', 'Yidai Yilu Chinese Language Institute is a premier institution dedicated to teaching Chinese language and promoting Bangladesh-China cultural exchange since 2016.', 'ইদাই ইলু চাইনিজ ল্যাঙ্গুয়েজ ইনস্টিটিউট ২০১৬ সাল থেকে চীনা ভাষা শেখানো এবং বাংলাদেশ-চীন সাংস্কৃতিক বিনিময়ের জন্য নিবেদিত একটি প্রধান প্রতিষ্ঠান।', '一带一路中文学院是一所自2016年起致力于中文教学和促进孟中文化交流的一流机构。'),
('contact_address', 'Dhaka, Bangladesh', 'ঢাকা, বাংলাদেশ', '孟加拉国达卡'),
('contact_phone', '+880 1234-567890', '+৮৮০ ১২৩৪-৫৬৭৮৯০', '+880 1234-567890'),
('contact_email', 'info@yidaiyilu.edu.bd', 'info@yidaiyilu.edu.bd', 'info@yidaiyilu.edu.bd');

-- Insert default hero settings
INSERT INTO public.hero_settings (
    tagline_en, tagline_bn, tagline_zh,
    subtitle_en, subtitle_bn, subtitle_zh,
    badge_text, stat_students, stat_teachers, stat_years
) VALUES (
    'Language Partner of National Development',
    'জাতীয় উন্নয়নের ভাষা অংশীদার',
    '国家发展的语言伙伴',
    'Celebrating Bangladesh-China friendship through quality Chinese language education. Join thousands of successful students learning with us.',
    'মানসম্মত চীনা ভাষা শিক্ষার মাধ্যমে বাংলাদেশ-চীন বন্ধুত্ব উদযাপন। হাজার হাজার সফল শিক্ষার্থীদের সাথে যোগ দিন যারা আমাদের সাথে মান্দারিন শিখছেন।',
    '通过优质的中文教育庆祝孟中友谊。加入成千上万与我们一起学习普通话的成功学生。',
    '🇧🇩 Bangladesh - China 🇨🇳 Friendship',
    '5000+', '25+', '9+'
);

-- Insert default navigation items with correct Bengali translations
INSERT INTO public.nav_items (path, label_en, label_bn, label_zh, sort_order) VALUES
('/', 'Home', 'প্রচ্ছদ', '首页', 1),
('/about', 'About Us', 'আমরা', '关于我们', 2),
('/courses', 'Courses', 'কোর্স', '课程', 3),
('/admission', 'Admission', 'ভর্তি', '招生', 4),
('/notice', 'Notice', 'বিজ্ঞপ্তি', '通知', 5),
('/job', 'Jobs', 'চাকরি', '招聘', 6),
('/alumni', 'Alumni', 'প্রাক্তন ছাত্র', '校友', 7),
('/books', 'Books', 'বই', '书籍', 8),
('/hsk', 'HSK Exam', 'এইচ এস কে', 'HSK考试', 9),
('/campus', 'Campus Life', 'ক্যাম্পাস জীবন', '校园生活', 10),
('/videos', 'Chinese Video', 'চাইনিজ ভিডিও', '中文视频', 11),
('/contact', 'Contact Us', 'যোগাযোগ', '联系我们', 12);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_settings_updated_at BEFORE UPDATE ON public.hero_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON public.translations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Storage policies
CREATE POLICY "Public can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
