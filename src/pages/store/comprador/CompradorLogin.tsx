import { useEffect, useRef } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";

import { useLocation, useNavigate } from "react-router-dom";

import "./CompradorAuth.css";

import { useCompradorAuth } from "../../../hooks/store/comprador/useCompradorAuth";

interface LocationState {
  from?: string;
}

export function CompradorLoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const { loginWithGoogle, isLoading, error } = useCompradorAuth();

  const state = location.state as LocationState | null;

  const from = state?.from ?? "/minha-conta/compras";

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      return;
    }

    let attempts = 0;

    function initializeGoogle() {
      if (!window.google?.accounts?.id) {
        attempts += 1;

        if (attempts < 20) {
          window.setTimeout(initializeGoogle, 250);
        }

        return;
      }

      if (!googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,

        callback: async (googleResponse) => {
          try {
            const result = await loginWithGoogle({
              credential: googleResponse.credential,
            });

            if (result.flow === "LOGIN") {
              navigate(from, {
                replace: true,
              });

              return;
            }

            navigate("/completar-cadastro", {
              state: {
                from,

                googleUser: result.googleUser,
              },
            });
          } catch {
            /*
             * Hook controla erro.
             */
          }
        },
      });

      googleButtonRef.current.innerHTML = "";

      const width = Math.min(googleButtonRef.current.clientWidth || 360, 400);

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",

        size: "large",

        text: "continue_with",

        shape: "rectangular",

        width,
      });
    }

    initializeGoogle();
  }, [from, loginWithGoogle, navigate]);

  function handleBack() {
    navigate("/loja");
  }

  return (
    <main className="buyer-auth-page">
      <div className="buyer-auth-grid" />

      <div className="buyer-auth-container">
        <button type="button" className="buyer-auth-back" onClick={handleBack}>
          <FiArrowLeft />
          Voltar para a loja
        </button>

        <div className="buyer-auth-layout">
          <section className="buyer-auth-hero">
            <span className="buyer-auth-eyebrow">
              Atlética T.I. • Sua conta
            </span>

            <h1>
              Bem-vindo <em>de volta.</em>
            </h1>

            <p className="buyer-auth-description">
              Entre com sua conta Google para acessar suas compras, pedidos e
              dados da Atlética T.I.
            </p>

            <div className="buyer-auth-benefits">
              <div className="buyer-auth-benefit">
                <span>
                  <FiShoppingBag />
                </span>

                <div>
                  <strong>Seus pedidos</strong>

                  <p>Consulte suas compras e acompanhe cada pedido.</p>
                </div>
              </div>

              <div className="buyer-auth-benefit">
                <span>
                  <FiUser />
                </span>

                <div>
                  <strong>Sua conta</strong>

                  <p>Acesso rápido usando sua conta Google.</p>
                </div>
              </div>
            </div>

            <div className="buyer-auth-orb buyer-auth-orb-one" />

            <div className="buyer-auth-orb buyer-auth-orb-two" />
          </section>

          <section className="buyer-auth-card">
            <div className="buyer-auth-card-header">
              <span className="buyer-auth-card-icon">
                <FiUser />
              </span>

              <div>
                <h2>Entrar</h2>

                <p>Continue com sua conta Google.</p>
              </div>
            </div>

            <div className="buyer-auth-form">
              <div className="buyer-google-login-block">
                <div className="buyer-google-login-icon">
                  <FiShield />
                </div>

                <div>
                  <strong>Acesso seguro</strong>

                  <p>Use sua conta Google para entrar na plataforma.</p>
                </div>
              </div>

              <div ref={googleButtonRef} className="buyer-google-button" />

              {isLoading && (
                <div className="buyer-google-loading">
                  <span className="buyer-auth-spinner" />

                  <p>Validando sua conta...</p>
                </div>
              )}

              {error && (
                <div className="buyer-auth-error" role="alert">
                  <strong>!</strong>

                  <p>{error}</p>
                </div>
              )}

              <div className="buyer-auth-divider">
                <span />
                <p>primeiro acesso?</p>
                <span />
              </div>

              <button
                type="button"
                className="buyer-create-account"
                onClick={() =>
                  navigate("/register", {
                    state: {
                      from,
                    },
                  })
                }
              >
                <div className="buyer-create-account-icon">
                  <FiUserPlus />
                </div>

                <div className="buyer-create-account-content">
                  <strong>Criar uma conta</strong>

                  <span>Comece seu cadastro usando sua conta Google.</span>
                </div>

                <FiArrowRight className="buyer-create-account-arrow" />
              </button>

              <div className="buyer-auth-security">
                <FiShield />

                <p>
                  O Google confirma sua identidade e seu e-mail antes do acesso
                  à plataforma.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CompradorLoginPage;
