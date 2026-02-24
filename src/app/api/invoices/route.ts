import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patient_id')
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase
    .from('invoices')
    .select('*', { count: 'exact' })
    .order('invoice_date', { ascending: false })
    .limit(limit)

  if (patientId) query = query.eq('patient_id', patientId)
  if (status) query = query.eq('status', status)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoices: data, total: count })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { service_lines, vaccine_lines, ...invoiceData } = body

  // Insert invoice (trigger assigns invoice_number)
  const { data: invoice, error: invErr } = await supabase
    .from('invoices')
    .insert([{ ...invoiceData, invoice_number: '' }])
    .select()
    .single()

  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 })

  // Insert line items
  if (service_lines?.length) {
    const { error } = await supabase.from('invoice_service_lines').insert(
      service_lines.map((l: Record<string, unknown>, i: number) => ({ ...l, invoice_id: invoice.id, sort_order: i }))
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (vaccine_lines?.length) {
    const { error } = await supabase.from('invoice_vaccine_lines').insert(
      vaccine_lines.map((l: Record<string, unknown>, i: number) => ({ ...l, invoice_id: invoice.id, sort_order: i }))
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ invoice }, { status: 201 })
}
