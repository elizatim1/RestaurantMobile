import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../../services/apiClient';
import { validateFields, isValid } from '../../utils/validationUtils';
import { userValidationSchema } from '../../validations/userValidation';

const EditUserScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [formData, setFormData] = useState({
    first_Name: '',
    last_Name: '',
    username: '',
    user_Address: '',
    user_Phone: '',
    email: '',
    role_Id: '',
  });
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/users/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Failed to fetch user details.');
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await apiClient.get('/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        Alert.alert('Error', 'Failed to fetch roles.');
      }
    };

    fetchUser();
    fetchRoles();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/users/${id}`);
            Alert.alert('Success', 'User deleted successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      { name: 'Home' },
                      { name: 'Users', params: { refresh: true } },
                    ],
                  });
                },
              },
            ]);
          } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'Failed to delete user. Please try again.');
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields(formData, userValidationSchema);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
      return;
    }

    try {
      await apiClient.put(`/users/${id}`, formData);
        Alert.alert('Success', 'User updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'Home' },
                  { name: 'Users', params: { refresh: true } },
                ],
              });
            },
          },
        ]);
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'Failed to update user. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, errors.first_Name && styles.errorInput]}
            value={formData.first_Name}
            onChangeText={(text) => setFormData({ ...formData, first_Name: text })}
          />
          {errors.first_Name && <Text style={styles.errorText}>{errors.first_Name}</Text>}

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, errors.last_Name && styles.errorInput]}
            value={formData.last_Name}
            onChangeText={(text) => setFormData({ ...formData, last_Name: text })}
          />
        {errors.last_Name && <Text style={styles.errorText}>{errors.last_Name}</Text>}

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, errors.username && styles.errorInput]}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            secureTextEntry
          />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, errors.user_Address && styles.errorInput]}
            value={formData.user_Address}
            onChangeText={(text) => setFormData({ ...formData, user_Address: text })}
          />
        {errors.user_Address && <Text style={styles.errorText}>{errors.user_Address}</Text>}

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, errors.user_Phone && styles.errorInput]}
            value={formData.user_Phone}
            onChangeText={(text) => setFormData({ ...formData, user_Phone: text })}
            keyboardType="phone-pad"
          />
        {errors.user_Phone && <Text style={styles.errorText}>{errors.user_Phone}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.role_Id}
              onValueChange={(value) => setFormData({ ...formData, role_Id: value })}
              style={styles.picker}
            >
              <Picker.Item label="Select a Role" value="" />
              {roles.map((role) => (
                <Picker.Item key={role.role_Id} label={role.name} value={role.role_Id} />
              ))}
            </Picker>
          </View>
        {errors.role_Id && <Text style={styles.errorText}>{errors.role_Id}</Text>}
        {console.log('errors',errors)}
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
  errorInput: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
});

export default EditUserScreen;
