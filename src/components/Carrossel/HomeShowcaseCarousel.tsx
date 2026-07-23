import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiTag,
} from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

import logo from "../../assets/logo.jpg";
import "./HomeShowcaseCarousel.css";

const slides = ["evento", "parceiros", "diretoria"] as const;
type Slide = (typeof slides)[number];

const partners = [
  { name: "Zyloto", category: "Tecnologia", initials: "ZY" },
  { name: "Parceiro 02", category: "Benefícios", initials: "P2" },
  { name: "Parceiro 03", category: "Experiências", initials: "P3" },
  { name: "Parceiro 04", category: "Comunidade", initials: "P4" },
];

const boardMembers = [
  { name: "Nome do Presidente", role: "Presidência", initials: "NP" },
  { name: "Nome do Vice", role: "Vice-presidência", initials: "NV" },
  { name: "Nome do Diretor", role: "Diretoria de Eventos", initials: "ND" },
];

interface HomeShowcaseCarouselProps {
  onNavigate: (path: string) => void;
}

export default function HomeShowcaseCarousel({
  onNavigate,
}: HomeShowcaseCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  function changeSlide(index: number) {
    const next = (index + slides.length) % slides.length;

    if (!document.startViewTransition) {
      setActive(next);
      return;
    }

    document.startViewTransition(() => setActive(next));
  }

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [paused]);

  const current: Slide = slides[active];

  return (
    <div
      className="hero-showcase-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-showcase-carousel__arrows">
        <button type="button" onClick={() => changeSlide(active - 1)} aria-label="Slide anterior">
          <FiArrowLeft />
        </button>
        <button type="button" onClick={() => changeSlide(active + 1)} aria-label="Próximo slide">
          <FiArrowRight />
        </button>
      </div>

      <div className="hero-showcase-carousel__viewport" key={current}>
        {current === "evento" && <EventSlide onNavigate={onNavigate} />}
        {current === "parceiros" && <PartnersSlide onNavigate={onNavigate} />}
        {current === "diretoria" && <BoardSlide onNavigate={onNavigate} />}
      </div>

      <div className="hero-showcase-carousel__dots" role="tablist" aria-label="Destaques">
        {slides.map((slide, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Exibir ${slide}`}
            className={index === active ? "is-active" : ""}
            onClick={() => changeSlide(index)}
            key={slide}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}

function CardHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="showcase-card__header">
      <div className="showcase-card__brand">
        <img src={logo} alt="Logo da Atlética T.I" />
        <div>
          <span>Atlética T.I</span>
          <strong>{subtitle}</strong>
        </div>
      </div>
      <span className="showcase-card__online"><i />Online</span>
    </div>
  );
}

function CardFooter({
  label,
  value,
  button,
  onClick,
}: {
  label: string;
  value: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="showcase-card__footer">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <button type="button" onClick={onClick}>
        {button}
        <FiArrowRight />
      </button>
    </div>
  );
}

function EventSlide({ onNavigate }: HomeShowcaseCarouselProps) {
  return (
    <article className="showcase-card showcase-card--event">
      <CardHeader subtitle="Temporada ativa" />

      <div className="event-ticket">
        <div className="event-ticket__main">
          <div className="event-ticket__top">
            <div>
              <span>Próximo evento</span>
              <h2>Em preparação</h2>
            </div>
            <b>Pré-lançamento</b>
          </div>

          <p>
            Uma nova experiência da Atlética T.I está sendo preparada. Os detalhes serão revelados em breve.
          </p>

          <div className="event-ticket__details">
            <div><FiCalendar /><span>Data<strong>Em definição</strong></span></div>
            <div><FiMapPin /><span>Local<strong>UMC</strong></span></div>
            <div><FiTag /><span>Categoria<strong>Integração</strong></span></div>
          </div>

          <div className="event-ticket__code">
            <span>Código de acesso</span>
            <strong>ATI-EVENTO-2026</strong>
          </div>
        </div>

        <aside className="event-ticket__stub">
          <span>Acesso digital</span>
          <div className="event-ticket__qr">
            <QRCodeSVG
              value={`${window.location.origin}/eventos`}
              size={78}
              bgColor="#ffffff"
              fgColor="#24102f"
              level="H"
            />
          </div>
          <small>Voucher</small>
          <strong>0001</strong>
        </aside>
      </div>

      <CardFooter
        label="Status do evento"
        value="Produção em andamento"
        button="Ver eventos"
        onClick={() => onNavigate("/eventos")}
      />
    </article>
  );
}

function PartnersSlide({ onNavigate }: HomeShowcaseCarouselProps) {
  return (
    <article className="showcase-card showcase-card--partners">
      <CardHeader subtitle="Rede de parceiros" />

      <div className="partners-slide">
        <div className="showcase-heading">
          <span>Quem constrói junto</span>
          <h2>Parceiros da Atlética</h2>
          <p>Marcas que apoiam experiências, benefícios e oportunidades para a comunidade de tecnologia.</p>
        </div>

        <div className="partners-slide__grid">
          {partners.map((partner) => (
            <div className="partner-card" key={partner.name}>
              <div className="partner-card__logo">{partner.initials}</div>
              <div>
                <strong>{partner.name}</strong>
                <span>{partner.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CardFooter
        label="Parcerias"
        value="Conexões que geram valor"
        button="Ver parceiros"
        onClick={() => onNavigate("/parceiros")}
      />
    </article>
  );
}

function BoardSlide({ onNavigate }: HomeShowcaseCarouselProps) {
  return (
    <article className="showcase-card showcase-card--board">
      <CardHeader subtitle="Gestão 2026" />

      <div className="board-slide">
        <div className="showcase-heading">
          <span>Por trás da comunidade</span>
          <h2>Diretoria da Atlética</h2>
          <p>Pessoas responsáveis por transformar ideias em eventos, projetos e novas experiências.</p>
        </div>

        <div className="board-slide__grid">
          {boardMembers.map((member, index) => (
            <article className={index === 0 ? "board-card board-card--featured" : "board-card"} key={member.name}>
              <div className="board-card__avatar">{member.initials}</div>
              <div>
                <span>{member.role}</span>
                <strong>{member.name}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>

      <CardFooter
        label="Gestão atual"
        value="Representação e comunidade"
        button="Ver diretoria"
        onClick={() => onNavigate("/diretoria")}
      />
    </article>
  );
}
