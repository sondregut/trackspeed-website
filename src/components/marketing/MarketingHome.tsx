import Image from "next/image";
import {ArrowRightIcon, CameraIcon, CheckIcon, ClockIcon, DownloadIcon, PersonIcon, PlusIcon} from "@radix-ui/react-icons";
import {DownloadLink} from "@/components/DownloadLink";
import {Link} from "@/i18n/navigation";
import {TextLink} from "./Primitives";
import ModeExplorer from "./ModeExplorer";
import ProductPhone from "./ProductPhone";
import SprintPreview from "./SprintPreview";
import type copy from "../../../messages/en/marketing.json";

const workflowItems = [{index: 1, Icon: PersonIcon}, {index: 3, Icon: ClockIcon}, {index: 4, Icon: DownloadIcon}, {index: 5, Icon: CheckIcon}];

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
            <Image src="/product/watch-hero-transparent.png" alt={`Apple Watch — ${c.beta.illustration}`} width={1086} height={1448} loading="eager" sizes="(max-width: 374px) 140px, (max-width: 767px) 168px, (max-width: 1100px) 220px, 322px"/>
            <span className="development-label">{c.beta.kicker}</span>
          </div>
          <figcaption className="sr-only">{c.editorial.illustration}</figcaption>
        </figure>
      </div>
    </section>

    <section id="how-it-works" className="editorial-section">
      <div className="marketing-container">
        <div className="section-intro"><h2>{c.modes.title}</h2><p>{c.modes.description}</p></div>
        <ModeExplorer copy={c.modes}/>
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
      <div className="marketing-container starts-layout">
        <div className="story-copy"><h2>{c.starts.title}</h2><p>{c.starts.description}</p></div>
        <div className="editorial-accordion">{c.starts.items.map((item, index) => <details key={item.title} open={index === 0}><summary><span className="list-number">0{index + 1}</span><h3>{item.title}</h3><PlusIcon aria-hidden="true"/></summary><p>{item.body}</p></details>)}</div>
      </div>
    </section>

    <section id="preview" className="editorial-section landscape-section">
      <div className="marketing-container">
        <div className="preview-heading"><h2>{c.editorial.landscapeTitle}</h2><span className="development-label">{c.beta.kicker}</span></div>
        <p className="section-description">{c.editorial.landscapeBody}</p>
        <figure className="landscape-product">
          <Image src="/product/landscape-practice-transparent.png" alt={c.beta.landscapeAlt} width={1672} height={941} sizes="(max-width: 1280px) 92vw, 1200px"/>
          <figcaption>{c.beta.illustration}</figcaption>
        </figure>
        <div className="landscape-features"><span>{c.editorial.standingFlying}</span><span>{c.editorial.agilityDrills}</span></div>
      </div>
    </section>

    <section className="editorial-section watch-section">
      <div className="marketing-container watch-layout">
        <div className="story-copy"><span className="development-label">{c.beta.kicker}</span><h2>{c.editorial.watchTitle}</h2><p>{c.editorial.watchBody}</p><TextLink href="/features#watch-start">{c.beta.link}</TextLink></div>
        <figure><Image src="/product/watch-and-phone-transparent.png" alt={c.beta.watchAlt} width={1448} height={1086} sizes="(max-width: 1024px) 95vw, 760px"/><figcaption>{c.beta.illustration}</figcaption></figure>
      </div>
      <p className="development-note marketing-container">{c.beta.note}</p>
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
