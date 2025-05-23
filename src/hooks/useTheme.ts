import { useAuth } from '../context/AuthContext';

export const useTheme = () => {
  const { darkMode } = useAuth();
  
  const theme = {
    colors: {
      // Backgrounds
      background: darkMode ? '#121212' : '#FAFAFA',
      card: darkMode ? '#1E1E1E' : '#FFFFFF',
    
      // Text
      text: darkMode ? '#FFFFFF' : '#18181B',
      placeholder: '#A1A1AA',
      
      // Borders
      border: darkMode ? '#333333' : '#E4E4E7',
      
      // Buttons
      button: darkMode ? '#333333' : 'blue',
      buttonText: '#FFFFFF',
      cartButton: '#fccf03', 
      logoutButton: 'red',
      saveButton: '#17a2b8',

      // Footer
      footerText: darkMode ? '#A1A1AA' : '#71717A',
      footerLink: darkMode ? '#FFFFFF' : '#18181B',
      
      // Errors
      error: '#EF4444',
    },
    darkMode,
  };

  return theme;
};