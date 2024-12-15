import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { validateFields, isValid } from '../../utils/validationUtils';
import { orderValidationSchema } from '../../validations/orderValidation';
import apiClient from '../../services/apiClient';

const EditOrderScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const [formData, setFormData] = useState({
    user_Id: '',
    restaurant_Id: '',
    order_Date: '',
    delivery_Address: '',
    status: '',
    orderDetails: [],
  });

  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [availableDishes, setAvailableDishes] = useState([]);
  const [currentDish, setCurrentDish] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [errors, setErrors] = useState({});

  const validStatuses = ['Pending', 'Completed', 'Cancelled', 'In Progress'];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${id}`);
        const orderData = response.data;

        const restaurantDishesResponse = await apiClient.get(`/restaurants/${orderData.restaurant_Id}`);
        const dishes = restaurantDishesResponse.data.dishes;

        const updatedOrderDetails = orderData.orderDetails.map((detail) => {
          const dish = dishes.find((d) => d.dish_Id === detail.dish_Id);
          return {
            ...detail,
            dish_Name: dish ? dish.dish_Name : 'Unknown Dish',
            price: dish ? dish.price : 0,
          };
        });

        setFormData({
          ...orderData,
          orderDetails: updatedOrderDetails,
        });

        setAvailableDishes(dishes);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch order details.');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        setUsers(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch users.');
      }
    };

    const fetchRestaurants = async () => {
      try {
        const response = await apiClient.get('/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch restaurants.');
      }
    };

    fetchOrder();
    fetchUsers();
    fetchRestaurants();
  }, [id]);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!formData.restaurant_Id) {
        setAvailableDishes([]);
        return;
      }

      try {
        const response = await apiClient.get(`/restaurants/${formData.restaurant_Id}`);
        if (response.data && Array.isArray(response.data.dishes)) {
          setAvailableDishes(response.data.dishes);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch dishes for the selected restaurant.');
      }
    };

    fetchDishes();
  }, [formData.restaurant_Id]);

  const handleAddOrderDetail = () => {
    if (!currentDish || !currentQuantity || parseInt(currentQuantity, 10) <= 0) {
      Alert.alert('Validation Error', 'Please select a dish and enter a valid quantity.');
      return;
    }

    const dishIdNumber = parseInt(currentDish, 10);
    const selectedDish = availableDishes.find((dish) => dish.dish_Id === dishIdNumber);

    if (!selectedDish) {
      Alert.alert('Error', 'Selected dish not found.');
      return;
    }

    const newOrderDetail = {
      dish_Id: dishIdNumber,
      quantity: parseInt(currentQuantity, 10),
      dish_Name: selectedDish.dish_Name,
      price: selectedDish.price,
    };

    setFormData((prevState) => ({
      ...prevState,
      orderDetails: [...prevState.orderDetails, newOrderDetail],
    }));

    setCurrentDish('');
    setCurrentQuantity('');
  };

  const handleRemoveOrderDetail = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      orderDetails: prevState.orderDetails.filter((_, i) => i !== index),
    }));
  };

  const calculateTotalPrice = () => {
    return formData.orderDetails.reduce(
      (total, detail) => total + detail.price * detail.quantity,
      0
    );
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(formData, orderValidationSchema);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      await apiClient.put(`/orders/${id}`, formData);
      Alert.alert('Success', 'Order updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                { name: 'Home' },
                { name: 'Orders', params: { refresh: true } },
              ],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order.');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/orders/${id}`);
            Alert.alert('Success', 'Order deleted successfully!', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete order.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>User</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.user_Id}
            onValueChange={(value) => setFormData({ ...formData, user_Id: value })}
            style={styles.picker}
          >
            <Picker.Item label="Select a User" value="" />
            {users.map((user) => (
              <Picker.Item
                key={user.user_Id}
                label={`${user.first_Name} ${user.last_Name}`}
                value={user.user_Id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Restaurant</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={restaurants.find((r) => r.restaurant_Id === formData.restaurant_Id)?.restaurant_Name || ''}
          editable={false}
        />

        <Text style={styles.label}>Order Date</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={formData.order_Date}
          editable={false}
        />

        <Text style={styles.label}>Delivery Address</Text>
        <TextInput
          style={styles.input}
          value={formData.delivery_Address}
          onChangeText={(text) => setFormData({ ...formData, delivery_Address: text })}
        />
        {errors.delivery_Address && (
          <Text style={styles.errorText}>{errors.delivery_Address}</Text>
        )}

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.status}
          onValueChange={(value) => {
            setFormData({ ...formData, status: value });
        }}
          style={styles.picker}
        >
          <Picker.Item label="Select a Status" value="" />
          {validStatuses.map((statusValue) => (
            <Picker.Item
              key={statusValue}
              label={statusValue}
              value={statusValue}
            />
          ))}
        </Picker>
        </View>
        {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}

        <Text style={styles.label}>Order Details</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentDish}
            onValueChange={(value) => setCurrentDish(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select a Dish" value="" />
            {availableDishes.map((dish) => (
              <Picker.Item key={dish.dish_Id} label={dish.dish_Name} value={String(dish.dish_Id)} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          value={currentQuantity}
          onChangeText={(text) => setCurrentQuantity(text)}
          placeholder="Quantity"
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddOrderDetail}>
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>

        {formData.orderDetails.length === 0 ? (
          <Text style={styles.noDishesText}>No dishes added yet.</Text>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Quantity</Text>
              <Text style={styles.headerText}>Price</Text>
              <Text style={styles.headerText}></Text>
            </View>
            {formData.orderDetails.map((item, index) => (
              <View key={index} style={styles.detailItem}>
                <Text>{item.dish_Name}</Text>
                <Text>{item.quantity}</Text>
                <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleRemoveOrderDetail(index)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <Text style={styles.totalPriceText}>
          Total Price: ${calculateTotalPrice().toFixed(2)}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16, borderRadius: 6, backgroundColor: '#fff' },
  disabledInput: { color: '#999', backgroundColor: '#e9e9e9' },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 16
  },
  picker: { height: 50 },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff' },
    noDishesText: {
      textAlign: 'center',
      fontSize: 16,
      marginVertical: 10,
      color: '#666',
    },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
    headerText: {
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
      textAlign: 'center',
    },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  removeButton: { color: 'red' },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 16,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  saveButton: { backgroundColor: '#007BFF' },
  deleteButton: { backgroundColor: '#FF3B3B' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
  errorInput: { borderColor: 'red' },
});

export default EditOrderScreen;
