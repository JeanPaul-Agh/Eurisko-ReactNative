import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const theme = useTheme();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0).toFixed(2);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <CustomText style={[styles.title, { color: theme.colors.text }]}>
          Your Cart
        </CustomText>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <CustomText style={{ color: theme.colors.error }}>
              Clear All
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <CustomText style={[styles.emptyText, { color: theme.colors.text }]}>
          Your cart is empty
        </CustomText>
      ) : (
        <>
          {cartItems.map(item => (
            <View 
              key={item._id} 
              style={[
                styles.itemContainer, 
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Image source={{ uri: item.images[0].url }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <CustomText style={[styles.itemTitle, { color: theme.colors.text }]}>
                  {item.title}
                </CustomText>
                
                <CustomText 
                  style={[styles.itemDescription, { color: theme.colors.text }]}
                  numberOfLines={expandedDescriptions[item._id] ? undefined : 2}
                >
                  {item.description}
                </CustomText>
                
                {item.description.length > 50 && (
                  <TouchableOpacity onPress={() => toggleDescription(item._id)}>
                    <CustomText style={{ color: theme.colors.button }}>
                      {expandedDescriptions[item._id] ? 'Show less' : 'Show more'}
                    </CustomText>
                  </TouchableOpacity>
                )}
                
                <View style={styles.priceQuantityContainer}>
                  <CustomText style={[styles.itemPrice, { color: theme.colors.text }]}>
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </CustomText>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => updateQuantity(item._id, (item.quantity || 1) - 1)}>
                      <Icon name="minus" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                    <CustomText style={[styles.quantityText, { color: theme.colors.text }]}>
                      {item.quantity || 1}
                    </CustomText>
                    <TouchableOpacity onPress={() => updateQuantity(item._id, (item.quantity || 1) + 1)}>
                      <Icon name="plus" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => removeFromCart(item._id)}
                      style={styles.removeButton}
                    >
                      <Icon name="delete" size={20} color={theme.colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <View style={[styles.totalContainer, { borderTopColor: theme.colors.border }]}>
            <CustomText style={[styles.totalText, { color: theme.colors.text }]}>
              Total Items:
            </CustomText>
            <CustomText style={[styles.totalAmount, { color: theme.colors.text }]}>
              {calculateTotalItems()}
            </CustomText>
          </View>

          <View style={[styles.totalContainer, { borderTopColor: theme.colors.border }]}>
            <CustomText style={[styles.totalText, { color: theme.colors.text }]}>
              Total Price:
            </CustomText>
            <CustomText style={[styles.totalAmount, { color: theme.colors.text }]}>
              ${calculateTotal()}
            </CustomText>
          </View>

          <TouchableOpacity 
            style={[styles.checkoutButton, { backgroundColor: theme.colors.button }]}
          >
            <CustomText style={[styles.checkoutButtonText, { color: theme.colors.buttonText }]}>
              Proceed to Checkout
            </CustomText>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 15,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    marginTop: 20,
    borderTopWidth: 0.5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Cart;