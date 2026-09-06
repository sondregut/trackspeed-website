import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPageMetadata } from "@/i18n/metadata";
import { Eyebrow, TextLink } from "@/components/marketing/Primitives";
import FeatureGuide from "@/components/marketing/FeatureGuide";
import { featureGroups } from "@/lib/product-features";

const title="Every TrackSpeed feature, explained";
const description="Explore automatic sprint timing, five start methods, wireless gates, solo laps, history, athlete profiles, CSV and video sharing, plus Watch and agility development previews.";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;
 return getPageMetadata({title,description,path:"/features",localized:false,robots:locale==="en"?undefined:{index:false,follow:true}});
}
export default async function FeaturesPage({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;setRequestLocale(locale);const t=await getTranslations({locale,namespace:"marketing.nav"});
 return <div lang="en" dir="ltr" className="pb-20 pt-28 sm:pt-36">
  <section className="px-5 pb-12 sm:px-8"><div className="marketing-container"><Eyebrow>Meet your training toolkit</Eyebrow><h1 className="max-w-4xl text-[clamp(2.75rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.06em]">Every feature.<br/><span className="text-[var(--brand)]">One clear guide.</span></h1><div className="mt-7 grid gap-6 lg:grid-cols-[1fr_auto]"><p className="max-w-2xl text-lg leading-8 text-muted">From your first flying sprint to a full team session. Explore what TrackSpeed does today, and what we’re developing next.</p><TextLink href="/#how-it-works">Find the right setup</TextLink></div>{locale!=="en"&&<p lang={locale} dir={locale==="ar"?"rtl":"ltr"} className="mt-6 border-s-2 border-[var(--brand)] ps-4 text-sm text-muted">{t("guideLanguage")}</p>}</div></section>
  <div className="px-5 sm:px-8"><div className="marketing-container"><FeatureGuide/></div></div>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"CollectionPage",name:title,description,url:"https://mytrackspeed.com/features",inLanguage:"en",about:{"@id":"https://mytrackspeed.com/#app"},hasPart:featureGroups.map(group=>({"@type":"WebPageElement",name:group.title,url:`https://mytrackspeed.com/features#${group.id}`}))})}}/>
 </div>;
}
