import Image from "next/image";
import ProductPhone from "./ProductPhone";
import type copy from "../../../messages/en/marketing.json";

type GatesCopy = Pick<typeof copy.modes, "gates" | "start" | "finish" | "diagramLabel">;

export default function ConnectedGates({copy: c}: {copy: GatesCopy}) {
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
      <div className="setup-art" aria-hidden="true">
        <ProductPhone src="/product/training-home.png" className="setup-home"/>
        <Image src="/product/sprint-football-transparent.png" alt="" width={873} height={1802} sizes="(max-width: 767px) 44vw, 224px" className="setup-finish"/>
      </div>
    </div>
    <ol className="setup-steps" aria-labelledby="connected-gates-title">
      {c.gates.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
    </ol>
  </>;
}
