import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const CustomText: React.FC<TextProps> = ({ style, children, ...props }) => {
  const theme = useTheme();
  return (
    <Text 
      style={[styles.text, { color: theme.colors.text }, style]} 
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Regular', 
  },
});

export default CustomText;