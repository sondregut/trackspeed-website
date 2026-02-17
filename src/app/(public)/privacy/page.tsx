import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "TrackSpeed privacy policy. How we handle camera data, timing sessions, and personal information. Video is processed on-device only.",
  alternates: {
    canonical: "https://mytrackspeed.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-[#9B9A97] mb-12">Last updated: February 12, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
          <p className="text-[#9B9A97]">
            TrackSpeed (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application (&quot;App&quot;).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>

          <h3 className="text-lg font-semibold mb-2 mt-4">2.1 Information You Provide</h3>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li><strong className="text-white">Account Information:</strong> When you create an account, we collect your name and email address (via Apple Sign In).</li>
            <li><strong className="text-white">Profile Information:</strong> Optional profile details you choose to provide, such as display name.</li>
            <li><strong className="text-white">Support Communications:</strong> Information you provide when contacting us for support.</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li><strong className="text-white">Usage Data:</strong> Information about how you use the App, including timing sessions, features used, and app performance data.</li>
            <li><strong className="text-white">Device Information:</strong> Device type, operating system version, and unique device identifiers.</li>
            <li><strong className="text-white">Analytics Data:</strong> Anonymized data about app usage patterns to improve our services.</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2 mt-4">2.3 Camera Data</h3>
          <p className="text-[#9B9A97] mb-2">The App requires camera access to function. Important notes about camera usage:</p>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li>Video is processed in real-time on your device for crossing detection</li>
            <li>We do not upload, store, or transmit video footage to our servers</li>
            <li>Video frames are immediately discarded after processing</li>
            <li>Optional session recordings are stored locally on your device only</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li>Provide and maintain the App&apos;s functionality</li>
            <li>Process your account registration and manage your subscription</li>
            <li>Sync your timing data across devices (if you enable this feature)</li>
            <li>Respond to your support requests and inquiries</li>
            <li>Improve the App through anonymized analytics</li>
            <li>Send important updates about the App or your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Data Sharing and Disclosure</h2>
          <p className="text-[#9B9A97] mb-2">We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li><strong className="text-white">Service Providers:</strong> Third-party services that help us operate the App (e.g., cloud hosting, analytics).</li>
            <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights, safety, or property.</li>
            <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Third-Party Services</h2>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li><strong className="text-white">Apple Sign In:</strong> For authentication. Subject to Apple&apos;s Privacy Policy.</li>
            <li><strong className="text-white">RevenueCat:</strong> For subscription management. Subject to RevenueCat&apos;s Privacy Policy.</li>
            <li><strong className="text-white">Supabase:</strong> For data storage and authentication. Subject to Supabase&apos;s Privacy Policy.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Data Storage and Security</h2>
          <p className="text-[#9B9A97]">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These include encryption of data in transit and at rest, secure authentication mechanisms, and limited access to personal data by employees.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">7. Data Retention</h2>
          <p className="text-[#9B9A97]">
            We retain your personal data only for as long as necessary. Account data is retained while your account is active. Timing session data is retained until you delete it or your account. You may request deletion of your account and associated data at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. Your Rights</h2>
          <p className="text-[#9B9A97] mb-2">Depending on your location, you may have the following rights:</p>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
            <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
            <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
            <li><strong className="text-white">Portability:</strong> Request your data in a portable format</li>
          </ul>
          <p className="text-[#9B9A97] mt-2">
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
              privacy@mytrackspeed.com
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">9. Children&apos;s Privacy</h2>
          <p className="text-[#9B9A97]">
            The App is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">10. Changes to This Policy</h2>
          <p className="text-[#9B9A97]">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">11. Contact Us</h2>
          <p className="text-[#9B9A97]">
            If you have any questions about this Privacy Policy, please contact us at:{" "}
            <a href="mailto:privacy@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
              privacy@mytrackspeed.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
