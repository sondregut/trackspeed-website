import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'legal'});
  return {
    title: t('deleteAccount.title'),
    description: t('deleteAccount.description'),
    alternates: getAlternates('/delete-account'),
  };
}

export default async function DeleteAccountPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Delete Your Account</h1>
        <p className="text-[#9B9A97] mb-12">Last updated: February 28, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. How to Delete Your Account</h2>
          <p className="text-[#9B9A97] mb-2">You can delete your account directly from the TrackSpeed app:</p>
          <ol className="list-decimal pl-5 text-[#9B9A97] space-y-1">
            <li>Open the TrackSpeed app</li>
            <li>Go to <strong className="text-white">Settings</strong></li>
            <li>Tap <strong className="text-white">Account</strong></li>
            <li>Tap <strong className="text-white">Delete Account</strong></li>
            <li>Confirm the deletion when prompted</li>
          </ol>
          <p className="text-[#9B9A97] mt-2">
            Your account and all associated data will be permanently deleted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. What Gets Deleted</h2>
          <p className="text-[#9B9A97] mb-2">When you delete your account, the following data is permanently removed:</p>
          <ul className="list-disc pl-5 text-[#9B9A97] space-y-1">
            <li>Your name, email address, and authentication credentials</li>
            <li>Display name and profile details</li>
            <li>All recorded sprint timing sessions and results</li>
            <li>Individual run times, splits, and personal records</li>
            <li>Subscription status and billing history</li>
            <li>Crossing photos and session thumbnails</li>
            <li>Push notification tokens and device identifiers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. What Gets Retained</h2>
          <p className="text-[#9B9A97]">
            Anonymized, aggregated analytics data that cannot be linked back to your identity may be retained to help us improve the app. This data contains no personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Can&apos;t Access the App?</h2>
          <p className="text-[#9B9A97] mb-2">
            If you are unable to access the app to delete your account, you can request deletion by email:
          </p>
          <ul className="list-disc pl-5 text-[#9B9A97] space-y-1">
            <li>
              Email{" "}
              <a href="mailto:privacy@mytrackspeed.com?subject=Account%20Deletion%20Request" className="text-[#5C8DB8] hover:underline">
                privacy@mytrackspeed.com
              </a>
              {" "}with the subject line <strong className="text-white">&quot;Account Deletion Request&quot;</strong>
            </li>
            <li>Include the email address associated with your account</li>
            <li>We will process your request within <strong className="text-white">30 days</strong></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Additional Notes</h2>
          <ul className="list-disc pl-5 text-[#9B9A97] space-y-1">
            <li>
              If you have an active subscription, cancel it through the{" "}
              <a href="https://play.google.com/store/account/subscriptions" className="text-[#5C8DB8] hover:underline">Google Play Store</a>
              {" "}or{" "}
              <a href="https://apps.apple.com/account/subscriptions" className="text-[#5C8DB8] hover:underline">App Store</a>
              {" "}before deleting your account. Deleting your account does not automatically cancel your subscription.
            </li>
            <li>Once your account is deleted, your data cannot be recovered. Deletion is permanent and irreversible.</li>
            <li>
              For questions about your data, see our{" "}
              <a href="/privacy" className="text-[#5C8DB8] hover:underline">Privacy Policy</a>
              {" "}or contact{" "}
              <a href="mailto:privacy@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">privacy@mytrackspeed.com</a>
              .
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
