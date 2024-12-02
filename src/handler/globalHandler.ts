import { logError } from "../logger/logError";
import { logRejection } from "../logger/logRejection";
import { FlytrapError } from "../utils/FlytrapError";
import loggedErrors from "../shared/loggedErrors";

let globalHandlersSet: boolean = false;

/**
 * Sets up global handlers for uncaught exceptions and unhandled promise rejections in the browser environment.
 * - Captures and logs uncaught exceptions unless they are `FlytrapError`.
 * - Captures and logs unhandled promise rejections, including both errors and other rejection values.
 * - Ensures handlers are only set up once per application lifecycle.
 *
 * @returns void
 */
export const setUpGlobalErrorHandlers = (): void => {
  if (globalHandlersSet) return;
  globalHandlersSet = true;

  window.addEventListener("error", async (e: ErrorEvent) => {
    const { error } = e;
    if (error instanceof FlytrapError) return;
    if (loggedErrors.has(error)) return;
    loggedErrors.add(error);
    await logError(error, false);
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
  });
};
