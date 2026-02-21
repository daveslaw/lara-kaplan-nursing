import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatZAR(cents: number): string {
  return `R ${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy')
  } catch {
    return dateStr
  }
}

export function ageLabel(dobStr: string | null | undefined): string {
  if (!dobStr) return '—'
  try {
    const dob = parseISO(dobStr)
    const now = new Date()
    const months =
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth())
    if (months < 1) {
      const days = Math.floor((now.getTime() - dob.getTime()) / 86_400_000)
      return `${days} day${days !== 1 ? 's' : ''} old`
    }
    if (months < 24) return `${months} month${months !== 1 ? 's' : ''} old`
    const years = Math.floor(months / 12)
    return `${years} year${years !== 1 ? 's' : ''} old`
  } catch {
    return '—'
  }
}

export function weightDisplay(grams: number | null | undefined): string {
  if (grams == null) return '—'
  return grams >= 1000
    ? `${(grams / 1000).toFixed(2)} kg`
    : `${grams} g`
}
