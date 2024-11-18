import { UAParser } from 'ua-parser-js';

export const getUserAgentDetails = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  const browser = result.browser.name 
  ? `${result.browser.name} ${result.browser.version || ''}`.trim() 
  : 'Unknown';

  const os = result.os.name 
  ? `${result.os.name} ${result.os.version || ''}`.trim() 
  : 'Unknown';

  return { browser, os }
}