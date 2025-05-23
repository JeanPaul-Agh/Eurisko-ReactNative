import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '../../config/apiConfig';

const Profile = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logout icon at the top right */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.logoutContainer} onPress={logout}>
          <Icon name="logout" size={22} color={theme.colors.text} />
          <CustomText style={[styles.logoutText, { color: theme.colors.text }]}>Logout</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          {/* Show user profile image or fallback icon */}
          {user?.profileImage?.url ? (
            <Image
              source={{ uri: `${API_BASE_URL}${user.profileImage.url}` }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: theme.colors.card }]}>
              <Icon name="account" size={60} color={theme.colors.text} />
            </View>
          )}
          {/* Edit Profile Icon Button on profile image bottom right */}
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="pencil" size={16} color={theme.colors.button} />
          </TouchableOpacity>
        </View>
        {/* User name and email */}
        <CustomText style={[styles.name, { color: theme.colors.text }]}>
          {user?.firstName} {user?.lastName}
        </CustomText>
        <CustomText style={[styles.email, { color: theme.colors.text }]}>
          {user?.email}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
    marginBottom: 10,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  logoutText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '500',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
    color: '#222',
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  email: {
    fontSize: 16,
    opacity: 0.85,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 16, // reduced from 16
    padding: 6,       // reduced from 6
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default Profile;