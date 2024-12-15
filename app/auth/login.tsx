import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../services/apiClient';
import CustomInputField from '../../components/ui/CustomInputField';
import CustomButton from '../../components/ui/CustomButton';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => null });
  }, []);

  const handleLogin = async () => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('username', username);
      navigation.navigate('Home');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <CustomInputField
        label="Username"
        value={username}
        onChangeText={setUsername}
      />
      <CustomInputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
});

export default LoginScreen;
