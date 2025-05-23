import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import CustomText from '../../components/CustomText';
import { apiService } from '../../services/apiService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_BASE_URL } from '../../config/apiConfig';

const EditProfile = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  // Local state for form fields and loading
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<any>(null);

  // Handle picking a new profile image from gallery
  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.uri) {
            setProfileImage({
              uri: asset.uri,
              type: asset.type,
              name: asset.fileName,
            });
          } else {
            Alert.alert('Error', 'Selected image is invalid.');
          }
        }
      }
    );
  };

  // Handle saving profile changes
  const handleSave = async () => {
    try {
      setLoading(true);
      let payload: any = { firstName, lastName };

      // If image is changed, use FormData for upload
      if (profileImage) {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('profileImage', {
          uri: profileImage.uri,
          type: profileImage.type || 'image/jpeg',
          name: profileImage.name || 'profile.jpg',
        });
        payload = formData;
      }

      const response = await apiService.updateProfile(payload);
      updateUser(response.data.data.user);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.profileHeader}>
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          {/* Show selected image, user image, or fallback icon */}
          {profileImage ? (
            <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
          ) : user?.profileImage?.url ? (
            <Image
              source={{ uri: `${API_BASE_URL}${user.profileImage.url}` }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: theme.colors.card, justifyContent: 'center', alignItems: 'center' }]}>
              <Icon name="account" size={60} color={theme.colors.text} />
            </View>
          )}

          {/* Pen icon overlay to change image */}
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <Icon name="pencil" size={16} color={theme.colors.button} />
          </TouchableOpacity>
        </View>
      </View>

      {/* First Name input */}
      <View style={styles.inputContainer}>
        <CustomText style={[styles.label, { color: theme.colors.text }]}>First Name</CustomText>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
            },
          ]}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      {/* Last Name input */}
      <View style={styles.inputContainer}>
        <CustomText style={[styles.label, { color: theme.colors.text }]}>Last Name</CustomText>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.card,
            },
          ]}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.text} />
        ) : (
          <CustomText style={styles.buttonText}>Save</CustomText>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditProfile;
