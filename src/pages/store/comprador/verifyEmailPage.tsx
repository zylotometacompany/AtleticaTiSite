import {
  FiCheckCircle,
  FiLoader,
  FiMail,
  FiXCircle,
} from "react-icons/fi";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { api } from "../../../service/api";

import "./VerifyEmailPage.css";

const COMPRADOR_TOKEN_KEY =
  "@atletica-ti-client:token";

const COMPRADOR_USER_KEY =
  "@atletica-ti-client:user";

interface VerifyEmailResponse {
  message: string;

  token: string;

  comprador: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string | null;
    rgm: string;
    curso: string;
    semestre: number;
    atleticaId: string;

    atletica: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

type VerifyStatus =
  | "loading"
  | "success"
  | "error";

export default function VerifyEmailPage() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] =
    useSearchParams();

  const [
    status,
    setStatus,
  ] =
    useState<VerifyStatus>(
      "loading",
    );

  const [
    message,
    setMessage,
  ] =
    useState(
      "Estamos validando seu endereço de e-mail.",
    );

  useEffect(() => {
    async function verifyEmail() {
      const token =
        searchParams.get(
          "token",
        );

      if (!token) {
        setStatus("error");

        setMessage(
          "Este link de confirmação é inválido.",
        );

        return;
      }

      try {
        const response =
          await api.post<VerifyEmailResponse>(
            "/comprador/auth/verify-email",

            {
              token,
            },
          );

        localStorage.setItem(
          COMPRADOR_TOKEN_KEY,
          response.data.token,
        );

        localStorage.setItem(
          COMPRADOR_USER_KEY,
          JSON.stringify(
            response.data.comprador,
          ),
        );

        setStatus(
          "success",
        );

        setMessage(
          "Seu e-mail foi confirmado e sua conta está ativa.",
        );

        setTimeout(() => {
          navigate(
            "/minhas-compras",
            {
              replace: true,
            },
          );
        }, 1800);
      } catch (
        requestError: unknown
      ) {
        let errorMessage =
          "Não foi possível confirmar seu e-mail.";

        if (
          typeof requestError ===
            "object" &&
          requestError !== null &&
          "response" in
            requestError
        ) {
          const error =
            requestError as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            };

          errorMessage =
            error.response?.data
              ?.message ??
            errorMessage;
        }

        setStatus(
          "error",
        );

        setMessage(
          errorMessage,
        );
      }
    }

    verifyEmail();
  }, [
    navigate,
    searchParams,
  ]);

  return (
    <main className="verify-email-page">
      <div className="verify-email-grid" />

      <div className="verify-email-orb verify-email-orb-one" />

      <div className="verify-email-orb verify-email-orb-two" />

      <section className="verify-email-card">
        <div
          className={`verify-email-icon verify-email-icon--${status}`}
        >
          {status ===
            "loading" && (
            <FiLoader />
          )}

          {status ===
            "success" && (
            <FiCheckCircle />
          )}

          {status ===
            "error" && (
            <FiXCircle />
          )}
        </div>

        <span className="verify-email-eyebrow">
          Atlética T.I. Store
        </span>

        {status ===
          "loading" && (
          <>
            <h1>
              Confirmando seu{" "}
              <em>e-mail.</em>
            </h1>

            <p>
              {message}
            </p>

            <div className="verify-email-loading">
              <span />
              <span />
              <span />
            </div>
          </>
        )}

        {status ===
          "success" && (
          <>
            <h1>
              Conta{" "}
              <em>ativada.</em>
            </h1>

            <p>
              {message}
            </p>

            <div className="verify-email-notice verify-email-notice--success">
              <FiMail />

              <div>
                <strong>
                  Tudo certo!
                </strong>

                <span>
                  Você será levado
                  para suas compras.
                </span>
              </div>
            </div>
          </>
        )}

        {status ===
          "error" && (
          <>
            <h1>
              Não foi possível{" "}
              <em>confirmar.</em>
            </h1>

            <p>
              {message}
            </p>

            <div className="verify-email-notice verify-email-notice--error">
              <FiMail />

              <div>
                <strong>
                  Link inválido
                  ou expirado
                </strong>

                <span>
                  Você pode voltar
                  ao login e tentar
                  novamente.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="verify-email-button"
              onClick={() =>
                navigate(
                  "/login",
                )
              }
            >
              Voltar para o login
            </button>
          </>
        )}
      </section>
    </main>
  );
}