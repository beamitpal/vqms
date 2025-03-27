import { z } from "zod";
import { ProjectStatus,  User } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
// Email type
export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

// Env Types
export type EnvSchemaType = {
  NEXT_APP_EMAIL_HOST: string;
  NEXT_APP_EMAIL_PORT: number;
  NEXT_APP_EMAIL_SECURE: boolean;
  NEXT_APP_EMAIL_USER: string;
  NEXT_APP_EMAIL_PASS: string;
  NEXT_APP_EMAIL_FROM: string;
  NEXT_PUBLIC_APP_URL: string;
};

// LoginForm Props Type
export type LoginFormProps = {
  onSubmit: (values: z.infer<typeof loginformSchema>) => void;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  forgot?: React.ReactNode;
  isLoading?: boolean;
};

// Forgot Password Form Props Type
export type ForgotFormProps = {
  back?: React.ReactNode;
};

// Reset Password Form Props Type
export type ResetFormProps = {
  back?: React.ReactNode;
};

// Project Types (aligned with Prisma schema and getProjectByUsername)
export type ProjectTypes = {
  status: ProjectStatus;
  name: string;
  id: string;
  businessId: string;
  username: string;
  description: string;
  customFields: JsonValue | null;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
};

// Project Card Props Type
export type ProjectCardProps = {
  name: string;
  link: string;
  description: string;
};

// Project List Props Type
export type ProjectListProps = {
  name: string;
  description: string;
  link: string;
};

// Project Create Input Type
export type ProjectCreateInput = {
  name: string;
  description: string;
  username: string;
  status: ProjectStatus;
};


// Project Update Input Type
export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  customFields?: Record<string, unknown>;
  apiKey?: string; 
};

// Create Project Schema Validation
export const createProjectSchema = z.object({
  fullname: z.string().min(3, {
    message: "Project Name must be at least 3 characters long.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  username: z
    .string()
    .min(1, { message: "Username (URL slug) is required." })
    .regex(/^[a-z0-9-_]+$/, {
      message:
        "Username must only contain lowercase letters, numbers, hyphens, or underscores (no spaces or special characters).",
    })
    .transform((val) => val.toLowerCase()),
});

// Sign Up Form Schema Validation
export const signUpFormSchema = z.object({
  fullname: z.string().min(5, {
    message: "Company name must be at least 5 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirm: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

// Forgot Password Form Schema Validation
export const forgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Reset Password Form Schema Validation
export const ResetPasswordFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirm: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

// Login Form Schema Validation
export const loginformSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export const projectfulllnameAndDescriptionUpdateFormSchema = z.object({
  fullname: z.string().min(3, {
    message: "Project Name must be at least 3 characters long.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
});


export const projectStatusUpdateFormSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
});


export const projectCustomFieldsUpdateFormSchema = z.object({
  customFields: z.record(z.unknown()), // Record<string, unknown>
});




export const customFieldTemplateSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  fieldType: z.enum(["text", "textarea"], {
    required_error: "Please select a field type",
  }),
});

// Type for custom fields stored in ProjectTypes.customFields
export type CustomFieldTemplate = Record<
  string,
  { type: "text" | "textarea"; defaultValue: string }
>;