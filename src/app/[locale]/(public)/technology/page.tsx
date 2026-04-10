import Image from "next/image";
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';
import {Link} from "@/i18n/navigation";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'technology'});
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: getAlternates('/technology', locale),
    openGraph: {
      type: "article",
    },
  };
}

export default async function TechnologyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'technology'});

  const faqItems = [
    { question: t('faq.items.0.question'), answer: t('faq.items.0.answer') },
    { question: t('faq.items.1.question'), answer: t('faq.items.1.answer') },
    { question: t('faq.items.2.question'), answer: t('faq.items.2.answer') },
    { question: t('faq.items.3.question'), answer: t('faq.items.3.answer') },
    { question: t('faq.items.4.question'), answer: t('faq.items.4.answer') },
    { question: t('faq.items.5.question'), answer: t('faq.items.5.answer') },
  ];

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "How Phone Sprint Timing Achieves ~4ms Accuracy",
    description:
      "How TrackSpeed achieves ~4ms sprint timing accuracy: sub-frame interpolation, rolling shutter correction, and ±3-5ms multi-device clock sync — explained.",
    image: "https://mytrackspeed.com/icon.png",
    author: {
      "@type": "Person",
      name: "Sondre Guttormsen",
      url: "https://instagram.com/sondre_pv",
      jobTitle: "Co-Founder, TrackSpeed",
      description: "Two-time Olympian, NCAA champion pole vaulter",
    },
    publisher: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: "https://mytrackspeed.com/icon.png",
    },
    datePublished: "2026-02-01",
    dateModified: "2026-04-08",
    mainEntityOfPage: "https://mytrackspeed.com/technology",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mytrackspeed.com" },
      { "@type": "ListItem", position: 2, name: "Technology" },
    ],
  };

  return (
    <div className="bg-hero min-h-screen">
      <script
        type="application/ld+json"
        // Static JSON-LD — no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        // Static JSON-LD — no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        // Static JSON-LD — no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/#timing-technology"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToHome')}
          </Link>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl" style={{ color: "var(--text-muted)" }}>
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Four capability sections with detail paragraphs */}
          {(['subFrame', 'corrections', 'clockSync', 'bodyTracking'] as const).map((key, i) => (
            <section key={key} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">{i + 1}</div>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {t(`sections.${key}.title`)}
                </h2>
              </div>
              <div className="card-feature p-6 md:p-8 space-y-4">
                <p className="text-body">
                  {t(`sections.${key}.desc`)}
                </p>
                <p className="text-body" style={{ color: "var(--text-muted)" }}>
                  {t(`sections.${key}.detail`)}
                </p>
              </div>
            </section>
          ))}

          {/* Accuracy result */}
          <section className="mb-16">
            <div className="card-feature p-6 md:p-8">
              <div
                className="rounded-xl p-6 text-center mb-6"
                style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}
              >
                <div className="text-4xl font-bold mb-2" style={{ color: "var(--accent-green)" }}>
                  {t('accuracy.value')}
                </div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t('accuracy.label')}
                </div>
              </div>
              <p className="text-body text-center">
                {t('accuracy.desc')}
              </p>
            </div>
          </section>

          {/* Comparison Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              {t('professionalComparison.title')}
            </h2>
            <div className="card-feature p-6 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        {t('professionalComparison.system')}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        {t('professionalComparison.resolution')}
                      </th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        {t('professionalComparison.detection')}
                      </th>
                      <th className="text-left py-3 pl-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        {t('professionalComparison.cost')}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-muted)" }}>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                        {t('professionalComparison.fat.name')}
                      </td>
                      <td className="py-3 px-4">{t('professionalComparison.fat.resolution')}</td>
                      <td className="py-3 px-4">{t('professionalComparison.fat.detection')}</td>
                      <td className="py-3 pl-4">{t('professionalComparison.fat.cost')}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                        {t('professionalComparison.laserGates.name')}
                      </td>
                      <td className="py-3 px-4">{t('professionalComparison.laserGates.resolution')}</td>
                      <td className="py-3 px-4">{t('professionalComparison.laserGates.detection')}</td>
                      <td className="py-3 pl-4">{t('professionalComparison.laserGates.cost')}</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--accent-green)" }}>
                        {t('professionalComparison.trackspeed.name')}
                      </td>
                      <td className="py-3 px-4">{t('professionalComparison.trackspeed.resolution')}</td>
                      <td className="py-3 px-4">{t('professionalComparison.trackspeed.detection')}</td>
                      <td className="py-3 pl-4">{t('professionalComparison.trackspeed.cost')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                {t('professionalComparison.laserNote')}
              </div>
            </div>
          </section>

          {/* Detection Pipeline Deep Dive */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t('deepDive.title')}
            </h2>
            <p className="text-body mb-6">{t('deepDive.intro')}</p>
            <div className="space-y-4">
              {(['downsample', 'frameDiff', 'ccl', 'filters', 'crossing', 'interpolation'] as const).map((step) => (
                <div key={step} className="card-feature p-5 md:p-6">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {t(`deepDive.steps.${step}.title`)}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {t(`deepDive.steps.${step}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Device Stability & Thermal */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t('stability.title')}
            </h2>
            <div className="card-feature p-6 md:p-8 space-y-4">
              <p className="text-body">{t('stability.desc')}</p>
              <p className="text-body" style={{ color: "var(--text-muted)" }}>{t('stability.thermal')}</p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              {t('faq.title')}
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details key={i} className="card-feature p-5 md:p-6 group">
                  <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
                    {item.question}
                    <svg aria-hidden="true" className="w-5 h-5 flex-shrink-0 ml-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--text-muted)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t('cta.title')}
            </h2>
            <p className="text-body mb-8">{t('cta.subtitle')}</p>
            <div className="flex flex-col items-center gap-4">
              <a href="https://apps.apple.com/app/trackspeed/id6757509163" className="inline-block hover:opacity-80 transition-opacity">
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </a>
              <Link
                href="/#comparison"
                className="text-sm text-[#5C8DB8] hover:underline"
              >
                {t('cta.compare')}
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
