import React, { useContext, useEffect, useState } from 'react';
import { Colors } from '../components/styles';
const { tertiary } = Colors;

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Login from './../screens/login';
import Signup from './../screens/signup';
import Welcome from './../screens/welcome';
import Verification from '../screens/LinkVerification';
import BalanceInputScreen from './../screens/balanceInputScreen';

// Credentials context
import { credentialsContext } from './../components/CredentialsContext';

// Check User Balance Function
import { checkUserBalance } from './../utils/checkUserBalance';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const { storedCredentials } = useContext(credentialsContext);
  const [isBalanceChecked, setIsBalanceChecked] = useState(false);
  const [hasBalance, setHasBalance] = useState(false);

  useEffect(() => {
    const fetchBalanceStatus = async () => {
      if (storedCredentials && storedCredentials._id) { // Changed userId to _id
        // console.log('Stored Credentials in RootStack:', storedCredentials); // Debug log
        const balanceExists = await checkUserBalance(storedCredentials._id);
        // console.log('Balance Exists:', balanceExists); // Debug log
        setHasBalance(balanceExists);
        setIsBalanceChecked(true);
      } else {
        setIsBalanceChecked(true);
      }
    };

    fetchBalanceStatus();
  }, [storedCredentials]);

  if (!isBalanceChecked) {
    return null; // Render a loading screen or spinner here if necessary
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: tertiary,
          headerTransparent: true,
          headerTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName="Login"
      >
        {storedCredentials ? (
          hasBalance ? (
            <Stack.Screen name="Welcome" component={Welcome} />
          ) : (
            <Stack.Screen 
              name="BalanceInput" 
              component={BalanceInputScreen} 
              initialParams={{ userId: storedCredentials._id }} // Pass _id as userId
            />
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Verification" component={Verification} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
