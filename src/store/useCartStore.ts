import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string;

  name: string;
  size: string;

  price: number;
  quantity: number;
  stock: number;

  imageUrl?: string | null;
}

interface AddCartItem {
  productId: string;
  variantId: string;

  name: string;
  size: string;

  price: number;
  stock: number;

  imageUrl?: string | null;
}

interface CartState {
  atleticaSlug: string | null;
  items: CartItem[];

  addItem: (atleticaSlug: string, item: AddCartItem) => void;

  removeItem: (variantId: string) => void;

  increaseQuantity: (variantId: string) => void;

  decreaseQuantity: (variantId: string) => void;

  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      atleticaSlug: null,

      items: [],

      addItem: (atleticaSlug, newItem) =>
        set((state) => {
          const isDifferentStore =
            state.atleticaSlug !== null && state.atleticaSlug !== atleticaSlug;

          const currentItems = isDifferentStore ? [] : state.items;

          const existingItem = currentItems.find(
            (item) => item.variantId === newItem.variantId,
          );

          if (existingItem) {
            const nextQuantity = Math.min(
              existingItem.quantity + 1,
              newItem.stock,
            );

            return {
              atleticaSlug,

              items: currentItems.map((item) =>
                item.variantId === newItem.variantId
                  ? {
                      ...item,

                      quantity: nextQuantity,

                      stock: newItem.stock,
                    }
                  : item,
              ),
            };
          }

          return {
            atleticaSlug,

            items: [
              ...currentItems,

              {
                ...newItem,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (variantId) =>
        set((state) => {
          const nextItems = state.items.filter(
            (item) => item.variantId !== variantId,
          );

          return {
            items: nextItems,

            atleticaSlug: nextItems.length === 0 ? null : state.atleticaSlug,
          };
        }),

      increaseQuantity: (variantId) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.variantId !== variantId) {
              return item;
            }

            return {
              ...item,

              quantity: Math.min(item.quantity + 1, item.stock),
            };
          }),
        })),

      decreaseQuantity: (variantId) =>
        set((state) => {
          const nextItems = state.items
            .map((item) => {
              if (item.variantId !== variantId) {
                return item;
              }

              return {
                ...item,

                quantity: item.quantity - 1,
              };
            })
            .filter((item) => item.quantity > 0);

          return {
            items: nextItems,

            atleticaSlug: nextItems.length === 0 ? null : state.atleticaSlug,
          };
        }),

      clearCart: () =>
        set({
          atleticaSlug: null,
          items: [],
        }),
    }),

    {
      name: "athletix-store-cart",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        atleticaSlug: state.atleticaSlug,

        items: state.items,
      }),
    },
  ),
);
