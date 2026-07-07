export function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const timeout = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export function createShutdownHandler(
  signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"],
) {
  const controller = new AbortController();
  let shouldStop = false;

  const requestStop = () => {
    shouldStop = true;
    controller.abort(new Error("Worker shutdown requested."));
  };

  for (const signal of signals) {
    process.once(signal, requestStop);
  }

  return {
    signal: controller.signal,
    get shouldStop() {
      return shouldStop;
    },
    dispose() {
      for (const signal of signals) {
        process.off(signal, requestStop);
      }
    },
  };
}
