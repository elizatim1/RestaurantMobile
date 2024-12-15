import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import apiClient from '../../services/apiClient';

const RestaurantsScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const response = await apiClient.get('/restaurants');
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      Alert.alert('Error', 'Failed to fetch restaurants. Please try again later.');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  };

  const renderRestaurant = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.restaurant_Name}</Text>
      <Text style={styles.subText}>Address: {item.restaurant_Address}</Text>
      <Text style={styles.subText}>Phone: {item.restaurant_Phone}</Text>
      <Text style={styles.subText}>Rating: {item.rating}</Text>
      <Text style={styles.subText}>Category: {item.category}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit Restaurant', { id: item.restaurant_Id })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create Restaurant')}
      >
        <Text style={styles.buttonText}>Create Restaurant</Text>
      </TouchableOpacity>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant_Id.toString()}
        renderItem={renderRestaurant}
        ListEmptyComponent={<Text style={styles.emptyText}>No restaurants found.</Text>}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  createButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default RestaurantsScreen;
