"use client";

import Image from "next/image";
import {useState} from "react";
import type copy from "../../../messages/en/marketing.json";

const scenes = [
  {src: "/product/sprint-blue-track-transparent.png", width: 872, height: 1802},
  {src: "/product/sprint-football-transparent.png", width: 873, height: 1802},
  {src: "/product/sprint-indoor-transparent.png", width: 852, height: 1846},
];

export default function SprintPreview({copy: c}: {copy: typeof copy}) {
  const [active, setActive] = useState(0);
  return <figure className="sprint-preview">
    <div className="sprint-preview-art" id="sprint-preview-art">
      {scenes.map((scene, index) => <Image key={scene.src} {...scene} alt={c.hero.imageAlt} sizes="(max-width: 640px) 280px, 380px" className={active === index ? "is-visible" : "is-hidden"}/>)}
    </div>
    <div className="scene-picker" role="group" aria-label={c.editorial.sceneLabel}>
      {c.editorial.scenes.map((label, index) => <button key={label} type="button" aria-pressed={active === index} aria-controls="sprint-preview-art" onClick={() => setActive(index)}>{label}</button>)}
    </div>
    <figcaption>{c.editorial.illustration}</figcaption>
  </figure>;
}
