'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText } from 'lucide-react'
import { formatZAR, formatDate } from '@/lib/utils'
import type { Invoice } from '@/types'

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-50 text-blue-700',
  paid: 'bg-emerald-50 text-emerald-700',
}

export function PatientInvoicesTab({ patientId }: { patientId: string }) {
  const { data, isLoading } = useQuery<{ invoices: Invoice[] }>({
    queryKey: ['invoices', patientId],
    queryFn: () => fetch(`/api/invoices?patient_id=${patientId}`).then(r => r.json()),
  })

  const invoices = data?.invoices || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Invoices</h3>
        <Button asChild size="sm" style={{ background: '#0f4c5c' }}>
          <Link href={`/invoices/new?patient=${patientId}`}>
            <Plus className="w-4 h-4 mr-1" /> New Invoice
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}
        </div>
      ) : !invoices.length ? (
        <Card>
          <CardContent className="py-10 text-center">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {invoices.map(inv => (
              <li key={inv.id}>
                <Link href={`/invoices/${inv.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors group">
                  <div>
                    <p className="text-sm font-medium">{inv.invoice_number}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(inv.invoice_date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatZAR(inv.grand_total_cents)}</span>
                    <Badge className={`text-xs ${statusColors[inv.status]}`}>{inv.status}</Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
