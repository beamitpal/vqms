import { z } from "zod";
import { EnvSchemaType } from "./types";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().min(1, "web app url is required.").optional(),
  NEXT_PUBLIC_WEB_3_FORM: z.string()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables detected (Non-fatal in Edge runtime).");
}

export const env: Partial<EnvSchemaType> = parsedEnv.success ? parsedEnv.data : {};
