import { useCallback, useState } from "react";

import { api } from "../../../service/api";

interface LoginCompradorPayload {
  email: string;
  password: string;
}

export interface Comprador {
  id: string;

  name: string;

  email: string;

  cpf: string;

  phone: string | null;

  rgm: string;

  curso: string;

  semestre: number;

  atletica?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface LoginCompradorResponse {
  message: string;

  token: string;

  comprador: Comprador;
}

interface MeCompradorResponse {
  comprador: Comprador;
}

export const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";

export const COMPRADOR_USER_KEY = "@atletica-ti-client:user";

export function useCompradorAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * LOGIN
   */

  const login = useCallback(
    async ({ email, password }: LoginCompradorPayload) => {
      try {
        setIsLoading(true);

        setError(null);

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
          throw new Error("Informe o e-mail e a senha.");
        }

        const response = await api.post<LoginCompradorResponse>(
          "/comprador/auth/login",
          {
            email: normalizedEmail,

            password,
          },
        );

        localStorage.setItem(COMPRADOR_TOKEN_KEY, response.data.token);

        localStorage.setItem(
          COMPRADOR_USER_KEY,
          JSON.stringify(response.data.comprador),
        );

        return response.data;
      } catch (error: unknown) {
        let message = "Não foi possível realizar o login.";

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const requestError = error as {
            response?: {
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
        } else if (error instanceof Error) {
          message = error.message;
        }

        setError(message);

        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /*
   * PERFIL DO COMPRADOR
   */

  const me = useCallback(async () => {
    try {
      setIsLoading(true);

      setError(null);

      const token = localStorage.getItem(COMPRADOR_TOKEN_KEY);

      if (!token) {
        throw new Error("Comprador não autenticado.");
      }

      const response = await api.get<MeCompradorResponse>(
        "/comprador/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.setItem(
        COMPRADOR_USER_KEY,
        JSON.stringify(response.data.comprador),
      );

      return response.data.comprador;
    } catch (error: unknown) {
      let message = "Não foi possível carregar o perfil.";

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
      setIsLoading(false);
    }
  }, []);

  /*
   * LOGOUT
   */

  const logout = useCallback(() => {
    localStorage.removeItem(COMPRADOR_TOKEN_KEY);

    localStorage.removeItem(COMPRADOR_USER_KEY);

    setError(null);
  }, []);

  /*
   * COMPRADOR SALVO
   */

  const getStoredComprador = useCallback((): Comprador | null => {
    const stored = localStorage.getItem(COMPRADOR_USER_KEY);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as Comprador;
    } catch {
      localStorage.removeItem(COMPRADOR_USER_KEY);

      return null;
    }
  }, []);

  /*
   * TOKEN EXISTE?
   */

  const isAuthenticated = useCallback(() => {
    return Boolean(localStorage.getItem(COMPRADOR_TOKEN_KEY));
  }, []);

  /*
   * TOKEN
   */

  const getToken = useCallback(() => {
    return localStorage.getItem(COMPRADOR_TOKEN_KEY);
  }, []);

  return {
    login,
    me,
    logout,
    getStoredComprador,
    getToken,
    isAuthenticated,
    isLoading,
    error,
  };
}
