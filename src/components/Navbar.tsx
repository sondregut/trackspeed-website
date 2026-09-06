"use client";

import Image from "next/image";
import { ArrowRightIcon, Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { DownloadLink } from "@/components/DownloadLink";

export default function Navbar() {
  const t=useTranslations("common.nav");
  const m=useTranslations("marketing.nav");
  const items=[{href:"/features",label:t("features")},{href:"/#how-it-works",label:t("howItWorks")},{href:"/technology",label:t("technology")},{href:"/pro",label:"Pro"},{href:"/about",label:t("about")}];
  return <header className="pointer-events-none fixed inset-x-0 top-0 z-40 border-b border-black/5 bg-white/85 px-4 backdrop-blur-xl sm:px-8">
    <nav aria-label={t("navigation")} className="pointer-events-auto mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-1 sm:px-0">
      <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="TrackSpeed"><Image src="/trackspeed-icon-1d43ec40.png" alt="" width={30} height={30} sizes="30px" className="rounded-lg"/><span className="text-lg font-semibold tracking-[-0.05em]">TrackSpeed</span></Link>
      <div className="hidden items-center gap-6 xl:flex">{items.map(item=><Link key={item.href} href={item.href} className="py-3 text-[13px] font-medium text-muted transition-colors hover:text-foreground">{item.label}</Link>)}</div>
      <div className="hidden items-center gap-3 xl:flex"><LanguageSwitcher/><DownloadLink store="ios" className="marketing-button !min-h-10 !px-5 !text-xs">{m("download")}<ArrowRightIcon className="size-3.5 rtl:rotate-180" aria-hidden="true"/></DownloadLink></div>
      <div className="flex items-center gap-4 xl:hidden"><DownloadLink store="ios" className="hidden text-xs font-semibold text-[var(--brand)] min-[420px]:inline-flex">{m("download")}</DownloadLink><Sheet><SheetTrigger asChild><button type="button" className="flex size-11 items-center justify-center rounded-full border border-[var(--border-light)]" aria-label={t("openMenu")}><HamburgerMenuIcon className="size-5" aria-hidden="true"/></button></SheetTrigger><SheetContent side="right" showCloseButton={false} className="w-[min(92vw,400px)] border-[var(--border-light)] bg-[var(--bg-warm)] p-6"><SheetTitle className="flex items-center justify-between text-xl tracking-tight">TrackSpeed<SheetClose asChild><button type="button" aria-label={m("close")} className="flex size-11 items-center justify-center rounded-full border border-[var(--border-light)]"><Cross2Icon className="size-5" aria-hidden="true"/></button></SheetClose></SheetTitle><SheetDescription className="sr-only">{t("navigation")}</SheetDescription><div className="mt-6 flex flex-1 flex-col overflow-y-auto">{[...items,{href:"/support",label:t("support")},{href:"/blog",label:t("blog")}].map(item=><SheetClose asChild key={item.href}><Link href={item.href} className="border-b border-[var(--border-light)] py-5 text-xl font-medium tracking-tight hover:text-[var(--brand)]">{item.label}</Link></SheetClose>)}<div className="my-7"><LanguageSwitcher/></div><SheetClose asChild><DownloadLink store="ios" className="marketing-button">{m("download")}<ArrowRightIcon className="size-4" aria-hidden="true"/></DownloadLink></SheetClose></div></SheetContent></Sheet></div>
    </nav>
  </header>;
}
