import "./Store.css";

import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiArrowRight,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  type Product,
  type ProductSize,
  useGetProducts,
} from "../../hooks/useGetProduct";

import { useCartStore } from "../../store/useCartStore";

import logo from "../../assets/logo.jpg";
const ATLETICA_SLUG = "atletica-ti";

interface ProductCardProps {
  product: Product;
  onOpenCart: () => void;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getProductImageUrl(imageUrl?: string | null) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  const normalizedImageUrl = imageUrl.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  return `${apiUrl}${normalizedImageUrl}`;
}

function ProductCard({ product, onOpenCart }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const availableVariants = product.variants.filter(
    (variant) => variant.stock > 0,
  );

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    availableVariants[0]?.size ?? null,
  );

  const [wasAdded, setWasAdded] = useState(false);

  const isSoldOut = availableVariants.length === 0;

  function handleAddToCart() {
    if (!selectedSize) {
      return;
    }

    const selectedVariant = product.variants.find(
      (variant) => variant.size === selectedSize,
    );

    if (!selectedVariant || selectedVariant.stock <= 0) {
      return;
    }

    addItem(ATLETICA_SLUG, {
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      price: product.price,
      stock: selectedVariant.stock,
      imageUrl: getProductImageUrl(product.imageUrl),
    });

    setWasAdded(true);

    onOpenCart();

    window.setTimeout(() => {
      setWasAdded(false);
    }, 1500);
  }

  return (
    <article className="store-product-card">
      <div className="store-product-media">
        <span
          className={[
            "store-product-badge",
            isSoldOut ? "store-product-badge--sold-out" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isSoldOut ? "ESGOTADO" : "PRODUTO OFICIAL"}
        </span>

        {product.imageUrl ? (
          <img src={getProductImageUrl(product.imageUrl)} alt={product.name} />
        ) : (
          <div className="store-product-placeholder">
            <span>{product.name.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="store-product-glow" />
      </div>

      <div className="store-product-content">
        <header className="store-product-header">
          <div>
            <span className="store-product-category">
              Coleção Atlética T.I.
            </span>

            <h2>{product.name}</h2>
          </div>

          <strong className="store-product-price">
            {formatCurrency(product.price)}
          </strong>
        </header>

        {product.description && (
          <p className="store-product-description">{product.description}</p>
        )}

        {!isSoldOut && (
          <div className="store-product-size-section">
            <span className="store-product-size-label">Escolha o tamanho</span>

            <div className="store-product-sizes">
              {product.variants.map((variant) => {
                const isSelected = selectedSize === variant.size;

                const isUnavailable = variant.stock <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={isUnavailable}
                    className={[
                      "store-product-size",

                      isSelected ? "store-product-size--selected" : "",

                      isUnavailable ? "store-product-size--unavailable" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedSize(variant.size)}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          className={[
            "store-add-button",

            wasAdded ? "store-add-button--success" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={isSoldOut || !selectedSize}
          onClick={handleAddToCart}
        >
          {wasAdded ? (
            <>
              <FiCheck />
              Adicionado ao carrinho
            </>
          ) : (
            <>
              <FiShoppingBag />

              {isSoldOut ? "Produto esgotado" : "Adicionar ao carrinho"}
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeItem = useCartStore((state) => state.removeItem);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.classList.add("store-cart-is-open");

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("store-cart-is-open");

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleCheckout() {
    if (items.length === 0) {
      return;
    }

    onClose();

    navigate("/checkout");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Fechar carrinho"
        className={[
          "store-cart-overlay",

          isOpen ? "store-cart-overlay--visible" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "store-cart-drawer",

          isOpen ? "store-cart-drawer--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!isOpen}
        aria-label="Carrinho de compras"
      >
        <header className="store-cart-header">
          <div>
            <span>Seu pedido</span>

            <h2>Carrinho</h2>
          </div>

          <button
            type="button"
            className="store-cart-close"
            aria-label="Fechar carrinho"
            onClick={onClose}
          >
            <FiX />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="store-cart-empty">
            <div className="store-cart-empty-icon">
              <FiShoppingBag />
            </div>

            <h3>Seu carrinho está vazio</h3>

            <p>Escolha um produto da coleção oficial para iniciar o pedido.</p>

            <button type="button" onClick={onClose}>
              Explorar produtos
            </button>
          </div>
        ) : (
          <>
            <div className="store-cart-items">
              {items.map((item) => (
                <article key={item.variantId} className="store-cart-item">
                  <div className="store-cart-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <span>{item.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="store-cart-item-content">
                    <div className="store-cart-item-top">
                      <div>
                        <h3>{item.name}</h3>

                        <span>Tamanho {item.size}</span>
                      </div>

                      <button
                        type="button"
                        className="store-cart-remove"
                        aria-label={`Remover ${item.name}`}
                        onClick={() => removeItem(item.variantId)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="store-cart-item-bottom">
                      <div className="store-cart-quantity">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          onClick={() => decreaseQuantity(item.variantId)}
                        >
                          <FiMinus />
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          disabled={item.quantity >= item.stock}
                          onClick={() => increaseQuantity(item.variantId)}
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <strong className="store-cart-item-price">
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="store-cart-footer">
              <div className="store-cart-summary-row">
                <span>Quantidade</span>

                <strong>
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </strong>
              </div>

              <div className="store-cart-summary-row">
                <span>Entrega</span>

                <strong>Retirada na Atlética</strong>
              </div>

              <div className="store-cart-total">
                <div>
                  <span>Subtotal</span>

                  <small>O valor final será validado no checkout.</small>
                </div>

                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <button
                type="button"
                className="store-checkout-button"
                onClick={handleCheckout}
              >
                <span>Finalizar compra</span>

                <FiArrowRight />
              </button>

              <button
                type="button"
                className="store-continue-button"
                onClick={onClose}
              >
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function StoreSkeleton() {
  return (
    <main className="store-page">
      <section className="store-hero store-hero--skeleton">
        <div className="store-skeleton-hero-content">
          <div className="store-skeleton-line store-skeleton-line--eyebrow" />

          <div className="store-skeleton-line store-skeleton-line--title" />

          <div className="store-skeleton-line store-skeleton-line--title-secondary" />

          <div className="store-skeleton-line store-skeleton-line--paragraph" />

          <div className="store-skeleton-line store-skeleton-line--button" />
        </div>

        <div className="store-skeleton-visual" />
      </section>

      <section className="store-collection">
        <div className="store-skeleton-line store-skeleton-line--section" />

        <div className="store-skeleton-grid">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <article key={index} className="store-skeleton-card">
              <div className="store-skeleton-image" />

              <div className="store-skeleton-card-content">
                <div className="store-skeleton-line store-skeleton-line--product" />

                <div className="store-skeleton-line store-skeleton-line--description" />

                <div className="store-skeleton-line store-skeleton-line--button" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const items = useCartStore((state) => state.items);

  const { products, isLoading, error, refetch } = useGetProducts();

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  if (isLoading) {
    return <StoreSkeleton />;
  }

  if (error) {
    return (
      <main className="store-feedback-page">
        <div className="store-error">
          <span>ERRO DE CONEXÃO</span>

          <h1>Não foi possível carregar a loja</h1>

          <p>{error}</p>

          <button type="button" onClick={refetch}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="store-page">
        <section className="store-hero">
          <div className="store-hero-content">
            <span className="store-hero-eyebrow">COLEÇÃO OFICIAL 2026</span>

            <h1>
              Vista a
              <br />
              <em>tecnologia.</em>
            </h1>

            <p>
              Produtos criados para representar quem transforma código,
              competição e comunidade em uma só identidade.
            </p>

            <a href="#colecao" className="store-hero-button">
              <span>Explorar coleção</span>

              <FiArrowRight />
            </a>
          </div>

          <div className="store-hero-visual">
            <div className="store-hero-orbit store-hero-orbit--outer" />

            <div className="store-hero-orbit store-hero-orbit--inner" />

            <div className="store-hero-symbol">
              <img
                src={logo}
                alt="Logo da Atlética T.I."
                className="store-hero-symbol-logo"
              />
            </div>
            <div className="store-hero-status">
              <span>COLEÇÃO</span>

              <strong>DISPONÍVEL</strong>
            </div>
          </div>

          <span className="store-hero-index">01</span>
        </section>

        <section id="colecao" className="store-collection">
          <header className="store-section-header">
            <div>
              <span>PRODUTOS OFICIAIS</span>

              <h2>Escolha seu uniforme</h2>
            </div>

            <p>
              Selecione o tamanho, adicione os produtos ao carrinho e finalize a
              compra com segurança.
            </p>
          </header>

          {products.length === 0 ? (
            <div className="store-empty">
              <div className="store-empty-icon">
                <FiShoppingBag />
              </div>

              <h2>Nenhum produto disponível</h2>

              <p>Novos produtos serão disponibilizados em breve.</p>
            </div>
          ) : (
            <div className="store-product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenCart={() => setIsCartOpen(true)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="store-benefits">
          <article>
            <span>01</span>

            <div>
              <h3>Pagamento seguro</h3>

              <p>Processamento realizado pelo Mercado Pago.</p>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <h3>Retirada facilitada</h3>

              <p>Retirada organizada diretamente com a equipe da Atlética.</p>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <h3>Produtos oficiais</h3>

              <p>Peças desenvolvidas para representar a comunidade de T.I.</p>
            </div>
          </article>
        </section>
      </main>

      <button
        type="button"
        className="store-floating-cart"
        aria-label="Abrir carrinho"
        onClick={() => setIsCartOpen(true)}
      >
        <FiShoppingBag />

        <span className="store-floating-cart-label">Carrinho</span>

        {totalItems > 0 && <strong>{totalItems}</strong>}
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
