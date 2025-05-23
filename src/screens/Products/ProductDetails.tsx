import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, ActivityIndicator, Linking } from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../components/CustomText';
import { useTheme } from '../../hooks/useTheme';
import { useCart } from '../../context/CartContext';
import { apiService } from '../../services/apiService';
import Swiper from 'react-native-swiper';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';

type RootStackParamList = {
  ProductDetails: { productId: string };
  Cart: undefined;
  EditProduct: { productId: string };
};

const ProductDetails = () => {
  const { params: { productId } } = useRoute<any>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  // Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProductById(productId);
        if (!response.data.success) throw new Error(response.data.error?.message || 'Product not found');
        setProduct(response.data.data);
        setIsOwner(user?.id === response.data.data.user?._id);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, user?.id]);

  // Set up custom header with edit/delete/cart actions
  useEffect(() => {
    navigation.setOptions({
      headerTitle: '', // Remove the screen name/title
      headerLeft: () => (
        isOwner ? (
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Icon name="delete" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        ) : null
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {isOwner && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('EditProduct', { productId })}
              style={styles.editButton}
            >
              <Icon name="pencil" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <View style={styles.headerCartContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Icon name="cart" size={30} style={{ marginRight: 15 }} />
              {cartItems.length > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: theme.colors.error }]}>
                  <CustomText style={styles.cartBadgeText}>
                    {cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}
                  </CustomText>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
    // eslint-disable-next-line
  }, [navigation, cartItems, theme, isOwner, productId]);

  // Share product info
  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${product.title} for $${product.price}` });
    } catch (error) {
    
    }
  };

  // Add product to cart
  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Added to Cart', `${product.title} has been added to your cart`);
  };

  // Delete product 
  const handleDelete = async () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await apiService.deleteProduct(productId);
              if (response.data?.success) {
                Alert.alert('Deleted', 'Product deleted successfully');
                navigation.goBack();
              } else {
                throw new Error(response.data?.error?.message || 'Failed to delete product');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to delete product');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.button} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background, padding: 20 }]}>
        <CustomText style={{ color: theme.colors.error, marginBottom: 20 }}>{error}</CustomText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.button }]}
          onPress={() => navigation.goBack()}
        >
          <CustomText style={{ color: theme.colors.buttonText }}>Go Back</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) return null;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Image Swiper */}
      {product.images?.length > 0 && (
        <View style={styles.swiperContainer}>
          <Swiper
            style={styles.swiper}
            showsPagination={true}
            dotColor="#ccc"
            activeDotColor={theme.colors.button}
            height={300}
            loop={true}
          >
            {product.images.map((img: any, idx: number) => (
              <Image
                key={idx}
                source={{ uri: `${API_BASE_URL}${img.url}` }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </Swiper>
        </View>
      )}

      {/* Product Info */}
      <View style={styles.textContainer}>
        <CustomText style={[styles.productTitle, { color: theme.colors.text }]}>
          {product.title}
        </CustomText>
        <CustomText style={[styles.productPrice, { color: theme.colors.text }]}>
          ${product.price}
        </CustomText>
        <CustomText
          style={[styles.productDescription, { color: theme.colors.text }]}
          numberOfLines={expanded ? undefined : 4}
        >
          {product.description}
        </CustomText>
        {product.description?.length > 100 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <CustomText style={[styles.readMore, { color: theme.colors.button }]}>
              {expanded ? 'Read Less ▲' : 'Read More ▼'}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {/* Map View */}
      {product.location?.latitude && product.location?.longitude && (
        <View style={styles.mapContainer}>
          <CustomText style={{ fontWeight: 'bold', marginBottom: 8, color: theme.colors.text }}>
            Location
          </CustomText>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: product.location.latitude,
              longitude: product.location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: product.location.latitude,
                longitude: product.location.longitude,
              }}
              title={product.location.name}
            />
          </MapView>
          <CustomText style={{ marginTop: 8, color: theme.colors.text }}>
            {product.location.name}
          </CustomText>
        </View>
      )}

      {/* Owner Details */}
      {product.user && (
        <View style={[styles.ownerContainer, { backgroundColor: theme.colors.card }]}>
          <CustomText style={[styles.ownerTitle, { color: theme.colors.text }]}>
            Owner Details
          </CustomText>
          <CustomText style={{ color: theme.colors.text }}>
            Email: {product.user.email}
          </CustomText>
          <TouchableOpacity
            style={[styles.emailButton, { backgroundColor: theme.colors.button, marginTop: 10 }]}
            onPress={() => Linking.openURL(`mailto:${product.user.email}`)}
          >
            <Icon name="email" size={20} color={theme.colors.buttonText} />
            <CustomText style={{ color: theme.colors.buttonText, marginLeft: 8 }}>
              Email Owner
            </CustomText>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.button }]}
          onPress={handleShare}
        >
          <Icon name="share" size={24} color={theme.colors.buttonText} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.cartButton, marginLeft: 10 }]}
          onPress={handleAddToCart}
        >
          <Icon name="cart-arrow-down" size={24} color={theme.colors.buttonText} />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
  },
  swiperContainer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  swiper: {
    borderRadius: 12,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '60%',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  headerCartContainer: {
    position: 'relative',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 15,
  },
  deleteButton: {
    marginLeft: 15,
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    right: 5,
    top: -5,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    width: '100%',
    height: 220,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  ownerContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  ownerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});

export default ProductDetails;