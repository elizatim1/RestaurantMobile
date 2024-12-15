import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigation.navigate('Login');
      }
    };

    checkAuth();
  }, [navigation]);

  if (isAuthenticated === null) {
    return <Text>Loading...</Text>;
  }

  if (!isAuthenticated) {
    return <Text>You are not authorized!</Text>;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProtectedRoute;
