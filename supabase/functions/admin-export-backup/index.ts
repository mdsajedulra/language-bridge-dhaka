import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BACKUP_TABLES = [
  'site_settings',
  'hero_settings',
  'nav_items',
  'translations',
  'courses',
  'teachers',
  'books',
  'notices',
  'jobs',
  'alumni',
  'services',
  'partners',
  'gallery',
  'videos',
  'media',
  'testimonials',
  'admission_applications',
  'contact_submissions',
  'newsletter_subscribers',
] as const

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  })

const getAdminUser = async (req: Request, supabaseUrl: string, anonKey: string, serviceRoleKey: string) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return null

  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: userData, error: userError } = await authClient.auth.getUser()
  if (userError || !userData.user) return null

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { data: isAdmin, error: roleError } = await adminClient.rpc('has_role', {
    _user_id: userData.user.id,
    _role: 'admin',
  })
  if (roleError || !isAdmin) return null

  return userData.user
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'GET') return jsonResponse({ success: false, error: 'Only GET method is allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ success: false, error: 'Backend configuration missing' }, 500)
  }

  const user = await getAdminUser(req, supabaseUrl, anonKey, serviceRoleKey)
  if (!user) return jsonResponse({ success: false, error: 'Admin access required' }, 403)

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const data: Record<string, unknown[]> = {}
  const rowCounts: Record<string, number> = {}

  try {
    for (const table of BACKUP_TABLES) {
      const { data: rows, error } = await adminClient.from(table).select('*')
      if (error) throw new Error(`${table}: ${error.message}`)
      data[table] = rows || []
      rowCounts[table] = rows?.length || 0
    }

    return jsonResponse({
      success: true,
      backup: {
        format: 'language-bridge-full-backup',
        version: 1,
        generated_at: new Date().toISOString(),
        generated_by: user.email || user.id,
        note_bn: 'এই backup file-এ website database-এর সব content row, multilingual text এবং media URL রাখা হয়েছে। Login password/auth user data রাখা হয়নি।',
        tables: BACKUP_TABLES,
        row_counts: rowCounts,
        data,
      },
    })
  } catch (error) {
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 500)
  }
})
