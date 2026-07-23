import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiFileText,
  FiLock,
  FiShield,
  FiUploadCloud,
} from "react-icons/fi";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import logo from "../../assets/logo.jpg";

import {
  zcardRequestSchema,
  type ZCardRequestData,
} from "./zCardRequestSchema";

import ZCardPreview from "../../components/zCardPreview/zcardPreview";

import "./ZCardRequest.css";
import { useCreateZCardRequest } from "../../hooks/useZCardRequest";
import { toast } from "sonner";
import { api } from "../../service/api";

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

const ZCARD_ATLETICA_SLUG = "tiumcatletica";

const fieldsByStep: Record<1 | 2 | 3, (keyof ZCardRequestData)[]> = {
  1: ["name", "cpf", "rgm", "email", "whatsapp"],

  2: ["course", "semester", "photo", "studentCard"],

  3: ["plan", "acceptedTerms"],
};

type UploadField = "photo" | "studentCard";

type DocumentUploadProps = {
  field: UploadField;
  title: string;
  description: string;
  file?: File;
  error?: string;
  icon?: "photo" | "document";
  onChange: (field: UploadField, event: ChangeEvent<HTMLInputElement>) => void;
};

function formatCpf(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatWhatsapp(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function DocumentUpload({
  field,
  title,
  description,
  file,
  error,
  icon = "document",
  onChange,
}: DocumentUploadProps) {
  return (
    <label
      className="zcard-photo zcard-field--full"
      data-has-file={file instanceof File}
      data-has-error={Boolean(error)}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => onChange(field, event)}
      />

      {icon === "photo" ? <FiUploadCloud /> : <FiFileText />}

      <div>
        <strong>{file instanceof File ? file.name : title}</strong>

        <span>{description}</span>

        {file instanceof File && (
          <small>
            Arquivo selecionado — {(file.size / 1024 / 1024).toFixed(2)} MB
          </small>
        )}

        {error && <small className="zcard-field__error">{error}</small>}
      </div>
    </label>
  );
}

export default function ZCardRequest() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [submitted, setSubmitted] = useState(false);

  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(()=>{
    const loadTeste = async () => {
            await api.get("/cors-test")
  .then(response => console.log(response.data))
  .catch(error => console.log(error));
    }

    loadTeste()
  },[])
  const {
    createRequest,
    response,
    error: requestError,
  } = useCreateZCardRequest();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    trigger,

    formState: { errors, isSubmitting },
  } = useForm<ZCardRequestData>({
    resolver: zodResolver(zcardRequestSchema),

    mode: "onTouched",

    defaultValues: {
      name: "",
      cpf: "",
      rgm: "",
      email: "",
      whatsapp: "",

      course: "",
      semester: "",

      plan: "MENSAL",

      photo: undefined,
      studentCard: undefined,

      acceptedTerms: undefined,
    },
  });

  const formData = useWatch({
    control,
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course.name === formData.course),
    [formData.course],
  );

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

  const selectedDocumentsCount = useMemo(() => {
    const files = [formData.photo, formData.studentCard];

    return files.filter((file) => file instanceof File).length;
  }, [formData.photo, formData.studentCard]);

  useEffect(() => {
    const photo = formData.photo;

    if (!(photo instanceof File)) {
      setPhotoPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(photo);

    setPhotoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [formData.photo]);

  async function goToNextStep() {
    const isCurrentStepValid = await trigger(fieldsByStep[step], {
      shouldFocus: true,
    });

    if (!isCurrentStepValid || step === 3) {
      return;
    }

    setStep((current) => (current + 1) as 1 | 2 | 3);
  }

  function goToPreviousStep() {
    setStep((current) => Math.max(1, current - 1) as 1 | 2 | 3);
  }

  function handleFileChange(
    field: UploadField,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setValue(field, file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    /*
     * Permite selecionar novamente o mesmo arquivo
     * caso o usuário queira substituí-lo.
     */
    event.target.value = "";
  }

  async function submitZCard(data: ZCardRequestData) {
    try {
      await createRequest(ZCARD_ATLETICA_SLUG, data);

      setSubmitted(true);
      reset();
    } catch {
     toast.error("erro")
    }
  }

  if (submitted) {
    return (
      <main className="zcard-request zcard-request--success">
        <section className="zcard-success">
          <div className="zcard-success__icon">
            <FiCheck />
          </div>

          <span>Solicitação recebida</span>

          <h1>Credenciamento enviado.</h1>

          <p>
            A Atlética T.I analisará os dados e documentos enviados e informará
            as próximas instruções pelos canais cadastrados.
          </p>

          {response?.socio?.id && (
            <div className="zcard-success__protocol">
              <span>Protocolo da solicitação</span>

              <strong>{response.socio.id}</strong>
            </div>
          )}

          <button type="button">Fazer nova solicitação</button>
        </section>
      </main>
    );
  }

  return (
    <main className="zcard-request">
      <div className="zcard-request__effects" aria-hidden="true" />

      <header className="zcard-request__header">
        <div className="zcard-request__brand">
          <img src={logo} alt="Atlética T.I" />

          <div>
            <span>Atlética T.I</span>

            <strong>Credenciamento ZCard</strong>
          </div>
        </div>

        <span className="zcard-request__secure">
          <FiLock />
          Ambiente protegido
        </span>
      </header>

      <section className="zcard-request__layout">
        <div>
          <div className="zcard-request__intro">
            <span className="zcard-request__eyebrow">
              <FiCreditCard />
              Solicitar credenciamento
            </span>

            <h1>
              Entrar para o ZCard.
              <span>Começar por aqui.</span>
            </h1>

            <p>
              Preencher os dados, enviar os documentos, escolher o plano e
              encaminhar a solicitação para análise da Atlética T.I.
            </p>
          </div>

          <div className="zcard-steps">
            {["Dados pessoais", "Dados acadêmicos", "Confirmação"].map(
              (label, index) => {
                const number = (index + 1) as 1 | 2 | 3;

                return (
                  <div
                    className={
                      number === step
                        ? "zcard-step zcard-step--active"
                        : number < step
                          ? "zcard-step zcard-step--done"
                          : "zcard-step"
                    }
                    key={label}
                  >
                    <span>{number < step ? <FiCheck /> : number}</span>

                    <strong>{label}</strong>
                  </div>
                );
              },
            )}
          </div>

          <form
            className="zcard-form"
            onSubmit={handleSubmit(submitZCard)}
            noValidate
          >
            {step === 1 && (
              <div className="zcard-form__grid">
                <label className="zcard-field zcard-field--full">
                  <span>Nome completo</span>

                  <input
                    {...register("name")}
                    placeholder="Como aparecerá no ZCard"
                    aria-invalid={Boolean(errors.name)}
                  />

                  {errors.name && (
                    <small className="zcard-field__error">
                      {errors.name.message}
                    </small>
                  )}
                </label>

                <label className="zcard-field">
                  <span>CPF</span>

                  <input
                    {...register("cpf")}
                    value={formData.cpf ?? ""}
                    onChange={(event) =>
                      setValue("cpf", formatCpf(event.target.value), {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    aria-invalid={Boolean(errors.cpf)}
                  />

                  {errors.cpf && (
                    <small className="zcard-field__error">
                      {errors.cpf.message}
                    </small>
                  )}
                </label>

                <label className="zcard-field">
                  <span>RGM</span>

                  <input
                    {...register("rgm")}
                    inputMode="numeric"
                    placeholder="Registro do aluno"
                    aria-invalid={Boolean(errors.rgm)}
                  />

                  {errors.rgm && (
                    <small className="zcard-field__error">
                      {errors.rgm.message}
                    </small>
                  )}
                </label>

                <label className="zcard-field">
                  <span>E-mail</span>

                  <input
                    type="email"
                    {...register("email")}
                    placeholder="nome@email.com"
                    aria-invalid={Boolean(errors.email)}
                  />

                  {errors.email && (
                    <small className="zcard-field__error">
                      {errors.email.message}
                    </small>
                  )}
                </label>

                <label className="zcard-field">
                  <span>WhatsApp</span>

                  <input
                    {...register("whatsapp")}
                    value={formData.whatsapp ?? ""}
                    onChange={(event) =>
                      setValue("whatsapp", formatWhatsapp(event.target.value), {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    aria-invalid={Boolean(errors.whatsapp)}
                  />

                  {errors.whatsapp && (
                    <small className="zcard-field__error">
                      {errors.whatsapp.message}
                    </small>
                  )}
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="zcard-form__grid">
                <label className="zcard-field zcard-field--full">
                  <span>Curso</span>

                  <select
                    {...register("course")}
                    onChange={(event) => {
                      setValue("course", event.target.value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });

                      setValue("semester", "", {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                    aria-invalid={Boolean(errors.course)}
                  >
                    <option value="">Selecionar curso</option>

                    {courses.map((course) => (
                      <option value={course.name} key={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>

                  {errors.course && (
                    <small className="zcard-field__error">
                      {errors.course.message}
                    </small>
                  )}
                </label>

                <label className="zcard-field zcard-field--full">
                  <span>Semestre</span>

                  <select
                    {...register("semester")}
                    disabled={!formData.course}
                    aria-invalid={Boolean(errors.semester)}
                  >
                    <option value="">Selecionar semestre</option>

                    {semesters.map((semester) => (
                      <option value={String(semester)} key={semester}>
                        {semester}º semestre
                      </option>
                    ))}
                  </select>

                  {errors.semester && (
                    <small className="zcard-field__error">
                      {errors.semester.message}
                    </small>
                  )}
                </label>

                <DocumentUpload
                  field="photo"
                  title="Enviar foto pessoal"
                  description="Imagem frontal, nítida e com boa iluminação."
                  file={
                    formData.photo instanceof File ? formData.photo : undefined
                  }
                  error={errors.photo?.message}
                  icon="photo"
                  onChange={handleFileChange}
                />

                <DocumentUpload
                  field="studentCard"
                  title="Enviar carteirinha estudantil"
                  description="A imagem deve permitir a leitura do nome, curso e matrícula."
                  file={
                    formData.studentCard instanceof File
                      ? formData.studentCard
                      : undefined
                  }
                  error={errors.studentCard?.message}
                  onChange={handleFileChange}
                />
              </div>
            )}

            {step === 3 && (
              <>
                <div className="zcard-plans">
                  <button
                    type="button"
                    className={
                      formData.plan === "MENSAL"
                        ? "zcard-plan zcard-plan--active"
                        : "zcard-plan"
                    }
                    onClick={() =>
                      setValue("plan", "MENSAL", {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <span>Plano mensal</span>

                    <strong>Mensal</strong>

                    <small>Renovação a cada mês</small>
                  </button>

                  <button
                    type="button"
                    className={
                      formData.plan === "SEMESTRAL"
                        ? "zcard-plan zcard-plan--active"
                        : "zcard-plan"
                    }
                    onClick={() =>
                      setValue("plan", "SEMESTRAL", {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <span>Mais vantajoso</span>

                    <strong>Semestral</strong>

                    <small>Benefícios por todo o semestre</small>
                  </button>
                </div>

                {errors.plan && (
                  <small className="zcard-field__error">
                    {errors.plan.message}
                  </small>
                )}

                <div className="zcard-summary">
                  <div>
                    <span>Nome</span>

                    <strong>{formData.name}</strong>
                  </div>

                  <div>
                    <span>RGM</span>

                    <strong>{formData.rgm}</strong>
                  </div>

                  <div>
                    <span>Curso</span>

                    <strong>{formData.course}</strong>
                  </div>

                  <div>
                    <span>Semestre</span>

                    <strong>{formData.semester}º</strong>
                  </div>

                  <div>
                    <span>Plano</span>

                    <strong>
                      {formData.plan === "MENSAL" ? "Mensal" : "Semestral"}
                    </strong>
                  </div>

                  <div>
                    <span>Arquivos</span>

                    <strong>
                      {selectedDocumentsCount}
                      /4 enviados
                    </strong>
                  </div>
                </div>

                <label className="zcard-consent">
                  <input type="checkbox" {...register("acceptedTerms")} />

                  <span>
                    Confirmar que os dados e documentos enviados são verdadeiros
                    e autorizar a análise.
                  </span>
                </label>

                {errors.acceptedTerms && (
                  <small className="zcard-field__error">
                    {errors.acceptedTerms.message}
                  </small>
                )}
              </>
            )}

            {requestError && (
              <div className="zcard-form__request-error" role="alert">
                {requestError}
              </div>
            )}

            <div className="zcard-form__actions">
              {step > 1 ? (
                <button
                  type="button"
                  className="zcard-form__back"
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                >
                  <FiArrowLeft />
                  Voltar
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  className="zcard-form__next"
                  onClick={goToNextStep}
                  disabled={isSubmitting}
                >
                  Continuar
                  <FiArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  className="zcard-form__next"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar solicitação"}

                  <FiArrowRight />
                </button>
              )}
            </div>
          </form>

          <div className="zcard-request__privacy">
            <FiShield />

            <span>
              Os dados e documentos serão usados apenas para análise, emissão e
              gestão do ZCard.
            </span>
          </div>
        </div>

        <aside className="zcard-preview-column">
          <span>Prévia do cartão</span>

          <ZCardPreview
            name={formData.name}
            course={formData.course}
            semester={formData.semester}
            rgm={formData.rgm}
            plan={formData.plan}
            photoUrl={photoPreview}
          />
        </aside>
      </section>
    </main>
  );
}
