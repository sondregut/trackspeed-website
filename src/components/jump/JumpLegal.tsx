import Link from 'next/link';
import type {ReactNode} from 'react';
import JumpFooter from './JumpFooter';

export default function JumpLegal({title, intro, children, updatedAt="September 7, 2026"}: {title:string;intro:string;children:ReactNode;updatedAt?:string}) {
  return <div className="bg-[var(--bg-warm)] pt-28 text-[var(--text-primary)]">
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-10 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-[var(--text-secondary)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:leading-7 [&_a]:underline [&_a]:underline-offset-4">
      <Link href="/jump" className="text-sm text-[var(--text-muted)]">← TrackJump</Link>
      <h1 className="mb-5 mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="text-lg">{intro}</p>
      <p className="text-sm">Last updated {updatedAt}</p>
      {children}
    </article><JumpFooter />
  </div>;
}
