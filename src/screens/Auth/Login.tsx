import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList, AuthStackParamList } from '../../navigation';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';

// Define proper navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'> & {
  reset: (state: {
    index: number;
    routes: { name: keyof RootStackParamList }[];
  }) => void;
};

// Validation schema for login form
const schema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  // Auth context provides login, theme, and error handling
  const { login, darkMode, toggleDarkMode, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  // React Hook Form setup with Zod validation
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Navigate to Signup screen
  const handleSignupNavigation = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Theme toggle button */}
      <TouchableOpacity 
        style={styles.themeToggle}
        onPress={toggleDarkMode}
      >
        <Icon
          name={darkMode ? 'weather-sunny' : 'weather-night'}
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* App logo */}
          <Image
            source={require('../../assets/img/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Login form card */}
          <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
            {/* Email input */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Email"
                    style={[styles.input, { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text 
                    }]}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                )}
              />
              {errors.email && (
                <CustomText style={[styles.error, { color: theme.colors.error }]}>
                  {errors.email.message}
                </CustomText>
              )}
            </View>

            {/* Password input with show/hide */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View style={[styles.passwordContainer, { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border 
                  }]}>
                    <TextInput
                      placeholder="Password"
                      style={[styles.passwordInput, { color: theme.colors.text }]}
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      placeholderTextColor={theme.colors.placeholder}
                    />
                    {/* Toggle password visibility */}
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={theme.colors.placeholder}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <CustomText style={[styles.error, { color: theme.colors.error }]}>
                  {errors.password.message}
                </CustomText>
              )}
            </View>

            {/* Sign In button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.button }]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                {loading ? 'Signing In...' : 'Sign In'}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Footer with navigation to Signup */}
          <View style={styles.footer}>
            <CustomText style={[styles.footerText, { color: theme.colors.footerText }]}>
              New here?
            </CustomText>
            <TouchableOpacity onPress={handleSignupNavigation}>
              <CustomText style={[styles.footerLink, { color: theme.colors.footerLink }]}>
                Create account
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 90,
    height: 90,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  error: {
    fontSize: 13,
    marginTop: 4,
    paddingLeft: 4,
  },
  button: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;