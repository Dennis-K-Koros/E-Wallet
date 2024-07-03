import React, { useContext } from 'react';
import { Colors } from '../components/styles';
const { tertiary } = Colors;

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Login from '../screens/login';
import Signup from '../screens/signup';
import Verification from '../screens/OtpVerification';
import BalanceInputScreen from '../screens/balanceInputScreen';
import Dashboard from '../screens/dashboard';
import AddTransaction from '../screens/AddTransaction';
import Report from '../screens/Report';
import Profile from '../screens/profile';
import BudgetManagement from '../screens/budgetManagement';
import AddBudget from '../screens/AddBudget';
import UpdateDetails from '../screens/updateDetails';
import ResetPassword from '../screens/resetPassword';

// Credentials context
import { credentialsContext } from '../components/CredentialsContext';

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
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="AddTransaction" component={AddTransaction} />
            <Stack.Screen name="Report" component={Report} />
            <Stack.Screen name='Profile' component={Profile}/>
            <Stack.Screen name='AddBudget' component={AddBudget}/>
            <Stack.Screen name='BudgetManagement' component={BudgetManagement}/>
            <Stack.Screen name="UpdateDetails" component={UpdateDetails} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />  
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen name="BalanceInput" component={BalanceInputScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;

