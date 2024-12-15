import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { validateFields, isValid } from '../../utils/validationUtils';
import { dishValidationSchema } from '../../validations/dishValidation';
import apiClient from '../../services/apiClient';

const CreateDishScreen = ({ navigation }) => {
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
    const fetchRestaurants = async () => {
      try {
        const response = await apiClient.get('/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch restaurants.');
      }
    };

    fetchRestaurants();
  }, []);

  const handleSubmit = async () => {
    const validationErrors = validateFields(formData, dishValidationSchema);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
        await apiClient.post('/dishes', {
          ...formData,
          price: parseFloat(formData.price),
        });
        Alert.alert('Success', 'Dish created successfully!', [
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
      Alert.alert('Error', 'Failed to create dish. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <Picker.Item label="Select a Restaurant" value="" />
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginBottom: 16
  },
  picker: {
    height: 50,
    justifyContent: 'center',
  },
    button: {
      backgroundColor: '#007BFF',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
});

export default CreateDishScreen;
