import {
  useEffect,
} from "react";

import {
  useGetStoreOrder,
} from "./useGetStoreOrder";

export function useWaitPayment(
  publicToken: string,
) {
  const {
    order,

    getOrder,

    isLoading,

    error,
  } =
    useGetStoreOrder();

  useEffect(() => {
    if (!publicToken) {
      return;
    }

    getOrder(publicToken);

    const interval =
      setInterval(
        async () => {
          const sale =
            await getOrder(
              publicToken,
            );

          if (
            sale.status ===
            "PAGA"
          ) {
            clearInterval(
              interval,
            );
          }
        },
        2000,
      );

    return () =>
      clearInterval(
        interval,
      );
  }, [
    publicToken,
    getOrder,
  ]);

  return {
    order,

    isLoading,

    error,
  };
}