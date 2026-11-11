'use client';

import {useId, useState} from 'react';
import {fly30Equivalent, parseDecimalInput, predict100mFromFly, topSpeed, type FlyingDistance} from '@/lib/sprint-calculators';

const DISTANCES: FlyingDistance[] = [30, 20, 10];

function Stat({label, value, unit, big = false}: {label: string; value: string; unit: string; big?: boolean}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[.14em]" style={{color: 'var(--text-muted)'}}>{label}</span>
      <span className={`font-mono font-medium tabular-nums tracking-tight ${big ? 'text-5xl' : 'text-3xl'}`} style={{color: 'var(--text-primary)'}}>
        {value}
        <span className="ml-1.5 text-base font-normal" style={{color: 'var(--text-muted)'}}>{unit}</span>
      </span>
    </div>
  );
}

export default function FlyingSprintConverter() {
  const uid = useId();
  const [distance, setDistance] = useState<FlyingDistance>(30);
  const [time, setTime] = useState('3.10');

  const t = parseDecimalInput(time);
  const valid = t !== null && t > 0;
  const speed = valid ? topSpeed(t, distance) : null;
  const hundred = valid ? predict100mFromFly(t, distance) : null;

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-[0_24px_60px_-40px_rgba(30,26,36,.35)] sm:p-8" style={{borderColor: 'var(--border-light)'}}>
      <div role="group" aria-label="Flying distance" className="grid w-full grid-cols-3 gap-1 rounded-full p-1 sm:inline-grid sm:w-auto" style={{background: 'var(--bg-sky)'}}>
        {DISTANCES.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={distance === d}
            onClick={() => setDistance(d)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${distance === d ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
            style={{color: distance === d ? 'var(--text-primary)' : 'var(--text-muted)'}}
          >
            Flying {d}m
          </button>
        ))}
      </div>

      <label htmlFor={`${uid}-t`} className="mt-6 flex max-w-sm min-w-0 flex-col gap-1.5">
        <span className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>Flying {distance}m time</span>
        <span className="text-xs" style={{color: 'var(--text-muted)'}}>Timed zone only, after a running start</span>
        <span className="flex items-center rounded-2xl border bg-white focus-within:ring-2 focus-within:ring-[#5C8DB8]/30" style={{borderColor: valid ? 'var(--border-light)' : 'var(--accent-red)'}}>
          <input id={`${uid}-t`} inputMode="decimal" autoComplete="off" value={time} onChange={(e) => setTime(e.target.value)} className="w-full min-w-0 bg-transparent px-4 py-3 font-mono text-lg tabular-nums outline-none" style={{color: 'var(--text-primary)'}} />
          <span className="pr-4 font-mono text-sm" style={{color: 'var(--text-muted)'}}>s</span>
        </span>
      </label>

      <div aria-live="polite" className="mt-7 border-t pt-6" style={{borderColor: 'var(--border-light)'}}>
        {speed && hundred !== null ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2">
              <Stat big label="Top speed" value={speed.kmh.toFixed(1)} unit="km/h" />
              <span className="font-mono text-base tabular-nums" style={{color: 'var(--text-secondary)'}}>
                {speed.mph.toFixed(1)} mph · {speed.ms.toFixed(2)} m/s
              </span>
            </div>
            <Stat big label="Estimated 100m" value={hundred.toFixed(2)} unit="s" />
          </div>
        ) : (
          <p className="text-sm" style={{color: 'var(--accent-red)'}}>Enter your flying time in seconds, for example 3.10.</p>
        )}
      </div>
      <p className="mt-5 font-mono text-xs leading-relaxed" style={{color: 'var(--text-muted)'}}>
        speed = {distance} ÷ t · 100m = (10/3) × {distance === 30 ? 't' : `fly-30 equivalent (${valid ? fly30Equivalent(t, distance).toFixed(2) : '–'} s)`} + 1.00
      </p>
    </div>
  );
}
