import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

// Form validation schema using Zod
const schema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .transform(val => val.trim()), 
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .transform(val => val.trim()),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { toggleLogin, toggleDarkMode, darkMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Hardcoded credentials for login validation
  const predefinedCredentials = {
    username: 'eurisko',
    password: 'academy2025',
  };

  // Form submit handler
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.username === predefinedCredentials.username && data.password === predefinedCredentials.password) {
        toggleLogin(true); // Update auth state
        navigation.navigate('ProductList'); // Redirect to ProductList
      } else {
        Alert.alert('Invalid Credentials', 'Please check your username and password and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Toggle between light and dark theme */}
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
          {/* App logo container */}
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.card }]}>
            <Image
              source={require('../../assets/img/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Login form card */}
          <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
            
            {/* Username input */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Username"
                    style={[styles.input, { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text 
                    }]}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                )}
              />
              {/* Display username validation error */}
              {errors.username && <CustomText style={[styles.error, { color: theme.colors.error }]}>{errors.username.message}</CustomText>}
            </View>

            {/* Password input with toggle visibility */}
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
                    {/* Eye icon to show/hide password */}
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
              {/* Display password validation error */}
              {errors.password && <CustomText style={[styles.error, { color: theme.colors.error }]}>{errors.password.message}</CustomText>}
            </View>

            {/* Login button */}
            <TouchableOpacity
              style={[
                styles.button, 
                isSubmitting && styles.buttonDisabled,
                { backgroundColor: theme.colors.button }
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Navigation to Signup screen */}
          <View style={styles.footer}>
            <CustomText style={[styles.footerText, { color: theme.colors.footerText }]}>New here?</CustomText>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <CustomText style={[styles.footerLink, { color: theme.colors.footerLink }]}> Create account</CustomText>
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
    top: Platform.OS === 'ios' ? 50 : 20,
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
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
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
  buttonDisabled: {
    opacity: 0.6,
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