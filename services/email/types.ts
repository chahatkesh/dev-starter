export type EmailTemplate =
  | {
      type: "account-created";
      data: {
        userName: string;
        loginUrl: string;
      };
    }
  | {
      type: "login-notification";
      data: {
        userName: string;
        loginTime: string;
        device: string;
        browser: string;
        location: string;
        ipAddress: string;
      };
    };

export interface EmailConfig {
  to: string;
  subject: string;
  template: EmailTemplate;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: unknown;
}
