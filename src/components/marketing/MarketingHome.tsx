import Image from "next/image";
import {ArrowRightIcon, CameraIcon, CheckIcon, ClockIcon, DownloadIcon, PersonIcon, PlusIcon} from "@radix-ui/react-icons";
import {DownloadLink} from "@/components/DownloadLink";
import {Link} from "@/i18n/navigation";
import {TextLink} from "./Primitives";
import ConnectedGates from "./ConnectedGates";
import ProductPhone from "./ProductPhone";
import SprintPreview from "./SprintPreview";
import type copy from "../../../messages/en/marketing.json";

const workflowItems = [{index: 1, Icon: PersonIcon}, {index: 3, Icon: ClockIcon}, {index: 4, Icon: DownloadIcon}, {index: 5, Icon: CheckIcon}];
const startArtwork = [
  {id: "flying", src: "/product/start-flying-blue-track-v3.png", width: 1536, height: 1024},
  {id: "touch", src: "/product/start-touch-track-v2.png", width: 1142, height: 1378},
  {id: "countdown", src: "/product/start-countdown-athlete.png", width: 1254, height: 1254},
  {id: "voice", src: "/product/start-voice-athlete.png", width: 1254, height: 1254},
  {id: "in-frame", src: "/product/start-in-frame-turf-v2.png", width: 1122, height: 1402},
];

export default function MarketingHome({copy: c}: {copy: typeof copy}) {
  return <div className="marketing-home editorial-home">
    <section className="editorial-hero">
      <div className="marketing-container hero-layout">
        <div className="hero-copy">
          <h1>{c.hero.title}<br/>{c.hero.accent}</h1>
          <p className="hero-description">{c.hero.description}</p>
          <div className="hero-actions">
            <DownloadLink store="ios" className="marketing-button">{c.nav.download}<ArrowRightIcon aria-hidden="true"/></DownloadLink>
            <a href="#how-it-works" className="quiet-link">{c.hero.secondary}</a>
          </div>
          <p className="hero-availability">{c.hero.availability}</p>
        </div>
        <figure className="hero-product">
          <Image src="/product/sprint-blue-track-transparent.png" alt={c.hero.imageAlt} width={872} height={1802} preload sizes="(max-width: 374px) 190px, (max-width: 767px) 230px, (max-width: 1100px) 295px, 352px" className="hero-timing-phone"/>
          <div className="hero-watch">
            <Image src="/product/watch-hero-transparent.png" alt={`Apple Watch — ${c.editorial.illustration}`} width={1086} height={1448} loading="eager" sizes="(max-width: 374px) 140px, (max-width: 767px) 168px, (max-width: 1100px) 220px, 322px"/>
          </div>
          <figcaption className="sr-only">{c.editorial.illustration}</figcaption>
        </figure>
      </div>
    </section>

    <section id="preview" className="editorial-section landscape-section">
      <div className="marketing-container">
        <div className="preview-heading"><h2>{c.editorial.landscapeTitle}</h2></div>
        <p className="section-description">{c.editorial.landscapeBody}</p>
        <figure className="landscape-product">
          <Image className="landscape-football-image" src="/product/landscape-football-daylight-v2.png" alt={c.beta.landscapeAlt} width={1672} height={941} sizes="(max-width: 1280px) 92vw, 1200px"/>
          <figcaption>{c.editorial.illustration}</figcaption>
        </figure>
        <div className="landscape-features"><span>{c.editorial.standingFlying}</span><span>{c.editorial.agilityDrills}</span></div>
      </div>
    </section>

    <section id="how-it-works" className="editorial-section setup-section" aria-labelledby="connected-gates-title">
      <div className="marketing-container">
        <ConnectedGates copy={c.modes}/>
      </div>
    </section>

    <section id="review" className="editorial-section evidence-section">
      <div className="marketing-container evidence-layout">
        <SprintPreview copy={c}/>
        <div className="story-copy">
          <h2>{c.evidence.title}</h2>
          <p>{c.editorial.evidenceBody}</p>
          <ul className="evidence-points">{c.evidence.items.map(item => <li key={item}><CameraIcon aria-hidden="true"/><span>{item}</span></li>)}</ul>
          <TextLink href="/technology">{c.evidence.link}</TextLink>
        </div>
      </div>
    </section>

    <section id="start-types" className="editorial-section starts-section">
      <div className="marketing-container">
        <div className="section-intro start-method-intro"><h2>{c.starts.title}</h2><p>{c.starts.description}</p></div>
        <ol className="start-method-grid">
          {c.starts.items.map((item, index) => <li key={startArtwork[index].id} className={`start-method-card start-method-${startArtwork[index].id}`}>
            <div className="start-method-copy">
              <span className="list-number" aria-hidden="true">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            <div className="start-method-art">
              <Image src={startArtwork[index].src} alt="" width={startArtwork[index].width} height={startArtwork[index].height} sizes="(max-width: 767px) 90vw, (max-width: 1100px) 42vw, 410px"/>
              {index === 2 && <span className="start-method-cue" aria-hidden="true"><span>3</span><span>2</span><span>1</span></span>}
              {index === 3 && <span className="start-method-cue start-method-voice-cue" aria-hidden="true">{[12,22,34,18,28,38,24,14].map((height, bar) => <i key={bar} style={{height}}/>)}</span>}
            </div>
          </li>)}
        </ol>
      </div>
    </section>

    <section className="editorial-section watch-section">
      <div className="marketing-container watch-layout">
        <div className="story-copy"><h2>{c.editorial.watchTitle}</h2><p>{c.editorial.watchBody}</p><TextLink href="/features#watch-start">{c.workflow.guide}</TextLink></div>
        <figure><Image src="/product/watch-and-phone-transparent.png" alt={c.beta.watchAlt} width={1448} height={1086} sizes="(max-width: 1024px) 95vw, 760px"/><figcaption>{c.editorial.illustration}</figcaption></figure>
      </div>
    </section>

    <section id="features" className="editorial-section history-section">
      <div className="marketing-container">
        <div className="history-layout">
          <div className="story-copy"><h2>{c.workflow.title}</h2><p>{c.editorial.historyBody}</p><TextLink href="/features">{c.workflow.guide}</TextLink></div>
          <figure className="history-art">
            <ProductPhone src="/product/session-history.png" alt={c.evidence.caption} className="history-phone"/>
            <ProductPhone src="/product/share-result.png" alt={c.workflow.items[4].title} className="share-phone"/>
            <figcaption>{c.evidence.caption}</figcaption>
          </figure>
        </div>
        <div className="feature-lines">{workflowItems.map(({index, Icon}) => <article key={index}><Icon aria-hidden="true"/><div><h3>{c.workflow.items[index].title}</h3><p>{c.editorial.featureDescriptions[index === 1 ? 0 : index === 3 ? 1 : index === 4 ? 2 : 3]}</p></div></article>)}</div>
      </div>
    </section>

    <section className="editorial-section founder-section">
      <div className="marketing-container founder-layout">
        <Image src="/testimonials/sondre-guttormsen.webp" alt={c.founder.imageAlt} width={800} height={533} sizes="(max-width: 768px) 90vw, 520px"/>
        <div className="story-copy"><p className="story-eyebrow">{c.founder.kicker}</p><h2>{c.founder.title}</h2><p>{c.founder.body}</p><Link href="/about" className="quiet-link">{c.founder.link}<ArrowRightIcon aria-hidden="true"/></Link></div>
      </div>
    </section>

    <section className="editorial-section faq-section">
      <div className="marketing-container starts-layout"><h2>{c.faq.title}</h2><div className="editorial-accordion">{c.faq.items.map(item => <details key={item.question}><summary><h3>{item.question}</h3><PlusIcon aria-hidden="true"/></summary><p>{item.answer}</p></details>)}</div></div>
    </section>

    <section id="download" className="editorial-download"><div className="marketing-container download-panel"><div><h2>{c.cta.title}</h2><p>{c.cta.note}</p></div><DownloadLink store="ios" className="marketing-button">{c.nav.download}<ArrowRightIcon aria-hidden="true"/></DownloadLink></div></section>
  </div>;
}
