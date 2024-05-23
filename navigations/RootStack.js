import React from 'react';

import { Colors } from '../components/styles';
const {primary, tertiary} = Colors;

// React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//screens
import Login from './../screens/login';
import Signup from './../screens/signup';
import Welcome from './../screens/welcome';

const Stack = createNativeStackNavigator();

const RootStack = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                headerTintColor: tertiary,
                headerTransparent: true,
                headerTitle: "",
                headerLeftContainerStyle:{
                    paddingLeft: 20
                },
              }}
              initialRouteName='Login'
            >
                <Stack.Screen name='Login' component={Login}/>
                <Stack.Screen name='Signup' component={Signup}/>
                <Stack.Screen name='Welcome' component={Welcome}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStack;
