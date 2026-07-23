import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function createImageSchema(label: string) {
  return z
    .instanceof(File, {
      message: `${label} é obrigatória.`,
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `${label} deve ter no máximo 5 MB.`,
    )
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      `${label} deve estar em JPG, PNG ou WEBP.`,
    );
}

export const zcardRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe o nome completo"),

  cpf: z
    .string()
    .min(14, "Informe um CPF válido"),

  rgm: z
    .string()
    .trim()
    .min(4, "Informe o RGM"),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido"),

  whatsapp: z
    .string()
    .min(14, "Informe um WhatsApp válido"),

  course: z
    .string()
    .min(1, "Selecione o curso"),

  semester: z
    .string()
    .min(1, "Selecione o semestre"),

  plan: z.enum(["MENSAL", "SEMESTRAL"]),

  photo: createImageSchema("A foto pessoal"),

  studentCard: createImageSchema(
    "A carteirinha estudantil",
  ),

  acceptedTerms: z.literal(true, {
    error:
      "Confirme que os dados são verdadeiros",
  }),
});

export type ZCardRequestData = z.infer<
  typeof zcardRequestSchema
>;