import SmsAndroid from 'react-native-get-sms-android';

const readSmsMessages = async ({ box = 'inbox', address }) => {
  console.log('Reading SMS messages...');
  return new Promise((resolve, reject) => {
    const filter = {
      box,
      address,
      read: 0,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.error('Failed to list SMS:', fail);
        reject(fail);
      },
      (count, smsList) => {
        try {
          const messages = JSON.parse(smsList);
          console.log(`Found ${count} messages:`, messages);
          resolve(messages);
        } catch (error) {
          console.error('Error parsing SMS list:', error);
          reject(error);
        }
      }
    );
  });
};
