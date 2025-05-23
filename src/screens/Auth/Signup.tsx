import React, { useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';
import { useAuth } from '../../context/AuthContext';


type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

// Validation schema for signup form
const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  // Auth context
  const { signUp, loading, error, clearError } = useAuth();
  const theme = useTheme();

  // React Hook Form setup with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Show alert if there's an authentication error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      await signUp({
        ...data,
        profileImage: null,
      });

      
      navigation.navigate('Verification', { email: data.email });
    } catch (error) {
     
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={[styles.formCard, { backgroundColor: theme.colors.card }]}>
            {/* First Name Field */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="First Name"
                    style={[styles.input, {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }]}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={theme.colors.placeholder}
                  />
                )}
              />
              {errors.firstName && (
                <CustomText style={[styles.error, { color: theme.colors.error }]}>
                  {errors.firstName.message}
                </CustomText>
              )}
            </View>

            {/* Last Name Field */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Last Name"
                    style={[styles.input, {
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }]}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor={theme.colors.placeholder}
                  />
                )}
              />
              {errors.lastName && (
                <CustomText style={[styles.error, { color: theme.colors.error }]}>
                  {errors.lastName.message}
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
                      color: theme.colors.text,
                    }]}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                      color: theme.colors.text,
                    }]}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholderTextColor={theme.colors.placeholder}
                  />
                )}
              />
              {errors.password && (
                <CustomText style={[styles.error, { color: theme.colors.error }]}>
                  {errors.password.message}
                </CustomText>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
                { backgroundColor: theme.colors.button },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Footer with link to login */}
          <View style={styles.footer}>
            <CustomText style={[styles.footerText, { color: theme.colors.footerText }]}>
              Already have an account?
            </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <CustomText style={[styles.footerLink, { color: theme.colors.footerLink }]}>
                {' '}
                Sign In
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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