import axios from "axios";
import { parseStackTrace } from "../utils/stackTrace";
import { readSourceFile } from "../utils/fileReader";
import { getCodeContext } from "../utils/codeContext";
import { getUserAgentDetails } from "../utils/userAgentInfo";
import { getIpAddress } from "../utils/ipInfo";
import { getConfig } from "../config";
import {
  ErrorLogData,
  CodeContext,
  Metadata as MetadataType,
} from "../types/types";

/**
 * Logs an error to the Flytrap backend.
 * Includes metadata such as stack trace, code context, user agent details, and IP address.
 * @param error - The error object to log.
 * @param handled - Indicates whether the error was explicitly handled.
 * @param metadata - Additional metadata, such as HTTP method and URL (optional).
 * @returns A promise that resolves when the log is sent or catches any error during the process.
 */
export const logError = async (
  error: Error,
  handled: boolean,
  metadata?: MetadataType,
): Promise<void> => {
  if (!error) return;

  const config = getConfig();
  const stackFrames = parseStackTrace(error.stack);

  let codeContexts: CodeContext[] = [];
  if (config.includeContext && stackFrames) {
    const contexts = await Promise.all(
      stackFrames.map(async (frame) => {
        if (frame.file) {
          const source = await readSourceFile(frame.file);
          if (source) {
            return {
              file: frame.file,
              line: frame.line,
              column: frame.column,
              context: getCodeContext(source, frame.line),
            };
          }
        }
        return null;
      }),
    );
    codeContexts = contexts.filter(Boolean) as CodeContext[];
  }

  const { browser, os } = getUserAgentDetails();
  const ip = await getIpAddress(); 

  const data: ErrorLogData = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    codeContexts,
    handled,
    timestamp: new Date().toISOString(),
    project_id: config.projectId,
    method: metadata?.method || null,
    path: metadata?.url || null,
    ip,
    os,
    browser,
  };

  try {
    await axios.post(
      `${config.apiEndpoint}/api/errors`,
      { data },
      { headers: { "x-api-key": config.apiKey } },
    );
  } catch {
    return;
  }
};
