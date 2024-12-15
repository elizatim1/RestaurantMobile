import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../services/apiClient';

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState('Guest');
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      navigation.setOptions({ headerLeft: () => null });

    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername || 'Guest');
    };

    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/orders/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (error.response?.status === 401) {
          Alert.alert('Session Expired', 'Please log in again.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]);
        } else {
          Alert.alert('Error', 'Failed to fetch statistics.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been logged out successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username}!</Text>
      <Text style={styles.subtitle}>Here's an overview of your system's activity.</Text>

      {/* Statistics Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Orders</Text>
          <Text style={styles.statValue}>{stats.totalOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed Orders</Text>
          <Text style={styles.statValue}>{stats.completedOrders}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pending Orders</Text>
          <Text style={styles.statValue}>{stats.pendingOrders}</Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Users')}>
        <Text style={styles.buttonText}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dishes')}>
        <Text style={styles.buttonText}>Manage Dishes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Orders')}>
        <Text style={styles.buttonText}>Manage Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Restaurants')}>
        <Text style={styles.buttonText}>Manage Restaurants</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 16, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  statLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#007BFF' },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#FF3B3B', marginTop: 24 },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
