import {
  useCallback,
  useState,
} from "react";

import { api } from "../../../service/api";

interface RegisterCompradorPayload {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  rgm: string;
  curso: string;
  semestre: number;

  password?: string;

  registerToken?: string;
}

interface RegisterCompradorResponse {
  message: string;

  token?: string;

  comprador: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string | null;
    rgm: string;
    curso: string;
    semestre: number;
    atleticaId?: string;
    createdAt?: string;
  };
}

const COMPRADOR_TOKEN_KEY =
  "@atletica-ti-client:token";

const COMPRADOR_USER_KEY =
  "@atletica-ti-client:user";

const GOOGLE_REGISTER_TOKEN_KEY =
  "@atletica-ti-client:google-register-token";

const GOOGLE_REGISTER_USER_KEY =
  "@atletica-ti-client:google-register-user";

export function useRegisterComprador() {
  const [
    isRegistering,
    setIsRegistering,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const register =
    useCallback(
      async (
        payload:
          RegisterCompradorPayload,
      ) => {
        try {
          setIsRegistering(
            true,
          );

          setError(null);

          const normalizedName =
            payload.name.trim();

          const normalizedEmail =
            payload.email
              .trim()
              .toLowerCase();

          const normalizedCpf =
            payload.cpf.replace(
              /\D/g,
              "",
            );

          const normalizedPhone =
            payload.phone.replace(
              /\D/g,
              "",
            );

          const normalizedRgm =
            payload.rgm.trim();

          const normalizedCurso =
            payload.curso.trim();

          if (!normalizedName) {
            throw new Error(
              "Informe o nome completo.",
            );
          }

          if (!normalizedEmail) {
            throw new Error(
              "Informe o e-mail.",
            );
          }

          if (!normalizedCpf) {
            throw new Error(
              "Informe o CPF.",
            );
          }

          if (!normalizedPhone) {
            throw new Error(
              "Informe o telefone.",
            );
          }

          if (!normalizedRgm) {
            throw new Error(
              "Informe o RGM.",
            );
          }

          if (!normalizedCurso) {
            throw new Error(
              "Informe o curso.",
            );
          }

          if (
            !Number.isInteger(
              payload.semestre,
            ) ||
            payload.semestre <=
              0
          ) {
            throw new Error(
              "Informe um semestre válido.",
            );
          }

          /*
           * SENHA SÓ É OBRIGATÓRIA
           * NO CADASTRO TRADICIONAL.
           *
           * NO GOOGLE TEMOS
           * registerToken.
           */
          const isGoogleRegister =
            Boolean(
              payload.registerToken,
            );

          if (
            !isGoogleRegister &&
            (
              !payload.password ||
              payload.password.length <
                6
            )
          ) {
            throw new Error(
              "A senha deve possuir pelo menos 6 caracteres.",
            );
          }

          const response =
            await api.post<RegisterCompradorResponse>(
              "/comprador/auth/register",

              {
                name:
                  normalizedName,

                email:
                  normalizedEmail,

                cpf:
                  normalizedCpf,

                phone:
                  normalizedPhone,

                rgm:
                  normalizedRgm,

                curso:
                  normalizedCurso,

                semestre:
                  payload.semestre,

                /*
                 * Só envia password
                 * se existir.
                 */
                ...(payload.password
                  ? {
                      password:
                        payload.password,
                    }
                  : {}),

                /*
                 * Token temporário
                 * criado após validar
                 * a conta Google.
                 */
                ...(payload.registerToken
                  ? {
                      registerToken:
                        payload.registerToken,
                    }
                  : {}),
              },
            );

          /*
           * SE O BACKEND JÁ DEVOLVER
           * JWT DEFINITIVO, AUTENTICA.
           */
          if (
            response.data.token
          ) {
            localStorage.setItem(
              COMPRADOR_TOKEN_KEY,
              response.data.token,
            );

            localStorage.setItem(
              COMPRADOR_USER_KEY,
              JSON.stringify(
                response.data
                  .comprador,
              ),
            );
          }

          /*
           * LIMPA ESTADO TEMPORÁRIO
           * DO GOOGLE.
           */
          localStorage.removeItem(
            GOOGLE_REGISTER_TOKEN_KEY,
          );

          localStorage.removeItem(
            GOOGLE_REGISTER_USER_KEY,
          );

          return response.data;
        } catch (
          error: unknown
        ) {
          let message =
            "Não foi possível realizar o cadastro.";

          if (
            typeof error ===
              "object" &&
            error !== null &&
            "response" in
              error
          ) {
            const requestError =
              error as {
                response?: {
                  status?: number;

                  data?: {
                    message?: string;
                  };
                };
              };

            message =
              requestError.response
                ?.data?.message ??
              message;
          } else if (
            error instanceof
            Error
          ) {
            message =
              error.message;
          }

          setError(
            message,
          );

          throw new Error(
            message,
          );
        } finally {
          setIsRegistering(
            false,
          );
        }
      },
      [],
    );

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  return {
    register,
    clearError,
    isRegistering,
    error,
  };
}