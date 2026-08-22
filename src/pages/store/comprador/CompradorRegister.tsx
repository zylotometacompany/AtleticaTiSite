import { useMemo, useState, type FormEvent } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiHash,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";

import { Link, useLocation, useNavigate } from "react-router-dom";

import "./CompradorAuth.css";
import { useRegisterComprador } from "../../../hooks/store/comprador/useRegisterComprador";

interface LocationState {
  from?: string;
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

export default function CompradorRegisterPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { register, isRegistering, error } = useRegisterComprador();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [cpf, setCpf] = useState("");

  const [phone, setPhone] = useState("");

  const [rgm, setRgm] = useState("");

  const [curso, setCurso] = useState("");

  const [semestre, setSemestre] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [localError, setLocalError] = useState<string | null>(null);

  const state = location.state as LocationState | null;

  const from = state?.from ?? "/loja";

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

    setLocalError(null);

    if (!curso) {
      setLocalError("Selecione o curso.");

      return;
    }

    if (!semestre) {
      setLocalError("Selecione o semestre.");

      return;
    }

    if (password.length < 6) {
      setLocalError("A senha deve possuir pelo menos 6 caracteres.");

      return;
    }

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem.");

      return;
    }

    try {
      await register({
        name: name.trim(),

        email: email.trim(),

        cpf,

        phone,

        rgm: rgm.trim(),

        curso,

        semestre: Number(semestre),

        password,
      });

      navigate(from, {
        replace: true,
      });
    } catch {
      /*
       * O hook controla
       * os erros da API.
       */
    }
  }

  function handleBack() {
    navigate("/loja");
  }

  const displayedError = localError ?? error;

  return (
    <main className="buyer-auth-page buyer-auth-register-page">
      <div className="buyer-auth-grid" />

      <div className="buyer-auth-container">
        <button type="button" className="buyer-auth-back" onClick={handleBack}>
          <FiArrowLeft />
          Voltar para a loja
        </button>

        <div className="buyer-auth-layout buyer-auth-register-layout">
          <section className="buyer-auth-hero">
            <span className="buyer-auth-eyebrow">Atlética T.I. Store</span>

            <h1>
              Crie sua <em>conta.</em>
            </h1>

            <p className="buyer-auth-description">
              Faça seu cadastro para comprar, identificar seus pedidos e
              acompanhar cada etapa da compra.
            </p>

            <div className="buyer-auth-benefits">
              <div className="buyer-auth-benefit">
                <span>
                  <FiShoppingBag />
                </span>

                <div>
                  <strong>Histórico de compras</strong>

                  <p>Seus pedidos ficam associados ao seu cadastro.</p>
                </div>
              </div>

              <div className="buyer-auth-benefit">
                <span>
                  <FiShield />
                </span>

                <div>
                  <strong>Mais segurança</strong>

                  <p>
                    A autenticação ajuda a identificar e proteger cada compra
                    realizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="buyer-auth-orb buyer-auth-orb-one" />

            <div className="buyer-auth-orb buyer-auth-orb-two" />
          </section>

          <section className="buyer-auth-card">
            <div className="buyer-auth-card-header">
              <span className="buyer-auth-card-icon">
                <FiUser />
              </span>

              <div>
                <h2>Criar conta</h2>

                <p>Preencha seus dados para continuar.</p>
              </div>
            </div>

            <form className="buyer-auth-form" onSubmit={handleSubmit}>
              <div className="buyer-auth-field">
                <label htmlFor="buyer-register-name">Nome completo</label>

                <div className="buyer-auth-input">
                  <FiUser />

                  <input
                    id="buyer-register-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Digite seu nome completo"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="buyer-auth-field">
                <label htmlFor="buyer-register-email">E-mail</label>

                <div className="buyer-auth-input">
                  <FiMail />

                  <input
                    id="buyer-register-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nome@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="buyer-auth-form-grid">
                <div className="buyer-auth-field">
                  <label htmlFor="buyer-register-cpf">CPF</label>

                  <div className="buyer-auth-input">
                    <span className="buyer-auth-text-icon">CPF</span>

                    <input
                      id="buyer-register-cpf"
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
                  <label htmlFor="buyer-register-phone">Telefone</label>

                  <div className="buyer-auth-input">
                    <FiPhone />

                    <input
                      id="buyer-register-phone"
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

              <div className="buyer-auth-form-grid">
                <div className="buyer-auth-field">
                  <label htmlFor="buyer-register-rgm">RGM</label>

                  <div className="buyer-auth-input">
                    <FiHash />

                    <input
                      id="buyer-register-rgm"
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
                  <label htmlFor="buyer-register-course">Curso</label>

                  <div className="buyer-auth-input buyer-auth-select">
                    <FiBookOpen />

                    <select
                      id="buyer-register-course"
                      value={curso}
                      onChange={(event) => {
                        setCurso(event.target.value);

                        setSemestre("");
                      }}
                      required
                    >
                      <option value="">Selecionar curso</option>

                      {courses.map((course) => (
                        <option value={course.name} key={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="buyer-auth-field">
                <label htmlFor="buyer-register-semester">Semestre</label>

                <div className="buyer-auth-input buyer-auth-select">
                  <span className="buyer-auth-text-icon">S</span>

                  <select
                    id="buyer-register-semester"
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
                      <option value={String(semester)} key={semester}>
                        {semester}º semestre
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="buyer-auth-form-grid">
                <div className="buyer-auth-field">
                  <label htmlFor="buyer-register-password">Senha</label>

                  <div className="buyer-auth-input">
                    <FiLock />

                    <input
                      id="buyer-register-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="buyer-auth-field">
                  <label htmlFor="buyer-register-confirm">
                    Confirmar senha
                  </label>

                  <div className="buyer-auth-input">
                    <FiLock />

                    <input
                      id="buyer-register-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Repita sua senha"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
              </div>

              {displayedError && (
                <div className="buyer-auth-error" role="alert">
                  <strong>!</strong>

                  <p>{displayedError}</p>
                </div>
              )}

              <button
                type="submit"
                className="buyer-auth-submit"
                disabled={isRegistering}
              >
                <span>
                  {isRegistering
                    ? "Criando conta..."
                    : "Criar conta e continuar"}
                </span>

                {isRegistering ? (
                  <span className="buyer-auth-spinner" />
                ) : (
                  <FiArrowRight />
                )}
              </button>

              <div className="buyer-auth-divider">
                <span />

                <p>já possui conta?</p>

                <span />
              </div>

              <Link
                to="/login"
                state={{
                  from,
                }}
                className="buyer-auth-secondary"
              >
                <FiLock />
                Entrar na minha conta
              </Link>

              <p className="buyer-auth-footer">
                Seus dados serão utilizados para identificar sua conta, seus
                pedidos e as compras realizadas na loja.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
