'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScanLine, Upload, CheckCircle2, Loader2 } from 'lucide-react'
import type { PatientFormData } from '@/types'

type ParsedFields = Partial<PatientFormData>

const FIELD_LABELS: Array<{ key: keyof PatientFormData; label: string; type?: string }> = [
  { key: 'client_name', label: 'Mom / Client Name' },
  { key: 'client_id_number', label: 'Client ID Number' },
  { key: 'partner_name', label: 'Partner Name' },
  { key: 'contact_number', label: 'Contact Number' },
  { key: 'email', label: 'Email' },
  { key: 'home_address', label: 'Home Address' },
  { key: 'baby_name', label: "Baby's Name" },
  { key: 'baby_dob', label: "Baby's Date of Birth", type: 'date' },
  { key: 'place_of_birth', label: 'Place of Birth' },
  { key: 'medical_aid_name', label: 'Medical Aid Name' },
  { key: 'medical_aid_number', label: 'Medical Aid Number' },
  { key: 'main_member_name', label: 'Main Member Name' },
  { key: 'main_member_id', label: 'Main Member ID' },
  { key: 'weeks_gestation', label: 'Weeks Gestation' },
  { key: 'mode_of_delivery', label: 'Mode of Delivery' },
  { key: 'birth_weight_grams', label: 'Birth Weight (grams)' },
  { key: 'num_pregnancies', label: 'Number of Pregnancies' },
  { key: 'num_children', label: 'Number of Children' },
]

export default function OCRPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [fields, setFields] = useState<ParsedFields | null>(null)
  const [rawText, setRawText] = useState('')
  const [saving, setSaving] = useState(false)

  const handleFile = (f: File) => {
    setFile(f)
    setFields(null)
    setRawText('')
    const url = URL.createObjectURL(f)
    setPreviewUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleScan = async () => {
    if (!file) return
    setScanning(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/ocr', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setFields(json.parsedFields || {})
      setRawText(json.rawText || '')
      toast.success('Form scanned successfully!')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setScanning(false)
    }
  }

  const handleSaveAsNew = async () => {
    if (!fields) return
    setSaving(true)
    try {
      const body: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(fields)) {
        if (!v || v === '') body[k] = null
        else if (['num_children', 'num_pregnancies', 'birth_weight_grams', 'discharge_weight_grams'].includes(k)) {
          body[k] = parseInt(v as string) || null
        } else if (k === 'weeks_gestation') {
          body[k] = parseFloat(v as string) || null
        } else {
          body[k] = v
        }
      }
      if (!body.client_name) {
        toast.error('Client name is required before saving')
        return
      }
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success('Patient saved!')
      router.push(`/patients/${json.patient.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (key: keyof PatientFormData, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      <TopBar
        title="Scan Patient Form"
        subtitle="Upload a handwritten form to extract patient details using OCR"
      />

      <div className={`grid gap-5 ${fields ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>
        {/* Upload zone */}
        <div className="space-y-4">
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer
              ${file ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/30'}`}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
          >
            <CardContent className="py-10 flex flex-col items-center gap-3 text-center">
              {file ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} KB · Click to change
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Drop PDF or image here</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse · PDF, JPG, PNG</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />

          {file && !fields && (
            <Button
              className="w-full"
              style={{ background: '#0f4c5c' }}
              onClick={handleScan}
              disabled={scanning}
            >
              {scanning ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning…</>
              ) : (
                <><ScanLine className="w-4 h-4 mr-2" />Scan with OCR</>
              )}
            </Button>
          )}

          {/* Image preview */}
          {previewUrl && file?.type !== 'application/pdf' && (
            <div className="rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Uploaded form" className="w-full object-contain max-h-[500px]" />
            </div>
          )}
          {previewUrl && file?.type === 'application/pdf' && (
            <div className="rounded-lg overflow-hidden border border-border bg-muted/30 h-[400px]">
              <iframe src={previewUrl} className="w-full h-full" title="PDF preview" />
            </div>
          )}
        </div>

        {/* Extracted fields */}
        {fields && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Extracted Fields — Review &amp; Correct
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {FIELD_LABELS.map(({ key, label, type }) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs">{label}</Label>
                    {key === 'home_address' ? (
                      <Textarea
                        value={(fields[key] as string) || ''}
                        onChange={e => updateField(key, e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    ) : (
                      <Input
                        type={type || 'text'}
                        value={(fields[key] as string) || ''}
                        onChange={e => updateField(key, e.target.value)}
                        className={`text-sm ${fields[key] ? 'border-emerald-300 bg-emerald-50/30' : ''}`}
                        placeholder="Not detected"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1"
                    style={{ background: '#0f4c5c' }}
                    onClick={handleSaveAsNew}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save as New Patient'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setFields(null); setRawText(''); setFile(null); setPreviewUrl(null) }}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {rawText && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">Raw OCR Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono max-h-48 overflow-y-auto leading-relaxed">
                    {rawText}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
