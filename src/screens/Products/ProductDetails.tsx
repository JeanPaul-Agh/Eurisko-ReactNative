import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, BackHandler } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

const ProductDetails = ({ route, navigation }: any) => {
  const { product } = route.params;
  const theme = useTheme();

  useEffect(() => {
    // Ensure normal back behavior by removing any existing back handlers
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.title} for $${product.price}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCart = () => {
    Alert.alert('Added to Cart', `${product.title} added to cart!`);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={{ uri: product.images[0].url }} style={styles.productImage} />
      <Text style={[styles.productTitle, { color: theme.colors.text }]}>{product.title}</Text>
      <Text style={[styles.productDescription, { color: theme.colors.text }]}>{product.description}</Text>
      <Text style={[styles.productPrice, { color: theme.colors.text }]}>${product.price}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: theme.colors.button,
              borderWidth: 1,
              borderColor: theme.colors.border
            }
          ]}
          onPress={handleShare}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: theme.colors.cartButton,
              marginLeft: 10
            }
          ]}
          onPress={handleAddToCart}
        >
          <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Montserrat-Regular',
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetails;