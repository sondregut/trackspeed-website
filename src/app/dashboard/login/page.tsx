import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginView } from '@/components/dashboard/views/LoginView'

export const metadata: Metadata = { title: 'Sign in' }

export default function DashboardLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  )
}
