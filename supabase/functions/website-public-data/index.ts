import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  })

const isAuthorized = (req: Request) => {
  const configuredKey = Deno.env.get('N8N_WEBSITE_API_KEY')
  const providedKey = req.headers.get('x-api-key')
  return Boolean(configuredKey && providedKey && providedKey === configuredKey)
}

const text = (bn?: string | null, en?: string | null, zh?: string | null) => bn || en || zh || null
const arr = (bn?: string[] | null, en?: string[] | null, zh?: string[] | null) =>
  bn && bn.length > 0 ? bn : en && en.length > 0 ? en : zh || []

const fetchTable = async (supabase: ReturnType<typeof createClient>, table: string, select = '*') => {
  const { data, error } = await supabase.from(table).select(select)
  if (error) throw new Error(`${table}: ${error.message}`)
  return data || []
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  if (req.method !== 'GET') {
    return jsonResponse({ success: false, error: 'Only GET method is allowed' }, 405)
  }

  if (!isAuthorized(req)) {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ success: false, error: 'Backend configuration missing' }, 500)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  try {
    const [
      teachers,
      courses,
      books,
      notices,
      gallery,
      videos,
      alumni,
      services,
      partners,
      media,
      testimonials,
      navigation,
      siteSettings,
      heroSettings,
      jobs,
    ] = await Promise.all([
      fetchTable(supabase, 'teachers'),
      fetchTable(supabase, 'courses'),
      fetchTable(supabase, 'books'),
      fetchTable(supabase, 'notices'),
      fetchTable(supabase, 'gallery'),
      fetchTable(supabase, 'videos'),
      fetchTable(supabase, 'alumni'),
      fetchTable(supabase, 'services'),
      fetchTable(supabase, 'partners'),
      fetchTable(supabase, 'media'),
      fetchTable(supabase, 'testimonials'),
      fetchTable(supabase, 'nav_items'),
      fetchTable(supabase, 'site_settings'),
      fetchTable(supabase, 'hero_settings'),
      fetchTable(supabase, 'jobs'),
    ])

    return jsonResponse({
      success: true,
      language: 'bn',
      mode: 'full',
      generated_at: new Date().toISOString(),
      data: {
        teachers: teachers.map((item) => ({
          'আইডি': item.id,
          'নাম': item.name,
          'পদবি': text(item.designation_bn, item.designation_en, item.designation_zh),
          'বিশেষায়ন': text(item.specialization_bn, item.specialization_en, item.specialization_zh),
          'জীবনী': text(item.bio_bn, item.bio_en, item.bio_zh),
          'ছবি': item.photo_url,
          'ইমেইল': item.email,
          'ফোন': item.phone,
          'ফিচার্ড': item.is_featured,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        courses: courses.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'বিবরণ': text(item.description_bn, item.description_en, item.description_zh),
          'সময়কাল': text(item.duration_bn, item.duration_en, item.duration_zh),
          'ফিচার': arr(item.features_bn, item.features_en, item.features_zh),
          'আইকন': item.icon,
          'ছবি': item.image_url,
          'ফি': item.price,
          'ফিচার্ড': item.is_featured,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
          'আপডেটের তারিখ': item.updated_at,
        })),
        books: books.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'লেখক': item.author,
          'বিবরণ': text(item.description_bn, item.description_en, item.description_zh),
          'মূল্য': item.price,
          'কভার ছবি': item.cover_image_url,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        notices: notices.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'বিষয়বস্তু': text(item.content_bn, item.content_en, item.content_zh),
          'ক্যাটাগরি': item.category,
          'পিন করা': item.is_pinned,
          'সক্রিয়': item.is_active,
          'প্রকাশের তারিখ': item.published_at,
          'তৈরির তারিখ': item.created_at,
        })),
        gallery: gallery.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'ছবি': item.image_url,
          'ক্যাটাগরি': item.category,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        videos: videos.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'বিবরণ': text(item.description_bn, item.description_en, item.description_zh),
          'ভিডিও লিংক': item.video_url,
          'থাম্বনেইল': item.thumbnail_url,
          'ক্যাটাগরি': item.category,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        alumni: alumni.map((item) => ({
          'আইডি': item.id,
          'নাম': item.name,
          'ব্যাচ': item.batch_year,
          'বর্তমান পদ': text(item.current_position_bn, item.current_position_en, item.current_position_zh),
          'কোম্পানি': item.company,
          'গল্প': text(item.story_bn, item.story_en, item.story_zh),
          'ছবি': item.photo_url,
          'ফোন': item.phone,
          'ঠিকানা': item.address,
          'ফিচার্ড': item.is_featured,
          'সক্রিয়': item.is_active,
          'তৈরির তারিখ': item.created_at,
        })),
        services: services.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'বিবরণ': text(item.description_bn, item.description_en, item.description_zh),
          'আইকন': item.icon,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        partners: partners.map((item) => ({
          'আইডি': item.id,
          'নাম': item.name,
          'লোগো': item.logo_url,
          'ওয়েবসাইট': item.website_url,
          'বিবরণ': text(item.description_bn, item.description_en, item.description_zh),
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        media: media.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'বিষয়বস্তু': text(item.content_bn, item.content_en, item.content_zh),
          'ছবি': item.image_url,
          'উৎস': item.source,
          'বাহ্যিক লিংক': item.external_url,
          'সক্রিয়': item.is_active,
          'প্রকাশের তারিখ': item.published_at,
          'তৈরির তারিখ': item.created_at,
        })),
        testimonials: testimonials.map((item) => ({
          'আইডি': item.id,
          'নাম': item.name,
          'ভূমিকা': text(item.role_bn, item.role_en, item.role_zh),
          'মতামত': text(item.content_bn, item.content_en, item.content_zh),
          'রেটিং': item.rating,
          'ছবি': item.avatar_url,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        navigation: navigation.map((item) => ({
          'আইডি': item.id,
          'লেবেল': text(item.label_bn, item.label_en, item.label_zh),
          'পাথ': item.path,
          'সক্রিয়': item.is_active,
          'ক্রম': item.sort_order,
          'তৈরির তারিখ': item.created_at,
        })),
        site_settings: siteSettings.map((item) => ({
          'আইডি': item.id,
          'কী': item.key,
          'ভ্যালু': text(item.value_bn, item.value_en, item.value_zh),
          'ছবি': item.image_url,
          'আপডেটের তারিখ': item.updated_at,
        })),
        hero_settings: heroSettings.map((item) => ({
          'আইডি': item.id,
          'ট্যাগলাইন': text(item.tagline_bn, item.tagline_en, item.tagline_zh),
          'সাবটাইটেল': text(item.subtitle_bn, item.subtitle_en, item.subtitle_zh),
          'ব্যাজ টেক্সট': item.badge_text,
          'শিক্ষক সংখ্যা': item.stat_teachers,
          'শিক্ষার্থী সংখ্যা': item.stat_students,
          'বছর সংখ্যা': item.stat_years,
          'ব্যাকগ্রাউন্ড ছবি': item.background_image_url,
          'আপডেটের তারিখ': item.updated_at,
        })),
        jobs: jobs.map((item) => ({
          'আইডি': item.id,
          'শিরোনাম': text(item.title_bn, item.title_en, item.title_zh),
          'বিবরণ': text(item.description_bn, item.description_en, item.description_zh),
          'লোকেশন': text(item.location_bn, item.location_en, item.location_zh),
          'চাকরির ধরন': item.job_type,
          'বেতন': item.salary_range,
          'শেষ তারিখ': item.deadline,
          'সক্রিয়': item.is_active,
          'তৈরির তারিখ': item.created_at,
        })),
      },
    })
  } catch (error) {
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 500)
  }
})
