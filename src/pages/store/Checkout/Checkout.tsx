import { useEffect, useMemo, useState, type FormEvent } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiShoppingBag,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./Checkout.css";

import { useCreateCheckout } from "../../../hooks/useCreateCheckout";

import { useCartStore } from "../../../store/useCartStore";
import { useCompradorAuth } from "../../../hooks/store/comprador/useCompradorAuth";

const MAX_ITEMS_PER_CHECKOUT = 5;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CheckoutPage() {
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.items);

  const { buy, isCreatingCheckout, error } = useCreateCheckout();

  const { getStoredComprador, me } = useCompradorAuth();

  const [comprador, setComprador] = useState(getStoredComprador());

  const [isLoadingComprador, setIsLoadingComprador] = useState(true);

  /*
   * CARREGA O COMPRADOR
   * AUTENTICADO
   */

  useEffect(() => {
    async function loadComprador() {
      try {
        const currentComprador = await me();

        setComprador(currentComprador);
      } catch {
        /*
         * Se o token estiver inválido
         * ou expirado, volta para login.
         */

        navigate("/login", {
          replace: true,

          state: {
            from: "/checkout",
          },
        });
      } finally {
        setIsLoadingComprador(false);
      }
    }

    loadComprador();
  }, [me, navigate]);

  /*
   * TOTAL DE ITENS
   */

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  /*
   * SUBTOTAL VISUAL
   *
   * O BACKEND CONTINUA
   * SENDO A FONTE REAL
   * DO PREÇO.
   */

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  const hasExceededItemLimit = totalItems > MAX_ITEMS_PER_CHECKOUT;

  function handleBackToStore() {
    navigate("/loja");
  }

  /*
   * FINALIZA CHECKOUT
   */

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    if (hasExceededItemLimit) {
      return;
    }

    if (!comprador) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    try {
      await buy({
        items: cartItems.map((item) => ({
          productId: item.productId,

          variantId: item.variantId,

          quantity: item.quantity,
        })),
      });
    } catch {
      /*
       * O hook
       * useCreateCheckout
       * controla a mensagem
       * de erro.
       */
    }
  }

  /*
   * CARRINHO VAZIO
   */

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page-grid" />

        <section className="checkout-empty">
          <div className="checkout-empty-icon">
            <FiShoppingBag />
          </div>

          <span className="checkout-eyebrow">Atlética T.I. Store</span>

          <h1>Seu carrinho está vazio</h1>

          <p>Adicione algum produto antes de iniciar o pagamento.</p>

          <button
            type="button"
            className="checkout-primary-button"
            onClick={handleBackToStore}
          >
            <FiArrowLeft />
            Voltar para a loja
          </button>
        </section>
      </main>
    );
  }

  /*
   * CARREGANDO COMPRADOR
   */

  if (isLoadingComprador) {
    return (
      <main className="checkout-page">
        <div className="checkout-page-grid" />

        <section className="checkout-empty">
          <div className="checkout-empty-icon">
            <FiLock />
          </div>

          <span className="checkout-eyebrow">Atlética T.I. Store</span>

          <h1>Carregando sua conta</h1>

          <p>Estamos verificando seus dados antes de continuar o checkout.</p>

          <span className="checkout-spinner checkout-page-spinner" />
        </section>
      </main>
    );
  }

  /*
   * CHECKOUT
   */

  return (
    <main className="checkout-page">
      <div className="checkout-page-grid" />

      <div className="checkout-container">
        <button
          type="button"
          className="checkout-back-button"
          onClick={handleBackToStore}
        >
          <FiArrowLeft />
          Voltar para a loja
        </button>

        <header className="checkout-header">
          <div className="checkout-header-content">
            <span className="checkout-eyebrow">Atlética T.I. Store</span>

            <h1>
              Finalizar <em>compra.</em>
            </h1>

            <p>
              Revise seu pedido e confirme os dados da sua conta antes de
              continuar para o pagamento.
            </p>
          </div>

          <div className="checkout-secure-badge">
            <span className="checkout-secure-icon">
              <FiLock />
            </span>

            <div>
              <strong>Pagamento seguro</strong>

              <span>Processado pelo Mercado Pago</span>
            </div>
          </div>
        </header>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          {/*
           * RESUMO DO PEDIDO
           */}

          <section className="checkout-card checkout-order-card">
            <div className="checkout-card-header">
              <span className="checkout-section-number">01</span>

              <div>
                <h2>Resumo do pedido</h2>

                <p>
                  {totalItems} de {MAX_ITEMS_PER_CHECKOUT} itens permitidos
                </p>
              </div>
            </div>

            {hasExceededItemLimit && (
              <div className="checkout-error checkout-limit-error" role="alert">
                <strong>!</strong>

                <p>
                  É permitido no máximo {MAX_ITEMS_PER_CHECKOUT} itens por
                  compra. Remova algum item para continuar.
                </p>
              </div>
            )}

            <div className="checkout-items">
              {cartItems.map((item) => {
                const itemTotal = item.price * item.quantity;

                return (
                  <article className="checkout-item" key={item.variantId}>
                    <div className="checkout-item-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} />
                      ) : (
                        <span>{item.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <div className="checkout-item-content">
                      <div className="checkout-item-main">
                        <div>
                          <span className="checkout-item-category">
                            Produto oficial
                          </span>

                          <h3>{item.name}</h3>

                          <div className="checkout-item-details">
                            <span>
                              Tamanho
                              <strong>{item.size}</strong>
                            </span>

                            <span>
                              Quantidade
                              <strong>{item.quantity}</strong>
                            </span>
                          </div>
                        </div>

                        <strong className="checkout-item-price">
                          {formatCurrency(itemTotal)}
                        </strong>
                      </div>

                      <span className="checkout-unit-price">
                        {formatCurrency(item.price)} por unidade
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span>Subtotal</span>

                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <div className="checkout-summary-row">
                <span>Taxa de pagamento</span>

                <strong className="checkout-free">Grátis</strong>
              </div>

              <div className="checkout-summary-total">
                <div>
                  <span>Total</span>

                  <small>Valor final confirmado pelo servidor</small>
                </div>

                <strong>{formatCurrency(subtotal)}</strong>
              </div>
            </div>
          </section>

          {/*
           * COMPRADOR LOGADO
           */}

          <section className="checkout-card checkout-form-card">
            <div className="checkout-card-header">
              <span className="checkout-section-number">02</span>

              <div>
                <h2>Dados do comprador</h2>

                <p>Esta compra será vinculada à sua conta.</p>
              </div>
            </div>

            <div className="checkout-form">
              <div className="checkout-buyer-profile">
                <div className="checkout-buyer-avatar">
                  {comprador?.name?.charAt(0).toUpperCase() ?? "U"}
                </div>

                <div className="checkout-buyer-main">
                  <span className="checkout-buyer-label">Comprador</span>

                  <strong className="checkout-buyer-name">
                    {comprador?.name ?? "-"}
                  </strong>

                  <span className="checkout-buyer-email">
                    {comprador?.email ?? "-"}
                  </span>
                </div>

                <div className="checkout-buyer-verified">
                  <FiCheck />

                  <span>Identificado</span>
                </div>
              </div>

              <div className="checkout-buyer-data">
                <div className="checkout-buyer-data-item">
                  <span>CPF</span>

                  <strong>{comprador?.cpf ?? "-"}</strong>
                </div>

                <div className="checkout-buyer-data-item">
                  <span>RGM</span>

                  <strong>{comprador?.rgm ?? "-"}</strong>
                </div>

                <div className="checkout-buyer-data-item checkout-buyer-course">
                  <span>Curso</span>

                  <strong>{comprador?.curso ?? "-"}</strong>
                </div>

                <div className="checkout-buyer-data-item">
                  <span>Semestre</span>

                  <strong>
                    {comprador?.semestre ? `${comprador.semestre}º` : "-"}
                  </strong>
                </div>

                <div className="checkout-buyer-data-item">
                  <span>Telefone</span>

                  <strong>{comprador?.phone ?? "-"}</strong>
                </div>
              </div>

              {error && (
                <div
                  className="checkout-error checkout-payment-error"
                  role="alert"
                >
                  <strong>!</strong>

                  <p>{error}</p>
                </div>
              )}

              <div className="checkout-payment-info">
                <span className="checkout-payment-info-icon">
                  <FiCreditCard />
                </span>

                <div>
                  <strong>Checkout Mercado Pago</strong>

                  <p>O pagamento será concluído em ambiente protegido.</p>
                </div>

                <FiCheck className="checkout-payment-check" />
              </div>

              <button
                type="submit"
                className="checkout-submit-button"
                disabled={
                  isCreatingCheckout ||
                  cartItems.length === 0 ||
                  hasExceededItemLimit ||
                  !comprador
                }
              >
                <span>
                  {isCreatingCheckout
                    ? "Preparando pagamento..."
                    : `Pagar ${formatCurrency(subtotal)}`}
                </span>

                {isCreatingCheckout ? (
                  <span className="checkout-spinner" />
                ) : (
                  <FiArrowRight />
                )}
              </button>

              <p className="checkout-terms">
                Ao continuar, esta compra será vinculada à sua conta e o
                pagamento será processado pelo Mercado Pago.
              </p>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
