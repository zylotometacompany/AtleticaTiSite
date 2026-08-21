import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import { useViewTransitionNavigate } from "../../hooks/useViewTransitionNavigate";

import logo from "../../assets/logo.jpg";

import "./Navbar.css";

const navigation = [
  { label: "Início", path: "/" },
  { label: "Diretoria", path: "/diretoria" },
 // { label: "Eventos", path: "/eventos" },
/*   { label: "Loja", path: "/loja" },
 */];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const transitionNavigate = useViewTransitionNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleNavigation(path: string) {
    closeMenu();

    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    transitionNavigate(path);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar__container">
        <button
          type="button"
          className="navbar__brand"
          onClick={() => handleNavigation("/")}
          aria-label="Ir para a página inicial"
        >
          <div className="navbar__logo-wrapper">
            <img
              src={logo}
              alt="Logo da Atlética T.I"
              className="navbar__logo"
            />
          </div>

          <div className="navbar__identity">
            <strong className="navbar__name">ATLÉTICA T.I</strong>

            <span className="navbar__subtitle">
              Universidade de Mogi das Cruzes
            </span>
          </div>
        </button>

        <nav
          className={`navbar__navigation ${
            menuOpen ? "navbar__navigation--open" : ""
          }`}
          aria-label="Navegação principal"
        >
          <div className="navbar__mobile-top">
            <div className="navbar__mobile-identity">
              <span className="navbar__mobile-label">
                Atlética T.I
              </span>

              <strong className="navbar__mobile-title">
                Navegação
              </strong>
            </div>

            <button
              type="button"
              className="navbar__close"
              onClick={closeMenu}
              aria-label="Fechar menu"
            >
              <FiX />
            </button>
          </div>

          <ul className="navbar__links">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <button
                    type="button"
                    className={`navbar__link ${
                      isActive ? "navbar__link--active" : ""
                    }`}
                    onClick={() => handleNavigation(item.path)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

       {/*    <button
            type="button"
            className="navbar__cta"
            onClick={() => handleNavigation("/contato")}
          >
            Fazer parte
          </button> */}
        </nav>

        <button
          type="button"
          className="navbar__menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <button
        type="button"
        className={`navbar__overlay ${
          menuOpen ? "navbar__overlay--visible" : ""
        }`}
        onClick={closeMenu}
        aria-label="Fechar menu"
        tabIndex={menuOpen ? 0 : -1}
      />
    </header>
  );
}