import { useCallback, useState } from "react";

import { api } from "../service/api";

export interface CheckoutItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CreateCheckoutPayload {
  items: CheckoutItem[];
}

interface CreateCheckoutResponse {
  message: string;

  environment?: string;

  sale: {
    id: string;
    publicToken: string;
    status: string;
    total: number;
    totalItems?: number;
  };

  checkoutUrl: string;
}

const MAX_ITEMS_PER_CHECKOUT = 5;

const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";
export const COMPRADOR_USER_KEY = "@atletica-ti-client:user";


export function useCreateCheckout() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(async (payload: CreateCheckoutPayload) => {
    try {
      setIsCreatingCheckout(true);

      setError(null);

      /*
       * VALIDA CARRINHO
       */

      if (!Array.isArray(payload.items) || payload.items.length === 0) {
        throw new Error("O carrinho está vazio.");
      }

      const hasInvalidItem = payload.items.some(
        (item) =>
          !item.productId ||
          !item.variantId ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0,
      );

      if (hasInvalidItem) {
        throw new Error("O carrinho possui itens inválidos.");
      }

      /*
       * LIMITE DE 5 ITENS
       */

      const totalItems = payload.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );

      if (totalItems > MAX_ITEMS_PER_CHECKOUT) {
        throw new Error(
          `É permitido no máximo ${MAX_ITEMS_PER_CHECKOUT} itens por compra.`,
        );
      }

      /*
       * TOKEN DO COMPRADOR
       */

      const token = localStorage.getItem(COMPRADOR_TOKEN_KEY);

      if (!token) {
        throw new Error(
          "Você precisa estar autenticado para finalizar a compra.",
        );
      }

      /*
       * CRIA CHECKOUT
       */

      const response = await api.post<CreateCheckoutResponse>(
        "/public/store/tiumcatletica/checkout",

        {
          items: payload.items,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error: unknown) {
      let message = "Não foi possível iniciar o pagamento.";

      if (typeof error === "object" && error !== null && "response" in error) {
        const requestError = error as {
          response?: {
            status?: number;

            data?: {
              message?: string;
              error?: string;
            };
          };
        };

        message =
          requestError.response?.data?.message ??
          requestError.response?.data?.error ??
          message;

        /*
         * TOKEN INVÁLIDO
         * OU EXPIRADO
         */

        if (requestError.response?.status === 401) {
          localStorage.removeItem(COMPRADOR_TOKEN_KEY);
  localStorage.removeItem(COMPRADOR_USER_KEY);
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      setError(message);

      throw new Error(message);
    } finally {
      setIsCreatingCheckout(false);
    }
  }, []);

  const buy = useCallback(
    async (payload: CreateCheckoutPayload) => {
      const checkout = await createCheckout(payload);

      if (!checkout.checkoutUrl) {
        throw new Error("O link de pagamento não foi retornado.");
      }

      window.location.assign(checkout.checkoutUrl);
    },
    [createCheckout],
  );

  return {
    createCheckout,
    buy,
    isCreatingCheckout,
    error,
  };
}
