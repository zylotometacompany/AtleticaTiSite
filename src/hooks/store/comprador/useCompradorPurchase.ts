import { useCallback, useState } from "react";

import { api } from "../../../service/api";

export interface CompradorPurchaseItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;

  product: {
    id: string;
    code: string;
    name: string;
  };

  productVariant: {
    id: string;
    size: string;
  };
}

export interface CompradorPurchase {
  id: string;
  publicToken: string;
  status: string;
  total: number;

  mercadoPagoStatus: string | null;

  mercadoPagoStatusDetail: string | null;

  paymentUrl: string | null;

  paidAt: string | null;

  createdAt: string;
  updatedAt: string;

  items: CompradorPurchaseItem[];
}

interface PurchasesResponse {
  purchases: CompradorPurchase[];
}

interface PurchaseResponse {
  purchase: CompradorPurchase;
}

const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";

export function useCompradorPurchases() {
  const [purchases, setPurchases] = useState<CompradorPurchase[]>([]);

  const [purchase, setPurchase] = useState<CompradorPurchase | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function getToken() {
    const token = localStorage.getItem(COMPRADOR_TOKEN_KEY);

    if (!token) {
      throw new Error("Comprador não autenticado.");
    }

    return token;
  }

  function getErrorMessage(error: unknown, fallback: string) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const requestError = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      };

      return (
        requestError.response?.data?.message ??
        requestError.response?.data?.error ??
        fallback
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }

  /*
   * LISTA TODAS AS
   * COMPRAS DO LOGADO
   */
  const loadPurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();

      const response = await api.get<PurchasesResponse>(
        "/comprador/store/purchases",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPurchases(response.data.purchases);

      return response.data.purchases;
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Não foi possível carregar suas compras.",
      );

      setError(message);

      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
   * BUSCA UM PEDIDO
   * ESPECÍFICO
   */
  const loadPurchase = useCallback(async (publicToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!publicToken.trim()) {
        throw new Error("Pedido não informado.");
      }

      const token = getToken();

      const response = await api.get<PurchaseResponse>(
        `/comprador/store/purchases/${publicToken}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPurchase(response.data.purchase);

      return response.data.purchase;
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Não foi possível carregar o pedido.",
      );

      setError(message);

      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function clearPurchase() {
    setPurchase(null);
  }

  return {
    // dados
    purchases,
    purchase,

    // ações
    loadPurchases,
    loadPurchase,
    clearPurchase,

    // estado
    isLoading,
    error,
  };
}
