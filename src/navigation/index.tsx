import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Signup from '../screens/Auth/Signup';
import Login from '../screens/Auth/Login';
import Verification from '../screens/Auth/Verification';
import ProductList from '../screens/Products/ProductList';
import ProductDetails from '../screens/Products/ProductDetails';
import { useTheme } from '../hooks/useTheme'; 

// Define the type for all routes in the app
export type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Verification: undefined;
  ProductList: undefined;
  ProductDetails: { product: any };
};

// Create the stack navigator 
const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const theme = useTheme(); 

  // Customize screen transition and header appearance
  const screenOptions: StackNavigationOptions = {
    headerTitle: '',
    headerBackTitle: '',
    headerBackImage: () => null, 
    headerStyle: {
      elevation: 0, // No shadow on Android
      shadowOpacity: 0, // No shadow on iOS
      backgroundColor: theme.colors.background, 
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login" // App starts on the Login screen
        screenOptions={screenOptions}
      >
        {/* Auth Screens */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} // Hide header on login
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Verification" component={Verification} />
        
        {/* Product Screens */}
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
