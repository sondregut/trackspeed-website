import Image from "next/image";
import { ArrowLeft, ShoppingBag, Smartphone, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAlternates } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

const PRODUCTS: Record<string, { nameKey: string; descriptionKey: string; longDescriptionKey: string; featuresKey: string; priceKey: string; image?: string; isDigital?: boolean; containImage?: boolean }> = {
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
    image: "/shop/trackspeed-tshirt.png",
  },
  bundle: {
    nameKey: "products.bundle.name",
    descriptionKey: "products.bundle.description",
    longDescriptionKey: "products.bundle.longDescription",
    featuresKey: "products.bundle.features",
    priceKey: "products.bundle.price",
  },
  lifetime: {
    nameKey: "products.lifetime.name",
    descriptionKey: "products.lifetime.description",
    longDescriptionKey: "products.lifetime.longDescription",
    featuresKey: "products.lifetime.features",
    priceKey: "products.lifetime.price",
    image: "/photofinish_edit.png",
    isDigital: true,
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
    alternates: getAlternates(`/shop/${productId}`),
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
                  className={(product.isDigital || product.containImage) ? "object-contain p-8" : "object-cover"}
                />
              ) : product.isDigital ? (
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center"
                  style={{ background: "rgba(92,141,184,0.15)" }}
                >
                  <Smartphone className="w-14 h-14" style={{ color: "#5C8DB8" }} />
                </div>
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
                {product.isDigital && (
                  <span
                    className="text-sm ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t("products.lifetime.priceLabel")}
                  </span>
                )}
              </div>

              {/* CTA */}
              {product.isDigital ? (
                <a
                  href="https://apps.apple.com/app/trackspeed/id6757509163"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#5C8DB8] hover:bg-[#4a7da8] text-white rounded-full px-8 py-3 h-auto text-base w-full sm:w-auto">
                    {t("cart.getInApp")}
                  </Button>
                </a>
              ) : (
                <ProductDetailClient
                  productId={productId}
                  productName={name}
                  productPrice={price}
                />
              )}

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
                      {product.isDigital ? (
                        <Check className="w-4 h-4 shrink-0" style={{ color: "#5C8DB8" }} />
                      ) : (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: "#5C8DB8" }}
                        />
                      )}
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
