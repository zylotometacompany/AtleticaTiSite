import {
  useEffect,
} from "react";

import {
  FiArrowLeft,
  FiCheck,
  FiDownload,
  FiMail,
  FiPrinter,
  FiShoppingBag,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useGetStoreOrder,
} from "../../../hooks/store/useGetStoreOrder";

import "..Pedido.css";

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(value);
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Aguardando confirmação";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle: "long",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  );
}

export default function PedidoComprovantePage() {
  const navigate =
    useNavigate();

  const {
    publicToken = "",
  } = useParams<{
    publicToken: string;
  }>();

  const {
    order,
    isLoading,
    error,
    getOrder,
  } = useGetStoreOrder();

  useEffect(() => {
    if (!publicToken) {
      return;
    }

    getOrder(publicToken);
  }, [
    publicToken,
    getOrder,
  ]);

  function handlePrint() {
    window.print();
  }

  if (
    isLoading &&
    !order
  ) {
    return (
      <main className="order-page">
        <section className="order-shell">
          <div className="order-status-card order-status-card--processing">
            <div className="order-loader" />

            <span className="order-eyebrow">
              Comprovante
            </span>

            <h1>
              Preparando seu pedido.
            </h1>

            <p>
              Estamos carregando os dados da compra.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (
    error ||
    !order
  ) {
    return (
      <main className="order-page">
        <section className="order-shell">
          <div className="order-status-card order-status-card--failure">
            <span className="order-eyebrow">
              Comprovante indisponível
            </span>

            <h1>
              Não encontramos este pedido.
            </h1>

            <p>
              {error ??
                "Verifique o endereço acessado e tente novamente."}
            </p>

            <div className="order-actions">
              <button
                className="order-button order-button--primary"
                type="button"
                onClick={() =>
                  navigate("/loja")
                }
              >
                Voltar para a loja
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const totalItems =
    order.items.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.quantity,
      0,
    );

  return (
    <main className="order-page order-page--receipt">
      <div className="order-page__glow order-page__glow--one" />
      <div className="order-page__glow order-page__glow--two" />

      <section className="order-shell order-shell--receipt">
        <header className="order-header order-header--receipt">
          <button
            className="order-back-button"
            type="button"
            onClick={() =>
              navigate(-1)
            }
          >
            <FiArrowLeft />
            Voltar
          </button>

          <div className="order-receipt-actions">
            <button
              className="order-icon-button"
              type="button"
              onClick={handlePrint}
              aria-label="Imprimir comprovante"
              title="Imprimir comprovante"
            >
              <FiPrinter />
            </button>

            <button
              className="order-icon-button"
              type="button"
              onClick={handlePrint}
              aria-label="Salvar comprovante"
              title="Salvar como PDF"
            >
              <FiDownload />
            </button>
          </div>
        </header>

        <article className="order-receipt">
          <header className="order-receipt__header">
            <div className="order-receipt__brand">
              <span className="order-brand__mark">
                A
              </span>

              <div>
                <strong>
                  ATLÉTICA TI
                </strong>

                <span>
                  Comprovante de pedido
                </span>
              </div>
            </div>

            <div className="order-receipt__status">
              <span className="order-status-icon order-status-icon--success order-status-icon--small">
                <FiCheck />
              </span>

              <div>
                <small>
                  Status
                </small>

                <strong>
                  {order.status ===
                  "PAGA"
                    ? "Pagamento confirmado"
                    : "Pagamento pendente"}
                </strong>
              </div>
            </div>
          </header>

          <div className="order-receipt__hero">
            <span className="order-eyebrow">
              Pedido confirmado
            </span>

            <h1>
              Obrigado,{" "}
              {order.customerName
                .split(" ")[0]}
              .
            </h1>

            <p>
              Este documento confirma o registro do
              seu pedido na loja oficial da Atlética
              TI.
            </p>
          </div>

          <section className="order-receipt__details">
            <div className="order-detail">
              <span>
                Número do pedido
              </span>

              <strong>
                #
                {order.publicToken
                  .slice(0, 12)
                  .toUpperCase()}
              </strong>
            </div>

            <div className="order-detail">
              <span>
                Data do pedido
              </span>

              <strong>
                {formatDate(
                  order.createdAt,
                )}
              </strong>
            </div>

            <div className="order-detail">
              <span>
                Confirmação
              </span>

              <strong>
                {formatDate(
                  order.paidAt,
                )}
              </strong>
            </div>

            <div className="order-detail">
              <span>
                Identificador do pagamento
              </span>

              <strong>
                {order.mercadoPagoPaymentId ??
                  "Não informado"}
              </strong>
            </div>
          </section>

          <section className="order-receipt__customer">
            <div className="order-section-heading">
              <div>
                <span>
                  Cliente
                </span>

                <h2>
                  Dados da compra
                </h2>
              </div>

              <FiMail />
            </div>

            <div className="order-customer-grid">
              <div>
                <span>
                  Nome
                </span>

                <strong>
                  {order.customerName}
                </strong>
              </div>

              <div>
                <span>
                  E-mail
                </span>

                <strong>
                  {order.customerEmail}
                </strong>
              </div>

              {order.customerRgm && (
                <div>
                  <span>
                    RGM
                  </span>

                  <strong>
                    {order.customerRgm}
                  </strong>
                </div>
              )}

              {order.customerPhone && (
                <div>
                  <span>
                    Telefone
                  </span>

                  <strong>
                    {order.customerPhone}
                  </strong>
                </div>
              )}
            </div>
          </section>

          <section className="order-receipt__items">
            <div className="order-section-heading">
              <div>
                <span>
                  Resumo
                </span>

                <h2>
                  Itens do pedido
                </h2>
              </div>

              <strong>
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "itens"}
              </strong>
            </div>

            <div className="order-item-list">
              {order.items.map(
                (item) => (
                  <article
                    className="order-item"
                    key={item.id}
                  >
                    <div className="order-item__image">
                      {item.product
                        .imageUrl ? (
                        <img
                          src={
                            item
                              .product
                              .imageUrl
                          }
                          alt={
                            item
                              .product
                              .name
                          }
                        />
                      ) : (
                        <FiShoppingBag />
                      )}
                    </div>

                    <div className="order-item__content">
                      <span className="order-item__code">
                        {
                          item.product
                            .code
                        }
                      </span>

                      <h3>
                        {
                          item.product
                            .name
                        }
                      </h3>

                      <p>
                        Tamanho{" "}
                        {item
                          .productVariant
                          ?.size ??
                          "Único"}
                        {" · "}
                        {item.quantity}{" "}
                        {item.quantity ===
                        1
                          ? "unidade"
                          : "unidades"}
                      </p>
                    </div>

                    <div className="order-item__price">
                      <span>
                        {formatCurrency(
                          item.unitPrice,
                        )}{" "}
                        cada
                      </span>

                      <strong>
                        {formatCurrency(
                          item.subtotal,
                        )}
                      </strong>
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>

          <footer className="order-receipt__total">
            <div>
              <span>
                Total do pedido
              </span>

              <small>
                Pagamento processado pelo Mercado
                Pago
              </small>
            </div>

            <strong>
              {formatCurrency(
                order.total,
              )}
            </strong>
          </footer>
        </article>

        <div className="order-actions order-actions--receipt">
          <button
            className="order-button order-button--secondary"
            type="button"
            onClick={() =>
              navigate("/loja")
            }
          >
            <FiShoppingBag />
            Voltar para a loja
          </button>

          <button
            className="order-button order-button--primary"
            type="button"
            onClick={handlePrint}
          >
            <FiDownload />
            Salvar comprovante
          </button>
        </div>
      </section>
    </main>
  );
}