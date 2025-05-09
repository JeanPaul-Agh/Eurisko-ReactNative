import React, { useCallback, useEffect } from 'react';
import { FlatList, Text, View, Image, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductList = ({ navigation }: any) => {
  const products = require('../../data/Products.json').data;
  const theme = useTheme();
  const { toggleLogin } = useAuth();

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer} activeOpacity={0.8}>
          <View style={[styles.logoutButton, { backgroundColor: theme.colors.logoutButton }]}>
            <Icon name="logout" size={20} color={theme.colors.text} style={styles.logoutIcon} />
            <Text style={[styles.logoutText, { color: theme.colors.text }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  useEffect(() => {
    // Add when screen focuses
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
      // Remove when screen unfocuses or unmounts
      backHandler.remove();
    };
  }, [handleBackPress]);

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
        <Text style={[styles.productTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.productDescription, { color: theme.colors.text }]}>{item.description}</Text>
        <Text style={[styles.productPrice, { color: theme.colors.text }]}>${item.price}</Text>
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