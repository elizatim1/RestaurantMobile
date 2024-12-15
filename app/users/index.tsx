import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import apiClient from '../../services/apiClient';

const UsersScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsersAndRoles = async () => {
    try {
      const usersResponse = await apiClient.get('/users');
      const validUsers = (usersResponse.data || []).filter((user) => user?.user_Id);

      const rolesResponse = await apiClient.get('/roles');
      const rolesData = rolesResponse.data.reduce((acc, role) => {
        acc[role.role_Id] = role.name;
        return acc;
      }, {});

      const usersWithRoles = validUsers.map((user) => ({
        ...user,
        role_Name: rolesData[user.role_Id] || 'N/A',
      }));

      setUsers(usersWithRoles);
      setRoles(rolesResponse.data);
    } catch (error) {
      console.error('Error fetching users or roles:', error);
      Alert.alert('Error', 'Failed to fetch users or roles. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsersAndRoles();
    setRefreshing(false);
  };

  const renderUser = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.first_Name} {item.last_Name}
      </Text>
      <Text style={styles.subText}>Email: {item.email}</Text>
      <Text style={styles.subText}>Phone: {item.user_Phone}</Text>
      <Text style={styles.subText}>Address: {item.user_Address}</Text>
      <Text style={styles.subText}>Role: {item.role_Name}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit User', { id: item.user_Id })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create User')}
      >
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.user_Id.toString()}
        renderItem={renderUser}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
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

export default UsersScreen;
