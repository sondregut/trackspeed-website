import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for the TrackSpeed sprint timing app. Covers subscriptions, acceptable use, and liability.",
  alternates: {
    canonical: "https://mytrackspeed.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto prose prose-zinc">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-muted mb-12">Last updated: February 14, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">1. Agreement to Terms</h2>
          <p className="text-muted">
            By downloading, installing, or using the TrackSpeed application (&quot;App&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, do not use the App.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">2. Description of Service</h2>
          <p className="text-muted">
            TrackSpeed is a mobile application that provides sprint timing functionality using your device&apos;s camera. The App is designed for training and recreational purposes and is not intended to replace certified timing equipment for official competitions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">3. Eligibility</h2>
          <p className="text-muted">
            You must be at least 13 years old to use this App. If you are under 18, you must have your parent or guardian&apos;s permission to use the App.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">4. Account Registration</h2>
          <p className="text-[#9B9A97] mb-3">Some features of the App may require you to create an account. You agree to:</p>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly notify us of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">5. Subscriptions and Payments</h2>
          <p className="text-[#9B9A97] mb-3">TrackSpeed offers subscription-based premium features. By subscribing, you agree to:</p>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-2">
            <li><strong className="text-foreground">Billing:</strong> Subscriptions are billed through your Apple ID account. Payment will be charged upon confirmation of purchase.</li>
            <li><strong className="text-foreground">Renewal:</strong> Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.</li>
            <li><strong className="text-foreground">Cancellation:</strong> You may manage and cancel subscriptions through your Apple ID account settings. Cancellation takes effect at the end of the current billing period.</li>
            <li><strong className="text-foreground">Price Changes:</strong> We reserve the right to change subscription prices. You will be notified of any price changes in advance.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">6. Acceptable Use</h2>
          <p className="text-[#9B9A97] mb-3">You agree not to:</p>
          <ul className="list-disc list-inside text-[#9B9A97] space-y-1">
            <li>Use the App for any unlawful purpose</li>
            <li>Record or photograph individuals without their consent</li>
            <li>Attempt to reverse engineer, decompile, or disassemble the App</li>
            <li>Remove or alter any proprietary notices in the App</li>
            <li>Use the App in any way that could damage or impair its functionality</li>
            <li>Use the App to harass, abuse, or harm others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">7. Intellectual Property</h2>
          <p className="text-muted">
            The App and its original content, features, and functionality are owned by TrackSpeed and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">8. Disclaimer of Warranties</h2>
          <p className="text-[#9B9A97] mb-3">
            THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          </p>
          <p className="text-muted">
            TIMING RESULTS PROVIDED BY THE APP ARE FOR INFORMATIONAL AND TRAINING PURPOSES ONLY. WE DO NOT GUARANTEE THE ACCURACY OF ANY TIMING DATA.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">9. Limitation of Liability</h2>
          <p className="text-muted">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL TRACKSPEED BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APP.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">10. Governing Law</h2>
          <p className="text-muted">
            These Terms shall be governed by and construed in accordance with the laws of Norway, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">11. Changes to Terms</h2>
          <p className="text-muted">
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 text-white">12. Contact Us</h2>
          <p className="text-muted">
            If you have any questions about these Terms, please contact us at:{" "}
            <a href="mailto:legal@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
              legal@mytrackspeed.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
