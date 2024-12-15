export const restaurantValidationSchema = {
  restaurant_Name: {
    required: { message: 'Restaurant name is required.' },
    minLength: { value: 3, message: 'Name must be at least 3 characters long.' },
  },
  restaurant_Address: {
    required: { message: 'Address is required.' },
    minLength: { value: 5, message: 'Address must be at least 5 characters long.' },
  },
  restaurant_Phone: {
    required: { message: 'Phone number is required.' },
    pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Invalid phone number format.' },
  },
  rating: {
    required: { message: 'Rating is required.' },
    numeric: { message: 'Rating must be a number.' },
    min: { value: 0, message: 'Rating cannot be less than 0.' },
    max: { value: 10, message: 'Rating cannot exceed 10.' },
  },
  category: {
    required: { message: 'Category is required.' },
  },
};
