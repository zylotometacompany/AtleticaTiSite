import {
  useEffect,
} from "react";

import {
  FiAlertTriangle,
  FiArrowRight,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useGetStoreOrder,
} from "../../../hooks/store/useGetStoreOrder";

import "../Pedido.css";

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

export default function PedidoFalhaPage() {
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

  return (
    <main className="order-page">
      <div className="order-page__glow order-page__glow--failure" />

      <section className="order-shell">
        <header className="order-header">
          <button
            className="order-brand"
            type="button"
            onClick={() =>
              navigate("/")
            }
          >
            <span className="order-brand__mark">
              A
            </span>

            <span className="order-brand__content">
              <strong>
                ATLÉTICA TI
              </strong>

              <small>
                TECH COMMAND
              </small>
            </span>
          </button>
        </header>

        <div className="order-status-card order-status-card--failure">
          <div className="order-status-icon order-status-icon--failure">
            <FiAlertTriangle />
          </div>

          <span className="order-eyebrow">
            Pagamento não concluído
          </span>

          <h1>
            Não foi possível finalizar a compra.
          </h1>

          <p>
            O Mercado Pago não confirmou o pagamento.
            Nenhuma cobrança aprovada foi registrada
            para este pedido.
          </p>

          {error && (
            <div className="order-alert order-alert--error">
              <strong>
                Não conseguimos carregar o pedido.
              </strong>

              <span>
                {error}
              </span>
            </div>
          )}

          {order && (
            <div className="order-summary">
              <div className="order-summary__row">
                <span>
                  Pedido
                </span>

                <strong>
                  #
                  {order.publicToken
                    .slice(0, 8)
                    .toUpperCase()}
                </strong>
              </div>

              <div className="order-summary__row">
                <span>
                  Cliente
                </span>

                <strong>
                  {order.customerName}
                </strong>
              </div>

              <div className="order-summary__row">
                <span>
                  Total
                </span>

                <strong className="order-summary__price">
                  {formatCurrency(
                    order.total,
                  )}
                </strong>
              </div>

              <div className="order-summary__row">
                <span>
                  Status
                </span>

                <strong className="order-badge order-badge--cancelled">
                  Não concluído
                </strong>
              </div>
            </div>
          )}

          <div className="order-alert order-alert--info">
            <strong>
              O que fazer agora?
            </strong>

            <span>
              Volte para a loja, confira os dados e
              tente novamente usando o método de
              pagamento que preferir.
            </span>
          </div>

          <div className="order-actions">
            <button
              className="order-button order-button--primary"
              type="button"
              onClick={() =>
                navigate("/checkout")
              }
            >
              <FiRefreshCw />
              Tentar novamente
            </button>

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
          </div>

          {isLoading && !order && (
            <span className="order-loading-label">
              Carregando informações...
            </span>
          )}

          <button
            className="order-text-link"
            type="button"
            onClick={() =>
              navigate("/")
            }
          >
            Ir para o início
            <FiArrowRight />
          </button>
        </div>

        <footer className="order-footer">
          Nenhum dado bancário é armazenado pela
          Atlética TI.
        </footer>
      </section>
    </main>
  );
}