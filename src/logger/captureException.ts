import { AxiosError } from "axios";
import { logError } from "./logError";
import { Metadata as MetadataType } from "../types/types";

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
