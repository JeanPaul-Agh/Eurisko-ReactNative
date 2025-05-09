// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import Verification from '../screens/Auth/Verification';
import ProductList from '../screens/Products/ProductList';
import ProductDetails from '../screens/Products/ProductDetails';
import { useTheme } from '../hooks/useTheme'; 

export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Verification: undefined;
  ProductList: undefined;
  ProductDetails: { product: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const theme = useTheme(); 

  const screenOptions: StackNavigationOptions = {
    headerTitle: '',
    headerBackTitle: '', 
    headerBackImage: () => null, 
    headerStyle: {
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0, // Remove shadow on iOS
      backgroundColor: theme.colors.background, 
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={screenOptions}
      >
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}