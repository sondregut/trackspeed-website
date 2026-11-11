import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRightIcon, MobileIcon} from '@radix-ui/react-icons';
import JumpFooter from '@/components/jump/JumpFooter';
import VerticalJumpCalculator from '@/components/jump/VerticalJumpCalculator';
import {CM_PER_IN, VERTICAL_NORMS} from '@/lib/vertical-jump';

const url = 'https://mytrackspeed.com/jump/vertical-jump-calculator';
const title = 'Vertical Jump Calculator: Flight Time, Reach and RSI';
const description =
  'Free vertical jump calculator. Get your jump height from flight time or a reach test, see how it rates against norms, and work out reactive strength index (RSI) from a drop jump.';

export const metadata: Metadata = {
  applicationName: 'TrackJump',
  itunes: {appId: '6809517672'},
  title: {absolute: title},
  description,
  alternates: {canonical: url},
  openGraph: {title, description, url, images: ['/jump/share-image']},
  twitter: {card: 'summary_large_image', title, description, images: ['/jump/share-image']},
};

const faqItems = [
  {
    question: 'How do I calculate my vertical jump?',
    answer:
      'Measure your standing reach, jump and touch as high as you can, and subtract the two. Or time how long you are in the air and use height = 9.81 × t² ÷ 8, with t in seconds. Filming the jump in slow motion gives you the flight time.',
  },
  {
    question: 'How do I convert flight time to jump height?',
    answer:
      'Square the flight time in seconds, multiply by 9.81 and divide by 8. That gives the height in metres. A flight time of 0.56 s is 9.81 × 0.3136 ÷ 8 = 0.385 m, about 38.5 cm or 15.1 in.',
  },
  {
    question: 'Is a 30 inch vertical good?',
    answer:
      'Yes. 30 inches (76 cm) is above the excellent line on general adult norms for both men and women. Jumping athletes such as volleyball and basketball players are often higher.',
  },
  {
    question: 'Why does my flight time result differ from my reach test?',
    answer:
      'Bending your knees or tucking your legs before landing adds air time and raises a flight time result. Reaching with one arm and shrugging the shoulder raise a reach test result. Use the same method every time when you track progress.',
  },
  {
    question: 'What is a good RSI?',
    answer:
      'For a drop jump from a 30 to 40 cm box, an RSI of 2.0 to 2.5 is good and above 3.0 is excellent. Values depend on the drop height and on how ground contact time is measured.',
  },
  {
    question: 'How do I measure ground contact time for RSI?',
    answer:
      'Use a contact mat, a force plate or a slow-motion video where you count frames from landing to takeoff. At 240 frames per second each frame is about 4 ms. TrackJump measures contact time and RSI from your iPhone camera.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {'@type': 'Answer', text: item.answer},
  })),
};

const rsiNorms = [
  ['Below 1.5', 'Low'],
  ['1.5 to 2.0', 'Average'],
  ['2.0 to 2.5', 'Good'],
  ['2.5 to 3.0', 'Very good'],
  ['Above 3.0', 'Excellent'],
];

function band(i: number, key: 'm' | 'w') {
  const lo = VERTICAL_NORMS[i][key];
  const hi = i > 0 ? VERTICAL_NORMS[i - 1][key] : null;
  const cm = (inches: number) => Math.round(inches * CM_PER_IN);
  if (hi === null) return [`${lo}+ in`, `${cm(lo)}+ cm`];
  if (lo === 0) return [`Under ${hi} in`, `Under ${cm(hi)} cm`];
  return [`${lo}–${hi} in`, `${cm(lo)}–${cm(hi)} cm`];
}

export default function VerticalJumpCalculatorPage() {
  return (
    <div className="jump-visual-page bg-[#f4f5f5] text-[#192b30]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqJsonLd)}} />

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-6 lg:pt-36">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#617279]">
          <Link href="/jump" className="underline underline-offset-4 hover:text-[#192b30]">TrackJump</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Vertical jump calculator</span>
        </nav>
        <p className="jump-eyebrow">Free tool</p>
        <h1 className="mt-4 text-[clamp(2.4rem,7vw,4rem)] font-semibold leading-[1.02] tracking-[-.05em] [text-wrap:balance]">Vertical jump calculator</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#536369]">
          Get your jump height from flight time or a reach test, see how it rates, and work out your reactive strength index (RSI) from a drop jump.
        </p>

        <div className="mt-10">
          <VerticalJumpCalculator />
        </div>

        <section className="mt-20">
          <p className="jump-eyebrow">The maths</p>
          <h2 className="jump-heading mt-4">How it works</h2>
          <div className="mt-8 grid gap-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Flight time</h3>
              <p className="mt-2 leading-7 text-[#536369]">
                You rise and fall for the same time, so jump height follows from the time you spend in the air: <span className="whitespace-nowrap font-mono text-[#192b30]">h = g × t² ÷ 8</span>, with g = 9.81 m/s². A 560 ms flight time is about 38.5 cm (15.1 in). Jump mats and phone apps that time the jump work this way. Land the way you took off, with straight legs: tucking adds air time and inflates the result.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Reach test</h3>
              <p className="mt-2 leading-7 text-[#536369]">
                Jump touch minus standing reach. It is the classic Vertec or wall test. It usually reads a little higher than flight time, because you reach with one arm and lift the shoulder.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Reactive strength index</h3>
              <p className="mt-2 leading-7 text-[#536369]">
                RSI is jump height in metres divided by ground contact time in seconds, from a drop jump. It shows how well you turn a fast landing into a high jump, which matters for sprinting and jumping.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <p className="jump-eyebrow">Norms</p>
          <h2 className="jump-heading mt-4">How good is your vertical?</h2>
          <p className="mt-5 leading-7 text-[#536369]">General ratings for adults. Trained jumpers and athletes in jumping sports usually sit well above these.</p>
          <div className="mt-6 overflow-x-auto rounded-3xl border border-[#dce2e3] bg-white">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-[#dce2e3] text-[11px] uppercase tracking-[.14em] text-[#617279]">
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Rating</th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Men</th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Women</th>
                </tr>
              </thead>
              <tbody>
                {VERTICAL_NORMS.map((n, i) => (
                  <tr key={n.rating} className="border-b border-[#eef2f3] last:border-0">
                    <th scope="row" className="px-3 py-3 font-medium sm:px-5">{n.rating}</th>
                    <td className="px-3 py-3 font-mono text-sm tabular-nums sm:px-5"><span className="block whitespace-nowrap">{band(i, 'm')[0]}</span><span className="block whitespace-nowrap text-xs text-[#617279]">{band(i, 'm')[1]}</span></td>
                    <td className="px-3 py-3 font-mono text-sm tabular-nums sm:px-5"><span className="block whitespace-nowrap">{band(i, 'w')[0]}</span><span className="block whitespace-nowrap text-xs text-[#617279]">{band(i, 'w')[1]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-12 text-xl font-semibold tracking-tight">What is a good RSI?</h3>
          <div className="mt-5 overflow-x-auto rounded-3xl border border-[#dce2e3] bg-white">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-[#dce2e3] text-[11px] uppercase tracking-[.14em] text-[#617279]">
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Drop jump RSI</th>
                  <th scope="col" className="px-3 py-3 font-semibold sm:px-5">Rating</th>
                </tr>
              </thead>
              <tbody>
                {rsiNorms.map(([range, rating]) => (
                  <tr key={range} className="border-b border-[#eef2f3] last:border-0">
                    <td className="px-3 py-3 font-mono text-sm tabular-nums sm:px-5">{range}</td>
                    <td className="px-3 py-3 sm:px-5">{rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[#617279]">From a 30 to 40 cm box. Values depend on drop height and on how contact time is measured.</p>
        </section>

        <section className="mt-20">
          <p className="jump-eyebrow">FAQ</p>
          <h2 className="jump-heading mt-4">Questions</h2>
          <div className="mt-6 divide-y divide-[#dce2e3] border-y border-[#dce2e3]">
            {faqItems.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden="true" className="mt-1 text-[#315f68] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-7 text-[#536369]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-8 rounded-[36px] bg-[#203e45] px-7 py-10 text-white sm:px-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#c0d6dc]">TrackJump for iPhone</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight [text-wrap:balance]">Measure it with your iPhone.</h2>
            <p className="mt-4 max-w-md leading-7 text-[#d2dfe2]">
              TrackJump measures jump height, contact time and RSI with your iPhone camera, keeps a replay of every jump and tracks your progress. No extra hardware.
            </p>
            <Link href="/jump" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white underline underline-offset-4">
              See how TrackJump works <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
          <a href="https://apps.apple.com/app/id6809517672" className="inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-white px-6 py-4 font-medium text-[#203e45] transition-colors hover:bg-[#eef2f3] md:w-auto md:self-center">
            <MobileIcon aria-hidden="true" /> Download on the App Store
          </a>
        </section>
      </div>
      <JumpFooter />
    </div>
  );
}
