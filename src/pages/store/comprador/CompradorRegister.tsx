import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { api } from "../../../service/api";

import "./CompradorAuth.css";

interface LocationState {
  from?: string;
}



interface Comprador {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  rgm: string;
  curso: string;
  semestre: number;
  atleticaId: string;

  atletica?: {
    id: string;
    name: string;
    slug: string;
  };
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
    name: string;
    email: string;
    picture: string | null;
  };
}

type GoogleAuthResponse =
  | GoogleLoginResponse
  | GoogleRegisterResponse;



const COMPRADOR_TOKEN_KEY =
  "@atletica-ti-client:token";

const COMPRADOR_USER_KEY =
  "@atletica-ti-client:user";

const GOOGLE_REGISTER_TOKEN_KEY =
  "@atletica-ti-client:google-register-token";

const GOOGLE_REGISTER_USER_KEY =
  "@atletica-ti-client:google-register-user";

export default function CompradorRegisterPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const googleButtonRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const [
    isGoogleLoading,
    setIsGoogleLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const state =
    location.state as
      | LocationState
      | null;

  const from =
    state?.from ??
    "/minha-conta/compras";

  /*
   * ========================================
   * RESPOSTA DO GOOGLE
   * ========================================
   */
  async function handleGoogleCredential(
    credential: string,
  ) {
    try {
      setIsGoogleLoading(
        true,
      );

      setError(null);

      const response =
        await api.post<GoogleAuthResponse>(
          "/comprador/auth/google",
          {
            credential,
          },
        );

      /*
       * ========================================
       * COMPRADOR JÁ EXISTE
       *
       * GOOGLE FUNCIONA COMO LOGIN
       * ========================================
       */
      if (
        response.data.flow ===
        "LOGIN"
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

        navigate(
          from,
          {
            replace: true,
          },
        );

        return;
      }

      /*
       * ========================================
       * NOVO COMPRADOR
       *
       * GUARDA TOKEN TEMPORÁRIO
       * E IDENTIDADE GOOGLE
       * ========================================
       */
      localStorage.setItem(
        GOOGLE_REGISTER_TOKEN_KEY,
        response.data
          .registerToken,
      );

      localStorage.setItem(
        GOOGLE_REGISTER_USER_KEY,
        JSON.stringify(
          response.data
            .googleUser,
        ),
      );

      navigate(
        "/completar-cadastro",
        {
          state: {
            from,

            googleUser:
              response.data
                .googleUser,
          },
        },
      );
    } catch (
      requestError: unknown
    ) {
      let message =
        "Não foi possível continuar com o Google.";

      if (
        typeof requestError ===
          "object" &&
        requestError !== null &&
        "response" in
          requestError
      ) {
        const apiError =
          requestError as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

        message =
          apiError.response
            ?.data?.message ??
          message;
      } else if (
        requestError instanceof
        Error
      ) {
        message =
          requestError.message;
      }

      setError(
        message,
      );
    } finally {
      setIsGoogleLoading(
        false,
      );
    }
  }

  /*
   * ========================================
   * INICIALIZA GOOGLE IDENTITY SERVICES
   * ========================================
   */
  useEffect(() => {
    const googleClientId =
      import.meta.env
        .GOOGLE_CLIENT_ID;

    if (
      !googleClientId
    ) {
      setError(
        "Google Client ID não configurado.",
      );

      return;
    }

    let attempts = 0;

    const initializeGoogle =
      () => {
        /*
         * SCRIPT AINDA NÃO
         * TERMINOU DE CARREGAR
         */
        if (
          !window.google
            ?.accounts?.id
        ) {
          attempts += 1;

          if (
            attempts < 20
          ) {
            window.setTimeout(
              initializeGoogle,
              250,
            );

            return;
          }

          setError(
            "Não foi possível carregar a autenticação do Google.",
          );

          return;
        }

        if (
          !googleButtonRef.current
        ) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id:
            googleClientId,

          callback:
            (
              googleResponse,
            ) => {
              void handleGoogleCredential(
                googleResponse
                  .credential,
              );
            },
        });

        /*
         * EVITA DUPLICAR BOTÃO
         * EM HOT RELOAD
         */
        googleButtonRef.current.innerHTML =
          "";

        const width =
          Math.min(
            googleButtonRef
              .current
              .clientWidth ||
              360,

            400,
          );

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme:
              "outline",

            size:
              "large",

            text:
              "continue_with",

            shape:
              "rectangular",

            width,
          },
        );
      };

    initializeGoogle();
  }, []);

  /*
   * ========================================
   * VOLTAR
   * ========================================
   */
  function handleBack() {
    navigate(
      "/loja",
    );
  }

  return (
    <main
      className="
        buyer-auth-page
        buyer-auth-register-page
      "
    >
      <div
        className="buyer-auth-grid"
      />

      <div
        className="buyer-auth-container"
      >
        <button
          type="button"
          className="buyer-auth-back"
          onClick={
            handleBack
          }
        >
          <FiArrowLeft />

          Voltar para a loja
        </button>

        <div
          className="
            buyer-auth-layout
            buyer-auth-register-layout
          "
        >
          {/*
           * ========================================
           * HERO
           * ========================================
           */}
          <section
            className="buyer-auth-hero"
          >
            <span
              className="buyer-auth-eyebrow"
            >
              Atlética T.I.
              Store
            </span>

            <h1>
              Sua conta começa{" "}
              <em>
                com você.
              </em>
            </h1>

            <p
              className="buyer-auth-description"
            >
              Use sua conta
              Google para
              confirmar sua
              identidade e
              continuar seu
              cadastro na
              Atlética T.I.
            </p>

            <div
              className="buyer-auth-benefits"
            >
              <div
                className="buyer-auth-benefit"
              >
                <span>
                  <FiShield />
                </span>

                <div>
                  <strong>
                    E-mail
                    verificado
                  </strong>

                  <p>
                    Sua conta
                    Google confirma
                    automaticamente
                    seu endereço de
                    e-mail.
                  </p>
                </div>
              </div>

              <div
                className="buyer-auth-benefit"
              >
                <span>
                  <FiShoppingBag />
                </span>

                <div>
                  <strong>
                    Suas compras
                  </strong>

                  <p>
                    Seus pedidos
                    ficam vinculados
                    à sua conta.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                buyer-auth-orb
                buyer-auth-orb-one
              "
            />

            <div
              className="
                buyer-auth-orb
                buyer-auth-orb-two
              "
            />
          </section>

          {/*
           * ========================================
           * CARD GOOGLE
           * ========================================
           */}
          <section
            className="buyer-auth-card"
          >
            <div
              className="buyer-auth-card-header"
            >
              <span
                className="buyer-auth-card-icon"
              >
                <FiLock />
              </span>

              <div>
                <h2>
                  Criar conta
                </h2>

                <p>
                  Primeiro,
                  confirme sua
                  identidade.
                </p>
              </div>
            </div>

            <div
              className="buyer-auth-form"
            >
              <div
                className="buyer-google-intro"
              >
                <div
                  className="buyer-google-check"
                >
                  <FiCheckCircle />
                </div>

                <div>
                  <strong>
                    Continue com
                    sua conta
                    Google
                  </strong>

                  <p>
                    Seu nome e
                    e-mail serão
                    obtidos da
                    conta Google.
                    Depois você
                    informará CPF,
                    RGM, curso e
                    semestre.
                  </p>
                </div>
              </div>

              {/*
               * GOOGLE RENDERIZA
               * O BOTÃO AQUI
               */}
              <div
                className="buyer-google-button-wrapper"
              >
                <div
                  ref={
                    googleButtonRef
                  }
                  className="buyer-google-button"
                />

                {isGoogleLoading && (
                  <div
                    className="buyer-google-loading"
                  >
                    <span
                      className="buyer-auth-spinner"
                    />

                    <p>
                      Validando sua
                      conta Google...
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div
                  className="buyer-auth-error"
                  role="alert"
                >
                  <strong>
                    !
                  </strong>

                  <p>
                    {error}
                  </p>
                </div>
              )}

              <div
                className="buyer-auth-divider"
              >
                <span />

                <p>
                  já possui conta?
                </p>

                <span />
              </div>

              <Link
                to="/login"
                state={{
                  from,
                }}
                className="buyer-auth-secondary"
              >
                <FiLock />

                Entrar na minha
                conta
              </Link>

              <p
                className="buyer-auth-footer"
              >
                A Atlética T.I.
                recebe apenas as
                informações
                necessárias da sua
                conta Google para
                identificação e
                autenticação.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}