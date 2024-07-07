import SmsAndroid from 'react-native-get-sms-android';

export const readSmsMessages = async ({ box = 'inbox', address }) => {
  console.log('Reading SMS messages...');
  return new Promise((resolve, reject) => {
    const filter = {
      box, // 'inbox' or 'sent'
      address,
      read: 0, // 0 for unread SMS, 1 for SMS already read
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
          console.log(`Found ${count} messages`);
          resolve(messages);
        } catch (error) {
          console.error('Error parsing SMS list:', error);
          reject(error);
        }
      }
    );
  });
};
