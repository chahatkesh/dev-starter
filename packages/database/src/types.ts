export type DatabaseRuntime = "development" | "test" | "production";

export type DatabaseConnectionConfig = {
  runtime: DatabaseRuntime;
  url: string;
  ssl: boolean;
  isConfigured: boolean;
};
