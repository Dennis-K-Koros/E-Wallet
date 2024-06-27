import React, { useContext } from 'react';
import { Colors } from '../components/styles';
const { primary, tertiary } = Colors;

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Login from './../screens/login';
import Signup from './../screens/signup';
import Welcome from './../screens/welcome';
import Verification from '../screens/OtpVerification';
import BalanceInputScreen from '../screens/balanceInputScreen';
import Dashboard from '../screens/dashboard';
import AddTransaction from '../screens/AddTransaction';

// Credentials context
import { credentialsContext } from './../components/CredentialsContext';

const Stack = createNativeStackNavigator();

const RootStack = () => {
const { storedCredentials } = useContext(credentialsContext);

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
          <>
            <Stack.Screen name="Dashboard" component={Dashboard}/>
            <Stack.Screen name="AddTransaction" component={AddTransaction}/>
          </>
        ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Verification" component={Verification}/>
          <Stack.Screen name="BalanceInput"component={BalanceInputScreen}/>
        </>
      )}
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default RootStack;