// App.tsx
import React from 'react';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';

const App: React.FC = () => {
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
};

export default App;
