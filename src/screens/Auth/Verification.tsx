import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useTheme } from '../../hooks/useTheme';
import { z } from 'zod';
import CustomText from '../../components/CustomText';


type VerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Verification'>;

// Verification screen component
const Verification = ({ navigation }: { navigation: VerificationScreenNavigationProp }) => {
  const [code, setCode] = useState(''); 
  const theme = useTheme(); 

  // Zod schema for a 4-digit code
  const codeSchema = z.string().length(4, 'Verification code must be 4 digits');

  // Handler to validate and check the code
  const handleVerify = () => {
    const result = codeSchema.safeParse(code); 

    if (!result.success) {
      Alert.alert('Error', result.error.errors[0].message); 
      return;
    }

    if (code === '1234') {
      
      Alert.alert('Success', 'Account verified! Please login');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {

      Alert.alert('Error', 'Invalid verification code');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomText style={[styles.title, { color: theme.colors.text }]}>
        Enter 4-Digit Verification Code
      </CustomText>

      {/* Code input field */}
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
        maxLength={4}
        placeholderTextColor={theme.colors.placeholder}
      />

      {/* Verify button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.button }]}
        onPress={handleVerify}
      >
        <CustomText style={[styles.buttonText, { color: theme.colors.buttonText }]}>
          Verify
        </CustomText>
      </TouchableOpacity>

      {/* Link to go back to Login */}
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
  },
});

export default Verification;