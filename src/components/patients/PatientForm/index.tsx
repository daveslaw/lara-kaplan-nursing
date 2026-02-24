'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { PatientFormData, Patient } from '@/types'

interface PatientFormProps {
  defaultValues?: Partial<PatientFormData>
  onSubmit: (data: PatientFormData) => Promise<void>
  isLoading?: boolean
  patient?: Patient
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground/80">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}

export function PatientForm({ defaultValues, onSubmit, isLoading, patient }: PatientFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PatientFormData>({
    defaultValues: defaultValues || {
      client_name: patient?.client_name || '',
      client_id_number: patient?.client_id_number || '',
      partner_name: patient?.partner_name || '',
      home_address: patient?.home_address || '',
      contact_number: patient?.contact_number || '',
      email: patient?.email || '',
      baby_name: patient?.baby_name || '',
      baby_dob: patient?.baby_dob || '',
      place_of_birth: patient?.place_of_birth || '',
      medical_aid_name: patient?.medical_aid_name || '',
      medical_aid_number: patient?.medical_aid_number || '',
      main_member_name: patient?.main_member_name || '',
      main_member_id: patient?.main_member_id || '',
      maternal_history: patient?.maternal_history || '',
      num_children: patient?.num_children?.toString() || '',
      num_pregnancies: patient?.num_pregnancies?.toString() || '',
      gynae_notes: patient?.gynae_notes || '',
      weeks_gestation: patient?.weeks_gestation?.toString() || '',
      birth_weight_grams: patient?.birth_weight_grams?.toString() || '',
      mode_of_delivery: patient?.mode_of_delivery || '',
      discharge_weight_grams: patient?.discharge_weight_grams?.toString() || '',
      paed_notes: patient?.paed_notes || '',
      consent_date: patient?.consent_date || '',
      consent_name: patient?.consent_name || '',
    },
  })

  const modeOfDelivery = watch('mode_of_delivery')

  const handleFormSubmit = async (data: PatientFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Client & Baby */}
      <Section title="Client & Baby Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Mom / Client Name" required>
            <Input {...register('client_name', { required: 'Client name is required' })}
              placeholder="e.g. Jane Smith"
              className={errors.client_name ? 'border-destructive' : ''} />
            {errors.client_name && (
              <p className="text-xs text-destructive mt-1">{errors.client_name.message}</p>
            )}
          </Field>
          <Field label="Client ID Number">
            <Input {...register('client_id_number')} placeholder="13-digit SA ID" />
          </Field>
          <Field label="Partner Name">
            <Input {...register('partner_name')} placeholder="e.g. John Smith" />
          </Field>
          <Field label="Contact Number">
            <Input {...register('contact_number')} placeholder="e.g. 082 555 1234" type="tel" />
          </Field>
          <Field label="Email Address">
            <Input {...register('email')} placeholder="e.g. jane@email.com" type="email" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Home Address">
              <Textarea {...register('home_address')} placeholder="Full home address" rows={2} />
            </Field>
          </div>
          <Separator className="sm:col-span-2 my-1" />
          <Field label="Baby's Name">
            <Input {...register('baby_name')} placeholder="e.g. Baby Smith" />
          </Field>
          <Field label="Baby's Date of Birth">
            <Input {...register('baby_dob')} type="date" />
          </Field>
          <Field label="Place of Birth">
            <Input {...register('place_of_birth')} placeholder="e.g. Sandton Clinic" />
          </Field>
        </div>
      </Section>

      {/* Medical Aid */}
      <Section title="Medical Aid">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Medical Aid Name">
            <Input {...register('medical_aid_name')} placeholder="e.g. Discovery Health" />
          </Field>
          <Field label="Medical Aid Number">
            <Input {...register('medical_aid_number')} placeholder="Scheme number" />
          </Field>
          <Field label="Main Member Name">
            <Input {...register('main_member_name')} placeholder="Main member full name" />
          </Field>
          <Field label="Main Member ID Number">
            <Input {...register('main_member_id')} placeholder="13-digit SA ID" />
          </Field>
        </div>
      </Section>

      {/* Pregnancy History */}
      <Section title="History of Pregnancy">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Number of Pregnancies">
            <Input {...register('num_pregnancies')} type="number" min="0" placeholder="e.g. 2" />
          </Field>
          <Field label="Number of Children">
            <Input {...register('num_children')} type="number" min="0" placeholder="e.g. 1" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Maternal History">
              <Textarea {...register('maternal_history')} placeholder="Relevant maternal history…" rows={2} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Gynae Notes">
              <Textarea {...register('gynae_notes')} placeholder="Gynaecologist notes…" rows={2} />
            </Field>
          </div>
        </div>
      </Section>

      {/* Baby History */}
      <Section title="Baby's History">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Weeks Gestation at Birth">
            <Input {...register('weeks_gestation')} type="number" step="0.1" min="20" max="45" placeholder="e.g. 38" />
          </Field>
          <Field label="Mode of Delivery">
            <Select
              value={modeOfDelivery}
              onValueChange={v => setValue('mode_of_delivery', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NVD">NVD (Normal Vaginal Delivery)</SelectItem>
                <SelectItem value="C-Section">C-Section</SelectItem>
                <SelectItem value="Assisted">Assisted Delivery</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Weight at Birth (grams)">
            <Input {...register('birth_weight_grams')} type="number" min="0" placeholder="e.g. 3200" />
          </Field>
          <Field label="Discharge Weight (grams)">
            <Input {...register('discharge_weight_grams')} type="number" min="0" placeholder="e.g. 3050" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Paed Notes">
              <Textarea {...register('paed_notes')} placeholder="Paediatrician notes…" rows={2} />
            </Field>
          </div>
        </div>
      </Section>

      {/* Consent */}
      <Section title="Consent">
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          I hereby give consent for vaccines to be administered to my child according to the recommended vaccination
          schedule in South Africa. The schedule and side effects have been explained by the nursing practitioner and
          I accept the risks associated with vaccine administration.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Consent Date">
            <Input {...register('consent_date')} type="date" />
          </Field>
          <Field label="Consenting Person Name">
            <Input {...register('consent_name')} placeholder="Full name of person consenting" />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save Patient'}
        </Button>
      </div>
    </form>
  )
}
