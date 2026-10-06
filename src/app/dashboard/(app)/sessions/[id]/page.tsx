import type { Metadata } from 'next'
import { SessionDetailView } from '@/components/dashboard/views/SessionDetailView'

export const metadata: Metadata = { title: 'Session' }

export default async function DashboardSessionPage(props: PageProps<'/dashboard/sessions/[id]'>) {
  const { id } = await props.params
  return <SessionDetailView sessionKey={id} />
}
