'use client';

import {useId, useState} from 'react';
import {adjustToZeroWind, estimateAtWind, isLegalWind, MAX_WIND_SPEED, parseDecimalInput, type WindEvent} from '@/lib/sprint-calculators';

const WIND_STEPS = [-2, -1, 0, 1, 2, 3];
const fmt = (t: number) => t.toFixed(2);
const signed = (w: number) => (w > 0 ? `+${w.toFixed(1)}` : w < 0 ? `−${Math.abs(w).toFixed(1)}` : '0.0');

export default function WindAdjustedTimeCalculator() {
  const uid = useId();
  const [event, setEvent] = useState<WindEvent>('100m');
  const [time, setTime] = useState('10.85');
  const [wind, setWind] = useState('+1.8');

  const t = parseDecimalInput(time);
  const w = parseDecimalInput(wind);
  const timeValid = t !== null && t > 0;
  const windValid = w !== null && Math.abs(w) <= MAX_WIND_SPEED;
  const zero = timeValid && windValid ? adjustToZeroWind(t, w, event) : null;
  const delta = zero !== null && timeValid ? zero - t : null;

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-[0_24px_60px_-40px_rgba(30,26,36,.35)] sm:p-8" style={{borderColor: 'var(--border-light)'}}>
      <div role="group" aria-label="Event" className="grid w-full grid-cols-2 gap-1 rounded-full p-1 sm:inline-grid sm:w-auto" style={{background: 'var(--bg-sky)'}}>
        {(['100m', '200m'] as WindEvent[]).map((e) => (
          <button
            key={e}
            type="button"
            aria-pressed={event === e}
            onClick={() => setEvent(e)}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${event === e ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
            style={{color: event === e ? 'var(--text-primary)' : 'var(--text-muted)'}}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label htmlFor={`${uid}-t`} className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Your time</span>
          <span className="text-xs" style={{color: 'var(--text-muted)'}}>Hand or electronic, in seconds</span>
          <span className="flex items-center rounded-2xl border bg-white focus-within:ring-2 focus-within:ring-[#5C8DB8]/30" style={{borderColor: timeValid ? 'var(--border-light)' : 'var(--accent-red)'}}>
            <input id={`${uid}-t`} inputMode="decimal" autoComplete="off" value={time} onChange={(e) => setTime(e.target.value)} className="w-full min-w-0 bg-transparent px-4 py-3 font-mono text-lg tabular-nums outline-none" style={{color: 'var(--text-primary)'}} />
            <span className="pr-4 font-mono text-sm" style={{color: 'var(--text-muted)'}}>s</span>
          </span>
        </label>
        <label htmlFor={`${uid}-w`} className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Wind</span>
          <span className="text-xs" style={{color: 'var(--text-muted)'}}>+ tailwind, − headwind, in m/s</span>
          <span className="flex items-center rounded-2xl border bg-white focus-within:ring-2 focus-within:ring-[#5C8DB8]/30" style={{borderColor: windValid ? 'var(--border-light)' : 'var(--accent-red)'}}>
            <input id={`${uid}-w`} inputMode="text" autoComplete="off" value={wind} onChange={(e) => setWind(e.target.value)} className="w-full min-w-0 bg-transparent px-4 py-3 font-mono text-lg tabular-nums outline-none" style={{color: 'var(--text-primary)'}} />
            <span className="pr-4 font-mono text-sm" style={{color: 'var(--text-muted)'}}>m/s</span>
          </span>
        </label>
      </div>

      <div aria-live="polite" className="mt-7 border-t pt-6" style={{borderColor: 'var(--border-light)'}}>
        {zero !== null && delta !== null ? (
          <>
            <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[.14em]" style={{color: 'var(--text-muted)'}}>Zero-wind time</span>
                <span className="font-mono text-5xl font-medium tabular-nums tracking-tight" style={{color: 'var(--text-primary)'}}>
                  {fmt(zero)}
                  <span className="ml-1.5 text-lg font-normal" style={{color: 'var(--text-muted)'}}>s</span>
                </span>
              </div>
              <div className="flex flex-col gap-1 pb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[.14em]" style={{color: 'var(--text-muted)'}}>{delta >= 0 ? 'Wind helped by' : 'Wind cost you'}</span>
                <span className="font-mono text-lg tabular-nums" style={{color: 'var(--text-secondary)'}}>{Math.abs(delta).toFixed(2)} s</span>
              </div>
              <span
                className="mb-1.5 self-end rounded-full px-3 py-1 text-sm font-medium"
                style={isLegalWind(w!) ? {background: 'rgba(34,197,94,.12)', color: '#15803d'} : {background: 'rgba(240,79,79,.12)', color: '#b91c1c'}}
              >
                {isLegalWind(w!) ? 'Legal wind (≤ +2.0)' : 'Wind-aided (over +2.0)'}
              </span>
            </div>

            <p className="mt-6 text-sm font-semibold" style={{color: 'var(--text-primary)'}}>The same run in other winds</p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {WIND_STEPS.map((step) => (
                <div key={step} className="rounded-2xl px-3 py-2.5 text-center" style={{background: step === 0 ? 'var(--bg-sky)' : 'var(--bg-mint)'}}>
                  <div className="font-mono text-xs" style={{color: 'var(--text-muted)'}}>{signed(step)}</div>
                  <div className="font-mono text-base font-medium tabular-nums" style={{color: 'var(--text-primary)'}}>{fmt(estimateAtWind(zero, step, event))}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm" style={{color: 'var(--accent-red)'}}>
            {timeValid ? `Enter a wind between −${MAX_WIND_SPEED} and +${MAX_WIND_SPEED} m/s.` : 'Enter your time in seconds, for example 10.85.'}
          </p>
        )}
      </div>
      <p className="mt-5 font-mono text-xs" style={{color: 'var(--text-muted)'}}>
        {event === '100m' ? 'zero-wind = t + (−0.0449 + 0.009459·t)·w − 0.0042·w²' : 'zero-wind = t + 0.090·w − 0.010·w²'}
      </p>
    </div>
  );
}
