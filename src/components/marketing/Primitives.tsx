import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

export function Eyebrow({children, light = false}: {children: ReactNode; light?: boolean}) {
  return <p className={`mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${light ? "text-white/65" : "text-[var(--brand)]"}`}><span className="h-px w-7 bg-current" aria-hidden="true" />{children}</p>;
}
export function TextLink({href,children,light=false}: {href:string;children:ReactNode;light?:boolean}) {
  return <Link href={href} className={`inline-flex min-h-11 items-center gap-3 border-b pb-1 text-sm font-semibold transition-colors ${light ? "border-white/35 text-white hover:border-white" : "border-[var(--border-light)] text-foreground hover:border-foreground"}`}>{children}<ArrowRightIcon className="marketing-arrow size-4 shrink-0" aria-hidden="true" /></Link>;
}
