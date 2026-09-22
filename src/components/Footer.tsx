import Image from "next/image";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { DownloadLink } from "@/components/DownloadLink";

export default function Footer() {
  const t=useTranslations("common");const m=useTranslations("marketing");const a=useTranslations("about.portfolio");
  const columns: Array<{
    title: string;
    links: Array<{href: string; label: string; englishOnly?: boolean}>;
  }>=[
    {title:t("footer.product"),links:[{href:"/features",label:m("nav.guide"),englishOnly:true},{href:"/#how-it-works",label:t("nav.howItWorks")},{href:"/technology",label:t("nav.technology"),englishOnly:true},{href:"/pro",label:"TrackSpeed Pro",englishOnly:true}]},
    {title:t("footer.resources"),links:[{href:"/about",label:t("nav.about")},{href:"/support",label:t("nav.support")},{href:"/blog",label:t("nav.blog")},{href:"/feedback",label:t("footer.feedback"),englishOnly:true}]},
    {title:t("footer.legal"),links:[{href:"/privacy",label:t("footer.privacyPolicy"),englishOnly:true},{href:"/terms",label:t("footer.termsAndConditions"),englishOnly:true}]}
  ];
  return <footer className="border-t border-[var(--border-light)] bg-white px-5 pt-14 sm:px-8 lg:pt-20"><div className="mx-auto max-w-7xl">
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]"><div><Link href="/" className="inline-flex items-center gap-2.5"><Image src="/trackspeed-icon-1d43ec40.png" alt="" width={32} height={32} sizes="32px" className="rounded-lg"/><span className="text-xl font-semibold tracking-[-0.05em]">TrackSpeed</span></Link><p className="mt-5 max-w-xs text-sm leading-6 text-muted">{m("footer.tagline")}</p><DownloadLink store="ios" className="mt-6 inline-flex transition-opacity hover:opacity-75"><Image src="/app-store-badge.svg" alt={t("cta.downloadOnAppStore")} width={132} height={44} sizes="132px" className="h-11 w-auto"/></DownloadLink><div className="mt-6 flex gap-5 text-xs text-muted"><a href="https://instagram.com/mytrackspeed" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a><a href="https://x.com/trackspeedapp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">X</a><a href="https://tiktok.com/@trackspeedapp" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">TikTok</a></div></div>
    {columns.map(column=><div key={column.title}><h2 className="mb-5 text-xs font-semibold uppercase tracking-wider">{column.title}</h2><ul className="space-y-3">{column.links.map(link=><li key={link.href}>{link.englishOnly?<NextLink href={link.href} className="inline-flex min-h-7 text-sm text-muted hover:text-[var(--brand)]">{link.label}</NextLink>:<Link href={link.href} className="inline-flex min-h-7 text-sm text-muted hover:text-[var(--brand)]">{link.label}</Link>}</li>)}</ul></div>)}</div>
    <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-y border-[var(--border-light)] py-6 text-xs"><span className="text-muted">{m("footer.moreApps")}</span><a href="https://www.athletemindset.app" className="hover:text-[var(--brand)]">Athlete Mindset</a><a href="https://stavhopp.no/vault" className="hover:text-[var(--brand)]">Vault</a><a href="https://www.athletemindset.app/apps" className="hover:text-[var(--brand)]">{a("allApps")} ↗</a></div>
    <div className="flex flex-col justify-between gap-4 py-7 text-[11px] text-muted sm:flex-row"><p>{t("footer.copyright",{year:new Date().getFullYear()})}</p><div className="flex flex-wrap gap-6"><span>{t("footer.madeForAthletes")}</span><NextLink href="/influencer/apply" className="hover:text-foreground">{t("footer.affiliates")}</NextLink></div></div>
  </div></footer>;
}
