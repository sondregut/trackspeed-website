import { Metadata } from 'next'
import Image from 'next/image'
import { CopyButton } from './CopyButton'

// App Store URL for TrackSpeed
const APP_STORE_URL = 'https://apps.apple.com/app/trackspeed/id6757509163'

type Props = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params

  return {
    title: 'You\'ve been invited to TrackSpeed',
    description: 'Download TrackSpeed and start timing your sprints with ~4ms accuracy. No hardware needed — just your phone.',
    robots: { index: false },
    openGraph: {
      title: 'You\'ve been invited to TrackSpeed',
      description: 'Download TrackSpeed and start timing your sprints with ~4ms accuracy.',
      type: 'website',
      url: `https://mytrackspeed.com/invite/${code}`,
    },
  }
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params
  const referralCode = code.toUpperCase()

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-16">
        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="TrackSpeed"
            width={40}
            height={40}
            className="w-10 h-10 rounded-xl"
          />
          <span className="text-2xl font-semibold text-[#1D1D1F]">TrackSpeed</span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] text-center mb-3">
        You&apos;ve been invited!
      </h1>

      <p className="text-[#86868B] text-lg text-center mb-8">
        Get the app and start timing your sprints.
      </p>

      {/* Download Card */}
      <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
        <p className="text-[#1D1D1F] text-center font-medium mb-6">
          Download the app:
        </p>

        {/* Download Button */}
        <div className="flex justify-center">
          <a href={APP_STORE_URL} className="inline-block hover:opacity-80 transition-opacity">
            <Image
              src="/app-store-badge.svg"
              alt="Download on the App Store"
              width={120}
              height={40}
              className="h-[40px] w-auto"
            />
          </a>
        </div>

        {/* Referral Code */}
        <div className="mt-8 text-center">
          <p className="text-[#86868B] text-sm mb-3">
            Use referral code:
          </p>
          <CopyButton code={referralCode} />
        </div>
      </div>
    </main>
  )
}
