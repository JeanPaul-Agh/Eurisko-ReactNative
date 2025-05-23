import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { apiService } from '../../services/apiService';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

type AddProductNavigationProp = StackNavigationProp<RootStackParamList, 'AddProduct'>;

const AddProduct = () => {
  const theme = useTheme();
  const navigation = useNavigation<AddProductNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [location, setLocation] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
  });
  const [region, setRegion] = useState<Region>({
    latitude: 31.9454,
    longitude: 35.9284,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  // Get user's current location on mount
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
      },
      error => console.log('Error getting location:', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  // Handle text input changes
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Select images from gallery (max 5)
  const selectImages = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5,
        quality: 0.8,
      });

      if (!result.didCancel && !result.errorCode) {
        const newImages = result.assets?.map(asset => ({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `image_${Date.now()}.jpg`,
        })) || [];

        if (images.length + newImages.length > 5) {
          Alert.alert('Error', 'You can upload a maximum of 5 images');
          return;
        }

        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Error', 'Failed to select images');
    }
  };

  // Remove selected image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Set location by tapping on map
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({
      name: searchQuery || 'Pinned Location',
      latitude,
      longitude,
    });
  };

  // Search for a location using OpenStreetMap
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data?.length > 0) {
        const firstResult = data[0];
        const newRegion = {
          latitude: parseFloat(firstResult.lat),
          longitude: parseFloat(firstResult.lon),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setRegion(newRegion);
        setLocation({
          name: firstResult.display_name,
          latitude: parseFloat(firstResult.lat),
          longitude: parseFloat(firstResult.lon),
        });
      } else {
        Alert.alert('Not found', 'No results found for your search');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search location');
    }
  };

  // Validate form fields before submitting
  const validateForm = () => {
    if (!formData.title.trim()) return 'Product title is required';
    if (!formData.description.trim()) return 'Product description is required';
    if (!formData.price.trim() || isNaN(Number(formData.price))) return 'Please enter a valid price';
    if (images.length === 0) return 'Please add at least one image';
    if (!location.name.trim() || location.latitude === 0 || location.longitude === 0) return 'Please select a valid location';
    return null;
  };

  // Submit product to API
  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return Alert.alert('Error', error);

    try {
      setLoading(true);
      await apiService.createProduct({
        ...formData,
        price: Number(formData.price),
        location,
        images,
      });

      Alert.alert('Success', 'Product added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderColor: theme.colors.border,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Product title input */}
        <CustomText style={[styles.label, { color: theme.colors.text }]}>Product Title</CustomText>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Enter product title"
          placeholderTextColor={theme.colors.border}
          value={formData.title}
          onChangeText={text => handleChange('title', text)}
        />

        {/* Product description textarea */}
        <CustomText style={[styles.label, { color: theme.colors.text }]}>Description</CustomText>
        <TextInput
          style={[styles.textArea, inputStyle]}
          placeholder="Enter product description"
          placeholderTextColor={theme.colors.border}
          value={formData.description}
          onChangeText={text => handleChange('description', text)}
          multiline
          numberOfLines={4}
        />

        {/* Price input */}
        <CustomText style={[styles.label, { color: theme.colors.text }]}>Price ($)</CustomText>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder="Enter price"
          placeholderTextColor={theme.colors.border}
          value={formData.price}
          onChangeText={text => handleChange('price', text)}
          keyboardType="numeric"
        />

        {/* Location input */}
        <CustomText style={[styles.label, { color: theme.colors.text }]}>Location</CustomText>
        
        {/* Search bar for location */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, inputStyle]}
            placeholder="Search for a location"
            placeholderTextColor={theme.colors.border}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            onPress={handleSearch} 
            style={[styles.searchButton, { backgroundColor: theme.colors.button }]}
          >
            <Icon name="magnify" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Map view for location */}
        <MapView
          style={styles.map}
          region={region}
          onPress={handleMapPress}
        >
          {location.latitude !== 0 && location.longitude !== 0 && (
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          )}
        </MapView>

        {/* Image picker */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity onPress={selectImages} style={[styles.imagePickerButton, { backgroundColor: theme.colors.button }]}>
            <Icon name="image-plus" size={24} color="#fff" />
            <CustomText style={styles.imagePickerText}>Add Images</CustomText>
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <TouchableOpacity key={index} onPress={() => removeImage(index)}>
                <Image source={{ uri: img.uri }} style={styles.imageThumbnail} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.submitButton, { backgroundColor: theme.colors.button }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CustomText style={styles.submitButtonText}>Submit</CustomText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    textAlignVertical: 'top',
    height: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  imagePickerContainer: {
    marginBottom: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePickerText: {
    color: '#fff',
    marginLeft: 8,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddProduct;