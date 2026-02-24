import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient()
  const { id } = await params

  const [invoiceRes, serviceRes, vaccineRes] = await Promise.all([
    supabase.from('invoices').select('*').eq('id', id).single(),
    supabase.from('invoice_service_lines').select('*').eq('invoice_id', id).order('sort_order'),
    supabase.from('invoice_vaccine_lines').select('*').eq('invoice_id', id).order('sort_order'),
  ])

  if (invoiceRes.error) return NextResponse.json({ error: invoiceRes.error.message }, { status: 404 })

  return NextResponse.json({
    invoice: {
      ...invoiceRes.data,
      service_lines: serviceRes.data || [],
      vaccine_lines: vaccineRes.data || [],
    },
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient()
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from('invoices')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ invoice: data })
}
