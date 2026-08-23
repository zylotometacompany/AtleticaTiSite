import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { FiHome, FiLogOut, FiShoppingBag } from "react-icons/fi";

import "./CompradorLayout.css";
import { useCompradorAuth } from "../hooks/store/comprador/useCompradorAuth";

export function CompradorLayout() {
  const navigate = useNavigate();

  const { logout, getStoredComprador } = useCompradorAuth();

  const comprador = getStoredComprador();

  function handleLogout() {
    logout();

    navigate("/loja", {
      replace: true,
    });
  }

  return (
    <main className="buyer-layout">
      <div className="buyer-layout-grid" />

      <aside className="buyer-sidebar">
        <div className="buyer-sidebar-brand">
          <span>Atlética T.I.</span>

          <strong>Minha conta</strong>
        </div>

        <div className="buyer-sidebar-user">
          <div className="buyer-sidebar-avatar">
            {comprador?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div>
            <strong>{comprador?.name ?? "Comprador"}</strong>

            <span>{comprador?.email ?? ""}</span>
          </div>
        </div>

        <nav className="buyer-sidebar-nav">
          <NavLink
            to="/minha-conta/compras"
            className={({ isActive }) =>
              isActive ? "buyer-sidebar-link active" : "buyer-sidebar-link"
            }
          >
            <FiShoppingBag />
            Minhas compras
          </NavLink>

         {/*  <NavLink
            to="/minha-conta/perfil"
            className={({ isActive }) =>
              isActive ? "buyer-sidebar-link active" : "buyer-sidebar-link"
            }
          >
            <FiUser />
            Meu perfil
          </NavLink> */}

          <NavLink to="/loja" className="buyer-sidebar-link">
            <FiHome />
            Voltar para loja
          </NavLink>
        </nav>

        <button
          type="button"
          className="buyer-sidebar-logout"
          onClick={handleLogout}
        >
          <FiLogOut />
          Sair
        </button>
      </aside>

      <section className="buyer-layout-content">
        <Outlet />
      </section>
    </main>
  );
}
