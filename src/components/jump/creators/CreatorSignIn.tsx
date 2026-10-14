'use client';

import {useState, type FormEvent} from 'react';
import {trackJumpClient} from '@/lib/trackjump-creators';

/** Email code sign-in against the TrackJump account system. */
export default function CreatorSignIn({title, intro}: {title: string; intro: string}) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    const supabase = trackJumpClient();
    if (!supabase) {setError('Sign-in is not set up on this site yet.'); return;}
    setBusy(true); setError(null);
    const {error: sendError} = await supabase.auth.signInWithOtp({email: email.trim().toLowerCase(), options: {shouldCreateUser: true}});
    setBusy(false);
    if (sendError) {setError(sendError.status === 429 ? 'Too many codes requested. Wait a minute and try again.' : 'The code could not be sent. Check the address and try again.'); return;}
    setStep('code');
  }

  async function verify(event: FormEvent) {
    event.preventDefault();
    const supabase = trackJumpClient();
    if (!supabase) return;
    setBusy(true); setError(null);
    const {error: verifyError} = await supabase.auth.verifyOtp({email: email.trim().toLowerCase(), token: code.trim(), type: 'email'});
    setBusy(false);
    if (verifyError) setError('That code did not work. Check the latest email or send a new code.');
  }

  return <div className="mx-auto w-full max-w-md">
    <div className="rounded-2xl bg-[#1A1A1A] p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#5C8DB8]">TrackJump creators</p>
      <h1 className="mb-2 text-2xl font-bold text-white">{title}</h1>
      <p className="mb-6 text-sm leading-6 text-[#9B9A97]">{intro}</p>
      {step === 'email' ? <form onSubmit={sendCode} className="space-y-3">
        <label htmlFor="creator-email" className="block text-sm text-[#9B9A97]">Email</label>
        <input id="creator-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[#2B2E32] bg-[#111] px-4 py-3 text-white outline-none focus:border-[#5C8DB8]" placeholder="you@example.com" />
        <button disabled={busy} className="w-full rounded-lg bg-[#5C8DB8] px-4 py-3 font-medium text-white transition-colors hover:bg-[#4A7A9E] disabled:opacity-60">
          {busy ? 'Sending…' : 'Email me a sign-in code'}
        </button>
      </form> : <form onSubmit={verify} className="space-y-3">
        <label htmlFor="creator-code" className="block text-sm text-[#9B9A97]">Code sent to {email}</label>
        <input id="creator-code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={e => setCode(e.target.value)}
          className="w-full rounded-lg border border-[#2B2E32] bg-[#111] px-4 py-3 font-mono text-lg tracking-[0.3em] text-white outline-none focus:border-[#5C8DB8]" placeholder="123456" />
        <button disabled={busy} className="w-full rounded-lg bg-[#5C8DB8] px-4 py-3 font-medium text-white transition-colors hover:bg-[#4A7A9E] disabled:opacity-60">
          {busy ? 'Checking…' : 'Sign in'}
        </button>
        <button type="button" onClick={() => {setStep('email'); setCode(''); setError(null);}} className="w-full text-sm text-[#9B9A97] hover:text-white">Use a different email</button>
      </form>}
      {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  </div>;
}
