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
import Verification from '../screens/LinkVerification';

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
          <Stack.Screen name="Welcome" component={Welcome} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Verification" component={Verification}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
