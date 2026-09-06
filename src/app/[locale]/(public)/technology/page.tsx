import Image from "next/image";
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";
import { setRequestLocale } from "next-intl/server";
import { getPageMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { DownloadLink } from "@/components/DownloadLink";
import { Eyebrow, TextLink } from "@/components/marketing/Primitives";

const title = "How TrackSpeed Measures Sprint Times";
const description = "Understand camera crossings, start methods, synchronized phones and photo review. A practical guide to repeatable sprint testing with TrackSpeed.";
const protocol = [
  ["Measure the course", "Mark the start, split and finish positions. Keep the distance, surface and start method the same when comparing results."],
  ["Set the camera line", "Use stable mounts. Align each on-screen line with the intended crossing location, keep the runner visible and leave room to run through."],
  ["Wait for every gate", "Join the same session and check connection, clock and camera readiness before starting. Recheck after a phone moves or reconnects."],
  ["Review, then repeat", "Inspect unusual results and crossing photos. Record the athlete, setup and recovery, so the next repetition answers the same question."],
];
const starts = [
  ["Flying", "Crossing the start camera line", "Speed through a measured zone after a run-in"],
  ["Touch release", "Lifting the finger from the start screen", "A repeatable release-based start"],
  ["Countdown", "The audible start cue", "A start that includes the athlete’s response"],
  ["Voice command", "The GO cue in the spoken sequence", "A command-led start, including response"],
  ["In-frame", "Crossing the front camera’s configured line", "A camera-based start near the start phone"],
];

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return getPageMetadata({title, description, path: "/technology", type: "article", localized: false, robots: locale === "en" ? undefined : {index: false, follow: true}});
}

export default async function TechnologyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const article = {
    "@context": "https://schema.org", "@type": "TechArticle", headline: title, description,
    image: "https://mytrackspeed.com/photofinish_edit.webp",
    author: {"@type": "Person", name: "Sondre Guttormsen", url: "https://mytrackspeed.com/about"},
    publisher: {"@type": "Organization", name: "TrackSpeed", url: "https://mytrackspeed.com"},
    datePublished: "2026-02-01", dateModified: "2026-09-06", mainEntityOfPage: "https://mytrackspeed.com/technology", inLanguage: "en",
  };
  return <div lang="en" dir="ltr">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(article)}}/>
    <section className="bg-[var(--bg-warm)] px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
      <div className="marketing-container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
        <div><Eyebrow>Behind the time</Eyebrow><h1 className="marketing-page-title">A clear start.<br/>A visible finish.</h1></div>
        <div><p className="text-lg leading-8 text-muted">A useful training time begins with a defined event. TrackSpeed records camera crossings, connects your timing points and gives you photos to review after the run.</p>{locale !== "en" && <p className="mt-5 text-xs text-muted">This guide is currently available in English.</p>}<div className="mt-6"><TextLink href="/features">Explore the features</TextLink></div></div>
      </div>
    </section>
    <section className="marketing-section"><div className="marketing-container grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
      <figure className="overflow-hidden rounded-2xl bg-[var(--bg-dark)] px-10 pt-10"><Image src="/photofinish_edit.webp" alt="Start and finish crossing photos in TrackSpeed" width={388} height={800} sizes="(max-width: 640px) 230px, 280px" className="mx-auto h-auto w-[230px] sm:w-[280px]"/><figcaption className="py-5 text-center text-xs text-white/70">An example of reviewable crossing evidence.</figcaption></figure>
      <div><Eyebrow>From a crossing to a result</Eyebrow><h2 className="marketing-heading">The event defines the time.</h2><div className="mt-8 space-y-7">{[
        ["Detect the crossing", "A camera watches the configured timing line. An automatic crossing event supplies a timestamp and the associated image evidence."],
        ["Connect the timing points", "Nearby phones share events within a session. Their clocks are synchronized so timestamps can be compared. Message delivery time is separate from the event time."],
        ["Calculate the effort", "The start and finish events define elapsed time. Split gates add segment times. A measured distance also lets the app calculate average speed."],
      ].map(([heading,body],i)=><div key={heading} className="flex gap-5"><span className="pt-1 font-mono text-xs text-[var(--brand)]">0{i+1}</span><div><h3 className="text-lg font-medium tracking-tight">{heading}</h3><p className="mt-2 text-sm leading-7 text-muted">{body}</p></div></div>)}</div></div>
    </div></section>
    <section className="marketing-section border-y border-[var(--border-light)] bg-[var(--bg-warm)]"><div className="marketing-container"><Eyebrow>Choose a consistent test</Eyebrow><h2 className="marketing-heading max-w-2xl">Five starts. Different questions.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-muted">A flying split and a cue-based start measure different efforts. Keep the start method with the result and compare like with like.</p><div className="mt-10 overflow-x-auto rounded-xl border border-[var(--border-light)] bg-white" role="region" aria-label="Start methods comparison" tabIndex={0}><table className="w-full min-w-[620px] text-left text-sm"><caption className="sr-only">The event that starts each TrackSpeed timing method</caption><thead><tr className="border-b border-[var(--border-light)]"><th className="p-5 font-semibold" scope="col">Start method</th><th className="p-5 font-semibold" scope="col">Timer begins at</th><th className="p-5 font-semibold" scope="col">Training use</th></tr></thead><tbody>{starts.map(([name,event,use])=><tr key={name} className="border-b border-[var(--border-light)] last:border-0"><th scope="row" className="p-5 font-medium">{name}</th><td className="p-5 leading-6 text-muted">{event}</td><td className="p-5 leading-6 text-muted">{use}</td></tr>)}</tbody></table></div></div></section>
    <section className="marketing-section"><div className="marketing-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"><div><Eyebrow>On the track</Eyebrow><h2 className="marketing-heading">Good timing starts with good setup.</h2></div><ol>{protocol.map(([heading,body],i)=><li key={heading} className="flex gap-5 border-t border-[var(--border-light)] py-7"><span className="font-mono text-xs text-[var(--brand)]">0{i+1}</span><div><h3 className="text-xl font-medium tracking-tight">{heading}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></div></li>)}</ol></div></section>
    <section className="marketing-section bg-[var(--bg-dark)] text-white"><div className="marketing-container grid gap-10 lg:grid-cols-2 lg:gap-24"><div><Eyebrow light>Read the result in context</Eyebrow><h2 className="marketing-heading">Decimal places don’t tell the whole story.</h2></div><div className="space-y-5 text-base leading-8 text-white/75"><p>Camera frame rate, lighting, visibility, stable placement, device temperature and clock synchronization can affect a result. Course measurement and the chosen start event matter too.</p><p>Reviewable photos help you check what happened. They do not turn every setup into the same measurement. TrackSpeed is for training and unofficial testing; official competition results require the event’s approved timing system.</p></div></div></section>
    <section className="marketing-section"><div className="marketing-container grid gap-10 lg:grid-cols-2 lg:gap-24"><div><Eyebrow>Your devices, working together</Eyebrow><h2 className="marketing-heading">Local timing. Results to keep.</h2><p className="mt-6 text-base leading-8 text-muted">Supported local connections can time without internet. Wi-Fi Aware needs compatible hardware and software; Bluetooth is another connection option. Cloud synchronization needs internet and supports the session data available in the app.</p></div><div className="space-y-6">{[
      ["One camera line", "Solo Laps measures repeated crossings at the same line. Separate start and finish positions use connected phones."],
      ["Watch and agility", "Watch starts use the paired host/start iPhone to reach the other gates. For 5-10-5, both outer-line touches need video review."],
      ["Further reading", "Explore setup and timing-method comparisons in the training journal."],
    ].map(([heading,body])=><div key={heading} className="border-t border-[var(--border-light)] pt-6"><h3 className="flex items-center gap-3 text-lg font-medium"><CheckIcon className="size-4 shrink-0 text-[var(--brand)]" aria-hidden="true"/>{heading}</h3><p className="mt-3 text-sm leading-7 text-muted">{body}</p></div>)}<Link href="/blog/single-beam-vs-dual-beam-timing-gates" className="inline-block text-sm underline underline-offset-4">Read the timing-gate comparison</Link></div></div></section>
    <section className="bg-[var(--bg-warm)] px-5 py-16 sm:px-8"><div className="marketing-container flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><h2 className="text-3xl font-medium tracking-tight">Bring the method to your next session.</h2><p className="mt-4 text-sm text-muted">Measure the course. Keep the setup consistent. Review your runs.</p></div><DownloadLink store="ios" className="marketing-button shrink-0">Get TrackSpeed<ArrowRightIcon className="size-4" aria-hidden="true"/></DownloadLink></div></section>
  </div>;
}
