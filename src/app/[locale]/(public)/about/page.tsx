import Image from "next/image";
import { ArrowRightIcon, InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPageMetadata } from "@/i18n/metadata";
import { DownloadLink } from "@/components/DownloadLink";
import { Eyebrow, TextLink } from "@/components/marketing/Primitives";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "about"});
  return getPageMetadata({title: t("metadata.title"), description: t("metadata.description"), path: "/about", locale});
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "about"});
  const m = await getTranslations({locale, namespace: "marketing"});
  return <div>
    <section className="bg-[var(--bg-warm)] px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40"><div className="marketing-container grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-24"><div><Eyebrow>{m("founder.kicker")}</Eyebrow><h1 className="marketing-page-title">{t("title")}</h1></div><p className="max-w-xl text-lg leading-8 text-muted">{m("founder.body")}</p></div></section>
    <section className="marketing-section"><div className="marketing-container grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-24"><figure><Image src="/testimonials/sondre-guttormsen.webp" alt={m("founder.imageAlt")} width={800} height={533} preload sizes="(max-width: 1024px) 100vw, 600px" className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"/><figcaption className="mt-4 text-xs text-muted">{t("teamNote")}</figcaption></figure><div><Eyebrow>{t("teamHeading")}</Eyebrow><h2 className="marketing-heading">{t("team.sondre.name")}</h2><p className="mb-7 mt-4 text-sm font-medium text-[var(--brand)]">{t("team.sondre.role")}</p><div className="space-y-5 text-base leading-8 text-muted"><p>{t("team.sondre.bio1")}</p><p>{t("team.sondre.bio2")}</p></div><div className="mt-8 flex flex-wrap gap-6"><a href="https://instagram.com/sondre_pv" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-[var(--brand)]"><InstagramLogoIcon aria-hidden="true"/>@sondre_pv</a><a href="https://www.linkedin.com/in/sondre-guttormsen-803b8619b" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-[var(--brand)]"><LinkedInLogoIcon aria-hidden="true"/>LinkedIn</a></div></div></div></section>
    <section className="marketing-section border-y border-[var(--border-light)] bg-[var(--bg-warm)]"><div className="marketing-container grid gap-10 lg:grid-cols-2 lg:gap-24"><div><Eyebrow>{m("hero.kicker")}</Eyebrow><h2 className="marketing-heading">{m("founder.title")}</h2></div><div><p className="text-lg leading-8 text-muted">{m("hero.description")}</p><p className="my-6 text-base leading-8 text-muted">{m("evidence.body")}</p><TextLink href="/technology">{t("cta.learnMore")}</TextLink></div></div></section>
    <section className="marketing-section"><div className="marketing-container"><Eyebrow>{t("portfolio.kicker")}</Eyebrow><h2 className="marketing-heading max-w-2xl">{t("portfolio.title")}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-muted">{t("portfolio.description")}</p><div className="mt-9 grid gap-4 md:grid-cols-2">{[{url:"https://www.athletemindset.app",name:t("portfolio.athleteMindset")},{url:"https://stavhopp.no/vault",name:t("portfolio.vault")}].map(app=><a href={app.url} key={app.url} className="flex min-h-28 items-center justify-between gap-6 rounded-xl border border-[var(--border-light)] px-6 py-7 text-lg font-medium tracking-tight transition-colors hover:bg-[var(--bg-warm)]">{app.name}<ArrowRightIcon className="size-5 shrink-0 rtl:rotate-180" aria-hidden="true"/></a>)}</div><a href="https://www.athletemindset.app/apps" className="mt-7 inline-flex min-h-11 items-center gap-3 text-sm font-medium underline underline-offset-4">{t("portfolio.allApps")}<ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden="true"/></a></div></section>
    <section className="bg-[var(--bg-dark)] px-5 py-16 text-white sm:px-8 lg:py-24"><div className="marketing-container flex flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><h2 className="marketing-heading max-w-2xl">{t("cta.title")}</h2><p className="mt-5 text-base text-white/70">{m("cta.body")}</p></div><DownloadLink store="ios" className="marketing-button !bg-white !text-foreground">{m("nav.download")}<ArrowRightIcon className="size-4 rtl:rotate-180" aria-hidden="true"/></DownloadLink></div></section>
  </div>;
}
