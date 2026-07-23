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

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;

    if (typeof responseMessage === "string") {
      return responseMessage;
    }

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

  async function createRequest(slug: "tiumcatletica", data: ZCardRequestData) {
    setError(null);

    const requestData = new FormData();

    requestData.append("name", data.name);

    requestData.append("cpf", data.cpf);

    requestData.append("rgm", data.rgm);

    requestData.append("email", data.email);

    /*
     * O backend espera phone e não whatsapp.
     */
    requestData.append("phone", data.whatsapp);

    /*
     * O backend espera curso e semestre.
     */
    requestData.append("curso", data.course);

    requestData.append("semestre", data.semester);

    requestData.append("plan", data.plan);

    requestData.append("photo", data.photo);

    requestData.append("studentCard", data.studentCard);

    try {
      const apiResponse = await api.post<CreateZCardRequestResponse>(
        `/zcard/${slug}/credential-request`,
        requestData,
      );

      setResponse(apiResponse.data);

      return apiResponse.data;
    } catch (requestError) {
      const message = getErrorMessage(requestError);

      setError(message);

      throw requestError;
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
  };
}
