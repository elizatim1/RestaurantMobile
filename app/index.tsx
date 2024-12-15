import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './auth/login';
import HomeScreen from './home/index';
import UsersScreen from './users/index';
import CreateUserScreen from './users/create';
import EditUserScreen from './users/edit';
import DishesScreen from './dishes/index';
import CreateDishScreen from './dishes/create';
import EditDishScreen from './dishes/edit';
import OrdersScreen from './orders/index';
import CreateOrderScreen from './orders/create';
import EditOrderScreen from './orders/edit';
import RestaurantsScreen from './restaurants/index';
import CreateRestaurantScreen from './restaurants/create';
import EditRestaurantScreen from './restaurants/edit';

const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Users Screens */}
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="Create User" component={CreateUserScreen} />
        <Stack.Screen name="Edit User" component={EditUserScreen} />

        {/* Dishes Screens */}
        <Stack.Screen name="Dishes" component={DishesScreen} />
        <Stack.Screen name="Create Dish" component={CreateDishScreen} />
        <Stack.Screen name="Edit Dish" component={EditDishScreen} />

        {/* Orders Screens */}
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Create Order" component={CreateOrderScreen} />
        <Stack.Screen name="Edit Order" component={EditOrderScreen} />

        {/* Restaurants Screens */}
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
        <Stack.Screen name="Create Restaurant" component={CreateRestaurantScreen} />
        <Stack.Screen name="Edit Restaurant" component={EditRestaurantScreen} />
      </Stack.Navigator>
  );
}
