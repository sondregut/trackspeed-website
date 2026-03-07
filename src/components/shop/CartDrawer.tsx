"use client";

import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./CartProvider";
import { useTranslations } from "next-intl";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen } = useCart();
  const t = useTranslations("shop");

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#5C8DB8] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#4a7da8] transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="text-sm font-bold">{totalItems}</span>
        )}
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>{t("cart.title")}</SheetTitle>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t("cart.itemCount", { count: totalItems })}
            </p>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart
                  className="w-12 h-12 mx-auto mb-3"
                  style={{ color: "var(--border-light)" }}
                />
                <p style={{ color: "var(--text-muted)" }}>{t("cart.empty")}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start gap-3 py-4">
                    {/* Item placeholder */}
                    <div
                      className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(92,141,184,0.08)" }}
                    >
                      <ShoppingCart
                        className="w-5 h-5"
                        style={{ color: "rgba(92,141,184,0.3)" }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-semibold truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.name}
                      </h4>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t("currency")}{item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span
                          className="text-sm font-medium w-6 text-center"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="ml-auto text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <span
                      className="text-sm font-bold flex-shrink-0"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t("currency")}{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <SheetFooter className="border-t">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("cart.subtotal")}
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t("currency")}{totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full bg-[#5C8DB8] hover:bg-[#4a7da8] text-white rounded-full"
                  disabled
                >
                  {t("cart.checkout")} — {t("cart.comingSoon")}
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
