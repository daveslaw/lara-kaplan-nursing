'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import { formatDate, weightDisplay } from '@/lib/utils'
import type { GrowthEntry, GrowthEntryFormData } from '@/types'

interface GrowthTabProps { patientId: string }

export function GrowthTab({ patientId }: GrowthTabProps) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<GrowthEntryFormData>()

  const { data, isLoading } = useQuery<{ entries: GrowthEntry[] }>({
    queryKey: ['growth', patientId],
    queryFn: () => fetch(`/api/patients/${patientId}/growth`).then(r => r.json()),
  })

  const entries = data?.entries || []

  const chartData = entries.map(e => ({
    label: e.age_months != null ? `${e.age_months}m` : formatDate(e.measurement_date),
    ageMonths: e.age_months ?? 0,
    weight: e.weight_grams != null ? +(e.weight_grams / 1000).toFixed(3) : null,
    length: e.length_cm ?? null,
    hc: e.head_circumference_cm ?? null,
  }))

  const onAdd = async (formData: GrowthEntryFormData) => {
    setSaving(true)
    try {
      const body = {
        measurement_date: formData.measurement_date,
        age_weeks: formData.age_weeks ? parseInt(formData.age_weeks) : null,
        age_months: formData.age_months ? parseFloat(formData.age_months) : null,
        weight_grams: formData.weight_grams ? parseInt(formData.weight_grams) : null,
        length_cm: formData.length_cm ? parseFloat(formData.length_cm) : null,
        head_circumference_cm: formData.head_circumference_cm ? parseFloat(formData.head_circumference_cm) : null,
        notes: formData.notes || null,
      }
      const res = await fetch(`/api/patients/${patientId}/growth`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Measurement added')
      queryClient.invalidateQueries({ queryKey: ['growth', patientId] })
      reset()
      setOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (entryId: string) => {
    if (!confirm('Delete this measurement?')) return
    const res = await fetch(`/api/patients/${patientId}/growth?entryId=${entryId}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Deleted')
      queryClient.invalidateQueries({ queryKey: ['growth', patientId] })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Growth Monitoring</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" style={{ background: '#0f4c5c' }}>
              <Plus className="w-4 h-4 mr-1" /> Add Measurement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Growth Measurement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAdd)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Date <span className="text-destructive">*</span></Label>
                  <Input {...register('measurement_date', { required: true })} type="date"
                    defaultValue={format(new Date(), 'yyyy-MM-dd')} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Age (weeks)</Label>
                  <Input {...register('age_weeks')} type="number" min="0" placeholder="e.g. 6" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Age (months)</Label>
                  <Input {...register('age_months')} type="number" step="0.1" min="0" placeholder="e.g. 1.5" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Weight (grams)</Label>
                  <Input {...register('weight_grams')} type="number" min="0" placeholder="e.g. 4200" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Length (cm)</Label>
                  <Input {...register('length_cm')} type="number" step="0.1" min="0" placeholder="e.g. 54.5" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Head Circumference (cm)</Label>
                  <Input {...register('head_circumference_cm')} type="number" step="0.1" min="0" placeholder="e.g. 36.2" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Notes</Label>
                  <Textarea {...register('notes')} rows={2} placeholder="Any observations…" />
                </div>
              </div>
              <Button type="submit" disabled={saving} className="w-full" style={{ background: '#0f4c5c' }}>
                {saving ? 'Saving…' : 'Save Measurement'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chart */}
      {chartData.length >= 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Growth Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="weight" orientation="left" tick={{ fontSize: 11 }} unit="kg"
                  domain={['auto', 'auto']} />
                <YAxis yAxisId="cm" orientation="right" tick={{ fontSize: 11 }} unit="cm"
                  domain={['auto', 'auto']} />
                <Tooltip formatter={(val, name) => [
                  name === 'Weight' ? `${val} kg` : `${val} cm`, name
                ]} />
                <Legend />
                <Line yAxisId="weight" type="monotone" dataKey="weight" name="Weight"
                  stroke="#0f4c5c" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                <Line yAxisId="cm" type="monotone" dataKey="length" name="Length"
                  stroke="#2ba3b6" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                <Line yAxisId="cm" type="monotone" dataKey="hc" name="Head Circ."
                  stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          ) : !entries.length ? (
            <div className="p-6 text-sm text-muted-foreground text-center">No measurements recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  {['Date', 'Age', 'Weight', 'Length', 'HC', 'Notes', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map(e => (
                  <tr key={e.id} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5">{formatDate(e.measurement_date)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {e.age_months != null ? `${e.age_months}m` : e.age_weeks != null ? `${e.age_weeks}w` : '—'}
                    </td>
                    <td className="px-4 py-2.5">{weightDisplay(e.weight_grams)}</td>
                    <td className="px-4 py-2.5">{e.length_cm ? `${e.length_cm} cm` : '—'}</td>
                    <td className="px-4 py-2.5">{e.head_circumference_cm ? `${e.head_circumference_cm} cm` : '—'}</td>
                    <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">{e.notes || '—'}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => onDelete(e.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
