import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { api } from "../service/api";


export type ProductSize =
  | "P"
  | "M"
  | "G"
  | "GG"
  | "UNICO";

export interface ProductVariant {
  id: string;
  size: ProductSize;
  stock: number;
  available: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  active: boolean;

  totalStock: number;
  available: boolean;

  variants: ProductVariant[];
}

interface StoreResponse {
  atletica: {
    id: string;
    name: string;
    slug: string;
  };

  products: Product[];
}

export function useGetProducts() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [atletica, setAtletica] =
    useState<StoreResponse["atletica"] | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const getProducts =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response =
          await api.get<StoreResponse>(
            "/store/tiumcatletica/products",
          );

        console.log(response.data);

        setProducts(
          response.data.products,
        );

        setAtletica(
          response.data.atletica,
        );

        return response.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os produtos.";

        setError(message);
        setProducts([]);
        setAtletica(null);

        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    products,
    atletica,
    isLoading,
    error,
    refetch: getProducts,
  };
}