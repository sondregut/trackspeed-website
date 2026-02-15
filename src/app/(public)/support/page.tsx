import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support - TrackSpeed",
  description: "Get help with TrackSpeed. FAQ, troubleshooting, and contact information.",
  alternates: {
    canonical: "https://mytrackspeed.com/support",
  },
};

export default function SupportPage() {
  const faqs = [
    {
      question: "How does TrackSpeed work?",
      answer: "TrackSpeed uses your iPhone's camera to detect when an athlete crosses the timing gate. The app uses camera-based motion detection to identify when the athlete's torso crosses the timing gate, providing millisecond-accurate timing.",
    },
    {
      question: "Do I need special equipment?",
      answer: "No! TrackSpeed works with just your iPhone. For split timing or start/finish gates, you can use two iPhones that sync together wirelessly.",
    },
    {
      question: "What iPhone models are supported?",
      answer: "TrackSpeed works with iPhone XS and later (iOS 17+). For best performance, we recommend iPhone 12 Pro or newer.",
    },
    {
      question: "How accurate is the timing?",
      answer: "TrackSpeed provides millisecond-level timing precision. When using two devices, our clock synchronization ensures both gates are aligned for accurate split times.",
    },
    {
      question: "Can I use TrackSpeed for official competitions?",
      answer: "TrackSpeed is designed for training and unofficial timing. For official competitions, please use certified timing equipment as required by your sport's governing body.",
    },
    {
      question: "How do I connect two phones together?",
      answer: "Both devices need to have TrackSpeed installed. One device creates a session as the 'host,' and the other joins. The devices connect automatically via peer-to-peer networking - no internet connection required.",
    },
    {
      question: "How do I cancel my subscription?",
      answer: "Subscriptions are managed through your Apple ID. Go to Settings → [Your Name] → Subscriptions → TrackSpeed → Cancel Subscription.",
    },
  ];

  const troubleshooting = [
    {
      issue: "The app isn't detecting crossings",
      solutions: [
        "Ensure good lighting - the camera needs to clearly see the athlete",
        "Position the phone so the athlete passes perpendicular to the camera view",
        "Make sure the athlete's torso is visible in the frame",
        "Try using a higher FPS setting (60 or 120fps) in settings",
      ],
    },
    {
      issue: "Two devices won't connect",
      solutions: [
        "Ensure both devices have WiFi and Bluetooth enabled",
        "Both devices should be within 30 feet of each other",
        "Try closing and reopening the app on both devices",
        "Make sure both devices are running the latest version of TrackSpeed",
      ],
    },
    {
      issue: "The app is running slow or getting hot",
      solutions: [
        "Remove any phone case to help with cooling",
        "Avoid direct sunlight on the device",
        "Close other apps running in the background",
        "Take breaks between timing sessions",
      ],
    },
  ];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support</h1>
        <p className="text-muted mb-12">Last updated: February 14, 2026</p>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted mb-4">
            If you need help with TrackSpeed or have any questions, we&apos;re here to assist you.
          </p>
          <p className="text-muted">
            <strong className="text-foreground">Email:</strong>{" "}
            <a href="mailto:support@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
              support@mytrackspeed.com
            </a>
          </p>
          <p className="text-muted mt-2">We typically respond within 24-48 hours.</p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card-gunmetal rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Troubleshooting</h2>
          <div className="space-y-6">
            {troubleshooting.map((item, index) => (
              <div key={index} className="card-gunmetal rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{item.issue}</h3>
                <ul className="list-disc list-inside space-y-2 text-muted">
                  {item.solutions.map((solution, i) => (
                    <li key={i}>{solution}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Feature Requests & Feedback</h2>
          <p className="text-muted">
            We love hearing from our users! Visit our{" "}
            <a href="/feedback" className="text-[#5C8DB8] hover:underline">
              feedback board
            </a>
            {" "}to vote on ideas, suggest new features, or report bugs. You can also email us at{" "}
            <a href="mailto:feedback@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
              feedback@mytrackspeed.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
