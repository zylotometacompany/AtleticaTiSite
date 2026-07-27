import {
  useCallback,
  useState,
} from "react";
import { api } from "../../service/api";


export function useDownloadReceipt() {
  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const downloadReceipt =
    useCallback(
      async (
        publicToken: string,
      ) => {
        try {
          setIsDownloading(
            true,
          );

          setError(null);

          const response =
            await api.get(
              `/public/store/orders/${publicToken}/receipt`,
              {
                responseType:
                  "blob",
              },
            );

          const url =
            URL.createObjectURL(
              response.data,
            );

          window.open(
            url,
            "_blank",
          );
        } catch (err: any) {
          const message =
            err?.response?.data
              ?.message ??
            "Erro ao baixar comprovante.";

          setError(message);

          throw err;
        } finally {
          setIsDownloading(
            false,
          );
        }
      },
      [],
    );

  return {
    downloadReceipt,

    isDownloading,

    error,
  };
}