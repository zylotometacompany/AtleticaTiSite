import {
  useCallback,
  useState,
} from "react";
import { api } from "../../service/api";


export type StoreOrderStatus =
  | "PENDENTE"
  | "PAGA"
  | "CANCELADA";

export interface StoreOrderItem {
  id: string;

  quantity: number;

  unitPrice: number;

  subtotal: number;

  product: {
    id: string;

    code: string;

    name: string;

    imageUrl: string;
  };

  productVariant: {
    id: string;

    size: string;
  } | null;
}

export interface StoreOrder {
  id: string;

  publicToken: string;

  customerName: string;

  customerEmail: string;

  customerCpf: string | null;

  customerPhone: string | null;

  customerRgm: string | null;

  total: number;

  status: StoreOrderStatus;

  mercadoPagoPaymentId: string | null;

  mercadoPagoStatus: string | null;

  mercadoPagoStatusDetail: string | null;

  createdAt: string;

  updatedAt: string;

  paidAt: string | null;

  items: StoreOrderItem[];
}

export function useGetStoreOrder() {
  const [order, setOrder] =
    useState<StoreOrder | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const getOrder =
    useCallback(
      async (
        publicToken: string,
      ) => {
        try {
          setIsLoading(true);

          setError(null);

          const response =
            await api.get<StoreOrder>(
              `/public/store/orders/${publicToken}`,
            );

          setOrder(
            response.data,
          );

          return response.data;
        } catch (err: any) {
          const message =
            err?.response?.data
              ?.message ??
            "Erro ao buscar o pedido.";

          setError(message);

          throw err;
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );

  return {
    order,

    isLoading,

    error,

    getOrder,
  };
}