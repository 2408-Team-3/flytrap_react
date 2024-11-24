import { AxiosError } from "axios";
import { logError } from "./logError";
import { Metadata as MetadataType } from "../types/types";

/**
 * Captures an exception and logs it to the Flytrap backend.
 * Automatically extracts metadata from Axios errors if applicable.
 * @param error - The error object to capture.
 * @param metadata - Additional metadata to include in the log (optional).
 * @returns void
 */
export const captureException = (
  error: Error,
  metadata: MetadataType = {},
): void => {
  if (!error) return;

  const reqMetadata = (error as AxiosError).isAxiosError
    ? {
        method: (error as AxiosError).config?.method,
        url: (error as AxiosError).config?.url,
      }
    : metadata;

  logError(error, true, reqMetadata);
};
