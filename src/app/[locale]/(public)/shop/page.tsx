import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/i18n/metadata";
import ProductGrid from "@/components/shop/ProductGrid";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    alternates: getAlternates("/shop"),
    openGraph: { type: "website" },
  };
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "shop" });

  return (
    <div className="bg-hero min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {t("hero.title")}
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ProductGrid />
        </div>
      </section>
    </div>
  );
}
