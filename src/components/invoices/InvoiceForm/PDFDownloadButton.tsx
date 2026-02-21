'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvoiceDocument, type InvoicePDFData } from '@/components/invoices/InvoicePDF/InvoiceDocument'

export default function PDFDownloadButton({ invoiceData }: { invoiceData: InvoicePDFData }) {
  return (
    <PDFDownloadLink
      document={<InvoiceDocument data={invoiceData} />}
      fileName={`invoice-${invoiceData.invoiceNumber}-${invoiceData.patientName.replace(/\s+/g, '-')}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading}>
          <Download className="w-4 h-4 mr-1" />
          {loading ? 'Generating…' : 'Preview PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
