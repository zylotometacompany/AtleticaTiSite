import { useCallback, useState } from "react";

import { api } from "../../../service/api";

interface LoginCompradorPayload {
  email: string;
  password: string;
}

interface GoogleLoginPayload {
  credential: string;
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
  atleticaId?: string;

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

interface GoogleLoginResponse {
  flow: "LOGIN";
  token: string;
  comprador: Comprador;
}

interface GoogleRegisterResponse {
  flow: "REGISTER";
  registerToken: string;

  googleUser: {
    googleSub?: string;
    name: string;
    email: string;
    picture: string | null;
  };
}

type GoogleAuthResponse = GoogleLoginResponse | GoogleRegisterResponse;

interface MeCompradorResponse {
  comprador: Comprador;
}

export const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";

export const COMPRADOR_USER_KEY = "@atletica-ti-client:user";

export const GOOGLE_REGISTER_TOKEN_KEY =
  "@atletica-ti-client:google-register-token";

export const GOOGLE_REGISTER_USER_KEY =
  "@atletica-ti-client:google-register-user";

export function useCompradorAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * SALVA SESSÃO
   */
  const saveSession = useCallback((token: string, comprador: Comprador) => {
    localStorage.setItem(COMPRADOR_TOKEN_KEY, token);

    localStorage.setItem(COMPRADOR_USER_KEY, JSON.stringify(comprador));
  }, []);

  /*
   * LOGIN TRADICIONAL
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

        saveSession(response.data.token, response.data.comprador);

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
    [saveSession],
  );

  /*
   * LOGIN / REGISTER
   * COM GOOGLE
   */
  const loginWithGoogle = useCallback(
    async ({ credential }: GoogleLoginPayload) => {
      try {
        setIsLoading(true);

        setError(null);

        if (!credential) {
          throw new Error("Credencial do Google não informada.");
        }

        const response = await api.post<GoogleAuthResponse>(
          "/comprador/auth/google",

          {
            credential,
          },
        );

        /*
         * JÁ EXISTE
         * → LOGIN DIRETO
         */
        if (response.data.flow === "LOGIN") {
          saveSession(response.data.token, response.data.comprador);

          /*
           * LIMPA POSSÍVEL
           * CADASTRO GOOGLE ANTIGO
           */
          localStorage.removeItem(GOOGLE_REGISTER_TOKEN_KEY);

          localStorage.removeItem(GOOGLE_REGISTER_USER_KEY);

          return response.data;
        }

        /*
         * NÃO EXISTE
         * → CADASTRO PENDENTE
         */
        localStorage.setItem(
          GOOGLE_REGISTER_TOKEN_KEY,
          response.data.registerToken,
        );

        localStorage.setItem(
          GOOGLE_REGISTER_USER_KEY,
          JSON.stringify(response.data.googleUser),
        );

        return response.data;
      } catch (error: unknown) {
        let message = "Não foi possível autenticar com o Google.";

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
    [saveSession],
  );

  /*
   * PERFIL
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

    localStorage.removeItem(GOOGLE_REGISTER_TOKEN_KEY);

    localStorage.removeItem(GOOGLE_REGISTER_USER_KEY);

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    loginWithGoogle,

    me,

    logout,

    getStoredComprador,
    getToken,
    isAuthenticated,

    clearError,

    isLoading,
    error,
  };
}
