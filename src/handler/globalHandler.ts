import { logError } from "../logger/logError";
import { logRejection } from "../logger/logRejection";
import { FlytrapError } from "../utils/FlytrapError";
import loggedErrors from "../shared/loggedErrors";

let globalHandlersSet: boolean = false;

export const setUpGlobalErrorHandlers = (): void => {
  if (globalHandlersSet) return;
  globalHandlersSet = true;

  window.addEventListener("error", async (e: ErrorEvent) => {
    const { error } = e;
    if (error instanceof FlytrapError) return;
    if (loggedErrors.has(error)) return;
    console.log('[flytrap] an error is being logged from the global handler')
    loggedErrors.add(error);
    await logError(error, false);
    // throw error?
  });

  window.addEventListener("unhandledrejection", async (e: PromiseRejectionEvent) => {
    const { reason } = e;

    if (reason instanceof Error) {
      if (reason instanceof FlytrapError) return;
      if (loggedErrors.has(reason)) return;
      loggedErrors.add(reason);
      await logError(reason, false);
    } else {
      await logRejection(reason, false);
    }

    // exit???
  });
};
