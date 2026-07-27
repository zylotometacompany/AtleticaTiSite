import {
  FiArrowRight,
  FiClock,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useWaitPayment,
} from "../../../hooks/store/useWaitPayment";

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

export default function PedidoPendentePage() {
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
  } = useWaitPayment(
    publicToken,
  );

  const isPaid =
    order?.status === "PAGA";

  if (isPaid) {
    return (
      <main className="order-page">
        <div className="order-page__glow order-page__glow--one" />

        <section className="order-shell">
          <div className="order-status-card order-status-card--success">
            <div className="order-status-icon order-status-icon--success">
              <FiArrowRight />
            </div>

            <span className="order-eyebrow">
              Pagamento confirmado
            </span>

            <h1>
              Tudo certo com o seu pedido.
            </h1>

            <p>
              O pagamento foi confirmado enquanto
              você aguardava. Seu comprovante já está
              disponível.
            </p>

            <div className="order-actions">
              <button
                className="order-button order-button--primary"
                type="button"
                onClick={() =>
                  navigate(
                    `/pedido/${publicToken}/comprovante`,
                  )
                }
              >
                Ver comprovante
                <FiArrowRight />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="order-page">
      <div className="order-page__glow order-page__glow--one" />
      <div className="order-page__glow order-page__glow--two" />

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

        <div className="order-status-card order-status-card--pending">
          <div className="order-status-icon order-status-icon--pending">
            <FiClock />
          </div>

          <span className="order-eyebrow">
            Pagamento pendente
          </span>

          <h1>
            Seu pedido está aguardando confirmação.
          </h1>

          <p>
            Alguns métodos de pagamento podem levar
            alguns minutos para serem confirmados.
            Você não precisa realizar uma nova compra.
          </p>

          <div className="order-processing">
            <FiRefreshCw className="order-spin" />

            <span>
              Verificando o pagamento
              automaticamente.
            </span>
          </div>

          {error && (
            <div className="order-alert order-alert--error">
              <strong>
                Não foi possível atualizar agora.
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

                <strong className="order-badge order-badge--pending">
                  Pendente
                </strong>
              </div>
            </div>
          )}

          <div className="order-actions">
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
              Buscando informações do pedido...
            </span>
          )}
        </div>

        <footer className="order-footer">
          Assim que o pagamento for confirmado, o
          status será atualizado automaticamente.
        </footer>
      </section>
    </main>
  );
}