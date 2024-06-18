import axios from 'axios';

// api route
import { baseAPIUrl } from '../components/shared';

export const checkUserBalance = async (userId) => {
  const url = `${baseAPIUrl}/balance/${userId}`;
  try {
    // console.log('Checking balance at URL:', url); // Debug log
    const response = await axios.get(url);
    const { status, data } = response.data;
    // console.log('Check Balance Response:', response.data); // Debug log
    return status === 'SUCCESS' && data.balance !== null;
  } catch (error) {
    // console.error('Error checking user balance:', error); // More detailed logging
    return false;
  }
};
