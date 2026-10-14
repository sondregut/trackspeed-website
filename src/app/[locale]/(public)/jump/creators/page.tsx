import type {Metadata} from 'next';
import CreatorDashboard from '@/components/jump/creators/CreatorDashboard';

export const metadata: Metadata = {
  title: 'TrackJump creator dashboard',
  description: 'Creators in the TrackJump program see their code, customers and earnings.',
  robots: {index: false, follow: false},
};

export default function Page() {
  return <CreatorDashboard />;
}
