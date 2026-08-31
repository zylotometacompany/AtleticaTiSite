import { useEffect } from "react";

import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiShoppingBag,
  FiXCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import "./MinhasCompras.css";

import { useCompradorPurchases } from "../../../hooks/store/comprador/useCompradorPurchase";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PAGA":
    case "APROVADA":
      return "Pagamento aprovado";

    case "EM_SEPARACAO":
      return "Em separação";

    case "PRONTA_PARA_RETIRADA":
      return "Pronta para retirada";

    case "ENTREGUE":
      return "Entregue";

    case "PENDENTE":
      return "Pagamento pendente";

    case "CANCELADA":
      return "Pedido cancelado";

    case "FALHA":
      return "Pagamento recusado";

    default:
      return status;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "ENTREGUE":
    case "PAGA":
    case "APROVADA":
      return <FiCheckCircle />;

    case "PENDENTE":
      return <FiClock />;

    case "CANCELADA":
      return <FiXCircle />;

    default:
      return <FiPackage />;
  }
}

function getTotalItems(
  items: {
    quantity: number;
  }[],
) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export default function MinhasCompras() {
  const navigate = useNavigate();

  const {
    purchases,
    loadPurchases,
    cancelPurchase,
    isLoading,
    isCancelling,
    error,
  } = useCompradorPurchases();

  useEffect(() => {
    loadPurchases().catch(() => {
      /*
       * O hook já controla
       * a mensagem de erro.
       */
    });
  }, [loadPurchases]);

  async function handleCancelPurchase(publicToken: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja cancelar este pedido?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelPurchase(publicToken);
    } catch {
      /*
       * O hook já salva
       * a mensagem em error.
       */
    }
  }

  const totalSpent = purchases
    .filter((purchase) => purchase.status !== "CANCELADA")
    .reduce((total, purchase) => total + Number(purchase.total), 0);

  if (isLoading) {
    return (
      <section className="purchases-page">
        <header className="purchases-header">
          <div>
            <span className="purchases-eyebrow">Minha conta</span>

            <h1>
              Minhas <em>compras.</em>
            </h1>

            <p>Consulte seus pedidos, pagamentos e status de retirada.</p>
          </div>

          <div className="purchases-header-icon">
            <FiShoppingBag />
          </div>
        </header>

        <div className="purchases-loading">
          <span className="purchases-spinner" />

          <p>Carregando suas compras...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="purchases-page">
      <header className="purchases-header">
        <div>
          <span className="purchases-eyebrow">Minha conta</span>

          <h1>
            Minhas <em>compras.</em>
          </h1>

          <p>Consulte seus pedidos, pagamentos e status de retirada.</p>
        </div>

        <div className="purchases-header-icon">
          <FiShoppingBag />
        </div>
      </header>

      {error && (
        <div className="purchases-error" role="alert">
          <strong>Não foi possível concluir a operação.</strong>

          <p>{error}</p>

          <button type="button" onClick={() => loadPurchases()}>
            Atualizar compras
          </button>
        </div>
      )}

      <div className="purchases-stats">
        <article>
          <span>Pedidos realizados</span>

          <strong>{purchases.length}</strong>
        </article>

        <article>
          <span>Total em compras</span>

          <strong>{formatCurrency(totalSpent)}</strong>
        </article>
      </div>

      <div className="purchases-list">
        {purchases.length === 0 ? (
          <div className="purchases-empty">
            <FiShoppingBag />

            <h2>Nenhuma compra encontrada</h2>

            <p>Quando você realizar uma compra, ela aparecerá aqui.</p>

            <button
              type="button"
              className="purchases-store-button"
              onClick={() => navigate("/loja")}
            >
              Ir para a loja
            </button>
          </div>
        ) : (
          purchases.map((purchase) => {
            const totalItems = getTotalItems(purchase.items);

            const isPending = purchase.status === "PENDENTE";

            return (
              <article
                key={purchase.id}
                className="purchase-card purchase-card-expanded"
              >
                <div className="purchase-card-header">
                  <div className="purchase-card-main">
                    <div className="purchase-icon">
                      {getStatusIcon(purchase.status)}
                    </div>

                    <div>
                      <span className="purchase-label">Pedido</span>

                      <h2>#{purchase.id.slice(0, 8).toUpperCase()}</h2>

                      <p>{formatDate(purchase.createdAt)}</p>
                    </div>
                  </div>

                  <div className="purchase-status-area">
                    <span
                      className={`purchase-status ${purchase.status.toLowerCase()}`}
                    >
                      {getStatusLabel(purchase.status)}
                    </span>

                    <strong>{formatCurrency(Number(purchase.total))}</strong>

                    <small>
                      {totalItems} {totalItems === 1 ? "item" : "itens"}
                    </small>
                  </div>
                </div>

                <div className="purchase-items-list">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="purchase-item-row">
                      <div className="purchase-item-main">
                        <span className="purchase-item-icon">
                          <FiPackage />
                        </span>

                        <div>
                          <strong>{item.product.name}</strong>

                          <div className="purchase-item-meta">
                            <span>
                              Tamanho{" "}
                              <strong>{item.productVariant.size}</strong>
                            </span>

                            <span>
                              Quantidade <strong>{item.quantity}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="purchase-item-price">
                        <span>
                          {formatCurrency(Number(item.unitPrice))} cada
                        </span>

                        <strong>{formatCurrency(Number(item.subtotal))}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="purchase-card-footer">
                  <div>
                    <span>Data da compra</span>

                    <strong>{formatDate(purchase.createdAt)}</strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <strong>{getStatusLabel(purchase.status)}</strong>
                  </div>

                  <div>
                    <span>Total do pedido</span>

                    <strong>{formatCurrency(Number(purchase.total))}</strong>
                  </div>
                </div>

                {isPending && (
                  <div className="purchase-actions">
                    {purchase.paymentUrl && (
                      <button
                        type="button"
                        className="purchase-pay-button"
                        onClick={() => {
                          window.location.href = purchase.paymentUrl!;
                        }}
                      >
                        <FiClock />
                        Continuar pagamento
                      </button>
                    )}

                    <button
                      type="button"
                      className="purchase-cancel-button"
                      disabled={isCancelling}
                      onClick={() => handleCancelPurchase(purchase.publicToken)}
                    >
                      <FiXCircle />

                      {isCancelling ? "Cancelando..." : "Cancelar pedido"}
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
