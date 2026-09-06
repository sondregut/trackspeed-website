"use client";

import Image from "next/image";
import {useRef, useState, type KeyboardEvent} from "react";
import ProductPhone from "./ProductPhone";
import type copy from "../../../messages/en/marketing.json";

type ModeId = "gates" | "solo";
const modes: ModeId[] = ["gates", "solo"];

export default function ModeExplorer({copy: c}: {copy: typeof copy.modes}) {
  const [active, setActive] = useState<ModeId>("gates");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = c[active];
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = event.currentTarget.closest("[dir='rtl']") !== null;
    const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
    let next = index;
    if (event.key === nextKey) next = (index + 1) % modes.length;
    else if (event.key === prevKey) next = (index + modes.length - 1) % modes.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = modes.length - 1;
    else return;
    event.preventDefault();
    setActive(modes[next]);
    tabs.current[next]?.focus();
  }
  return <div className="mode-explorer">
    <div className="setup-story">
      <div className="setup-content">
        <div className="setup-intro"><h2>{c.title}</h2><p>{c.description}</p></div>
        <div role="tablist" aria-label={c.title} className="setup-tabs">
          {modes.map((id, index) => <button key={id} ref={el => {tabs.current[index] = el;}} id={"mode-tab-" + id} role="tab" type="button" aria-selected={active === id} aria-controls="mode-panel" tabIndex={active === id ? 0 : -1} onKeyDown={event => move(event, index)} onClick={() => setActive(id)}>{c[id].tab}</button>)}
        </div>
        <div role="tabpanel" id="mode-panel" aria-labelledby={"mode-tab-" + active} tabIndex={0} className="setup-copy">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <p className="setup-requirement">{item.requirement}</p>
          <div className={"setup-course " + (active === "solo" ? "setup-course-solo" : "")} aria-label={c.diagramLabel}>
            <span>{active === "solo" ? c.lap : c.start}</span>
            <span className="course-line" aria-hidden="true"/>
            <span>{active === "solo" ? "↺" : c.finish}</span>
          </div>
        </div>
      </div>
      <div className={"setup-art " + (active === "solo" ? "setup-art-solo" : "")} aria-hidden="true">
        <ProductPhone src="/product/training-home.png" className="setup-home"/>
        {active === "gates" && <Image src="/product/sprint-football-transparent.png" alt="" width={873} height={1802} sizes="(max-width: 767px) 44vw, 224px" className="setup-finish"/>}
      </div>
    </div>
    <ol className="setup-steps" aria-labelledby={"mode-tab-" + active}>{item.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
  </div>;
}
