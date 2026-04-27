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
    const [admissionApplications, contactSubmissions, newsletterSubscribers] = await Promise.all([
      fetchTable(supabase, 'admission_applications'),
      fetchTable(supabase, 'contact_submissions'),
      fetchTable(supabase, 'newsletter_subscribers'),
    ])

    return jsonResponse({
      success: true,
      language: 'bn',
      mode: 'full',
      generated_at: new Date().toISOString(),
      data: {
        admission_applications: admissionApplications.map((item) => ({
          'আইডি': item.id,
          'কোর্স আইডি': item.course_id,
          'পূর্ণ নাম': item.full_name,
          'ফোন': item.phone,
          'ইমেইল': item.email,
          'জন্ম তারিখ': item.date_of_birth,
          'ঠিকানা': item.address,
          'শিক্ষাগত যোগ্যতা': item.education_level,
          'পছন্দের সময়সূচি': item.preferred_schedule,
          'কীভাবে জানতে পেরেছেন': item.how_did_you_hear,
          'অতিরিক্ত নোট': item.additional_notes,
          'স্ট্যাটাস': item.status,
          'আবেদনের তারিখ': item.created_at,
        })),
        contact_submissions: contactSubmissions.map((item) => ({
          'আইডি': item.id,
          'নাম': item.name,
          'ইমেইল': item.email,
          'ফোন': item.phone,
          'বিষয়': item.subject,
          'বার্তা': item.message,
          'পড়া হয়েছে': item.is_read,
          'জমা দেওয়ার তারিখ': item.created_at,
        })),
        newsletter_subscribers: newsletterSubscribers.map((item) => ({
          'আইডি': item.id,
          'ইমেইল': item.email,
          'সক্রিয়': item.is_active,
          'সাবস্ক্রাইবের তারিখ': item.created_at,
        })),
      },
    })
  } catch (error) {
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 500)
  }
})
