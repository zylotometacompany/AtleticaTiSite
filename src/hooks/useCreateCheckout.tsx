import { useCallback, useState } from "react";

import { api } from "../service/api";

export interface CheckoutCustomer {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  rgm?: string;
}

export interface CheckoutItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface CreateCheckoutPayload {
  customer: CheckoutCustomer;
  items: CheckoutItem[];
}

interface CreateCheckoutResponse {
  message: string;

  sale: {
    id: string;
    publicToken: string;
    status: string;
    total: number;
  };

  checkoutUrl: string;
}

export function useCreateCheckout() {
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(
    async (_atleticaSlug: string, payload: CreateCheckoutPayload) => {
      try {
        setIsCreatingCheckout(true);
        setError(null);


        const normalizedName = payload.customer.name.trim();

        const normalizedEmail = payload.customer.email.trim().toLowerCase();

        if (!normalizedName) {
          throw new Error("Informe o nome do comprador.");
        }

        if (!normalizedEmail) {
          throw new Error("Informe o e-mail do comprador.");
        }

        if (!Array.isArray(payload.items) || payload.items.length === 0) {
          throw new Error("O carrinho está vazio.");
        }

        const response = await api.post<CreateCheckoutResponse>(
          "/public/store/tiumcatletica/checkout",

          {
            customer: {
              ...payload.customer,

              name: normalizedName,
              email: normalizedEmail,

              cpf: payload.customer.cpf?.trim() || undefined,

              phone: payload.customer.phone?.trim() || undefined,

              rgm: payload.customer.rgm?.trim() || undefined,
            },

            items: payload.items,
          },
        );

        return response.data;
      } catch (error: unknown) {
        let message = "Não foi possível iniciar o pagamento.";

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const requestError = error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

          message = requestError.response?.data?.message ?? message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        setError(message);

        throw new Error(message);
      } finally {
        setIsCreatingCheckout(false);
      }
    },
    [],
  );

  const buy = useCallback(
    async (atleticaSlug: string, payload: CreateCheckoutPayload) => {
      const checkout = await createCheckout(atleticaSlug, payload);

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
