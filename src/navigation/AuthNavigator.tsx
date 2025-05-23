import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/Auth/Signup';
import LoginScreen from '../screens/Auth/Login';
import VerificationScreen from '../screens/Auth/Verification';

export type AuthStackParamList = {
  Signup: undefined;
  Login: undefined;
  Verification: { email: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="Verification" 
        component={VerificationScreen} 
        initialParams={{ email: '' }} // Provide default params
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;