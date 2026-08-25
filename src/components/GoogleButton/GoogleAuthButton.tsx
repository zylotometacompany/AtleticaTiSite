import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;

          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            },
          ) => void;
        };
      };
    };
  }
}

interface ExistingBuyerResponse {
  flow: "LOGIN";

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
  };
}

interface NewBuyerResponse {
  flow: "REGISTER";

  registerToken: string;

  googleUser: {
    name: string;
    email: string;
    picture: string | null;
  };
}

type GoogleAuthResponse = ExistingBuyerResponse | NewBuyerResponse;

const TOKEN_KEY = "@atletica-ti-client:token";

const USER_KEY = "@atletica-ti-client:user";

const REGISTER_TOKEN_KEY = "@atletica-ti-client:google-register-token";

export function GoogleAuthButton() {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || !window.google || !buttonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,

      callback: async ({ credential }) => {
        try {
          const response = await api.post<GoogleAuthResponse>(
            "/comprador/auth/google",

            {
              credential,
            },
          );

          if (response.data.flow === "LOGIN") {
            localStorage.setItem(TOKEN_KEY, response.data.token);

            localStorage.setItem(
              USER_KEY,
              JSON.stringify(response.data.comprador),
            );

            navigate("/minha-conta/compras", {
              replace: true,
            });

            return;
          }

          localStorage.setItem(REGISTER_TOKEN_KEY, response.data.registerToken);

          navigate("/completar-cadastro", {
            state: {
              googleUser: response.data.googleUser,
            },
          });
        } catch (error) {
          console.error("Erro no login Google:", error);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",

      size: "large",

      width: 320,

      text: "continue_with",

      shape: "rectangular",
    });
  }, [navigate]);

  return <div ref={buttonRef} />;
}
