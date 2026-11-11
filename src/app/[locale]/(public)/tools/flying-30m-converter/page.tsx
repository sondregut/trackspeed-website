import Image from 'next/image';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getPageMetadata} from '@/i18n/metadata';
import {DownloadLink} from '@/components/DownloadLink';
import FlyingSprintConverter from '@/components/tools/FlyingSprintConverter';
import {predict100mFromFly, topSpeed} from '@/lib/sprint-calculators';

const path = '/tools/flying-30m-converter';
const title = 'Flying 30m Converter: Top Speed and 100m Time';
const description =
  'Free flying 30m converter. Turn a flying 30m, 20m or 10m time into top speed in km/h, mph and m/s, and an estimated 100m time.';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return getPageMetadata({title, description, path, localized: false, absoluteTitle: true, locale});
}

const faqItems = [
  {
    question: 'How do you convert a flying 30m time to top speed?',
    answer: `Divide 30 by your time. A 3.00 s flying 30m is 10.00 m/s, which is 36.0 km/h or ${topSpeed(3).mph.toFixed(1)} mph. Multiply m/s by 3.6 for km/h.`,
  },
  {
    question: 'How do you estimate a 100m time from a flying 30m?',
    answer:
      'Multiply the flying 30m time by 10/3 and add 1.00 s for the acceleration from the blocks: 100m ≈ (10/3) × fly 30 + 1.00. A 3.00 s fly gives about 11.00 s. The formula comes from Jimson Lee at SpeedEndurance.com.',
  },
  {
    question: 'How accurate is the 100m estimate?',
    answer:
      'It shows your potential based on top speed. Athletes who accelerate well can beat it by a few tenths, and athletes who fade late in the race run slower. The acceleration allowance ranges from about 0.7 s for elite starters to about 1.2 s for poor ones.',
  },
  {
    question: 'Can I use a flying 10m or 20m instead?',
    answer:
      'Yes. The converter turns a 10m or 20m fly into the 30m time at the same speed first. A 1.00 s flying 10m is 10 m/s, the same as a 3.00 s flying 30m. Shorter flys amplify small timing errors, so the 30m is the most reliable.',
  },
  {
    question: 'Is this the same formula the TrackSpeed app uses?',
    answer:
      'Yes. Top speed and the 100m estimate use the same equations as the flying sprint converter in the TrackSpeed iOS app, so both give the same answer.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({'@type': 'Question', name: item.question, acceptedAnswer: {'@type': 'Answer', text: item.answer}})),
};

const examples = [2.6, 2.8, 3.0, 3.2, 3.4, 3.6];

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <div className="bg-hero min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd)}} />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-6 lg:pt-36">
        <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{background: 'rgba(92,141,184,.1)', color: '#5C8DB8'}}>Free tool</span>
        <h1 className="mt-5 text-[clamp(2.25rem,6.5vw,3.5rem)] font-bold leading-[1.05] [text-wrap:balance]" style={{color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>
          Flying 30m converter
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{color: 'var(--text-muted)'}}>
          Turn your flying 30m time into top speed in km/h and mph, and see the 100m time that speed points to.
        </p>

        <div className="mt-10">
          <FlyingSprintConverter />
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-bold" style={{color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>How the conversion works</h2>
          <div className="mt-6 grid gap-5 leading-7" style={{color: 'var(--text-secondary)'}}>
            <p>
              A flying 30m is timed after a running start, so it measures your top speed, not your acceleration. Speed is simply distance over time.
            </p>
            <p>
              The 100m estimate assumes you hold that speed for the whole race and adds one second for the start, following Jimson Lee&apos;s table at SpeedEndurance.com:
            </p>
            <ul className="grid gap-2 rounded-2xl p-5 font-mono text-sm" style={{background: 'var(--bg-sky)', color: 'var(--text-primary)'}}>
              <li>top speed = 30 ÷ t (m/s) · × 3.6 = km/h</li>
              <li>100m ≈ (10/3) × t + 1.00</li>
            </ul>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>Flying 30m chart</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border bg-white" style={{borderColor: 'var(--border-light)'}}>
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b text-[11px] uppercase tracking-[.12em]" style={{borderColor: 'var(--border-light)', color: 'var(--text-muted)'}}>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Fly 30</th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">km/h</th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">mph</th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-4">100m</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm tabular-nums" style={{color: 'var(--text-primary)'}}>
                {examples.map((t) => {
                  const v = topSpeed(t);
                  return (
                    <tr key={t} className="border-b last:border-0" style={{borderColor: 'var(--border-light)'}}>
                      <td className="px-3 py-3 sm:px-4">{t.toFixed(2)}</td>
                      <td className="px-3 py-3 sm:px-4">{v.kmh.toFixed(1)}</td>
                      <td className="px-3 py-3 sm:px-4">{v.mph.toFixed(1)}</td>
                      <td className="px-3 py-3 font-medium sm:px-4">{predict100mFromFly(t).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold" style={{color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>Questions</h2>
          <div className="mt-6 divide-y border-y" style={{borderColor: 'var(--border-light)'}}>
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5" style={{borderColor: 'var(--border-light)'}}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden" style={{color: 'var(--text-primary)'}}>
                  {item.question}
                  <span aria-hidden="true" className="mt-0.5 text-[#5C8DB8] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-7" style={{color: 'var(--text-secondary)'}}>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl px-7 py-10 sm:px-10" style={{background: 'var(--bg-dark)'}}>
          <h2 className="text-3xl font-bold [text-wrap:balance]" style={{color: 'var(--text-on-dark)', letterSpacing: '-0.02em'}}>Time your flying 30m with your phone.</h2>
          <p className="mt-4 max-w-md leading-7" style={{color: 'var(--text-on-dark-muted)'}}>
            TrackSpeed times flying sprints with two iPhones as timing gates and shows your top speed after every run.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <DownloadLink store="ios" className="inline-block transition-opacity hover:opacity-85">
              <Image src="/app-store-badge.svg" alt="Download TrackSpeed on the App Store" width={150} height={50} className="h-[50px] w-auto" />
            </DownloadLink>
            <Link href="/tools/wind-adjusted-100m-time-calculator" className="text-sm font-medium underline underline-offset-4" style={{color: 'var(--text-on-dark)'}}>
              Wind adjusted time calculator →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
