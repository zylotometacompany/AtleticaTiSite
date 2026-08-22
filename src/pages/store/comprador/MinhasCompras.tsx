import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

import "./MinhasCompras.css";

interface Compra {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: number;
}

const compras: Compra[] = [
  {
    id: "82F1A9",
    status: "PAGA",
    total: 159.9,
    createdAt: "21/08/2026",
    items: 2,
  },
  {
    id: "71D2B4",
    status: "PRONTA_PARA_RETIRADA",
    total: 79.9,
    createdAt: "15/08/2026",
    items: 1,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PAGA":
      return "Pagamento aprovado";

    case "EM_SEPARACAO":
      return "Em separação";

    case "PRONTA_PARA_RETIRADA":
      return "Pronta para retirada";

    case "ENTREGUE":
      return "Entregue";

    case "PENDENTE":
      return "Pagamento pendente";

    default:
      return status;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "ENTREGUE":
    case "PAGA":
      return <FiCheckCircle />;

    case "PENDENTE":
      return <FiClock />;

    default:
      return <FiPackage />;
  }
}

export default function MinhasCompras() {
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

      <div className="purchases-stats">
        <article>
          <span>Pedidos realizados</span>

          <strong>{compras.length}</strong>
        </article>

        <article>
          <span>Total em compras</span>

          <strong>
            {formatCurrency(
              compras.reduce((total, compra) => total + compra.total, 0),
            )}
          </strong>
        </article>
      </div>

      <div className="purchases-list">
        {compras.length === 0 ? (
          <div className="purchases-empty">
            <FiShoppingBag />

            <h2>Nenhuma compra encontrada</h2>

            <p>Quando você realizar uma compra, ela aparecerá aqui.</p>
          </div>
        ) : (
          compras.map((compra) => (
            <article key={compra.id} className="purchase-card">
              <div className="purchase-card-main">
                <div className="purchase-icon">
                  {getStatusIcon(compra.status)}
                </div>

                <div>
                  <span className="purchase-label">Pedido</span>

                  <h2>#{compra.id}</h2>

                  <p>
                    {compra.createdAt} • {compra.items}{" "}
                    {compra.items === 1 ? "item" : "itens"}
                  </p>
                </div>
              </div>

              <div className="purchase-status-area">
                <span
                  className={`purchase-status ${compra.status.toLowerCase()}`}
                >
                  {getStatusLabel(compra.status)}
                </span>

                <strong>{formatCurrency(compra.total)}</strong>
              </div>

              <button type="button" className="purchase-details">
                Ver pedido
                <FiArrowRight />
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
