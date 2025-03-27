import { z } from "zod";
import { EnvSchemaType } from "./types";

const envSchema = z.object({
  NEXT_APP_EMAIL_HOST: z.string().min(1, "EMAIL_HOST is required").optional(),
  NEXT_APP_EMAIL_PORT: z.coerce.number().positive("EMAIL_PORT must be a positive number").optional(),
  NEXT_APP_EMAIL_SECURE: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
  NEXT_APP_EMAIL_USER: z.string().min(1, "EMAIL_USER is required").optional(),
  NEXT_APP_EMAIL_PASS: z.string().min(1, "EMAIL_PASS is required").optional(),
  NEXT_APP_EMAIL_FROM: z.string().email("EMAIL_FROM must be a valid email").optional(),
  NEXT_PUBLIC_APP_URL: z.string().min(1, "web app url is required.").optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables detected (Non-fatal in Edge runtime).");
}

export const env: Partial<EnvSchemaType> = parsedEnv.success ? parsedEnv.data : {};
