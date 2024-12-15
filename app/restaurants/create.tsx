import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { validateFields, isValid } from '../../utils/validationUtils';
import { restaurantValidationSchema } from '../../validations/restaurantValidation';
import apiClient from '../../services/apiClient';

const CreateRestaurantScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    restaurant_Name: '',
    restaurant_Address: '',
    restaurant_Phone: '',
    rating: '',
    category: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const validationErrors = validateFields(formData, restaurantValidationSchema);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        rating: Number(formData.rating),
      };

      await apiClient.post('/restaurants', dataToSubmit);
      Alert.alert('Success', 'Restaurant created successfully!', [
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
      console.error('Error creating restaurant:', error);
      Alert.alert('Error', 'Failed to create restaurant. Please try again.');
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16, borderRadius: 6, backgroundColor: '#fff' },
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

export default CreateRestaurantScreen;
