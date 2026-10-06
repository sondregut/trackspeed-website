import type { Metadata } from 'next'
import { AthleteDetailView } from '@/components/dashboard/views/AthleteDetailView'

export const metadata: Metadata = { title: 'Athlete' }

export default async function DashboardAthletePage(props: PageProps<'/dashboard/athletes/[key]'>) {
  const { key } = await props.params
  return <AthleteDetailView athleteKey={key} />
}
