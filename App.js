import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// React Navigation stack
import RootStack from './navigations/RootStack';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//credentials context
import { credentialsContext } from './components/CredentialsContext';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState();

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await checkLoginCrendentials();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  const checkLoginCrendentials = async () => {
    try {
      const result = await AsyncStorage.getItem('myWalletCrendentials');
      if (result !== null) {
        setStoredCredentials(JSON.parse(result));
      } else {
        setStoredCredentials(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!appReady) {
    return null; // or a custom loading component
  }

  return (
    <credentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <RootStack />
    </credentialsContext.Provider>
  );
}
