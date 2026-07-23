import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiLock,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";



import "./Checkout.css";
import { useCreateCheckout } from "../../../hooks/useCreateCheckout";
import { useCartStore } from "../../../store/useCartStore";

function formatCurrency(value: number) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(value);
}

export function CheckoutPage() {
  const { atleticaSlug = "" } =
    useParams();

  const navigate = useNavigate();

  const cartItems = useCartStore(
    (state) => state.items,
  );

  const {
    buy,
    isCreatingCheckout,
    error,
  } = useCreateCheckout();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [rgm, setRgm] =
    useState("");

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => {
        return (
          sum +
          item.price *
            item.quantity
        );
      },
      0,
    );
  }, [cartItems]);

  function handleBackToStore() {
    if (atleticaSlug) {
      navigate(
        `/${atleticaSlug}/produtos`,
      );

      return;
    }

    navigate(-1);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
     
      cartItems.length === 0
    ) {
      return;
    }

    try {
     await buy(atleticaSlug, {
  customer: {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    rgm: rgm.trim(),
  },

  items: cartItems.map(
    (item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    }),
  ),
});
    } catch {
      // O hook useCreateCheckout
      // controla o erro.
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page-grid" />

        <section className="checkout-empty">
          <div className="checkout-empty-icon">
            <FiShoppingBag />
          </div>

          <span className="checkout-eyebrow">
            Atlética T.I. Store
          </span>

          <h1>
            Seu carrinho está vazio
          </h1>

          <p>
            Adicione algum produto antes
            de iniciar o pagamento.
          </p>

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
            <span className="checkout-eyebrow">
              Atlética T.I. Store
            </span>

            <h1>
              Finalizar{" "}
              <em>compra.</em>
            </h1>

            <p>
              Revise os produtos e
              informe os dados necessários
              para continuar.
            </p>
          </div>

          <div className="checkout-secure-badge">
            <span className="checkout-secure-icon">
              <FiLock />
            </span>

            <div>
              <strong>
                Pagamento seguro
              </strong>

              <span>
                Processado pelo Mercado Pago
              </span>
            </div>
          </div>
        </header>

        <div className="checkout-layout">
          <section className="checkout-card checkout-order-card">
            <div className="checkout-card-header">
              <span className="checkout-section-number">
                01
              </span>

              <div>
                <h2>
                  Resumo do pedido
                </h2>

                <p>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "itens"}{" "}
                  no carrinho
                </p>
              </div>
            </div>

            <div className="checkout-items">
              {cartItems.map((item) => {
                const itemTotal =
                  item.price *
                  item.quantity;

                return (
                  <article
                    className="checkout-item"
                    key={item.variantId}
                  >
                    <div className="checkout-item-image">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                        />
                      ) : (
                        <span>
                          {item.name
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="checkout-item-content">
                      <div className="checkout-item-main">
                        <div>
                          <span className="checkout-item-category">
                            Produto oficial
                          </span>

                          <h3>
                            {item.name}
                          </h3>

                          <div className="checkout-item-details">
                            <span>
                              Tamanho
                              <strong>
                                {item.size}
                              </strong>
                            </span>

                            <span>
                              Quantidade
                              <strong>
                                {
                                  item.quantity
                                }
                              </strong>
                            </span>
                          </div>
                        </div>

                        <strong className="checkout-item-price">
                          {formatCurrency(
                            itemTotal,
                          )}
                        </strong>
                      </div>

                      <span className="checkout-unit-price">
                        {formatCurrency(
                          item.price,
                        )}{" "}
                        por unidade
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  {formatCurrency(
                    subtotal,
                  )}
                </strong>
              </div>

              <div className="checkout-summary-row">
                <span>
                  Taxa de pagamento
                </span>

                <strong className="checkout-free">
                  Grátis
                </strong>
              </div>

              <div className="checkout-summary-total">
                <div>
                  <span>
                    Total
                  </span>

                  <small>
                    Valor final confirmado
                    pelo servidor
                  </small>
                </div>

                <strong>
                  {formatCurrency(
                    subtotal,
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="checkout-card checkout-form-card">
            <div className="checkout-card-header">
              <span className="checkout-section-number">
                02
              </span>

              <div>
                <h2>
                  Dados do comprador
                </h2>

                <p>
                  Informe os dados para
                  registrar o pedido.
                </p>
              </div>
            </div>

            <form
              className="checkout-form"
              onSubmit={handleSubmit}
            >
              <div className="checkout-field">
                <label htmlFor="checkout-name">
                  Nome completo
                </label>

                <div className="checkout-input-wrapper">
                  <FiUser />

                  <input
                    id="checkout-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    placeholder="Digite seu nome completo"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="checkout-email">
                  E-mail
                </label>

                <div className="checkout-input-wrapper">
                  <FiMail />

                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    placeholder="nome@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-field">
                  <label htmlFor="checkout-phone">
                    Telefone
                  </label>

                  <div className="checkout-input-wrapper">
                    <FiPhone />

                    <input
                      id="checkout-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value,
                        )
                      }
                      placeholder="(11) 99999-9999"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="checkout-rgm">
                    RGM
                  </label>

                  <div className="checkout-input-wrapper">
                    <span className="checkout-rgm-icon">
                      ID
                    </span>

                    <input
                      id="checkout-rgm"
                      type="text"
                      value={rgm}
                      onChange={(event) =>
                        setRgm(
                          event.target.value,
                        )
                      }
                      placeholder="Digite seu RGM"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div
                  className="checkout-error"
                  role="alert"
                >
                  <strong>
                    !
                  </strong>

                  <p>{error}</p>
                </div>
              )}

              <div className="checkout-payment-info">
                <span className="checkout-payment-info-icon">
                  <FiCreditCard />
                </span>

                <div>
                  <strong>
                    Checkout Mercado Pago
                  </strong>

                  <p>
                    O pagamento será
                    concluído em ambiente
                    protegido.
                  </p>
                </div>

                <FiCheck className="checkout-payment-check" />
              </div>

<button
  type="submit"
  className="checkout-submit-button"
  disabled={
    isCreatingCheckout ||
    cartItems.length === 0
  }
>
  <span>
    {isCreatingCheckout
      ? "Preparando pagamento..."
      : `Pagar ${formatCurrency(
          subtotal,
        )}`}
  </span>

  {isCreatingCheckout ? (
    <span className="checkout-spinner" />
  ) : (
    <FiArrowRight />
  )}
</button>
              <p className="checkout-terms">
                Ao continuar, os dados
                serão utilizados somente
                para processar este pedido.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}