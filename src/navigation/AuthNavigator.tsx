import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/Auth/Signup';
import LoginScreen from '../screens/Auth/Login';
import VerificationScreen from '../screens/Auth/Verification'; 

// Define the type for the navigation stack routes
export type AuthStackParamList = {
  Signup: undefined;
  Login: undefined;
  Verification: undefined;
};

// Create the stack navigator
const Stack = createNativeStackNavigator<AuthStackParamList>();

// Auth navigation stack containing Signup, Login, and Verification screens
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Signup" 
      screenOptions={{ headerShown: false }} 
    >
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
