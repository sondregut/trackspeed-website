import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';
import {Link} from "@/i18n/navigation";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'support'});
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: getAlternates('/support'),
  };
}

const faqKeys = [
  'howItWorks',
  'equipment',
  'models',
  'accuracy',
  'competitions',
  'connecting',
  'cancel',
] as const;

const troubleshootingKeys = [
  'noDetection',
  'noConnection',
  'thermal',
] as const;

export default async function SupportPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'support'});

  // Build FAQ data for JSON-LD (plain text only)
  const faqJsonLdEntities = faqKeys.map((key) => ({
    "@type": "Question" as const,
    name: t(`faq.items.${key}.question`),
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: t(`faq.items.${key}.answer`),
    },
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqJsonLdEntities,
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted mb-12">{t('lastUpdated')}</p>

        {/* Contact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
          <p className="text-muted mb-4">
            {t('contact.description')}
          </p>
          <p className="text-muted">
            <strong className="text-foreground">{t('contact.email')}</strong>{" "}
            <a href="mailto:support@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
              support@mytrackspeed.com
            </a>
          </p>
          <p className="text-muted mt-2">{t('contact.responseTime')}</p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('faq.title')}</h2>
          <div className="space-y-4">
            {faqKeys.map((key) => (
              <div key={key} className="card-feature rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{t(`faq.items.${key}.question`)}</h3>
                <p className="text-muted">
                  {key === 'howItWorks' ? (
                    <>
                      {t(`faq.items.${key}.answer`).split('camera-based motion detection')[0]}
                      <Link href="/technology" className="text-[#5C8DB8] hover:underline">camera-based motion detection</Link>
                      {t(`faq.items.${key}.answer`).split('camera-based motion detection')[1]}
                    </>
                  ) : key === 'accuracy' ? (
                    <>
                      {t(`faq.items.${key}.answer`).split('~4ms timing accuracy')[0]}
                      <Link href="/technology" className="text-[#5C8DB8] hover:underline">~4ms timing accuracy</Link>
                      {t(`faq.items.${key}.answer`).split('~4ms timing accuracy')[1]}
                    </>
                  ) : (
                    t(`faq.items.${key}.answer`)
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('troubleshooting.title')}</h2>
          <div className="space-y-6">
            {troubleshootingKeys.map((key) => (
              <div key={key} className="card-feature rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{t(`troubleshooting.items.${key}.issue`)}</h3>
                <ul className="list-disc pl-5 space-y-2 text-muted">
                  {(t.raw(`troubleshooting.items.${key}.solutions`) as string[]).map((solution: string, i: number) => (
                    <li key={i}>{solution}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback */}
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('feedbackSection.title')}</h2>
          <p className="text-muted">
            {t.rich('feedbackSection.description', {
              feedbackLink: (chunks) => (
                <a href="/feedback" className="text-[#5C8DB8] hover:underline">
                  {chunks}
                </a>
              ),
              emailLink: (chunks) => (
                <a href="mailto:feedback@mytrackspeed.com" className="text-[#5C8DB8] hover:underline">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </div>
    </div>
  );
}
