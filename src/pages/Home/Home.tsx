import {
  FiActivity,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiUsers,
  FiCheck,
  FiCreditCard,
  FiGift,
  FiShield,
  FiStar,
  FiZap,
} from "react-icons/fi";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { useViewTransitionNavigate } from "../../hooks/useViewTransitionNavigate";

import logo from "../../assets/logo.jpg";
import zylotoLogo from "../../assets/zandorinha.logo.png";
import skylogo from "../../assets/skylogo-removebg-preview.png";
import smokeLogo from "../../assets/smoke-removebg-preview.png";
import coposLogo from "../../assets/copos-removebg-preview.png";
import kairon from "../../assets/kairon-removed.png";
import pablo from "../../assets/pablo-removebg-preview.png";

import "./Home.css";
import "./Home.carousel.css";
import "./Home.sections.css";

const stats = [
  {
    value: "06",
    label: "Modalidades",
  },
  {
    value: "12",
    label: "Eventos",
  },
  {
    value: "120+",
    label: "Integrantes",
  },
];

const partners = [
  {
    name: "Zyloto Inovações",
    category: "Tecnologia",
    logo: zylotoLogo,
    scale: 1,
  },
  {
    name: "Sky",
    category: "Sky - Food | Happiness | Dance Bar",
    logo: skylogo,
    scale: 2.5,
  },
  {
    name: "Smoke House",
    category: "Produtos",
    logo: smokeLogo,
    scale: 1.5,
  },
  {
    name: "Buenos Copos",
    category: "Comunidade",
    logo: coposLogo,
    scale: 1.0,
  },
];

const boardMembers = [
  {
    name: "Kairon",
    role: "Presidência",
    photo: kairon,
  },
  {
    name: "Pablo",
    role: "Vice-presidência",
    photo: pablo,
  },
  {
    name: "Ana",
    role: "Diretoria de Eventos",
    // photo: anaPhoto,
  },
];

const slides = [
  {
    id: "inicio",
    label: "Início",
  },
  {
    id: "parceiros",
    label: "Parceiros",
  },
  {
    id: "diretoria",
    label: "Diretoria",
  },
] as const;

type SlideId = (typeof slides)[number]["id"];

export default function Home() {
  const transitionNavigate = useViewTransitionNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlideId: SlideId = slides[activeSlide].id;

  function handleNavigation(path: string) {
    transitionNavigate(path);
  }

  function scrollToExperience() {
    document
      .querySelector("#experiencia")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function changeSlide(nextIndex: number) {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;

    if (!document.startViewTransition) {
      setActiveSlide(normalizedIndex);
      return;
    }

    document.startViewTransition(() => {
      setActiveSlide(normalizedIndex);
    });
  }

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero__effects" aria-hidden="true">
          <div className="home-hero__grid" />
          <div className="home-hero__beam home-hero__beam--one" />
          <div className="home-hero__beam home-hero__beam--two" />
          <div className="home-hero__light" />
        </div>

        <div
          className="home-main-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="home-main-carousel__controls">
            <button
              type="button"
              onClick={() => changeSlide(activeSlide - 1)}
              aria-label="Exibir slide anterior"
            >
              <FiArrowLeft />
            </button>

            <button
              type="button"
              onClick={() => changeSlide(activeSlide + 1)}
              aria-label="Exibir próximo slide"
            >
              <FiArrowRight />
            </button>
          </div>

          <div className="home-main-carousel__viewport" key={activeSlideId}>
            {activeSlideId === "inicio" && (
              <HeroMainSlide onNavigate={handleNavigation} />
            )}

            {activeSlideId === "parceiros" && (
              <PartnersMainSlide onNavigate={handleNavigation} />
            )}

            {activeSlideId === "diretoria" && (
              <BoardMainSlide onNavigate={handleNavigation} />
            )}
          </div>

          <div
            className="home-main-carousel__pagination"
            role="tablist"
            aria-label="Destaques da Atlética"
          >
            {slides.map((slide, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === activeSlide}
                aria-label={`Exibir ${slide.label}`}
                className={
                  index === activeSlide
                    ? "home-main-carousel__dot home-main-carousel__dot--active"
                    : "home-main-carousel__dot"
                }
                onClick={() => changeSlide(index)}
                key={slide.id}
              >
                <span />
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="home-hero__scroll"
          onClick={scrollToExperience}
          aria-label="Ir para a próxima seção"
        >
          <span>Explorar</span>
          <FiArrowDown />
        </button>
      </section>

      <section className="home-partners-strip" id="experiencia">
        <div className="home-partners-strip__heading">
          <span>Parceiros oficiais</span>
          <strong>Marcas que caminham com a Atlética T.I</strong>
        </div>

        <div className="home-partners-marquee">
          <div className="home-partners-marquee__fade home-partners-marquee__fade--left" />
          <div className="home-partners-marquee__fade home-partners-marquee__fade--right" />

          <div className="home-partners-marquee__track">
            {[...partners, ...partners].map((partner, index) => (
              <article
                className="home-partners-marquee__item"
                key={`${partner.name}-${index}`}
              >
                <div className="home-partners-marquee__logo">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    style={{
                      transform: `scale(${partner.scale ?? 1})`,
                    }}
                  />
                </div>

                <div>
                  <strong>{partner.name}</strong>
                  <span>{partner.category}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="zcard" className="zcard-section">
        <div className="zcard-section__effects" aria-hidden="true">
          <span className="zcard-section__glow zcard-section__glow--one" />
          <span className="zcard-section__glow zcard-section__glow--two" />
        </div>

        <div className="zcard-section__container">
          <div className="zcard-section__content">
            <div className="zcard-section__eyebrow">
              <FiCreditCard />
              <span>Benefícios exclusivos</span>
            </div>

            <h2>
              Não só um cartão.
              <span>Uma comunidade inteira.</span>
            </h2>

            <p>
              O ZCard conecta estudantes da Atlética T.I a benefícios,
              experiências e vantagens exclusivas dentro e fora da universidade.
            </p>

            <div className="zcard-benefits">
              <div className="zcard-benefit">
                <FiGift />
                <div>
                  <strong>Descontos exclusivos</strong>
                  <span>Condições especiais com parceiros da Atlética.</span>
                </div>
              </div>

              <div className="zcard-benefit">
                <FiZap />
                <div>
                  <strong>Acesso a experiências</strong>
                  <span>Prioridade em eventos, ações e ativações especiais.</span>
                </div>
              </div>

              <div className="zcard-benefit">
                <FiStar />
                <div>
                  <strong>Identidade digital</strong>
                  <span>Perfil, categoria e benefícios reunidos em um só lugar.</span>
                </div>
              </div>

              <div className="zcard-benefit">
                <FiShield />
                <div>
                  <strong>Validação segura</strong>
                  <span>QR Code individual para identificação e acesso.</span>
                </div>
              </div>
            </div>

            <div className="zcard-section__actions">
              <button
                type="button"
                className="home-button home-button--primary"
                onClick={() => handleNavigation("/zcard")}
              >
                Conhecer o ZCard
                <FiArrowRight />
              </button>

              <span>
                <FiCheck />
                Exclusivo para a comunidade Atlética T.I
              </span>
            </div>
          </div>

          <div className="zcard-section__visual">
            <div className="zcard-scene">
              <div className="zcard zcard--back">
                <div className="zcard__ambient" />
              </div>

              <article className="zcard zcard--front">
                <div className="zcard__top">
                  <div className="zcard__brand">
                    <div className="zcard__brand-logo">
                      <img src={logo} alt="" />
                    </div>

                    <div>
                      <span>Atlética T.I</span>
                      <strong>ZCARD</strong>
                    </div>
                  </div>

                  <span className="zcard__badge">PREMIUM</span>
                </div>

                <div className="zcard__chip">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="zcard__member">
                  <span>Membro</span>
                  <strong>SEU NOME AQUI</strong>
                </div>

                <div className="zcard__bottom">
                  <div>
                    <span>Validade</span>
                    <strong>12/26</strong>
                  </div>

                  <div className="zcard__qr">
                    <QRCodeSVG
                      value={`${window.location.origin}/zcardinfo`}
                      size={64}
                      bgColor="#ffffff"
                      fgColor="#24102f"
                      level="H"
                      includeMargin={false}
                      title="Conhecer o ZCard"
                    />
                  </div>
                </div>
              </article>

              <div className="zcard-floating-benefit zcard-floating-benefit--discount">
                <FiGift />
                <div>
                  <span>Benefício ativo</span>
                  <strong>Descontos exclusivos</strong>
                </div>
              </div>

              <div className="zcard-floating-benefit zcard-floating-benefit--access">
                <FiZap />
                <div>
                  <span>Acesso digital</span>
                  <strong>QR individual</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type NavigateFunction = (path: string) => void;

function HeroMainSlide({ onNavigate }: { onNavigate: NavigateFunction }) {
  return (
    <div className="home-hero__container home-main-slide">
      <div className="home-hero__content">
        <div className="home-hero__eyebrow">
          <span className="home-hero__eyebrow-icon">
            <FiActivity />
          </span>

          <span>Atlética oficial dos cursos de tecnologia</span>
        </div>

        <h1 className="home-hero__title">
          A tecnologia nos conecta.
          <span>A Atlética nos representa.</span>
        </h1>

        <p className="home-hero__description">
          Esporte, eventos e experiências para conectar os estudantes de
          tecnologia da Universidade de Mogi das Cruzes.
        </p>

        <div className="home-hero__actions">
       <button
  type="button"
  className="home-button home-button--primary"
  onClick={() => {
    document
      .getElementById("zcard")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }}
>
  Fazer parte
  <FiArrowRight />
</button>

         <button
  type="button"
  className="home-button home-button--secondary"
  onClick={() =>
    window.open(
      "https://instagram.com/atleticatiumc",
      "_blank",
      "noopener,noreferrer",
    )
  }
>
  Conhecer a Atlética
</button>
        </div>

        <div className="home-hero__stats">
          {stats.map((stat) => (
            <div className="home-stat" key={stat.label}>
              <strong className="home-stat__value">{stat.value}</strong>
              <span className="home-stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-hero__visual">
        <div className="event-panel">
          <div className="event-panel__header">
            <div className="event-panel__brand">
              <div className="event-panel__logo">
                <img src={logo} alt="Logo da Atlética T.I" />
              </div>

              <div>
                <span>Atlética T.I</span>
                <strong>Temporada ativa</strong>
              </div>
            </div>

            <span className="event-panel__online">
              <span />
              Online
            </span>
          </div>

          <div className="event-panel__ticket">
            <div className="event-ticket__main">
              <div className="event-ticket__top">
                <div>
                  <span className="event-ticket__eyebrow">Próximo evento</span>

                  <strong className="event-ticket__title">Em preparação</strong>
                </div>

                <span className="event-ticket__status">Pré-lançamento</span>
              </div>

              <p className="event-ticket__description">
                Uma nova experiência da Atlética T.I está sendo preparada. Os
                detalhes serão revelados em breve.
              </p>

              <div className="event-ticket__details">
                <div className="event-ticket__detail">
                  <FiCalendar />

                  <div>
                    <span>Data</span>
                    <strong>Em definição</strong>
                  </div>
                </div>

                <div className="event-ticket__detail">
                  <FiMapPin />

                  <div>
                    <span>Local</span>
                    <strong>UMC</strong>
                  </div>
                </div>

                <div className="event-ticket__detail">
                  <FiTag />

                  <div>
                    <span>Categoria</span>
                    <strong>Integração</strong>
                  </div>
                </div>
              </div>

              <div className="event-ticket__bottom">
                <div className="event-ticket__code">
                  <span>Código do evento</span>
                  <strong>ATI-UMC-2026</strong>
                </div>

                <div className="event-ticket__barcode" aria-hidden="true">
                  {Array.from({ length: 17 }).map((_, index) => (
                    <span key={index} />
                  ))}
                </div>
              </div>
            </div>

            <div className="event-ticket__stub">
              <span className="event-ticket__stub-label">Acesso digital</span>

              <div className="event-ticket__qr">
                <QRCodeSVG
                  value={`${window.location.origin}/eventos`}
                  size={72}
                  bgColor="#ffffff"
                  fgColor="#24102f"
                  level="H"
                  includeMargin={false}
                  title="QR Code para a página de eventos"
                />
              </div>

              <div className="event-ticket__number">
                <span>Voucher</span>
                <strong>0001</strong>
              </div>
            </div>
          </div>

          <div className="event-panel__footer">
            <div>
              <span>Status do evento</span>
              <strong>Produção em andamento</strong>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/eventos")}
              aria-label="Ver eventos"
            >
              <FiArrowRight />
            </button>
          </div>
        </div>

        <div className="home-floating-card home-floating-card--event">
          <span>Próximo evento</span>
          <strong>Em preparação</strong>
        </div>

        <div className="home-floating-card home-floating-card--status">
          <FiActivity />

          <div>
            <span>Status</span>
            <strong>Comunidade ativa</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function PartnersMainSlide({ onNavigate }: { onNavigate: NavigateFunction }) {
  return (
    <div className="home-hero__container home-main-slide">
      <div className="home-hero__content home-main-slide__copy">
        <div className="home-hero__eyebrow">
          <span className="home-hero__eyebrow-icon">
            <FiUsers />
          </span>

          <span>Empresas que acreditam na comunidade</span>
        </div>

        <h2 className="home-main-slide__title">
          Conexões que
          <span>transformam experiências.</span>
        </h2>

        <p className="home-hero__description">
          Parceiros que ajudam a criar oportunidades, benefícios e momentos
          inesquecíveis para os estudantes de tecnologia.
        </p>

        <div className="home-hero__actions">
          <button
            type="button"
            className="home-button home-button--primary"
            onClick={() => onNavigate("/parceiros")}
          >
            Conhecer parceiros
            <FiArrowRight />
          </button>

          <button
            type="button"
            className="home-button home-button--secondary"
            onClick={() => onNavigate("/contato")}
          >
            Ser parceiro
          </button>
        </div>
      </div>

      <div className="home-main-slide__visual">
        <div className="partners-panel">
          <div className="partners-panel__header">
            <span>Nossa rede</span>
            <strong>Parceiros oficiais</strong>
          </div>

          <div className="partners-panel__grid">
            {partners.map((partner) => (
              <article className="partner-item" key={partner.name}>
                <div className="partner-item__logo">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{
                      transform: `scale(${partner.scale ?? 1})`,
                    }}
                  />{" "}
                </div>

                <div className="partner-item__content">
                  <strong>{partner.name}</strong>
                  <span>{partner.category}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="partners-panel__footer">
            <span>Parcerias que conectam tecnologia e comunidade.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardMainSlide({ onNavigate }: { onNavigate: NavigateFunction }) {
  return (
    <div className="home-hero__container home-main-slide">
      <div className="home-hero__content home-main-slide__copy">
        <div className="home-hero__eyebrow">
          <span className="home-hero__eyebrow-icon">
            <FiActivity />
          </span>

          <span>Gestão responsável pela Atlética</span>
        </div>

        <h2 className="home-main-slide__title">
          Pessoas que
          <span>movem a comunidade.</span>
        </h2>

        <p className="home-hero__description">
          Uma diretoria formada por estudantes que transformam ideias em
          projetos, eventos e novas experiências.
        </p>

        <div className="home-hero__actions">
          <button
            type="button"
            className="home-button home-button--primary"
            onClick={() => onNavigate("/diretoria")}
          >
            Conhecer a diretoria
            <FiArrowRight />
          </button>

          <button
            type="button"
            className="home-button home-button--secondary"
            onClick={() => onNavigate("/contato")}
          >
            Falar com a gestão
          </button>
        </div>
      </div>

      <div className="home-main-slide__visual">
        <div className="board-panel">
          <div className="board-panel__header">
            <span>Gestão 2026</span>
            <strong>Diretoria da Atlética</strong>
          </div>

          <div className="board-panel__grid">
            {boardMembers.map((member, index) => (
              <article
                className={
                  index === 0 ? "board-item board-item--featured" : "board-item"
                }
                key={member.name}
              >
                <div className="board-item__avatar">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} loading="lazy" />
                  ) : (
                    <span>{member.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div className="board-item__content">
                  <span>{member.role}</span>
                  <strong>{member.name}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className="board-panel__footer">
            <span>Representação, organização e comunidade.</span>
          </div>
        </div>
      </div>
    </div>
  );
}