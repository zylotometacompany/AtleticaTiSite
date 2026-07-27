import { useEffect } from "react";

import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiRefreshCw,
  FiShoppingBag,
} from "react-icons/fi";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useWaitPayment } from "../../../hooks/store/useWaitPayment";
import { useCartStore } from "../../../store/useCartStore";

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

export default function PedidoSucessoPage() {
  const navigate =
    useNavigate();

  const {
    publicToken = "",
  } = useParams<{
    publicToken: string;
  }>();

  const clearCart =
    useCartStore(
      (state) =>
        state.clearCart,
    );

  const {
    order,
    isLoading,
    error,
  } = useWaitPayment(
    publicToken,
  );

  const isPaid =
    order?.status === "PAGA";

  const isCancelled =
    order?.status ===
    "CANCELADA";

  useEffect(() => {
    if (!isPaid) {
      return;
    }

    clearCart();
  }, [
    isPaid,
    clearCart,
  ]);

  if (isCancelled) {
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
              <FiShoppingBag />
            </div>

            <span className="order-eyebrow">
              Pagamento não concluído
            </span>

            <h1>
              Não conseguimos confirmar seu pedido.
            </h1>

            <p>
              O pagamento foi cancelado ou recusado.
              Você pode voltar para a loja e tentar
              novamente.
            </p>

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
                    Cancelado
                  </strong>
                </div>
              </div>
            )}

            <div className="order-actions">
              <button
                className="order-button order-button--primary"
                type="button"
                onClick={() =>
                  navigate("/loja")
                }
              >
                Voltar para a loja
                <FiArrowRight />
              </button>
            </div>
          </div>

          <footer className="order-footer">
            Nenhuma cobrança aprovada foi registrada
            para este pedido.
          </footer>
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

        <div
          className={
            isPaid
              ? "order-status-card order-status-card--success"
              : "order-status-card order-status-card--processing"
          }
        >
          <div
            className={
              isPaid
                ? "order-status-icon order-status-icon--success"
                : "order-status-icon order-status-icon--processing"
            }
          >
            {isPaid ? (
              <FiCheck />
            ) : (
              <FiRefreshCw className="order-spin" />
            )}
          </div>

          <span className="order-eyebrow">
            {isPaid
              ? "Pagamento confirmado"
              : "Confirmando pagamento"}
          </span>

          <h1>
            {isPaid
              ? "Seu pedido está confirmado."
              : "Só mais alguns segundos."}
          </h1>

          <p>
            {isPaid
              ? "Recebemos o pagamento e seu pedido já foi registrado com sucesso."
              : "O Mercado Pago concluiu o retorno e agora estamos aguardando a confirmação segura em nosso sistema."}
          </p>

          {!isPaid && (
            <div className="order-processing">
              <FiClock />

              <span>
                Esta página será atualizada
                automaticamente.
              </span>
            </div>
          )}

          {error && (
            <div className="order-alert order-alert--error">
              <strong>
                Não conseguimos atualizar o pedido.
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

                <strong
                  className={
                    isPaid
                      ? "order-badge order-badge--paid"
                      : "order-badge order-badge--pending"
                  }
                >
                  {isPaid
                    ? "Pago"
                    : "Processando"}
                </strong>
              </div>
            </div>
          )}

          <div className="order-actions">
            {isPaid && (
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
            )}

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
              Carregando informações do pedido...
            </span>
          )}
        </div>

        <footer className="order-footer">
          Pagamento processado com segurança pelo
          Mercado Pago.
        </footer>
      </section>
    </main>
  );
}