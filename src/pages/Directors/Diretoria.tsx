import {
  FiArrowLeft,
  FiInstagram,
  FiUsers,
} from "react-icons/fi";

import { useViewTransitionNavigate } from "../../hooks/useViewTransitionNavigate";

import kairon from "../../assets/kairon-removed.png";
import pablo from "../../assets/pablo-removebg-preview.png";
import araujo from "../../assets/ana.png"
import bianca from "../../assets/bia.png"
import isabela from "../../assets/WhatsApp_Image_2026-07-24_at_10.17.13-removebg-preview.png"
import livia from "../../assets/WhatsApp Image 2026-08-15 at 18.59.57.jpeg"

import "./Diretoria.css";

interface BoardMember {
  name: string;
  role: string;
  photo?: string;
}

interface MemberCardProps {
  member: BoardMember;
  variant?:
    | "default"
    | "president"
    | "vice"
    | "director";
}

const president: BoardMember = {
  name: "Kairon",
  role: "Presidência",
  photo: kairon,
};

const vicePresident: BoardMember = {
  name: "Pablo",
  role: "Vice-presidência",
  photo: pablo,
};

const eventDirector: BoardMember = {
  name: "Araújo",
  role: "Diretora Geral",
    photo: araujo,

};

const commercialDirectors: BoardMember[] = [
  {
    name: "Bianca Ordine ",
    role: "Diretora de Eventos",
      photo: bianca,

  },
  {
    name: "Isabela Rocheto",
    role: "Diretora Comercial",
      photo: isabela,

  },
   {
    name: "Lívia",
    role: "Secretaria",
      photo: livia,

  },
];

export default function Diretoria() {
  const transitionNavigate =
    useViewTransitionNavigate();

  function handleBack() {
    transitionNavigate("/");
  }

  function openInstagram() {
    window.open(
      "https://instagram.com/atleticatiumc",
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="board-page">
      <div
        className="board-page__effects"
        aria-hidden="true"
      >
        <span className="board-page__grid" />

        <span className="board-page__glow board-page__glow--one" />

        <span className="board-page__glow board-page__glow--two" />
      </div>

      <div className="board-page__container">
        <header className="board-page__header">
          <button
            type="button"
            className="board-page__back"
            onClick={handleBack}
          >
            <FiArrowLeft />
            Voltar para o início
          </button>

          <button
            type="button"
            className="board-page__instagram"
            onClick={openInstagram}
          >
            <FiInstagram />
            Instagram
          </button>
        </header>

        <section className="board-page__content">
          <div className="board-page__heading">
            <div className="board-page__eyebrow">
              <span>
                <FiUsers />
              </span>

              Gestão 2026
            </div>

            <h1>
              Diretoria da
              <span>Atlética T.I</span>
            </h1>

            <p>
              Conheça as pessoas responsáveis por
              representar, organizar e movimentar a
              comunidade dos cursos de tecnologia.
            </p>
          </div>

          <div className="organization-chart">
            <div className="organization-chart__leadership">
              <MemberCard
                member={president}
                variant="president"
              />

              <div
                className="organization-chart__vertical-line"
                aria-hidden="true"
              />

              <MemberCard
                member={vicePresident}
                variant="vice"
              />

              <div
                className="organization-chart__vertical-line"
                aria-hidden="true"
              />

              <MemberCard
                member={eventDirector}
                variant="director"
              />
            </div>

            <div
              className="organization-chart__trunk"
              aria-hidden="true"
            />

            <div className="organization-chart__directors">
              {commercialDirectors.map((director) => (
                <div
                  className="organization-chart__director"
                  key={director.name}
                >
                  <span
                    className="organization-chart__branch"
                    aria-hidden="true"
                  />

                  <MemberCard member={director} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="board-page__footer">
          <span>
            Atlética T.I · Universidade de Mogi das
            Cruzes
          </span>

          <span>Gestão 2026</span>
        </footer>
      </div>
    </main>
  );
}

function MemberCard({
  member,
  variant = "default",
}: MemberCardProps) {
  return (
    <article
      className={`board-member board-member--${variant}`}
    >
      <div className="board-member__avatar">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
          />
        ) : (
          <span>{getInitials(member.name)}</span>
        )}
      </div>

      <div className="board-member__content">
        <span>{member.role}</span>

        <strong>{member.name}</strong>
      </div>
    </article>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}