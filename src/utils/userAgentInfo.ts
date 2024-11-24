import { UAParser } from 'ua-parser-js';

/**
 * Retrieves user agent details, including browser and operating system information.
 * @returns An object containing:
 * - `browser`: The browser name and version, or `null` if unavailable.
 * - `os`: The operating system name and version, or `null` if unavailable.
 */
export const getUserAgentDetails = (): {
  browser: string | null;
  os: string | null;
} => {
  const parser = new UAParser();
  const result = parser.getResult();

  const browser = result.browser.name 
  ? `${result.browser.name} ${result.browser.version || ''}`.trim() 
  : null;

  const os = result.os.name 
  ? `${result.os.name} ${result.os.version || ''}`.trim() 
  : null;

  return { browser, os }
}