"use client";

import { CartProvider } from "./CartProvider";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";

const PRODUCTS = [
  {
    id: "tripod",
    nameKey: "products.tripod.name",
    descriptionKey: "products.tripod.description",
    priceKey: "products.tripod.price",
    image: "/shop/tripod.png",
    containImage: true,
  },
  {
    id: "tshirt",
    nameKey: "products.tshirt.name",
    descriptionKey: "products.tshirt.description",
    priceKey: "products.tshirt.price",
    image: "/shop/trackspeed-tshirt.webp",
  },
  {
    id: "bundle",
    nameKey: "products.bundle.name",
    descriptionKey: "products.bundle.description",
    priceKey: "products.bundle.price",
  },
];

export default function ProductGrid() {
  return (
    <CartProvider>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
