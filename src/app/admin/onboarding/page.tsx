"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  onboardingApps, onboardingUpdatedAt, type OnboardingApp, type OnboardingScreen, type ScreenStatus,
} from "@/lib/admin-onboarding"

const statusStyle: Record<ScreenStatus, string> = {
  changed: "bg-[#5C8DB8]/20 text-[#8EC5F3]",
  new: "bg-green-500/15 text-green-400",
  same: "bg-[#2B2E32] text-[#9B9A97]",
}

export default function OnboardingPage() {
  const [appID, setAppID] = useState<OnboardingApp["id"]>("trackspeed")
  const [changedOnly, setChangedOnly] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash === "trackspeed" || hash === "trackjump") void Promise.resolve(hash as OnboardingApp["id"]).then(setAppID)
  }, [])

  function choose(id: OnboardingApp["id"]) {
    setAppID(id)
    window.history.replaceState(null, "", `#${id}`)
  }

  const app = onboardingApps.find(a => a.id === appID)!
  const all = app.groups.flatMap(g => g.screens)
  const count = (s: ScreenStatus) => all.filter(x => x.status === s).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Onboarding</h1>
        <p className="text-[#9B9A97] text-sm sm:text-base">Every onboarding screen in the order a new user sees it, with what changed. Updated {onboardingUpdatedAt}.</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-lg bg-[#1A1A1A] p-1" role="group" aria-label="App">
          {onboardingApps.map(a => (
            <button key={a.id} type="button" onClick={() => choose(a.id)} aria-pressed={a.id === appID}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${a.id === appID ? "bg-[#5C8DB8] text-white" : "text-[#9B9A97] hover:text-white"}`}>
              {a.name}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[#C9D4DE]">
          <input type="checkbox" checked={changedOnly} onChange={e => setChangedOnly(e.target.checked)} /> Only changed screens
        </label>
      </div>

      <div className="mb-8 rounded-xl bg-[#1A1A1A] p-5">
        <p className="max-w-4xl text-sm leading-6 text-[#C9D4DE]">{app.intro}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className={`rounded px-2 py-1 ${statusStyle.changed}`}>{count("changed")} changed</span>
          <span className={`rounded px-2 py-1 ${statusStyle.new}`}>{count("new")} new</span>
          <span className={`rounded px-2 py-1 ${statusStyle.same}`}>{count("same")} unchanged</span>
        </div>
      </div>

      {app.groups.map((group, i) => {
        const screens = changedOnly ? group.screens.filter(s => s.status !== "same") : group.screens
        if (screens.length === 0) return null
        return (
          <section key={`${app.id}-${i}`} className="mb-10">
            {group.title && <h2 className="mb-1 text-lg font-semibold text-white">{group.title}</h2>}
            {group.note && <p className="mb-4 text-sm text-[#9B9A97]">{group.note}</p>}
            <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] items-start">
              {screens.map(screen => <ScreenCard key={`${app.id}-${screen.num}-${screen.title}`} screen={screen} />)}
            </div>
          </section>
        )
      })}

      <div className="grid gap-4 lg:grid-cols-2">
        {app.boxes.map(box => (
          <div key={box.title} className="rounded-xl bg-[#1A1A1A] p-5">
            <h2 className="mb-3 text-lg font-semibold text-white">{box.title}</h2>
            <ul className="space-y-2 text-sm leading-6 text-[#C9D4DE]">
              {box.items.map(item => <li key={item.title}><span className="font-medium text-white">{item.title}</span> {item.text}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScreenCard({ screen }: { screen: OnboardingScreen }) {
  const wide = screen.shots.length > 1
  const span = screen.shots.length > 2 ? "col-span-2 lg:col-span-3" : wide ? "col-span-2" : ""
  return (
    <article className={`min-w-0 space-y-2 ${span}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-[#8EC5F3] tabular-nums">{screen.num}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${statusStyle[screen.status]}`}>{screen.label}</span>
      </div>
      <h3 className="text-base font-semibold text-white">{screen.title}</h3>
      {screen.shots.length === 0 ? (
        <div className="grid aspect-[540/1170] place-content-center rounded-3xl border border-dashed border-[#3D3D3D] text-center text-sm text-[#9B9A97]">
          Screenshot pending
        </div>
      ) : (
        <div className={screen.shots.length > 2 ? "grid grid-cols-3 gap-3" : wide ? "grid grid-cols-2 gap-3" : ""}>
          {screen.shots.map(shot => (
            <figure key={shot.src} className="space-y-1">
              <div className="overflow-hidden rounded-3xl border border-[#3D3D3D] bg-[#202327]">
                <Image src={shot.src} alt={`${screen.title}${shot.caption ? `, ${shot.caption}` : ""}`}
                  width={540} height={screen.small ? 960 : 1170} sizes="(max-width: 640px) 90vw, 260px" className="h-auto w-full" />
              </div>
              {shot.caption && <figcaption className="font-mono text-xs uppercase tracking-wide text-[#9B9A97]">{shot.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
      {screen.note && <p className="text-sm leading-6 text-[#9B9A97]">{screen.note}</p>}
    </article>
  )
}
