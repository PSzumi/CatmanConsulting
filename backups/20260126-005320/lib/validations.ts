import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Imię musi mieć minimum 2 znaki")
    .max(100, "Imię może mieć maksimum 100 znaków"),
  email: z
    .string()
    .email("Nieprawidłowy adres email")
    .max(255, "Email może mieć maksimum 255 znaków"),
  phone: z
    .string()
    .max(20, "Numer telefonu może mieć maksimum 20 znaków")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(200, "Nazwa firmy może mieć maksimum 200 znaków")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Wiadomość musi mieć minimum 10 znaków")
    .max(5000, "Wiadomość może mieć maksimum 5000 znaków"),
  consent: z.literal(true, {
    message: "Zgoda na przetwarzanie danych jest wymagana",
  }),
  // Honeypot field - should be empty
  website: z.string().max(0, "").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
