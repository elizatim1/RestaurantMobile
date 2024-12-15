import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { validateFields, isValid } from '../../utils/validationUtils';
import { dishValidationSchema } from '../../validations/dishValidation';
import apiClient from '../../services/apiClient';

const EditDishScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [formData, setFormData] = useState({
    dish_Name: '',
    description: '',
    price: '',
    category: '',
    restaurant_Id: '',
  });
  const [errors, setErrors] = useState({});
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const response = await apiClient.get(`/dishes/${id}`);
        setFormData({
          ...response.data,
          price: response.data.price.toString(),
        });
      } catch (error) {
        console.error('Error fetching dish:', error);
        Alert.alert('Error', 'Failed to fetch dish details. Please try again.');
      }
    };

    const fetchRestaurants = async () => {
      try {
        const response = await apiClient.get('/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        Alert.alert('Error', 'Failed to fetch restaurants.');
      }
    };

    fetchDish();
    fetchRestaurants();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this dish?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/dishes/${id}`);
            Alert.alert('Success', 'Dish deleted successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'Home' },
                        { name: 'Dishes', params: { refresh: true } }
                    ],
                  });
                },
              },
            ]);
          } catch (error) {
            console.error('Error deleting dish:', error);
            Alert.alert('Error', 'Failed to delete dish. Please try again.');
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(formData, dishValidationSchema);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      Alert.alert('Validation Error', 'Please correct the highlighted errors.');
      return;
    }

    try {
      await apiClient.put(`/dishes/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
      });
      Alert.alert('Success', 'Dish updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                { name: 'Home' },
                { name: 'Dishes', params: { refresh: true } }
              ],
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating dish:', error);
      Alert.alert('Error', 'Failed to update dish. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dish Name</Text>
      <TextInput
        style={[styles.input, errors.dish_Name && styles.errorInput]}
        value={formData.dish_Name}
        onChangeText={(text) => setFormData({ ...formData, dish_Name: text })}
      />
      {errors.dish_Name && <Text style={styles.errorText}>{errors.dish_Name}</Text>}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, errors.description && styles.errorInput]}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={[styles.input, errors.price && styles.errorInput]}
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        keyboardType="numeric"
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={[styles.input, errors.category && styles.errorInput]}
        value={formData.category}
        onChangeText={(text) => setFormData({ ...formData, category: text })}
      />
      {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

      <Text style={styles.label}>Restaurant</Text>
      <View style={[styles.pickerContainer, errors.restaurant_Id && styles.errorInput]}>
        <Picker
          selectedValue={formData.restaurant_Id}
          onValueChange={(value) => setFormData({ ...formData, restaurant_Id: value })}
          style={styles.picker}
        >
          {restaurants.map((restaurant) => (
            <Picker.Item
              key={restaurant.restaurant_Id}
              label={restaurant.restaurant_Name}
              value={restaurant.restaurant_Id}
            />
          ))}
        </Picker>
      </View>
      {errors.restaurant_Id && <Text style={styles.errorText}>{errors.restaurant_Id}</Text>}

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
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: '#fff',
      marginBottom: 16,
      overflow: 'hidden',
    },
    picker: {
      height: 50,
    },
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8
  },
  errorInput: {
    borderColor: 'red'
   },
});

export default EditDishScreen;
