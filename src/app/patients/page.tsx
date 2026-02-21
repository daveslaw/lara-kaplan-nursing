'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, ChevronRight, Baby } from 'lucide-react'
import Link from 'next/link'
import { ageLabel, formatDate } from '@/lib/utils'
import type { Patient } from '@/types'

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data, isLoading } = useQuery<{ patients: Patient[]; total: number }>({
    queryKey: ['patients', debouncedSearch],
    queryFn: () =>
      fetch(`/api/patients?search=${encodeURIComponent(debouncedSearch)}&limit=100`).then(r => r.json()),
  })

  const handleSearch = (val: string) => {
    setSearch(val)
    clearTimeout((window as Window & { _st?: ReturnType<typeof setTimeout> })._st)
    ;(window as Window & { _st?: ReturnType<typeof setTimeout> })._st = setTimeout(
      () => setDebouncedSearch(val), 300
    )
  }

  return (
    <div>
      <TopBar
        title="Patients"
        subtitle={data ? `${data.total} patient${data.total !== 1 ? 's' : ''}` : undefined}
        actions={
          <Button asChild>
            <Link href="/patients/new">
              <Plus className="w-4 h-4 mr-1" /> New Patient
            </Link>
          </Button>
        }
      />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by baby or mom name…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : !data?.patients?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Baby className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {search ? 'No patients match your search.' : 'No patients yet.'}
            </p>
            {!search && (
              <Button asChild className="mt-4">
                <Link href="/patients/new">Add First Patient</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {data.patients.map(p => (
              <li key={p.id}>
                <Link
                  href={`/patients/${p.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#d0eaed', color: '#0f4c5c' }}>
                      <Baby className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{p.baby_name || 'Unnamed baby'}</p>
                      <p className="text-xs text-muted-foreground">
                        Mom: {p.client_name}
                        {p.baby_dob
                          ? ` · Born ${formatDate(p.baby_dob)} · ${ageLabel(p.baby_dob)}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
