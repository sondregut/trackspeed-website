import OnboardingView from "@/components/admin/OnboardingView"
import { onboardingApps, onboardingUpdatedAt } from "@/lib/admin-onboarding"

export const metadata = { title: { absolute: "Onboarding | TrackSpeed Admin" } }

export default function OnboardingPage() {
  return <OnboardingView apps={onboardingApps} updatedAt={onboardingUpdatedAt} />
}
