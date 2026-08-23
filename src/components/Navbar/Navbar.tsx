import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  FiChevronDown,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";

import {
  useViewTransitionNavigate,
} from "../../hooks/useViewTransitionNavigate";

import logo from "../../assets/logo.jpg";

import "./Navbar.css";

const navigation = [
  {
    label: "Início",
    path: "/",
  },

  {
    label: "Diretoria",
    path: "/diretoria",
  },

  // {
  //   label: "Eventos",
  //   path: "/eventos",
  // },

  {
    label: "Loja",
    path: "/loja",
  },
];

const COMPRADOR_TOKEN_KEY =
  "@atletica-ti-client:token";

const COMPRADOR_USER_KEY =
  "@atletica-ti-client:user";

interface StoredComprador {
  id: string;
  name: string;
  email: string;
}

export function Navbar() {
  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const [
    accountOpen,
    setAccountOpen,
  ] =
    useState(false);

  const [
    comprador,
    setComprador,
  ] =
    useState<StoredComprador | null>(
      null,
    );

  const location =
    useLocation();

  const transitionNavigate =
    useViewTransitionNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  function closeAccount() {
    setAccountOpen(false);
  }

  function loadComprador() {
    const token =
      localStorage.getItem(
        COMPRADOR_TOKEN_KEY,
      );

    const storedComprador =
      localStorage.getItem(
        COMPRADOR_USER_KEY,
      );

    if (
      !token ||
      !storedComprador
    ) {
      setComprador(null);

      return;
    }

    try {
      const parsedComprador =
        JSON.parse(
          storedComprador,
        ) as StoredComprador;

      setComprador(
        parsedComprador,
      );
    } catch {
      localStorage.removeItem(
        COMPRADOR_TOKEN_KEY,
      );

      localStorage.removeItem(
        COMPRADOR_USER_KEY,
      );

      setComprador(null);
    }
  }

  function handleNavigation(
    path: string,
  ) {
    closeMenu();
    closeAccount();

    if (
      location.pathname ===
      path
    ) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    transitionNavigate(
      path,
    );
  }

  function handleAccountClick() {
    if (!comprador) {
      handleNavigation(
        "/login",
      );

      return;
    }

    setAccountOpen(
      (current) =>
        !current,
    );
  }

  function handleLogout() {
    localStorage.removeItem(
      COMPRADOR_TOKEN_KEY,
    );

    localStorage.removeItem(
      COMPRADOR_USER_KEY,
    );

    setComprador(null);

    setAccountOpen(false);

    setMenuOpen(false);

    transitionNavigate(
      "/loja",
    );
  }

  useEffect(() => {
    loadComprador();
  }, [
    location.pathname,
  ]);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    menuOpen,
  ]);

  useEffect(() => {
    closeMenu();

    closeAccount();
  }, [
    location.pathname,
  ]);

  const firstName =
    comprador?.name
      ?.trim()
      .split(" ")[0] ??
    "";

  const initial =
    comprador?.name
      ?.trim()
      .charAt(0)
      .toUpperCase() ??
    "U";

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/*
         * MARCA
         */}

        <button
          type="button"
          className="navbar__brand"
          onClick={() =>
            handleNavigation(
              "/",
            )
          }
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
            <strong className="navbar__name">
              ATLÉTICA T.I
            </strong>

            <span className="navbar__subtitle">
              Universidade de
              Mogi das Cruzes
            </span>
          </div>
        </button>

        {/*
         * NAVEGAÇÃO
         */}

        <nav
          className={`navbar__navigation ${
            menuOpen
              ? "navbar__navigation--open"
              : ""
          }`}
          aria-label="Navegação principal"
        >
          {/*
           * TOPO MOBILE
           */}

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
              onClick={
                closeMenu
              }
              aria-label="Fechar menu"
            >
              <FiX />
            </button>
          </div>

          {/*
           * LINKS
           */}

          <ul className="navbar__links">
            {navigation.map(
              (item) => {
                const isActive =
                  location.pathname ===
                  item.path;

                return (
                  <li
                    key={
                      item.path
                    }
                  >
                    <button
                      type="button"
                      className={`navbar__link ${
                        isActive
                          ? "navbar__link--active"
                          : ""
                      }`}
                      onClick={() =>
                        handleNavigation(
                          item.path,
                        )
                      }
                      aria-current={
                        isActive
                          ? "page"
                          : undefined
                      }
                    >
                      {
                        item.label
                      }
                    </button>
                  </li>
                );
              },
            )}
          </ul>

          {/*
           * CONTA MOBILE
           */}

          <div className="navbar__mobile-account">
            {comprador ? (
              <>
                <div className="navbar__mobile-user">
                  <span className="navbar__account-avatar">
                    {
                      initial
                    }
                  </span>

                  <div>
                    <strong>
                      {
                        comprador.name
                      }
                    </strong>

                    <span>
                      {
                        comprador.email
                      }
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="navbar__mobile-account-action"
                  onClick={() =>
                    handleNavigation(
                      "/minha-conta/compras",
                    )
                  }
                >
                  <FiShoppingBag />

                  Minhas compras
                </button>

                <button
                  type="button"
                  className="navbar__mobile-account-action navbar__mobile-account-action--danger"
                  onClick={
                    handleLogout
                  }
                >
                  <FiLogOut />

                  Sair
                </button>
              </>
            ) : (
              <button
                type="button"
                className="navbar__mobile-login"
                onClick={() =>
                  handleNavigation(
                    "/login",
                  )
                }
              >
                <FiLogIn />

                Entrar na minha conta
              </button>
            )}
          </div>
        </nav>

        {/*
         * CONTA DESKTOP
         */}

        <div className="navbar__account">
          <button
            type="button"
            className={`navbar__account-button ${
              comprador
                ? "navbar__account-button--logged"
                : ""
            }`}
            onClick={
              handleAccountClick
            }
            aria-expanded={
              accountOpen
            }
            aria-label={
              comprador
                ? "Abrir menu da conta"
                : "Entrar na conta"
            }
          >
            {comprador ? (
              <>
                <span className="navbar__account-avatar">
                  {
                    initial
                  }
                </span>

                <span className="navbar__account-name">
                  {
                    firstName
                  }
                </span>

                <FiChevronDown
                  className={`navbar__account-chevron ${
                    accountOpen
                      ? "navbar__account-chevron--open"
                      : ""
                  }`}
                />
              </>
            ) : (
              <>
                <FiUser />

                <span>
                  Entrar
                </span>
              </>
            )}
          </button>

          {/*
           * DROPDOWN
           */}

          {comprador &&
            accountOpen && (
              <div className="navbar__account-dropdown">
                <div className="navbar__account-user">
                  <span className="navbar__account-avatar navbar__account-avatar--large">
                    {
                      initial
                    }
                  </span>

                  <div>
                    <strong>
                      {
                        comprador.name
                      }
                    </strong>

                    <span>
                      {
                        comprador.email
                      }
                    </span>
                  </div>
                </div>

                <div className="navbar__account-separator" />

                <button
                  type="button"
                  className="navbar__account-option"
                  onClick={() =>
                    handleNavigation(
                      "/minha-conta/compras",
                    )
                  }
                >
                  <FiShoppingBag />

                  <div>
                    <strong>
                      Minhas compras
                    </strong>

                    <span>
                      Pedidos e
                      pagamentos
                    </span>
                  </div>
                </button>

                <div className="navbar__account-separator" />

                <button
                  type="button"
                  className="navbar__account-option navbar__account-option--danger"
                  onClick={
                    handleLogout
                  }
                >
                  <FiLogOut />

                  <div>
                    <strong>
                      Sair
                    </strong>

                    <span>
                      Encerrar sessão
                    </span>
                  </div>
                </button>
              </div>
            )}
        </div>

        {/*
         * MENU MOBILE
         */}

        <button
          type="button"
          className="navbar__menu-button"
          onClick={() =>
            setMenuOpen(
              (current) =>
                !current,
            )
          }
          aria-label={
            menuOpen
              ? "Fechar menu"
              : "Abrir menu"
          }
          aria-expanded={
            menuOpen
          }
        >
          {menuOpen ? (
            <FiX />
          ) : (
            <FiMenu />
          )}
        </button>
      </div>

      {/*
       * OVERLAY MOBILE
       */}

      <button
        type="button"
        className={`navbar__overlay ${
          menuOpen
            ? "navbar__overlay--visible"
            : ""
        }`}
        onClick={
          closeMenu
        }
        aria-label="Fechar menu"
        tabIndex={
          menuOpen
            ? 0
            : -1
        }
      />
    </header>
  );
}