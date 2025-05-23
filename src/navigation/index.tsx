import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';
import Verification from '../screens/Auth/Verification';
import ProductList from '../screens/Products/ProductList';
import ProductDetails from '../screens/Products/ProductDetails';
import Cart from '../screens/Products/Cart';
import Profile from '../screens/Profile/Profile';
import EditProfile from '../screens/Profile/EditProfile';
import AddProduct from '../screens/Products/AddProduct';
import EditProduct from '../screens/Products/EditProduct';

export type RootStackParamList = {
  AuthStack: undefined;
  MainTab: undefined;
  ProductDetails: { productId: string };
  EditProfile: undefined;
  AddProduct: undefined;
  EditProduct: { productId: string };
};

export type MainTabParamList = {
  Products: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Verification: { email: string };
};

const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

const MainTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Products') iconName = 'shopping';
          else if (route.name === 'Cart') iconName = 'cart';
          else if (route.name === 'Profile') iconName = 'account';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.button,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.background },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Products" component={ProductList} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Verification" component={Verification} />
    </AuthStack.Navigator>
  );
};

export default function AppNavigator() {
  const { isLoggedIn, authChecked } = useAuth();
  const theme = useTheme();

  if (!authChecked) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      >
        {!isLoggedIn ? (
          <RootStack.Screen 
            name="AuthStack" 
            component={AuthStackNavigator} 
            options={{ headerShown: false }} 
          />
        ) : (
          <>
            <RootStack.Screen 
              name="MainTab" 
              component={MainTabNavigator} 
              options={{ headerShown: false }} 
            />
            <RootStack.Screen 
              name="ProductDetails" 
              component={ProductDetails} 
              options={{ title: 'Product Details' }} 
            />
            <RootStack.Screen 
              name="EditProfile" 
              component={EditProfile} 
              options={{ title: 'Edit Profile' }} 
            />
            <RootStack.Screen 
              name="AddProduct" 
              component={AddProduct} 
              options={{ title: 'Add Product' }} 
            />
            <RootStack.Screen 
              name="EditProduct" 
              component={EditProduct} 
              options={{ title: 'Edit Product' }} 
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}