import axios from "axios";
import { getConfig } from "../config";
// import { FlytrapError } from '../utils/FlytrapError';
import { getUserAgentDetails } from "../utils/userAgentInfo";
import { getIpAddress } from "../utils/ipInfo";
import { RejectionLogData, RejectionValue } from "../types/types";

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
    ip: ip,
    os: os,
    browser: browser,
  };

  try {
    console.log("[flytrap] Sending rejection to backend...");
    const response = await axios.post(
      `${config.apiEndpoint}/api/rejections`,
      { data },
      { headers: { "x-api-key": config.apiKey } },
    );
    console.log("[flytrap]", response.status, response.data);
  } catch (e) {
    console.warn("[flytrap] Failed to log rejection:", e);
  }
};
