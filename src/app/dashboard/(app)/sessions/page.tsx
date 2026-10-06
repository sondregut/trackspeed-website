import type { Metadata } from 'next'
import { SessionsView } from '@/components/dashboard/views/SessionsView'

export const metadata: Metadata = { title: 'Sessions' }

export default function DashboardSessionsPage() {
  return <SessionsView />
}
