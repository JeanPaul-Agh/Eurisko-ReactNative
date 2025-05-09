import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation';
import { useTheme } from '../../hooks/useTheme';

type VerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Verification'>;

const Verification = ({ navigation }: { navigation: VerificationScreenNavigationProp }) => {
  const [code, setCode] = useState('');
  const theme = useTheme();

  const handleVerify = () => {
    if (code.length !== 4) {
      Alert.alert('Error', 'Verification code must be 4 digits');
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
      <Text style={[styles.title, { color: theme.colors.text }]}>Enter 4-Digit Verification Code</Text>
      
      <TextInput
        style={[styles.input, { 
          borderColor: theme.colors.border,
          color: theme.colors.text,
          backgroundColor: theme.colors.card
        }]}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={4}
        placeholderTextColor={theme.colors.placeholder}
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.colors.button }]} 
        onPress={handleVerify}
      >
        <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.linkText, { color: theme.colors.footerLink }]}>Back to Login</Text>
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