import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const CreateGrowthSchema = z.object({
  measurement_date: z.string().min(1, 'measurement_date is required'),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('growth_entries')
    .select('*')
    .eq('patient_id', id)
    .order('measurement_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient()
  const { id } = await params
  const body = await req.json()

  const parsed = CreateGrowthSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('growth_entries')
    .insert([{ ...body, patient_id: id }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data }, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createAdminClient()
  await params
  const { searchParams } = new URL(req.url)
  const entryId = searchParams.get('entryId')

  if (!entryId) return NextResponse.json({ error: 'entryId required' }, { status: 400 })

  const { error } = await supabase.from('growth_entries').delete().eq('id', entryId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
