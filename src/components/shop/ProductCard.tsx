"use client";

import Image from "next/image";
import { ShoppingBag, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useCart } from "./CartProvider";
import { useTranslations } from "next-intl";

type Product = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  priceKey: string;
  priceLabelKey?: string;
  image?: string;
  isDigital?: boolean;
  containImage?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const t = useTranslations("shop");

  const name = t(product.nameKey);
  const description = t(product.descriptionKey);
  const price = parseFloat(t(product.priceKey));
  const inCart = items.find((i) => i.id === product.id);

  return (
    <div className="card-feature p-0 overflow-hidden flex flex-col group">
      {/* Clickable product image + info */}
      <Link href={`/shop/${product.id}`} className="flex flex-col flex-1">
        {/* Product image */}
        <div
          className="aspect-square flex items-center justify-center relative overflow-hidden"
          style={{ background: "rgba(92,141,184,0.08)" }}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={name}
              fill
              className={`${(product.isDigital || product.containImage) ? "object-contain p-6" : "object-cover"} transition-transform duration-300 group-hover:scale-105`}
            />
          ) : product.isDigital ? (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(92,141,184,0.15)" }}
            >
              <Smartphone className="w-10 h-10" style={{ color: "#5C8DB8" }} />
            </div>
          ) : (
            <ShoppingBag
              className="w-16 h-16"
              style={{ color: "rgba(92,141,184,0.3)" }}
            />
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h3>
          <p
            className="text-sm leading-relaxed mb-4 flex-1"
            style={{ color: "var(--text-muted)" }}
          >
            {description}
          </p>
          <div>
            <span
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {t("currency")}{price.toFixed(2)}
            </span>
            {product.priceLabelKey && (
              <span
                className="text-xs ml-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                {t(product.priceLabelKey)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action button */}
      <div className="px-5 pb-5">
        {product.isDigital ? (
          <a
            href="https://apps.apple.com/app/trackspeed/id6757509163"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#5C8DB8] hover:bg-[#4a7da8] text-white rounded-full px-5 w-full">
              {t("cart.getInApp")}
            </Button>
          </a>
        ) : (
          <Button
            onClick={() => addItem({ id: product.id, name, price })}
            className="bg-[#5C8DB8] hover:bg-[#4a7da8] text-white rounded-full px-5 w-full"
          >
            {inCart
              ? `${t("cart.added")} (${inCart.quantity})`
              : t("cart.addToCart")}
          </Button>
        )}
      </div>
    </div>
  );
}
