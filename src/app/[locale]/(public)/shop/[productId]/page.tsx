import Image from "next/image";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

const PRODUCTS: Record<string, { nameKey: string; descriptionKey: string; longDescriptionKey: string; featuresKey: string; priceKey: string; image?: string; containImage?: boolean }> = {
  tripod: {
    nameKey: "products.tripod.name",
    descriptionKey: "products.tripod.description",
    longDescriptionKey: "products.tripod.longDescription",
    featuresKey: "products.tripod.features",
    priceKey: "products.tripod.price",
    image: "/shop/tripod.png",
    containImage: true,
  },
  tshirt: {
    nameKey: "products.tshirt.name",
    descriptionKey: "products.tshirt.description",
    longDescriptionKey: "products.tshirt.longDescription",
    featuresKey: "products.tshirt.features",
    priceKey: "products.tshirt.price",
    image: "/shop/trackspeed-tshirt.webp",
  },
  bundle: {
    nameKey: "products.bundle.name",
    descriptionKey: "products.bundle.description",
    longDescriptionKey: "products.bundle.longDescription",
    featuresKey: "products.bundle.features",
    priceKey: "products.bundle.price",
  },
};

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((productId) => ({ productId }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; productId: string }> }) {
  const { locale, productId } = await params;
  const product = PRODUCTS[productId];
  if (!product) return { title: "Not Found" };
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: `${t(product.nameKey)} - TrackSpeed Shop`,
    description: t(product.descriptionKey),
    alternates: getAlternates(`/shop/${productId}`, locale),
    openGraph: { type: "website" },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; productId: string }> }) {
  const { locale, productId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "shop" });

  const product = PRODUCTS[productId];
  if (!product) {
    return (
      <div className="bg-hero min-h-screen pt-32 px-6 text-center">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Product not found</h1>
        <Link href="/shop" className="text-[#5C8DB8] hover:underline mt-4 inline-block">
          {t("detail.backToShop")}
        </Link>
      </div>
    );
  }

  const name = t(product.nameKey);
  const description = t(product.descriptionKey);
  const longDescription = t(product.longDescriptionKey);
  const features = t(product.featuresKey).split(",");
  const price = parseFloat(t(product.priceKey));

  return (
    <div className="bg-hero min-h-screen">
      <section className="pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors hover:opacity-70"
            style={{ color: "#5C8DB8" }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("detail.backToShop")}
          </Link>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Image */}
            <div
              className="card-feature p-0 overflow-hidden aspect-square flex items-center justify-center relative"
              style={{ background: "rgba(92,141,184,0.08)" }}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={name}
                  fill
                  className={product.containImage ? "object-contain p-8" : "object-cover"}
                />
              ) : (
                <ShoppingBag className="w-24 h-24" style={{ color: "rgba(92,141,184,0.3)" }} />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                {name}
              </h1>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                {description}
              </p>
              <div className="mb-6">
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("currency")}{price.toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <ProductDetailClient
                productId={productId}
                productName={name}
                productPrice={price}
              />

              {/* Long description */}
              <p
                className="text-sm leading-relaxed mt-8"
                style={{ color: "var(--text-secondary)" }}
              >
                {longDescription}
              </p>

              {/* Features */}
              <div className="mt-6">
                <h3
                  className="text-sm font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("detail.features")}
                </h3>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Check className="w-4 h-4 shrink-0" style={{ color: "#5C8DB8" }} />
                      {feature.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
