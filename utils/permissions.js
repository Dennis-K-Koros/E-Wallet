import { PermissionsAndroid, Alert, Platform } from 'react-native';
export const requestSmsPermission = async () => {
    console.log('Handling SMS permission...');
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "SMS Permission",
            message: "This app needs access to your SMS to read transaction messages.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('SMS permission granted');
            return true;
          } else {
            console.log('SMS permission denied');
            Alert.alert(
              "Permission required",
              "You need to enable SMS permissions in your settings to read transaction messages.",
              [{ text: "OK" }]
            );
            return false;
          }
        }).catch(err => {
          console.warn(err);
          return false;
        });
        return granted;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS doesn't have SMS permission model like Android
      return true;
    }
  };