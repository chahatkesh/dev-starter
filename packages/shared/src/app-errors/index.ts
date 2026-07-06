export interface AppErrorDefinition {
  code: string;
  message: string;
  statusCode: number;
}

interface CreateAppErrorOptions {
  cause?: unknown;
  message?: string;
}

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  override readonly cause?: unknown;

  constructor(
    definition: AppErrorDefinition,
    options: CreateAppErrorOptions = {},
  ) {
    super(
      options.message ?? definition.message,
      options.cause ? { cause: options.cause } : undefined,
    );
    this.name = "AppError";
    this.code = definition.code;
    this.statusCode = definition.statusCode;
    this.cause = options.cause;
  }
}

export class AppErrors {
  static readonly invalidEmailAddress = {
    code: "INVALID_EMAIL_ADDRESS",
    message: "Enter a valid email address.",
    statusCode: 400,
  } as const satisfies AppErrorDefinition;

  static readonly passwordTooShort = {
    code: "PASSWORD_TOO_SHORT",
    message: "Password must be at least 8 characters.",
    statusCode: 400,
  } as const satisfies AppErrorDefinition;

  static readonly emailAlreadyRegistered = {
    code: "EMAIL_ALREADY_REGISTERED",
    message: "An account with this email already exists.",
    statusCode: 409,
  } as const satisfies AppErrorDefinition;

  static readonly invalidCredentials = {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password.",
    statusCode: 401,
  } as const satisfies AppErrorDefinition;

  static readonly passwordsDoNotMatch = {
    code: "PASSWORDS_DO_NOT_MATCH",
    message: "Passwords do not match.",
    statusCode: 400,
  } as const satisfies AppErrorDefinition;

  static readonly internalServerError = {
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong. Please try again.",
    statusCode: 500,
  } as const satisfies AppErrorDefinition;

  static create(
    definition: AppErrorDefinition,
    options: CreateAppErrorOptions = {},
  ) {
    return new AppError(definition, options);
  }

  static fromUnknown(
    error: unknown,
    fallback: AppErrorDefinition = AppErrors.internalServerError,
  ) {
    if (error instanceof AppError) {
      return error;
    }

    return AppErrors.create(fallback, {
      cause: error,
    });
  }
}
