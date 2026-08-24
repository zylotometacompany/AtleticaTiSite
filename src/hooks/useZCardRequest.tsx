// src/pages/zCard/hooks/useCreateZCardRequest.ts

import { useState } from "react";

import axios from "axios";

import type { ZCardRequestData } from "../pages/zCardRequest/zCardRequestSchema";

import { api } from "../service/api";

type CreateZCardRequestResponse = {
  message: string;

  socio: {
    id: string;
    name: string;
    email: string;
    rgm: string;
    curso: string;
    semestre: number | null;

    plan: "MENSAL" | "SEMESTRAL";

    status: string;
    documentStatus: string;
    paymentStatus: string;

    createdAt: string;

    atletica: {
      id: string;
      name: string;
      slug: string;
    };
  };
};

type ZCardApiError = {
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ZCardApiError>(error)) {
    const status = error.response?.status;

    const responseMessage = error.response?.data?.message;

    /*
     * RATE LIMIT
     *
     * Nova tentativa dentro
     * da janela de segurança.
     */
    if (status === 429) {
      return (
        responseMessage ??
        "Atividade incomum detectada. Novas solicitações foram temporariamente bloqueadas por segurança. O envio deliberado de informações ou documentos falsos, a tentativa de obtenção indevida de credencial ou outras formas de fraude poderão ser registradas, apuradas e encaminhadas para adoção das medidas legais cabíveis."
      );
    }

    /*
     * CONFLITO
     *
     * CPF, RGM ou e-mail
     * já cadastrados.
     */
    if (status === 409) {
      return (
        responseMessage ??
        "Já existe uma solicitação vinculada aos dados informados."
      );
    }

    /*
     * DADOS INVÁLIDOS
     */
    if (status === 400) {
      return (
        responseMessage ?? "Verifique os dados informados e tente novamente."
      );
    }

    /*
     * ATLÉTICA NÃO ENCONTRADA
     */
    if (status === 404) {
      return responseMessage ?? "Não foi possível localizar a Atlética.";
    }

    /*
     * ERRO DO SERVIDOR
     */
    if (status && status >= 500) {
      return (
        responseMessage ??
        "Ocorreu um erro no servidor. Tente novamente mais tarde."
      );
    }

    /*
     * MENSAGEM GENÉRICA
     * RETORNADA PELA API
     */
    if (typeof responseMessage === "string") {
      return responseMessage;
    }

    /*
     * API FORA DO AR /
     * SEM CONEXÃO
     */
    if (!error.response) {
      return "Não foi possível conectar com o servidor.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível enviar a solicitação.";
}

export function useCreateZCardRequest() {
  const [response, setResponse] = useState<CreateZCardRequestResponse | null>(
    null,
  );

  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createRequest(
    slug: "tiumcatletica",

    data: ZCardRequestData,
  ) {
    try {
      setIsSubmitting(true);

      setError(null);

      setResponse(null);

      const requestData = new FormData();

      requestData.append("name", data.name);

      requestData.append("cpf", data.cpf);

      requestData.append("rgm", data.rgm);

      requestData.append("email", data.email);

      /*
       * Backend espera
       * phone.
       */
      requestData.append("phone", data.whatsapp);

      /*
       * Backend espera
       * curso e semestre.
       */
      requestData.append("curso", data.course);

      requestData.append("semestre", data.semester);

      requestData.append("plan", data.plan);

      /*
       * ARQUIVOS
       */
      requestData.append("photo", data.photo);

      requestData.append("studentCard", data.studentCard);

      const apiResponse = await api.post<CreateZCardRequestResponse>(
        `/zcard/${slug}/credential-request`,

        requestData,
      );

      setResponse(apiResponse.data);

      return apiResponse.data;
    } catch (requestError: unknown) {
      const message = getErrorMessage(requestError);

      setError(message);

      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearRequestState() {
    setResponse(null);

    setError(null);
  }

  return {
    createRequest,
    clearRequestState,

    response,
    error,
    isSubmitting,
  };
}
