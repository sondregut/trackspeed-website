import Image from "next/image";
import type copy from "../../../messages/en/marketing.json";

type GatesCopy = Pick<typeof copy.modes, "gates" | "start" | "finish" | "diagramLabel">;
type PhotoCopy = Pick<typeof copy.photos, "connectAlt" | "alignAlt">;

export default function ConnectedGates({copy: c, photos}: {copy: GatesCopy; photos: PhotoCopy}) {
  return <>
    <div className="setup-story">
      <div className="setup-content">
        <div className="setup-intro">
          <p className="setup-eyebrow">{c.gates.tab}</p>
          <h2 id="connected-gates-title">{c.gates.title}</h2>
        </div>
        <div className="setup-copy">
          <p>{c.gates.body}</p>
          <p className="setup-requirement">{c.gates.requirement}</p>
          <div className="setup-course" aria-label={c.diagramLabel}>
            <span>{c.start}</span>
            <span className="course-line" aria-hidden="true"/>
            <span>{c.finish}</span>
          </div>
        </div>
      </div>
      <div className="setup-art">
        <Image src="/photos/trackspeed/connect-devices.webp" alt={photos.connectAlt} width={900} height={1600} sizes="(max-width: 767px) 44vw, 220px" className="setup-photo"/>
        <Image src="/photos/trackspeed/align-camera.webp" alt={photos.alignAlt} width={900} height={1600} sizes="(max-width: 767px) 44vw, 220px" className="setup-photo setup-photo-offset"/>
      </div>
    </div>
    <ol className="setup-steps" aria-labelledby="connected-gates-title">
      {c.gates.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
    </ol>
  </>;
}
