import { z } from "zod";

// Lead score data schema (optional - for analytics)
export const leadScoreSchema = z.object({
  score: z.number().min(0).max(100).optional(),
  grade: z.enum(["hot", "warm", "cold", "new"]).optional(),
  totalTimeOnSite: z.number().optional(),
  pageViews: z.number().optional(),
  scrollDepth: z.number().optional(),
  visitCount: z.number().optional(),
  returnVisit: z.boolean().optional(),
  quizCompleted: z.boolean().optional(),
  quizScore: z.number().nullable().optional(),
  calculatorUsed: z.boolean().optional(),
  calculatorSavings: z.number().nullable().optional(),
  calendlyClicked: z.boolean().optional(),
  videoRecorded: z.boolean().optional(),
  easterEggFound: z.boolean().optional(),
  alerts: z.array(z.string()).optional(),
}).optional();

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
  role: z
    .string()
    .max(100, "Rola może mieć maksimum 100 znaków")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .max(5000, "Wiadomość może mieć maksimum 5000 znaków")
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    message: "Zgoda na przetwarzanie danych jest wymagana",
  }),
  // Honeypot field - should be empty
  website: z.string().max(0, "").optional(),
  // Path selection from form
  path: z.string().optional(),
  contactMethod: z.string().optional(),
  hasVideo: z.boolean().optional(),
  // Lead scoring data
  leadScore: leadScoreSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
