import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { validateFields, isValid } from '../../utils/validationUtils';
import { restaurantValidationSchema } from '../../validations/restaurantValidation';
import apiClient from '../../services/apiClient';

const EditRestaurantScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [formData, setFormData] = useState({
    restaurant_Name: '',
    restaurant_Address: '',
    restaurant_Phone: '',
    rating: '0',
    category: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await apiClient.get(`/restaurants/${id}`);
        const restaurantData = response.data;

        setFormData({
          ...restaurantData,
          rating: restaurantData.rating ? String(restaurantData.rating) : '0',
        });
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        Alert.alert('Error', 'Failed to fetch restaurant details. Please try again.');
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this restaurant?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/restaurants/${id}`);
            Alert.alert('Success', 'Restaurant deleted successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      { name: 'Home' },
                      { name: 'Restaurants', params: { refresh: true } },
                    ],
                  });
                },
              },
            ]);
          } catch (error) {
            console.error('Error deleting restaurant:', error);
            Alert.alert('Error', 'Failed to delete restaurant. Please try again.');
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(formData, restaurantValidationSchema);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      const updatedData = {
        ...formData,
        rating: Number(formData.rating),
      };

      await apiClient.put(`/restaurants/${id}`, updatedData);
      Alert.alert('Success', 'Restaurant updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                { name: 'Home' },
                { name: 'Restaurants', params: { refresh: true } },
              ],
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      Alert.alert('Error', 'Failed to update restaurant. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Restaurant Name</Text>
      <TextInput
        style={[styles.input, errors.restaurant_Name && styles.errorInput]}
        value={formData.restaurant_Name}
        onChangeText={(text) => setFormData({ ...formData, restaurant_Name: text })}
      />
      {errors.restaurant_Name && <Text style={styles.errorText}>{errors.restaurant_Name}</Text>}

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={[styles.input, errors.restaurant_Address && styles.errorInput]}
        value={formData.restaurant_Address}
        onChangeText={(text) => setFormData({ ...formData, restaurant_Address: text })}
      />
      {errors.restaurant_Address && <Text style={styles.errorText}>{errors.restaurant_Address}</Text>}

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={[styles.input, errors.restaurant_Phone && styles.errorInput]}
        value={formData.restaurant_Phone}
        onChangeText={(text) => setFormData({ ...formData, restaurant_Phone: text })}
        keyboardType="phone-pad"
      />
      {errors.restaurant_Phone && <Text style={styles.errorText}>{errors.restaurant_Phone}</Text>}

      <Text style={styles.label}>Rating</Text>
      <TextInput
        style={[styles.input, errors.rating && styles.errorInput]}
        value={formData.rating}
        onChangeText={(text) => setFormData({ ...formData, rating: text })}
        keyboardType="numeric"
      />
      {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={[styles.input, errors.category && styles.errorInput]}
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
      />
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16, borderRadius: 6, backgroundColor: '#fff' },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: '#007BFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B3B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
});

export default EditRestaurantScreen;
