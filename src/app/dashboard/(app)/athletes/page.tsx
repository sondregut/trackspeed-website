import type { Metadata } from 'next'
import { AthletesView } from '@/components/dashboard/views/AthletesView'

export const metadata: Metadata = { title: 'Athletes' }

export default function DashboardAthletesPage() {
  return <AthletesView />
}
