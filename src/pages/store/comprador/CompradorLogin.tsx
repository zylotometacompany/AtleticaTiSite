import { useState, type FormEvent } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiLock,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiUserPlus,
} from "react-icons/fi";

import { Link, useLocation, useNavigate } from "react-router-dom";

import "./CompradorAuth.css";
import { useCompradorAuth } from "../../../hooks/store/comprador/useCompradorAuth";

interface LocationState {
  from?: string;
}

export function CompradorLoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { login, isLoading, error } = useCompradorAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const state = location.state as LocationState | null;

  const from = state?.from ?? "/loja";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await login({
        email: email.trim(),

        password,
      });

      navigate(from, {
        replace: true,
      });
    } catch {
      /*
       * O hook controla
       * a mensagem de erro.
       */
    }
  }

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
            <span className="buyer-auth-eyebrow">Atlética T.I. Store</span>

            <h1>
              Continue sua <em>compra.</em>
            </h1>

            <p className="buyer-auth-description">
              Entre na sua conta para continuar o checkout e acompanhar seus
              pedidos.
            </p>

            <div className="buyer-auth-benefits">
              <div className="buyer-auth-benefit">
                <span>
                  <FiShoppingBag />
                </span>

                <div>
                  <strong>Seus pedidos</strong>

                  <p>Todas as suas compras ficam vinculadas à sua conta.</p>
                </div>
              </div>

              <div className="buyer-auth-benefit">
                <span>
                  <FiShield />
                </span>

                <div>
                  <strong>Compra protegida</strong>

                  <p>
                    Seus dados ajudam a identificar e proteger cada pedido
                    realizado.
                  </p>
                </div>
              </div>
            </div>

            <div className="buyer-auth-orb buyer-auth-orb-one" />

            <div className="buyer-auth-orb buyer-auth-orb-two" />
          </section>

          <section className="buyer-auth-card">
            <div className="buyer-auth-card-header">
              <span className="buyer-auth-card-icon">
                <FiLock />
              </span>

              <div>
                <h2>Entrar</h2>

                <p>Acesse sua conta para continuar.</p>
              </div>
            </div>

            <form className="buyer-auth-form" onSubmit={handleSubmit}>
              <div className="buyer-auth-field">
                <label htmlFor="buyer-login-email">E-mail</label>

                <div className="buyer-auth-input">
                  <FiMail />

                  <input
                    id="buyer-login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="buyer-auth-field">
                <label htmlFor="buyer-login-password">Senha</label>

                <div className="buyer-auth-input">
                  <FiLock />

                  <input
                    id="buyer-login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="buyer-auth-error" role="alert">
                  <strong>!</strong>

                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="buyer-auth-submit"
                disabled={isLoading}
              >
                <span>{isLoading ? "Entrando..." : "Entrar e continuar"}</span>

                {isLoading ? (
                  <span className="buyer-auth-spinner" />
                ) : (
                  <FiArrowRight />
                )}
              </button>

              <div className="buyer-auth-divider">
                <span />

                <p>ou</p>

                <span />
              </div>

              <Link
                to="/register"
                state={{
                  from,
                }}
                className="buyer-auth-secondary"
              >
                <FiUserPlus />
                Criar minha conta
              </Link>

              <p className="buyer-auth-footer">
                Sua conta é usada para identificar suas compras e facilitar o
                acompanhamento dos pedidos.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default CompradorLoginPage;
