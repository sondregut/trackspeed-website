import Image from 'next/image';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getPageMetadata} from '@/i18n/metadata';
import {DownloadLink} from '@/components/DownloadLink';
import WindAdjustedTimeCalculator from '@/components/tools/WindAdjustedTimeCalculator';
import {adjustToZeroWind} from '@/lib/sprint-calculators';

const path = '/tools/wind-adjusted-100m-time-calculator';
const title = 'Wind Adjusted 100m Time Calculator';
const description =
  'Free wind adjusted 100m and 200m time calculator. Convert a wind-aided or headwind time to its zero-wind equivalent and see the same run in other winds.';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return getPageMetadata({title, description, path, localized: false, absoluteTitle: true, locale});
}

const faqItems = [
  {
    question: 'How do you adjust a 100m time for wind?',
    answer:
      'Add the wind effect to your time. For the 100m, zero-wind time = t + (−0.0449 + 0.009459 × t) × w − 0.0042 × w², with t in seconds and w the wind in m/s (positive for a tailwind). The model is from Moinat, Fabius and Emanuel (2018), fitted to 150,169 competition results.',
  },
  {
    question: 'How much does a +2.0 m/s tailwind help in the 100m?',
    answer: `About 0.08 s for a 10-second sprinter and 0.12 s for a 12-second one, because a slower athlete spends longer in the wind. A 12.00 run with +2.0 m/s is worth ${adjustToZeroWind(12, 2, '100m').toFixed(2)} in still air, and a 10.00 is worth ${adjustToZeroWind(10, 2, '100m').toFixed(2)}.`,
  },
  {
    question: 'What is the legal wind limit for sprint records?',
    answer:
      'World Athletics allows a following wind of up to +2.0 m/s for records and rankings in the 100m, 200m, 100m and 110m hurdles, long jump and triple jump. Anything above is marked wind-aided.',
  },
  {
    question: 'Does a headwind slow you down as much as a tailwind helps?',
    answer:
      'A headwind costs a little more than the same tailwind gives back, because air resistance grows with the square of your speed through the air. The quadratic term in the formula accounts for this.',
  },
  {
    question: 'Is this the same formula the TrackSpeed app uses?',
    answer:
      'Yes. The calculator uses the same coefficients and equations as the wind calculator in the TrackSpeed iOS app, so both give the same answer.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({'@type': 'Question', name: item.question, acceptedAnswer: {'@type': 'Answer', text: item.answer}})),
};

const examples: [number, number][] = [
  [10.0, 2.0],
  [10.5, 1.5],
  [11.0, -1.0],
  [12.0, 2.0],
  [12.5, -2.0],
];

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return (
    <div className="bg-hero min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd)}} />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-6 lg:pt-36">
        <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{background: 'rgba(92,141,184,.1)', color: '#5C8DB8'}}>Free tool</span>
        <h1 className="mt-5 text-[clamp(2.25rem,6.5vw,3.5rem)] font-bold leading-[1.05] [text-wrap:balance]" style={{color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>
          Wind adjusted 100m and 200m time calculator
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{color: 'var(--text-muted)'}}>
          Enter your time and the wind reading to see what the run is worth in still air, and how fast it would be in other winds.
        </p>

        <div className="mt-10">
          <WindAdjustedTimeCalculator />
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-bold" style={{color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>How the wind adjustment works</h2>
          <div className="mt-6 grid gap-5 leading-7" style={{color: 'var(--text-secondary)'}}>
            <p>
              A tailwind pushes you along and a headwind holds you back. The effect is not the same for everyone: in the 100m a slower athlete spends longer in the wind, so the same breeze is worth more time.
            </p>
            <p>
              The calculator uses the model from Moinat, Fabius and Emanuel (2018, <em>European Journal of Sport Science</em>), fitted to 150,169 competition results. For the 100m the wind effect depends on your time; for the 200m it does not:
            </p>
            <ul className="grid gap-2 rounded-2xl p-5 font-mono text-sm" style={{background: 'var(--bg-sky)', color: 'var(--text-primary)'}}>
              <li className="break-words">100m: t₀ = t + (−0.0449 + 0.009459·t)·w − 0.0042·w²</li>
              <li className="break-words">200m: t₀ = t + 0.090·w − 0.010·w²</li>
            </ul>
            <p>t is your time in seconds, w the wind in m/s (+ tailwind, − headwind) and t₀ the zero-wind time.</p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>100m examples</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border bg-white" style={{borderColor: 'var(--border-light)'}}>
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b text-[11px] uppercase tracking-[.14em]" style={{borderColor: 'var(--border-light)', color: 'var(--text-muted)'}}>
                  <th scope="col" className="px-4 py-3 font-semibold">Time</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Wind</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Zero wind</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm tabular-nums" style={{color: 'var(--text-primary)'}}>
                {examples.map(([t, w]) => (
                  <tr key={`${t}${w}`} className="border-b last:border-0" style={{borderColor: 'var(--border-light)'}}>
                    <td className="px-4 py-3">{t.toFixed(2)}</td>
                    <td className="px-4 py-3">{w > 0 ? '+' : '−'}{Math.abs(w).toFixed(1)}</td>
                    <td className="px-4 py-3 font-medium">{adjustToZeroWind(t, w, '100m').toFixed(2)}</td>
                  </tr>
                ))}
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
          <h2 className="text-3xl font-bold [text-wrap:balance]" style={{color: 'var(--text-on-dark)', letterSpacing: '-0.02em'}}>Time your sprints with your phone.</h2>
          <p className="mt-4 max-w-md leading-7" style={{color: 'var(--text-on-dark-muted)'}}>
            TrackSpeed times sprints with iPhone cameras, from 10m flys to full 100m runs, and has this wind calculator built in.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <DownloadLink store="ios" className="inline-block transition-opacity hover:opacity-85">
              <Image src="/app-store-badge.svg" alt="Download TrackSpeed on the App Store" width={150} height={50} className="h-[50px] w-auto" />
            </DownloadLink>
            <Link href="/tools/flying-30m-converter" className="text-sm font-medium underline underline-offset-4" style={{color: 'var(--text-on-dark)'}}>
              Flying 30m converter →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
