import React, { useState, useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { Alert, View, Text, PermissionsAndroid, Platform } from 'react-native';

// React Navigation stack
import RootStack from './navigations/RootStack';

// async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// credentials context
import { credentialsContext } from './components/CredentialsContext';

// Notification handler
import NotificationHandler from './components/NotificationHandler';

// Import permissions and SMS reader
import { requestSmsPermission } from './utils/permissions';
import { readSmsMessages } from './utils/smsReader';
import { parseTransactionMessages } from './utils/smsParser';

const checkSmsPermission = async () => {
  if (Platform.OS === 'android') {
    const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    console.log('Initial SMS permission status:', status);
  } else {
    // For iOS, SMS permissions are handled differently
    console.log('SMS permission is not applicable on iOS.');
  }
};

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState();
  const [transactions, setTransactions] = useState([]);
  const addTransactionRef = useRef(null);

  const prepare = async () => {
    try {
      console.log('Preparing app...');
      await SplashScreen.preventAutoHideAsync();
      await checkLoginCrendentials();
      await checkSmsPermission(); // Check initial SMS permission status
      const smsPermissionGranted = await requestSmsPermission();
      console.log('SMS permission granted status:', smsPermissionGranted);
      const notificationPermissionGranted = await requestNotificationPermission();
      if (smsPermissionGranted) {
        const messages = await readSmsMessages({ box: 'inbox', address: 'MPESA' });
        const transactions = parseTransactionMessages(messages);
        setTransactions(transactions);
        if (addTransactionRef.current) {
          transactions.forEach(transaction => {
            addTransactionRef.current.handleTransaction(transaction);
          });
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {
      console.log('App is ready');
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    prepare();
  }, [])

  useEffect(() => {
    try {
      console.log("Configuring NotificationHandler...");
      NotificationHandler.configure();
      console.log("Scheduling daily transaction reminder...");
      NotificationHandler.scheduleDailyTransactionReminder();

      const intervalId = setInterval(() => {
        console.log("Checking budgets and notifying...");
        NotificationHandler.checkBudgetsAndNotify();
      }, 60 * 60 * 1000); // Check budgets every hour

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error in notification scheduling:", error);
    }
  }, []);

  const checkLoginCrendentials = async () => {
    try {
      console.log('Checking login credentials...');
      const result = await AsyncStorage.getItem('myWalletCredentials');
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        "Permission required",
        "You need to enable notifications in your settings to receive alerts.",
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  };

  if (!appReady) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    ); // or a custom loading component
  }

  return (
    <credentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <RootStack addTransactionRef={addTransactionRef} />
    </credentialsContext.Provider>
  );
}
