'use client'

import { Download } from 'lucide-react'
import { buildRunsCsv, csvFilename } from '@/lib/dashboard/format'
import type { Dataset, DashboardRun } from '@/lib/dashboard/types'
import { useDashboard } from './DashboardProvider'
import { Button, EmptyState, ErrorState, Skeleton } from './ui'

/** Renders children once data is ready; skeleton, error and empty states otherwise. */
export function DataView({
  children,
  skeleton,
}: {
  children: (dataset: Dataset) => React.ReactNode
  skeleton?: React.ReactNode
}) {
  const { status, dataset, error, reload, user } = useDashboard()
  if (status === 'error' && !dataset) return <ErrorState message={error ?? 'Something went wrong.'} onRetry={reload} />
  if (status === 'loading' && !dataset) return <>{skeleton ?? <PageSkeleton />}</>
  if (!dataset) return null
  if (dataset.runs.length === 0) {
    return (
      <EmptyState
        title="No runs yet"
        action={<Button onClick={reload}>Check again</Button>}
      >
        Runs you time in the TrackSpeed app show up here once they upload. Make sure the app is signed in
        {user?.email ? ` as ${user.email}` : ' with this account'} and the phone has a connection after the session.
      </EmptyState>
    )
  }
  return <>{children(dataset)}</>
}

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-72" />
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i}>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="mt-12 space-y-3">
        {[0, 1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}

export function ExportCsvButton({ runs, name, label = 'Export CSV' }: { runs: DashboardRun[]; name: string[]; label?: string }) {
  const { unit, sessionsByKey } = useDashboard()
  const onExport = () => {
    const csv = buildRunsCsv(runs, sessionsByKey, unit)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = csvFilename(name)
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <Button onClick={onExport} disabled={runs.length === 0}>
      <Download size={15} aria-hidden="true" /> {label}
    </Button>
  )
}
