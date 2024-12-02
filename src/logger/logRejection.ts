import axios from "axios";
import { getConfig } from "../config";
import { getUserAgentDetails } from "../utils/userAgentInfo";
import { getIpAddress } from "../utils/ipInfo";
import { RejectionLogData, RejectionValue } from "../types/types";

/**
 * Logs a rejected value (e.g., from an unhandled Promise rejection) to the Flytrap backend.
 * Includes metadata such as user agent details and IP address.
 * @param value - The rejected value.
 * @param handled - Indicates whether the rejection was explicitly handled.
 * @returns A promise that resolves when the log is sent or catches any error during the process.
 */
export const logRejection = async (
  value: RejectionValue,
  handled: boolean,
): Promise<void> => {
  const config = getConfig();

  const { browser, os } = getUserAgentDetails();
  const ip = await getIpAddress(); 

  const data: RejectionLogData = {
    value,
    handled,
    timestamp: new Date().toISOString(),
    project_id: config.projectId,
    ip,
    os,
    browser,
  };

  try {
    await axios.post(
      `${config.apiEndpoint}/api/rejections`,
      { data },
      { headers: { "x-api-key": config.apiKey } },
    );
  } catch {
    return;
  }
};
