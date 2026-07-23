import { FiUser } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

import logo from "../../assets/logo.jpg";

import "./ZCardPreview.css";

type ZCardPlan = "MENSAL" | "SEMESTRAL";

interface ZCardPreviewProps {
  name?: string;
  course?: string;
  rgm?: string;
  semester?: string;
  plan?: ZCardPlan;
  photoUrl?: string;
}

export default function ZCardPreview({
  name = "",
  course = "",
  rgm = "",
  semester = "",
  plan = "MENSAL",
  photoUrl = "",
}: ZCardPreviewProps) {
  const badge = plan === "SEMESTRAL" ? "PREMIUM" : "BRONZE";

  return (
    <article className="zcard-card">
      <div className="zcard-card__effects" aria-hidden="true">
        <span />
        <span />
      </div>

      <header className="zcard-card__header">
        <div className="zcard-card__brand">
          <img src={logo} alt="Atlética T.I" />

          <div>
            <span>Atlética T.I</span>
            <strong>ZCARD</strong>
          </div>
        </div>

        <span className="zcard-card__badge">{badge}</span>
      </header>

      <section className="zcard-card__body">
        <div className="zcard-card__identity">
          <span>Membro</span>

          <strong>{name || "SEU NOME AQUI"}</strong>

          <small>
            {course || "CURSO DE TECNOLOGIA"}
            {semester ? ` • ${semester}º SEMESTRE` : ""}
          </small>
        </div>

        <div className="zcard-card__photo">
          {photoUrl ? (
            <img src={photoUrl} alt={`Foto de ${name || "aluno"}`} />
          ) : (
            <FiUser aria-hidden="true" />
          )}
        </div>
      </section>

      <footer className="zcard-card__footer">
        <div className="zcard-card__data">
          <div>
            <span>RGM</span>
            <strong>{rgm || "00000000"}</strong>
          </div>

          <div>
            <span>Validade</span>
            <strong>12/2026</strong>
          </div>
        </div>

        <div className="zcard-card__qr">
          <QRCodeSVG
            value={`zcard:${rgm || "preview"}`}
            size={62}
            bgColor="#ffffff"
            fgColor="#24102f"
            level="H"
            includeMargin={false}
            title="QR Code do ZCard"
          />
        </div>
      </footer>
    </article>
  );
}