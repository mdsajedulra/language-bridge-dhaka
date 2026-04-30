import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESTORE_TABLES = [
  'newsletter_subscribers',
  'contact_submissions',
  'admission_applications',
  'testimonials',
  'media',
  'videos',
  'gallery',
  'partners',
  'services',
  'alumni',
  'jobs',
  'notices',
  'books',
  'teachers',
  'courses',
  'translations',
  'nav_items',
  'hero_settings',
  'site_settings',
] as const

const ALLOWED_TABLES = new Set(RESTORE_TABLES)

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

const validateBackup = (body: any) => {
  const backup = body?.backup || body
  if (!backup || backup.format !== 'language-bridge-full-backup' || !backup.data || typeof backup.data !== 'object') {
    throw new Error('Invalid backup file format')
  }

  const tableNames = Object.keys(backup.data)
  const unknownTables = tableNames.filter((table) => !ALLOWED_TABLES.has(table as any))
  if (unknownTables.length > 0) {
    throw new Error(`Unknown table found in backup: ${unknownTables.join(', ')}`)
  }

  for (const table of tableNames) {
    if (!Array.isArray(backup.data[table])) {
      throw new Error(`${table} data must be an array`)
    }
  }

  return backup as { data: Record<string, Record<string, unknown>[]> }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ success: false, error: 'Only POST method is allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ success: false, error: 'Backend configuration missing' }, 500)
  }

  const user = await getAdminUser(req, supabaseUrl, anonKey, serviceRoleKey)
  if (!user) return jsonResponse({ success: false, error: 'Admin access required' }, 403)

  try {
    const body = await req.json()
    if (body?.confirm !== 'RESTORE_FULL_WEBSITE_DATA') {
      return jsonResponse({ success: false, error: 'Restore confirmation is required' }, 400)
    }

    const backup = validateBackup(body)
    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const restoredCounts: Record<string, number> = {}

    for (const table of RESTORE_TABLES) {
      if (!backup.data[table]) continue

      const { error: deleteError } = await adminClient.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (deleteError) throw new Error(`${table} clear failed: ${deleteError.message}`)

      const rows = backup.data[table]
      if (rows.length > 0) {
        const { error: insertError } = await adminClient.from(table).insert(rows)
        if (insertError) throw new Error(`${table} restore failed: ${insertError.message}`)
      }
      restoredCounts[table] = rows.length
    }

    return jsonResponse({
      success: true,
      restored_at: new Date().toISOString(),
      restored_by: user.email || user.id,
      restored_counts: restoredCounts,
    })
  } catch (error) {
    return jsonResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, 500)
  }
})
