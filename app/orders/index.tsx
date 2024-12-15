import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import apiClient from '../../services/apiClient';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dishesMap, setDishesMap] = useState({});

  const fetchOrders = async () => {
    try {
      const ordersResponse = await apiClient.get('/orders');
      const ordersData = ordersResponse.data || [];

      const dishesResponse = await apiClient.get('/dishes');
      const dishesData = dishesResponse.data || [];
      const dishesMapLocal = dishesData.reduce((map, dish) => {
        map[dish.dish_Id] = dish;
        return map;
      }, {});
      setDishesMap(dishesMapLocal);

      const populatedOrders = await Promise.all(
        ordersData.map(async (order) => {
          const userResponse = await apiClient.get(`/users/${order.user_Id}`);
          const userData = userResponse.data;

          const restaurantResponse = await apiClient.get(`/restaurants/${order.restaurant_Id}`);
          const restaurantData = restaurantResponse.data;

          const totalPrice = (order.orderDetails || []).reduce((total, detail) => {
            const dish = dishesMapLocal[detail.dish_Id];
            const price = dish && dish.price ? Number(dish.price) : 0;
            const quantity = Number(detail.quantity) || 0;
            return total + (price * quantity);
          }, 0);

          return {
            ...order,
            fullName: `${userData.first_Name} ${userData.last_Name}`,
            restaurantName: restaurantData.restaurant_Name,
            totalPrice,
          };
        })
      );

      setOrders(populatedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders. Please try again later.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const renderOrder = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Order #{item.order_Id}</Text>
      <Text style={styles.subText}>Status: {item.status}</Text>
      <Text style={styles.subText}>Customer: {item.fullName}</Text>
      <Text style={styles.subText}>Restaurant: {item.restaurantName}</Text>
      <Text style={styles.subText}>Order Date: {item.order_Date}</Text>
      <Text style={styles.subText}>Address: {item.delivery_Address}</Text>
      <Text style={styles.subText}>Total Price: ${item.totalPrice.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit Order', { id: item.order_Id })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create Order')}
      >
        <Text style={styles.buttonText}>Create Order</Text>
      </TouchableOpacity>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_Id.toString()}
        renderItem={renderOrder}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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

export default OrdersScreen;
