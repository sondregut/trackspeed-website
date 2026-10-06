import type { Metadata } from 'next'
import './dashboard.css'

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | TrackSpeed Dashboard',
  },
  description: 'Every run, split and finish photo from your TrackSpeed sessions.',
  robots: { index: false, follow: false, nocache: true },
}

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="ts-dash">{children}</div>
}
