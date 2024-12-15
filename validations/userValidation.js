export const userValidationSchema = {
  first_Name: {
    required: { message: 'First name is required.' },
  },
  last_Name: {
    required: { message: 'Last name is required.' },
  },
  username: {
    required: { message: 'Username is required.' },
    min: { value: 3, message: 'Username must be at least 3 characters long.' },
  },
  user_Address: {
    required: { message: 'Address is required.' },
  },
  user_Phone: {
    required: { message: 'Phone number is required.' },
    numeric: { message: 'Phone number must be numeric.' },
  },
  email: {
    required: { message: 'Email is required.' },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format.',
    },
  },
  role_Id: {
    required: { message: 'Role is required.' },
  },
};
