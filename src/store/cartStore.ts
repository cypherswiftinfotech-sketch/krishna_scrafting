"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  category: string;
}

export interface CartItemLocal {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItemLocal[];
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (product) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] });
        }
        
        // Sync with backend
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id, quantity: 1 }),
          });
        } catch (e) {
          console.error("Failed to sync cart", e);
        }
      },

      removeItem: async (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
        try {
          await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
        } catch (e) {}
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, i) => sum + Number(i.product.price) * i.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
