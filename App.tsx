// App.tsx
import React from 'react';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/context/AuthContext';
const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
