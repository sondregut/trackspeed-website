import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';
import {Link} from "@/i18n/navigation";
import GooglePlayIcon from "@/components/icons/GooglePlayIcon";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'technology'});
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: getAlternates('/technology'),
    openGraph: {
      type: "article",
    },
  };
}

export default async function TechnologyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'technology'});

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "How Phone Sprint Timing Achieves ~4ms Accuracy",
    description:
      "Learn how TrackSpeed uses your phone's camera to deliver millisecond-accurate sprint timing.",
    author: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
    },
    publisher: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: "https://mytrackspeed.com/icon.png",
    },
    datePublished: "2026-02-01",
    dateModified: "2026-02-27",
    mainEntityOfPage: "https://mytrackspeed.com/technology",
  };

  return (
    <div className="bg-hero min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/#timing-technology"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          {/* Four capability sections */}
          {(['subFrame', 'corrections', 'clockSync', 'bodyTracking'] as const).map((key, i) => (
            <section key={key} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">{i + 1}</div>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {t(`sections.${key}.title`)}
                </h2>
              </div>
              <div className="card-feature p-6 md:p-8">
                <p className="text-body">
                  {t(`sections.${key}.desc`)}
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

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {t('cta.title')}
            </h2>
            <p className="text-body mb-8">{t('cta.subtitle')}</p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://apps.apple.com/app/trackspeed/id6757509163"
                  className="btn-primary inline-flex items-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  {t('cta.download')}
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.trackspeed.android"
                  className="btn-primary inline-flex items-center gap-3"
                >
                  <GooglePlayIcon className="w-6 h-6" />
                  {t('cta.download')}
                </a>
              </div>
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
