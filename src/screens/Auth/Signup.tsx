import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// React Hook Form & Zod for validation
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Persist data locally
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navigation types
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

// Custom theming and components
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';

// Define props type for navigation
type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

// Validation schema using Zod
const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  countryCode: z
    .string()
    .regex(/^\+\d{1,4}$/, 'Country code must start with + and include up to 4 digits'),
  phone: z
    .string()
    .regex(/^\d{8}$/, 'Phone must be 8 digits (excluding country code)'),
});

// Type for form data inferred from schema
type FormData = z.infer<typeof schema>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  // useForm hook setup with Zod schema as resolver
  const {
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const theme = useTheme(); 

  // Function to handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      // Store user data in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(data));
      Alert.alert('Success', 'Account created! Please verify your email');
      navigation.navigate('Verification'); 
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>

          {/* Full Name Field */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Full Name"
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }]}
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor={theme.colors.placeholder}
                />
              )}
            />
            {/* Error message for name */}
            {errors.name && (
              <CustomText style={[styles.error, { color: theme.colors.error }]}>
                {errors.name.message}
              </CustomText>
            )}
          </View>

          {/* Email Field */}
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.placeholder}
                />
              )}
            />
            {/* Error message for email */}
            {errors.email && (
              <CustomText style={[styles.error, { color: theme.colors.error }]}>
                {errors.email.message}
              </CustomText>
            )}
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Password"
                  style={[styles.input, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }]}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry // Hides text for passwords
                  placeholderTextColor={theme.colors.placeholder}
                />
              )}
            />
            {/* Error message for password */}
            {errors.password && (
              <CustomText style={[styles.error, { color: theme.colors.error }]}>
                {errors.password.message}
              </CustomText>
            )}
          </View>

          {/* Country Code and Phone Number */}
          <View style={styles.inputContainer}>
            <View style={styles.phoneRow}>
              {/* Country Code Input */}
              <Controller
                control={control}
                name="countryCode"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="+961"
                    style={[styles.countryCodeInput, {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }]}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    placeholderTextColor={theme.colors.placeholder}
                    maxLength={5}
                  />
                )}
              />

              {/* Phone Number Input */}
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Phone Number"
                    style={[styles.phoneInput, {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text
                    }]}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    maxLength={8}
                    placeholderTextColor={theme.colors.placeholder}
                  />
                )}
              />
            </View>

            {/* Error message for phone or country code */}
            {(errors.countryCode || errors.phone) && (
              <CustomText style={[styles.error, { color: theme.colors.error }]}>
                {errors.countryCode?.message || errors.phone?.message}
              </CustomText>
            )}
          </View>

          {/* Submit Button */}
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Footer with link to login */}
        <View style={styles.footer}>
          <CustomText style={[styles.footerText, { color: theme.colors.footerText }]}>
            Already have an account?
          </CustomText>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <CustomText style={[styles.footerLink, { color: theme.colors.footerLink }]}> Sign In</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    paddingTop: 48,
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    marginRight: 8,
    width: 80,
  },
  phoneInput: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
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

export default SignupScreen;
