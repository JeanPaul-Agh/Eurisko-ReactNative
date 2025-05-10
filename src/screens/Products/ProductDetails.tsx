import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, BackHandler } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';

const ProductDetails = ({ route, navigation }: any) => {
  const { product } = route.params; 
  const theme = useTheme();

  useEffect(() => {
    // Handle Android back button to go back to previous screen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    
    return () => backHandler.remove();
  }, [navigation]);

  // Share product details using native sharing options
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.title} for $${product.price}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Product image */}
      <Image source={{ uri: product.images[0].url }} style={styles.productImage} />

      {/* Product title */}
      <CustomText style={[styles.productTitle, { color: theme.colors.text }]}>
        {product.title}
      </CustomText>

      {/* Product description */}
      <CustomText style={[styles.productDescription, { color: theme.colors.text }]}>
        {product.description}
      </CustomText>

      {/* Product price */}
      <CustomText style={[styles.productPrice, { color: theme.colors.text }]}>
        ${product.price}
      </CustomText>

      {/* Buttons for sharing and adding to cart */}
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
          <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            Share
          </CustomText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { 
              backgroundColor: theme.colors.cartButton,
              marginLeft: 10
            }
          ]}
        >
          <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
            Add to Cart
          </CustomText>
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