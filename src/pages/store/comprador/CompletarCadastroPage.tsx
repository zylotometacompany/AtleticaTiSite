// src/pages/store/comprador/CompletarCadastro.tsx

import { useMemo, useState, type FormEvent } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiHash,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";

import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../../../service/api";

import "./CompradorAuth.css";

interface GoogleUser {
  name: string;
  email: string;
  picture: string | null;
}

interface LocationState {
  from?: string;

  googleUser?: GoogleUser;
}

interface CompleteRegisterResponse {
  message: string;

  token: string;

  comprador: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string | null;
    rgm: string;
    curso: string;
    semestre: number;
    atleticaId: string;

    atletica?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

const courses = [
  {
    name: "Análise e Desenvolvimento de Sistemas",
    semesters: 4,
  },
  {
    name: "Engenharia de Software",
    semesters: 8,
  },
  {
    name: "Sistemas de Informação",
    semesters: 8,
  },
  {
    name: "Ciência da Computação",
    semesters: 8,
  },
];

const GOOGLE_REGISTER_TOKEN_KEY = "@atletica-ti-client:google-register-token";

const GOOGLE_REGISTER_USER_KEY = "@atletica-ti-client:google-register-user";

const COMPRADOR_TOKEN_KEY = "@atletica-ti-client:token";

const COMPRADOR_USER_KEY = "@atletica-ti-client:user";

export default function CompletarCadastroPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const state = location.state as LocationState | null;

  const storedGoogleUser = localStorage.getItem(GOOGLE_REGISTER_USER_KEY);

  const googleUser: GoogleUser | null =
    state?.googleUser ??
    (storedGoogleUser ? JSON.parse(storedGoogleUser) : null);

  const from = state?.from ?? "/minha-conta/compras";

  const [cpf, setCpf] = useState("");

  const [phone, setPhone] = useState("");

  const [rgm, setRgm] = useState("");

  const [curso, setCurso] = useState("");

  const [semestre, setSemestre] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const selectedCourse = useMemo(() => {
    return courses.find((item) => item.name === curso);
  }, [curso]);

  const semesters = useMemo(() => {
    if (!selectedCourse) {
      return [];
    }

    return Array.from(
      {
        length: selectedCourse.semesters,
      },

      (_, index) => index + 1,
    );
  }, [selectedCourse]);

  function formatCpf(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);

      const registerToken = localStorage.getItem(GOOGLE_REGISTER_TOKEN_KEY);

      if (!registerToken) {
        throw new Error(
          "Sua validação com o Google expirou. Entre novamente com sua conta Google.",
        );
      }

      if (!cpf) {
        throw new Error("Informe o CPF.");
      }

      if (!phone) {
        throw new Error("Informe o telefone.");
      }

      if (!rgm.trim()) {
        throw new Error("Informe o RGM.");
      }

      if (!curso) {
        throw new Error("Selecione o curso.");
      }

      if (!semestre) {
        throw new Error("Selecione o semestre.");
      }

      setIsSubmitting(true);

      const response = await api.post<CompleteRegisterResponse>(
        "/comprador/auth/complete-register",

        {
          cpf: cpf.replace(/\D/g, ""),

          phone: phone.replace(/\D/g, ""),

          rgm: rgm.trim(),

          curso,

          semestre: Number(semestre),
        },

        {
          headers: {
            Authorization: `Bearer ${registerToken}`,
          },
        },
      );

      /*
       * CADASTRO TERMINADO.
       * AGORA É JWT NORMAL.
       */
      localStorage.setItem(COMPRADOR_TOKEN_KEY, response.data.token);

      localStorage.setItem(
        COMPRADOR_USER_KEY,
        JSON.stringify(response.data.comprador),
      );

      /*
       * LIMPA DADOS
       * TEMPORÁRIOS DO GOOGLE.
       */
      localStorage.removeItem(GOOGLE_REGISTER_TOKEN_KEY);

      localStorage.removeItem(GOOGLE_REGISTER_USER_KEY);

      navigate(from, {
        replace: true,
      });
    } catch (requestError: unknown) {
      let message = "Não foi possível concluir seu cadastro.";

      if (
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError
      ) {
        const apiError = requestError as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = apiError.response?.data?.message ?? message;
      } else if (requestError instanceof Error) {
        message = requestError.message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    localStorage.removeItem(GOOGLE_REGISTER_TOKEN_KEY);

    localStorage.removeItem(GOOGLE_REGISTER_USER_KEY);

    navigate("/register");
  }

  return (
    <main
      className="
        buyer-auth-page
        buyer-auth-register-page
      "
    >
      <div className="buyer-auth-grid" />

      <div className="buyer-auth-container">
        <button type="button" className="buyer-auth-back" onClick={handleBack}>
          <FiArrowLeft />
          Trocar conta Google
        </button>

        <div
          className="
            buyer-auth-layout
            buyer-auth-register-layout
          "
        >
          {/*
           * HERO
           */}
          <section className="buyer-auth-hero">
            <span className="buyer-auth-eyebrow">Atlética T.I. Store</span>

            <h1>
              Falta bem <em>pouco.</em>
            </h1>

            <p className="buyer-auth-description">
              Sua identidade Google já foi confirmada. Agora precisamos apenas
              dos seus dados acadêmicos para finalizar o cadastro.
            </p>

            <div className="buyer-auth-benefits">
              <div className="buyer-auth-benefit">
                <span>
                  <FiCheckCircle />
                </span>

                <div>
                  <strong>Google verificado</strong>

                  <p>Seu nome e e-mail já foram confirmados.</p>
                </div>
              </div>

              <div className="buyer-auth-benefit">
                <span>
                  <FiShield />
                </span>

                <div>
                  <strong>Cadastro protegido</strong>

                  <p>
                    Os dados acadêmicos ajudam a identificar corretamente cada
                    comprador.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                buyer-auth-orb
                buyer-auth-orb-one
              "
            />

            <div
              className="
                buyer-auth-orb
                buyer-auth-orb-two
              "
            />
          </section>

          {/*
           * CARD
           */}
          <section className="buyer-auth-card">
            <div className="buyer-auth-card-header">
              <span className="buyer-auth-card-icon">
                <FiUser />
              </span>

              <div>
                <h2>Complete seu cadastro</h2>

                <p>Informe seus dados acadêmicos.</p>
              </div>
            </div>

            <form className="buyer-auth-form" onSubmit={handleSubmit}>
              {/*
               * CONTA GOOGLE
               */}
              {googleUser && (
                <div className="buyer-google-profile">
                  {googleUser.picture ? (
                    <img src={googleUser.picture} alt="" />
                  ) : (
                    <div className="buyer-google-profile-fallback">
                      {googleUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <span>Conta Google confirmada</span>

                    <strong>{googleUser.name}</strong>

                    <p>{googleUser.email}</p>
                  </div>

                  <FiCheckCircle />
                </div>
              )}

              {/*
               * CPF + TELEFONE
               */}
              <div className="buyer-auth-form-grid">
                <div className="buyer-auth-field">
                  <label htmlFor="buyer-complete-cpf">CPF</label>

                  <div className="buyer-auth-input">
                    <span className="buyer-auth-text-icon">CPF</span>

                    <input
                      id="buyer-complete-cpf"
                      type="text"
                      value={cpf}
                      onChange={(event) =>
                        setCpf(formatCpf(event.target.value))
                      }
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      maxLength={14}
                      required
                    />
                  </div>
                </div>

                <div className="buyer-auth-field">
                  <label htmlFor="buyer-complete-phone">Telefone</label>

                  <div className="buyer-auth-input">
                    <FiPhone />

                    <input
                      id="buyer-complete-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(formatPhone(event.target.value))
                      }
                      placeholder="(11) 99999-9999"
                      autoComplete="tel"
                      maxLength={15}
                      required
                    />
                  </div>
                </div>
              </div>

              {/*
               * RGM + CURSO
               */}
              <div className="buyer-auth-form-grid">
                <div className="buyer-auth-field">
                  <label htmlFor="buyer-complete-rgm">RGM</label>

                  <div className="buyer-auth-input">
                    <FiHash />

                    <input
                      id="buyer-complete-rgm"
                      type="text"
                      value={rgm}
                      onChange={(event) =>
                        setRgm(event.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Registro do aluno"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                <div className="buyer-auth-field">
                  <label htmlFor="buyer-complete-course">Curso</label>

                  <div
                    className="
                      buyer-auth-input
                      buyer-auth-select
                    "
                  >
                    <FiBookOpen />

                    <select
                      id="buyer-complete-course"
                      value={curso}
                      onChange={(event) => {
                        setCurso(event.target.value);

                        setSemestre("");
                      }}
                      required
                    >
                      <option value="">Selecionar curso</option>

                      {courses.map((course) => (
                        <option key={course.name} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/*
               * SEMESTRE
               */}
              <div className="buyer-auth-field">
                <label htmlFor="buyer-complete-semester">Semestre</label>

                <div
                  className="
                    buyer-auth-input
                    buyer-auth-select
                  "
                >
                  <span className="buyer-auth-text-icon">S</span>

                  <select
                    id="buyer-complete-semester"
                    value={semestre}
                    onChange={(event) => setSemestre(event.target.value)}
                    disabled={!curso}
                    required
                  >
                    <option value="">
                      {curso
                        ? "Selecionar semestre"
                        : "Selecione o curso primeiro"}
                    </option>

                    {semesters.map((semester) => (
                      <option key={semester} value={String(semester)}>
                        {semester}º semestre
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="buyer-auth-error" role="alert">
                  <strong>!</strong>

                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="buyer-auth-submit"
                disabled={isSubmitting}
              >
                <span>
                  {isSubmitting
                    ? "Finalizando cadastro..."
                    : "Finalizar cadastro"}
                </span>

                {isSubmitting ? (
                  <span className="buyer-auth-spinner" />
                ) : (
                  <FiArrowRight />
                )}
              </button>

              <p className="buyer-auth-footer">
                Seu nome e e-mail foram confirmados pela sua conta Google. Os
                demais dados serão usados para identificação da sua conta e dos
                seus pedidos.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
