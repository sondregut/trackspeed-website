import { Metadata } from 'next'
import { CopyButton } from './CopyButton'

// App Store URL for TrackSpeed
const APP_STORE_URL = 'https://apps.apple.com/app/trackspeed/id6757509163'

type Props = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params

  return {
    title: 'You\'ve been invited! - TrackSpeed',
    description: 'Get the app and start timing your sprints.',
    openGraph: {
      title: 'You\'ve been invited! - TrackSpeed',
      description: 'Get the app and start timing your sprints.',
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
          <img
            src="/icon.png"
            alt="TrackSpeed"
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

        {/* iPhone Button */}
        <a
          href={APP_STORE_URL}
          className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-full border border-[#E5E5E7] hover:bg-[#F5F5F7] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.0349 12.5C17.0249 10.65 17.9449 9.25 19.7949 8.25C18.7949 6.8 17.2449 6 15.1849 5.85C13.2349 5.7 11.0849 7 10.2849 7C9.43494 7 7.58494 5.9 6.13494 5.9C3.13494 5.95 0.0349426 8.3 0.0349426 12.75C0.0349426 14.1 0.284943 15.5 0.784943 16.95C1.48494 18.95 4.03494 23.95 6.68494 23.85C8.03494 23.8 9.00494 22.85 10.7349 22.85C12.4149 22.85 13.3149 23.85 14.8149 23.85C17.4849 23.8 19.7849 19.25 20.4349 17.25C17.1849 15.7 17.0349 12.6 17.0349 12.5ZM14.0349 4C15.5349 2.2 15.3849 0.55 15.3349 0C14.0349 0.1 12.5349 0.95 11.6849 1.95C10.7349 3.05 10.1849 4.4 10.3349 5.85C11.7349 5.95 13.0349 5.15 14.0349 4Z" fill="#007AFF"/>
          </svg>
          <span className="text-[#1D1D1F] font-medium">iPhone</span>
        </a>

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
