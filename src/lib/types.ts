export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }

  export type EnvSchemaType = {
    NEXT_APP_EMAIL_HOST: string;
    NEXT_APP_EMAIL_PORT: number;
    NEXT_APP_EMAIL_SECURE: boolean;
    NEXT_APP_EMAIL_USER: string;
    NEXT_APP_EMAIL_PASS: string;
    NEXT_APP_EMAIL_FROM: string;
  };