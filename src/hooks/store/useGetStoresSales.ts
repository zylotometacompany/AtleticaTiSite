import { useCallback, useEffect, useState } from "react";

import { api } from "../../services/api";

export type StoreSaleStatus =
  | "PENDENTE"
  | "PAGA"
  | "CANCELADA";

export interface StoreSaleItem {
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

export interface StoreSale {
  id: string;
  publicToken: string;

  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  customerRgm: string;

  total: number;
  totalItems: number;

  status: StoreSaleStatus;

  mercadoPagoPreferenceId: string | null;

  createdAt: string;
  updatedAt: string;

  items: StoreSaleItem[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StoreSalesResponse {
  sales: StoreSale[];
  pagination: Pagination;
}

interface GetStoreSalesParams {
  page?: number;
  limit?: number;
  status?: StoreSaleStatus;
  search?: string;
}

export function useGetStoreSales() {
  const [sales, setSales] = useState<StoreSale[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const getSales = useCallback(
    async ({
      page = 1,
      limit = 20,
      status,
      search,
    }: GetStoreSalesParams = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await api.get<StoreSalesResponse>(
            "/admin/store/sales",
            {
              params: {
                page,
                limit,
                status,
                search,
              },
            },
          );

        setSales(response.data.sales);
        setPagination(
          response.data.pagination,
        );

        return response.data;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          "Erro ao buscar as vendas.";

        setError(message);

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    getSales();
  }, [getSales]);

  return {
    sales,
    pagination,

    isLoading,
    error,

    getSales,
  };
}