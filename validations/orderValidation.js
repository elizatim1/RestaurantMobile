export const orderValidationSchema = {
  user_Id: {
    required: { message: "User is required" },
    numeric: { message: "User ID must be a number" },
  },
  restaurant_Id: {
    required: { message: "Restaurant is required" },
    numeric: { message: "Restaurant ID must be a number" },
  },
  order_Date: {
    required: { message: "Order date is required" },
    date: { message: "Order date must be a valid date" },
  },
  status: {
    required: { message: "Status is required" },
    maxLength: { value: 50, message: "Status must not exceed 50 characters" },
  },
  delivery_Address: {
    required: { message: "Delivery address is required" },
    maxLength: { value: 255, message: "Delivery address must not exceed 255 characters" },
  },
  orderDetails: {
    required: { message: "Order details are required" },
    array: { message: "Order details must be a valid array of items" },
    minLength: { value: 1, message: "Order must contain at least one dish" },
  },
};
