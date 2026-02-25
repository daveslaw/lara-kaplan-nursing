import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const table = searchParams.get('table')

  let query = supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .order('performed_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (table) query = query.eq('table_name', table)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data, total: count })
}
