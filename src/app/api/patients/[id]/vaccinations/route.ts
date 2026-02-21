import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createServerClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('vaccination_records')
    .select('*')
    .eq('patient_id', id)
    .order('administered_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ records: data })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createServerClient()
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from('vaccination_records')
    .insert([{ ...body, patient_id: id }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ record: data }, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createServerClient()
  await params
  const { searchParams } = new URL(req.url)
  const recordId = searchParams.get('recordId')

  if (!recordId) return NextResponse.json({ error: 'recordId required' }, { status: 400 })

  const { error } = await supabase.from('vaccination_records').delete().eq('id', recordId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
