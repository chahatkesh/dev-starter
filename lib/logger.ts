type LogContext = Record<string, unknown>;
type LogLevel = "debug" | "info" | "warn" | "error";

function writeLog(level: LogLevel, context: LogContext, message: string) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...context,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(entry));
    return;
  }

  console.log(JSON.stringify(entry));
}

export const logger = {
  debug(context: LogContext, message: string) {
    if (process.env.NODE_ENV !== "production") {
      writeLog("debug", context, message);
    }
  },
  info(context: LogContext, message: string) {
    writeLog("info", context, message);
  },
  warn(context: LogContext, message: string) {
    writeLog("warn", context, message);
  },
  error(context: LogContext, message: string) {
    writeLog("error", context, message);
  },
};
