import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../../components/CustomText';
import { apiService } from '../../services/apiService';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../../navigation';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API_BASE_URL } from '../../config/apiConfig';

type ProductListNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Products'>,
  StackNavigationProp<RootStackParamList>
>;

const ProductList = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProductListNavigationProp>();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products from API
  const fetchProducts = async (pageNum: number) => {
    try {
      if (pageNum === 1) setLoading(true);
      const response = await apiService.getProducts(pageNum, 10);
      setProducts(prev => pageNum === 1 ? response.data.data : [...prev, ...response.data.data]);
      setHasMore(response.data.pagination.hasNextPage);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter and sort products based on search and sort order
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(lowerQuery));
    }
    return result.sort((a, b) => sortAscending ? a.price - b.price : b.price - a.price);
  }, [products, searchQuery, sortAscending]);

  useEffect(() => { fetchProducts(1); }, []);

  // Pull-to-refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchProducts(1);
  };

  // Load more products for pagination
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchProducts(page + 1);
    }
  };

  // Render each product item
  const renderItem = ({ item }: any) => {
    const isExpanded = expandedId === item._id;
    const shortDescription = item.description?.slice(0, 60) + '...' || '';

    return (
      <TouchableOpacity
        style={[styles.productContainer, { backgroundColor: theme.colors.card }]}
        onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
        activeOpacity={0.8}
      >
        {item.images?.[0] && (
          <Image
            source={{ uri: `${API_BASE_URL}${item.images[0].url}` }}
            style={styles.productImage}
          />
        )}

        <View style={styles.productDetails}>
          <CustomText style={[styles.productTitle, { color: theme.colors.text }]}>
            {item.title}
          </CustomText>

          <CustomText style={[styles.productDescription, { color: theme.colors.text }]}>
            {isExpanded ? item.description : shortDescription}
          </CustomText>

          {item.description?.length > 60 && (
            <TouchableOpacity onPress={() => setExpandedId(isExpanded ? null : item._id)}>
              <CustomText style={[styles.readMore, { color: theme.colors.button }]}>
                {isExpanded ? 'Show Less' : 'Read More'}
              </CustomText>
            </TouchableOpacity>
          )}

          <CustomText style={[styles.productPrice, { color: theme.colors.text }]}>
            ${item.price}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.searchSortContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
              backgroundColor: theme.colors.card
            }
          ]}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.border}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        <TouchableOpacity 
          onPress={() => setSortAscending(prev => !prev)} 
          style={styles.sortButton}
        >
          <Icon
            name={sortAscending ? 'sort-ascending' : 'sort-descending'}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={loading ? (
          <ActivityIndicator size="large" color={theme.colors.button} />
        ) : null}
        keyboardShouldPersistTaps="handled"
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.button }]}
        onPress={() => navigation.navigate('AddProduct')}
        activeOpacity={0.8}
        accessibilityLabel="Add Product"
      >
        <Icon name="plus" size={28} color={theme.colors.buttonText} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
  productContainer: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
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
    fontSize: 13,
    marginBottom: 4,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  searchSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sortButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default ProductList;