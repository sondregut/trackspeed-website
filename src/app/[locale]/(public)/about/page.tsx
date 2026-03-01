import Image from "next/image";
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';
import {Link} from "@/i18n/navigation";
import GooglePlayIcon from "@/components/icons/GooglePlayIcon";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'about'});
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: getAlternates('/about'),
    openGraph: {
      type: "website",
    },
  };
}

function IgIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'about'});

  return (
    <div className="bg-hero min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6" style={{ color: "var(--text-muted)" }}>
            {t('intro')}
          </p>
          <div
            className="card-feature max-w-2xl mx-auto p-6 md:p-8 text-left"
          >
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {t('story1')}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t('story2')}
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            {/* Sondre */}
            <div className="card-feature p-6 md:p-8">
              <Image
                src="/testimonials/sondre-guttormsen.jpg"
                alt="Sondre Guttormsen"
                width={160}
                height={160}
                className="w-full aspect-square rounded-xl object-cover mb-5"
              />
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t('team.sondre.name')}
              </h3>
              <p className="text-sm font-medium mb-4" style={{ color: "#5C8DB8" }}>
                {t('team.sondre.role')}
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('team.sondre.bio1')}
              </p>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('team.sondre.bio2')}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href="https://instagram.com/sondre_pv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <IgIcon /> @sondre_pv
                </a>
                <a
                  href="https://www.linkedin.com/in/sondre-guttormsen-803b8619b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <LinkedInIcon /> LinkedIn
                </a>
              </div>
            </div>

            {/* Andreas */}
            <div className="card-feature p-6 md:p-8">
              <Image
                src="/testimonials/andreas-trajkovski.jpg"
                alt="Andreas Trajkovski"
                width={160}
                height={160}
                className="w-full aspect-square rounded-xl object-cover mb-5"
              />
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t('team.andreas.name')}
              </h3>
              <p className="text-sm font-medium mb-4" style={{ color: "#5C8DB8" }}>
                {t('team.andreas.role')}
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('team.andreas.bio1')}
              </p>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('team.andreas.bio2')}
              </p>
              <a
                href="https://instagram.com/jumpers.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium inline-flex items-center gap-1"
                style={{ color: "#5C8DB8" }}
              >
                <IgIcon /> @jumpers.world
              </a>
            </div>

            {/* Simen */}
            <div className="card-feature p-6 md:p-8">
              <div
                className="w-full aspect-square rounded-xl flex items-center justify-center text-5xl font-bold mb-5"
                style={{ background: "rgba(92,141,184,0.12)", color: "#5C8DB8" }}
              >
                SG
              </div>
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {t('team.simen.name')}
              </h3>
              <p className="text-sm font-medium mb-4" style={{ color: "#5C8DB8" }}>
                {t('team.simen.role')}
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('team.simen.bio1')}
              </p>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                {t('team.simen.bio2')}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href="https://instagram.com/simen_guttormsen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <IgIcon /> @simen_g
                </a>
                <a
                  href="https://www.linkedin.com/in/simen-guttormsen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <LinkedInIcon /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <p
            className="text-sm max-w-lg mx-auto text-center mt-10"
            style={{ color: "var(--text-muted)" }}
          >
            {t('teamNote')}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          {t('cta.title')}
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          {t('cta.subtitle')}
        </p>
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
            href="/technology"
            className="text-sm text-[#5C8DB8] hover:underline"
          >
            {t('cta.learnMore')}
          </Link>
        </div>
      </section>
    </div>
  );
}
