import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/useTheme';
import CustomText from '../../components/CustomText';
import { useAuth } from '../../context/AuthContext';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation';

// Types for navigation and route props
type VerificationScreenRouteProp = RouteProp<AuthStackParamList, 'Verification'>;
type VerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Verification'>;

type Props = {
  route: VerificationScreenRouteProp;
  navigation: VerificationScreenNavigationProp;
};

const Verification = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const [code, setCode] = useState('');
  // Auth context provides OTP
  const { verifyOtp, resendOtp, loading, error, clearError } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  // Handle OTP verification
  const handleVerify = async () => {
    try {
      await verifyOtp(email, code);
      Alert.alert('Success', 'Email verified successfully! Please login.');
      navigation.navigate('Login');
    } catch (error) {
      
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      await resendOtp(email);
    } catch (error) {
      
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Title and subtitle */}
      <CustomText style={[styles.title, { color: theme.colors.text }]}>
        Enter 4-Digit Verification Code
      </CustomText>

      <CustomText style={[styles.subtitle, { color: theme.colors.text }]}>
        Sent to {email}
      </CustomText>

      {/* OTP input */}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
          },
        ]}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="------"
        placeholderTextColor={theme.colors.placeholder}
      />

      {/* Verify button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button }]}
        onPress={handleVerify}
        disabled={loading || code.length !== 6}
      >
        <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
          {loading ? 'Verifying...' : 'Verify'}
        </CustomText>
      </TouchableOpacity>

      {/* Resend OTP link */}
      <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
        <CustomText style={[styles.linkText, { color: theme.colors.footerLink }]}>
          Didn't receive code? Resend
        </CustomText>
      </TouchableOpacity>

      {/* Back to Login link */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <CustomText style={[styles.linkText, { color: theme.colors.footerLink }]}>
          Back to Login
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default Verification;