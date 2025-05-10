import React, { useCallback, useEffect } from 'react';
import { FlatList, View, Image, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../components/CustomText';

const ProductList = ({ navigation }: any) => {
  // Load product data from JSON
  const theme = useTheme(); 
  const products = require('../../data/Products.json').data; 

  const { toggleLogin } = useAuth();

  // Confirm logout and navigate to Login screen
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            toggleLogin(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  // Confirm app exit on Android back press
  const handleBackPress = useCallback(() => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the application?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp(), style: 'destructive' },
      ],
      { cancelable: false }
    );
    return true;
  }, []);

  // logout button in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer} activeOpacity={0.8}>
          <View style={[styles.logoutButton, { backgroundColor: theme.colors.logoutButton }]}>
            <Icon name="logout" size={20} color={theme.colors.text} style={styles.logoutIcon} />
            <CustomText style={[styles.logoutText, { color: theme.colors.text }]}>Logout</CustomText>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    // Handle back press when screen is active
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove(); 
  }, [handleBackPress]);

  // Render each product item
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.productContainer, { 
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.card 
      }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.images[0].url }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <CustomText style={[styles.productTitle, { color: theme.colors.text }]}>{item.title}</CustomText>
        <CustomText style={[styles.productDescription, { color: theme.colors.text }]}>{item.description}</CustomText>
        <CustomText style={[styles.productPrice, { color: theme.colors.text }]}>${item.price}</CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a52be',
  },
  logoutContainer: {
    marginRight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ProductList;