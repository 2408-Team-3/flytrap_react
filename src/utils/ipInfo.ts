import axios from 'axios';

export const getIpAddress = async () => {
  try {
    const { data }= await axios.get('https://api.ipify.org?format=json');
    return data.ip;
  } catch {
    return 'Unknown';
  }
}