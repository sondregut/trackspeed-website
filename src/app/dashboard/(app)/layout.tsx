import { Suspense } from 'react'
import { DashboardProvider } from '@/components/dashboard/DashboardProvider'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

// Signed-in area. Authentication happens in the browser with the user's own
// Supabase session; DashboardProvider redirects to /dashboard/login without one.
export default function DashboardAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </Suspense>
  )
}
