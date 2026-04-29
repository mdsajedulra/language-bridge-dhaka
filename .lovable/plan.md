আমি Privacy Policy এবং Terms of Service পেজ বানাবো, এগুলো main menu-তে যোগ করবো না—শুধু footer-এর bottom area-তে সুন্দরভাবে বসানো হবে। পেজের content dynamic থাকবে, যাতে Admin থেকে English, Bangla, Chinese তিন ভাষায় পরিবর্তন করা যায়।

Implementation Plan:

1. Dynamic page content storage
- Database-এ `site_settings` ব্যবহার করেই content রাখা হবে, কারণ এই table আগে থেকেই public read এবং admin manage support করে।
- নতুন dynamic keys যোগ করা হবে:
  - `privacy_policy_title`
  - `privacy_policy_content`
  - `terms_service_title`
  - `terms_service_content`
- প্রতিটি key-তে `value_en`, `value_bn`, `value_zh` থাকবে।
- Bangla content website-এর current data/feature অনুযায়ী লেখা হবে: admission form, contact form, newsletter, course inquiry, alumni/teacher/course/public content, admin-managed website content, n8n/API integration context, Cloudinary media links ইত্যাদি বিবেচনায়।

2. Public pages
- নতুন public route তৈরি হবে:
  - `/privacy-policy`
  - `/terms-of-service`
- একই reusable page component দিয়ে দুই পেজ render করা হবে।
- Page content database থেকে current language অনুযায়ী দেখাবে।
- যদি database content কোনো কারণে না আসে, তাহলে safe fallback Bangla/English/Chinese content দেখাবে।
- Content paragraphs/sections সুন্দরভাবে readable layout-এ দেখানো হবে।

3. Footer placement
- Footer-এর bottom bar-এ copyright/affiliation-এর পাশে বা নিচে responsive legal links যোগ করা হবে:
  - Privacy Policy
  - Terms of Service
- Main menu/header navigation পরিবর্তন করা হবে না।
- Mobile view-তে links neatly stacked/centered থাকবে, desktop view-তে inline থাকবে।

4. Admin dynamic editing
- Admin Settings page-এ নতুন section যোগ হবে: “Legal Pages”।
- Admin এখান থেকে Privacy Policy এবং Terms of Service content তিন ভাষায় edit/save করতে পারবে।
- Existing save flow ব্যবহার করা হবে, যাতে আলাদা admin page দরকার না হয়।

5. Multilingual labels
- Footer link labels এবং page defaults English, Bangla, Chinese তিন ভাষায় থাকবে।
- User language preference অনুযায়ী page title/content বদলাবে।

Technical Details:
- Database migration দিয়ে `site_settings`-এ default legal content insert করা হবে using upsert, যাতে existing data থাকলে duplicate না হয়।
- Existing RLS policy যথেষ্ট: public can read site settings, only admins can manage.
- `src/App.tsx`-এ দুইটি route যোগ হবে।
- `src/components/layout/Footer.tsx`-এ footer legal links যোগ হবে।
- `src/pages/admin/SettingsAdmin.tsx`-এ Legal Pages editor section যোগ হবে।
- Supabase auto-generated files (`client.ts`, `types.ts`) manually edit করা হবে না।