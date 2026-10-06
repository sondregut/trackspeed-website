import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthCallbackView } from '@/components/dashboard/views/AuthCallbackView'

export const metadata: Metadata = { title: 'Signing in' }

export default function DashboardAuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackView />
    </Suspense>
  )
}
