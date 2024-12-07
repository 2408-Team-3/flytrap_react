import axios from 'axios';

/**
 * Retrieves the public IP address of the current environment using the ipify API.
 * @returns A promise resolving to the IP address as a string, or `null` if the request fails.
 */
export const getIpAddress = async (): Promise<string | null> => {
  try {
    const { data } = await axios.get('https://api.ipify.org?format=json');
    return data.ip;
  } catch {
    return null;
  }
}