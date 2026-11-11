'use client';

import {useId, useState} from 'react';
import {CM_PER_IN, flightTimeHeightCm, rsiRating, sayersPeakPower, verticalRating, type Sex, type Unit} from '@/lib/vertical-jump';

type Tab = 'flight' | 'reach' | 'rsi';

const parse = (v: string) => {
  const n = Number.parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : Number.NaN;
};

const tabs: {id: Tab; label: string}[] = [
  {id: 'flight', label: 'Flight time'},
  {id: 'reach', label: 'Reach test'},
  {id: 'rsi', label: 'RSI'},
];

function Field({label, hint, unit, value, onChange, step = '1', id}: {label: string; hint: string; unit: string; value: string; onChange: (v: string) => void; step?: string; id: string}) {
  return (
    <label htmlFor={id} className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-medium text-[#192b30]">{label}</span>
      <span className="text-xs text-[#617279]">{hint}</span>
      <span className="flex items-center rounded-2xl border border-[#d4dcde] bg-white focus-within:border-[#315f68] focus-within:ring-2 focus-within:ring-[#315f68]/25">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent px-4 py-3 font-mono text-lg tabular-nums text-[#192b30] outline-none"
        />
        <span className="pr-4 font-mono text-sm text-[#617279]">{unit}</span>
      </span>
    </label>
  );
}

function SexSelect({id, value, onChange}: {id: string; value: Sex; onChange: (v: Sex) => void}) {
  return (
    <label htmlFor={id} className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-medium text-[#192b30]">Compare with</span>
      <span className="text-xs text-[#617279]">General adult norms</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as Sex)}
        className="rounded-2xl border border-[#d4dcde] bg-white px-4 py-3 text-base text-[#192b30] outline-none focus:border-[#315f68] focus:ring-2 focus:ring-[#315f68]/25"
      >
        <option value="m">Men</option>
        <option value="w">Women</option>
      </select>
    </label>
  );
}

function Stat({label, value, unit}: {label: string; value: string; unit?: string}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#617279]">{label}</span>
      <span className="font-mono text-4xl font-medium tabular-nums tracking-tight text-[#192b30]">
        {value}
        {unit ? <span className="ml-1.5 text-base font-normal text-[#617279]">{unit}</span> : null}
      </span>
    </div>
  );
}

export default function VerticalJumpCalculator() {
  const uid = useId();
  const [tab, setTab] = useState<Tab>('flight');
  const [unit, setUnit] = useState<Unit>('in');
  const [flightMs, setFlightMs] = useState('560');
  const [sex, setSex] = useState<Sex>('m');
  const [mass, setMass] = useState('');
  const [standing, setStanding] = useState('90.5');
  const [touch, setTouch] = useState('114');
  const [dropHeight, setDropHeight] = useState('12.5');
  const [contactMs, setContactMs] = useState('180');

  const toCm = (v: number) => (unit === 'cm' ? v : v * CM_PER_IN);
  const fromCm = (cm: number) => (unit === 'cm' ? cm : cm / CM_PER_IN);

  function switchUnit(next: Unit) {
    if (next === unit) return;
    const convert = (v: string) => {
      const n = parse(v);
      if (!Number.isFinite(n)) return v;
      return (next === 'cm' ? n * CM_PER_IN : n / CM_PER_IN).toFixed(1).replace(/\.0$/, '');
    };
    setStanding(convert(standing));
    setTouch(convert(touch));
    setDropHeight(convert(dropHeight));
    setUnit(next);
  }

  let heightCm = Number.NaN;
  if (tab === 'flight') heightCm = flightTimeHeightCm(parse(flightMs));
  if (tab === 'reach') heightCm = toCm(parse(touch)) - toCm(parse(standing));
  const kg = parse(mass);
  const power = heightCm > 0 && kg > 0 ? sayersPeakPower(heightCm, kg) : Number.NaN;
  const rsi = tab === 'rsi' ? toCm(parse(dropHeight)) / 100 / (parse(contactMs) / 1000) : Number.NaN;

  const formula =
    tab === 'flight' ? 'height = 9.81 × t² ÷ 8' : tab === 'reach' ? 'height = jump touch − standing reach' : 'RSI = jump height (m) ÷ ground contact time (s)';

  return (
    <div className="rounded-[32px] border border-[#dce2e3] bg-white p-5 shadow-[0_24px_65px_-45px_#35494c66] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Calculator" className="grid w-full grid-cols-3 gap-1 rounded-full bg-[#eef2f3] p-1 sm:flex sm:w-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`${uid}-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`${uid}-panel`}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium sm:px-4 transition-colors ${tab === t.id ? 'bg-white text-[#192b30] shadow-sm' : 'text-[#536369] hover:text-[#192b30]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Units" className="flex gap-1 rounded-full bg-[#eef2f3] p-1">
          {(['in', 'cm'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => switchUnit(u)}
              className={`rounded-full px-3.5 py-2 font-mono text-sm transition-colors ${unit === u ? 'bg-white text-[#192b30] shadow-sm' : 'text-[#536369] hover:text-[#192b30]'}`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="mt-6 grid gap-5 sm:grid-cols-2">
        {tab === 'flight' && (
          <>
            <Field id={`${uid}-ft`} label="Flight time" hint="Time in the air, takeoff to landing" unit="ms" value={flightMs} onChange={setFlightMs} />
            <SexSelect id={`${uid}-sex1`} value={sex} onChange={setSex} />
            <Field id={`${uid}-mass1`} label="Body mass (optional)" hint="Adds an estimate of peak power" unit="kg" step="0.5" value={mass} onChange={setMass} />
          </>
        )}
        {tab === 'reach' && (
          <>
            <Field id={`${uid}-sr`} label="Standing reach" hint="Highest point flat-footed, one arm up" unit={unit} step="0.5" value={standing} onChange={setStanding} />
            <Field id={`${uid}-jr`} label="Jump touch" hint="Highest point you touched" unit={unit} step="0.5" value={touch} onChange={setTouch} />
            <SexSelect id={`${uid}-sex2`} value={sex} onChange={setSex} />
            <Field id={`${uid}-mass2`} label="Body mass (optional)" hint="Adds an estimate of peak power" unit="kg" step="0.5" value={mass} onChange={setMass} />
          </>
        )}
        {tab === 'rsi' && (
          <>
            <Field id={`${uid}-rh`} label="Drop jump height" hint="How high you jumped after landing" unit={unit} step="0.5" value={dropHeight} onChange={setDropHeight} />
            <Field id={`${uid}-ct`} label="Ground contact time" hint="Landing to takeoff" unit="ms" value={contactMs} onChange={setContactMs} />
          </>
        )}
      </div>

      <div aria-live="polite" className="mt-7 grid gap-6 border-t border-[#dce2e3] pt-6 sm:grid-cols-3">
        {tab === 'rsi' ? (
          <>
            <Stat label="RSI" value={rsi > 0 ? rsi.toFixed(2) : '–'} />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#617279]">Rating</span>
              <span className="self-start rounded-full bg-[#e3eef0] px-3 py-1 text-sm font-medium text-[#234f58]">{rsi > 0 ? rsiRating(rsi) : '–'}</span>
            </div>
          </>
        ) : (
          <>
            <Stat label="Vertical jump" value={heightCm > 0 ? fromCm(heightCm).toFixed(1) : '–'} unit={unit} />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#617279]">Rating</span>
              <span className="self-start rounded-full bg-[#e3eef0] px-3 py-1 text-sm font-medium text-[#234f58]">{heightCm > 0 ? verticalRating(heightCm, sex) : '–'}</span>
            </div>
            {power > 0 ? <Stat label="Peak power" value={Math.round(power).toLocaleString('en-US')} unit="W" /> : null}
          </>
        )}
      </div>
      <p className="mt-5 font-mono text-xs text-[#617279]">
        {formula}
        {tab !== 'rsi' && power > 0 ? ' · peak power (Sayers) = 60.7 × cm + 45.3 × kg − 2055' : ''}
      </p>
    </div>
  );
}
