import type { PatientFormData } from '@/types'

type PartialPatient = Partial<PatientFormData>

function extract(text: string, ...patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const m = text.match(pattern)
    if (m?.[1]) return m[1].trim()
  }
  return ''
}

function normaliseSADate(raw: string): string {
  // Try DD/MM/YYYY or DD-MM-YYYY → YYYY-MM-DD
  const m = raw.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/)
  if (m) {
    const [, d, mo, y] = m
    const year = y.length === 2 ? `20${y}` : y
    return `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return raw
}

export function extractPatientFields(rawText: string): PartialPatient {
  const t = rawText

  const fields: PartialPatient = {}

  const clientName = extract(t,
    /client\s*name\s*[:\-]?\s*([^\n\r]+)/i,
    /client\s*[:\-]\s*([^\n\r]+)/i,
    /mother\s*[:\-]\s*([^\n\r]+)/i
  )
  if (clientName) fields.client_name = clientName

  const idNumber = extract(t,
    /id\s*(?:no|number|num)\s*[:\-]?\s*([0-9\s]{6,13})/i,
    /id\s*[:\-]\s*([0-9\s]{6,13})/i
  )
  if (idNumber) fields.client_id_number = idNumber.replace(/\s/g, '')

  const partnerName = extract(t,
    /partner(?:'s)?\s*name\s*[:\-]?\s*([^\n\r]+)/i,
    /father\s*[:\-]\s*([^\n\r]+)/i
  )
  if (partnerName) fields.partner_name = partnerName

  const babyName = extract(t,
    /baby(?:'s)?\s*name\s*[:\-]?\s*([^\n\r]+)/i,
    /infant\s*name\s*[:\-]?\s*([^\n\r]+)/i
  )
  if (babyName) fields.baby_name = babyName

  const babyDob = extract(t,
    /baby(?:'s)?\s*(?:date\s*of\s*birth|dob)\s*[:\-]?\s*([0-9\/\-\.]+)/i,
    /d\.?o\.?b\s*[:\-]?\s*([0-9\/\-\.]+)/i
  )
  if (babyDob) fields.baby_dob = normaliseSADate(babyDob)

  const placeOfBirth = extract(t,
    /place\s*of\s*birth\s*[:\-]?\s*([^\n\r]+)/i
  )
  if (placeOfBirth) fields.place_of_birth = placeOfBirth

  const contact = extract(t,
    /(?:contact|tel|phone|cell)\s*(?:details|no|number)?\s*[:\-]?\s*([0-9\s\+\(\)]{7,15})/i
  )
  if (contact) fields.contact_number = contact.trim()

  const email = extract(t,
    /email\s*(?:address)?\s*[:\-]?\s*([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/i
  )
  if (email) fields.email = email

  const address = extract(t,
    /(?:home\s*)?address\s*[:\-]?\s*([^\n\r]{5,})/i
  )
  if (address) fields.home_address = address

  const medAid = extract(t,
    /medical\s*aid\s*(?:name|scheme)?\s*[:\-]?\s*([^\n\r]+)/i
  )
  if (medAid) fields.medical_aid_name = medAid

  const medAidNo = extract(t,
    /medical\s*aid\s*(?:no|number|num)\s*[:\-]?\s*([A-Z0-9\s\-]+)/i,
    /scheme\s*(?:no|number)\s*[:\-]?\s*([A-Z0-9\s\-]+)/i
  )
  if (medAidNo) fields.medical_aid_number = medAidNo.trim()

  const mainMember = extract(t,
    /main\s*member\s*(?:name)?\s*[:\-]?\s*([^\n\r]+)/i
  )
  if (mainMember) fields.main_member_name = mainMember

  const mainMemberId = extract(t,
    /main\s*member\s*(?:id|id\s*no)\s*[:\-]?\s*([0-9\s]{6,13})/i
  )
  if (mainMemberId) fields.main_member_id = mainMemberId.replace(/\s/g, '')

  const weeks = extract(t,
    /(?:weeks\s*gestation|gestation)\s*[:\-]?\s*(\d+)/i,
    /(\d+)\s*weeks?\s*gestation/i
  )
  if (weeks) fields.weeks_gestation = weeks

  const birthWeight = extract(t,
    /birth\s*weight\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*(?:g|kg)?/i,
    /weight\s*at\s*birth\s*[:\-]?\s*(\d+(?:[.,]\d+)?)/i
  )
  if (birthWeight) {
    const val = parseFloat(birthWeight.replace(',', '.'))
    // If value looks like kg (< 20), convert to grams
    fields.birth_weight_grams = val < 20 ? String(Math.round(val * 1000)) : String(Math.round(val))
  }

  const mode = extract(t,
    /mode\s*of\s*delivery\s*[:\-]?\s*([^\n\r]+)/i
  )
  if (mode) {
    const m = mode.toLowerCase()
    if (m.includes('caesar') || m.includes('c-sec') || m.includes('csec')) {
      fields.mode_of_delivery = 'C-Section'
    } else if (m.includes('assist')) {
      fields.mode_of_delivery = 'Assisted'
    } else {
      fields.mode_of_delivery = 'NVD'
    }
  }

  const numPreg = extract(t,
    /(?:number\s*of\s*)?pregnancies\s*[:\-]?\s*(\d+)/i,
    /gravida\s*[:\-]?\s*(\d+)/i
  )
  if (numPreg) fields.num_pregnancies = numPreg

  const numChildren = extract(t,
    /(?:number\s*of\s*)?children\s*[:\-]?\s*(\d+)/i,
    /para\s*[:\-]?\s*(\d+)/i
  )
  if (numChildren) fields.num_children = numChildren

  return fields
}
