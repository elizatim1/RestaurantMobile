import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import apiClient from '../../services/apiClient';

const DishesScreen = ({ navigation }) => {
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDishesAndRestaurants = async () => {
    try {
      const dishesResponse = await apiClient.get('/dishes');
      const restaurantsResponse = await apiClient.get('/restaurants');

      const restaurantData = restaurantsResponse.data.reduce((acc, restaurant) => {
        acc[restaurant.restaurant_Id] = restaurant.restaurant_Name;
        return acc;
      }, {});

      const dishesWithRestaurants = dishesResponse.data.map((dish) => ({
        ...dish,
        restaurant_Name: restaurantData[dish.restaurant_Id] || 'N/A',
      }));

      setDishes(dishesWithRestaurants);
      setRestaurants(restaurantsResponse.data);
    } catch (error) {
      console.error('Error fetching dishes or restaurants:', error);
      Alert.alert('Error', 'Failed to fetch dishes or restaurants. Please try again later.');
    }
  };

  useEffect(() => {
    fetchDishesAndRestaurants();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDishesAndRestaurants();
    setRefreshing(false);
  };

  const renderDish = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.dish_Name}</Text>
      <Text style={styles.subText}>Description: {item.description}</Text>
      <Text style={styles.subText}>Price: ${item.price?.toFixed(2)}</Text>
      <Text style={styles.subText}>Category: {item.category}</Text>
      <Text style={styles.subText}>Restaurant: {item.restaurant_Name}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit Dish', { id: item.dish_Id })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create Dish')}
      >
        <Text style={styles.buttonText}>Create Dish</Text>
      </TouchableOpacity>
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.dish_Id.toString()}
        renderItem={renderDish}
        ListEmptyComponent={<Text style={styles.emptyText}>No dishes found.</Text>}
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
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default DishesScreen;
