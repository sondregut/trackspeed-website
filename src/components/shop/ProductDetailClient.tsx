"use client";

import { Button } from "@/components/ui/button";
import { CartProvider, useCart } from "./CartProvider";
import CartDrawer from "./CartDrawer";
import { useTranslations } from "next-intl";

function AddToCartButton({ productId, productName, productPrice }: {
  productId: string;
  productName: string;
  productPrice: number;
}) {
  const { addItem, items } = useCart();
  const t = useTranslations("shop");
  const inCart = items.find((i) => i.id === productId);

  return (
    <Button
      onClick={() => addItem({ id: productId, name: productName, price: productPrice })}
      className="bg-[#5C8DB8] hover:bg-[#4a7da8] text-white rounded-full px-8 py-3 h-auto text-base w-full sm:w-auto"
    >
      {inCart
        ? `${t("cart.added")} (${inCart.quantity})`
        : t("cart.addToCart")}
    </Button>
  );
}

export default function ProductDetailClient({ productId, productName, productPrice }: {
  productId: string;
  productName: string;
  productPrice: number;
}) {
  return (
    <CartProvider>
      <AddToCartButton
        productId={productId}
        productName={productName}
        productPrice={productPrice}
      />
      <CartDrawer />
    </CartProvider>
  );
}
