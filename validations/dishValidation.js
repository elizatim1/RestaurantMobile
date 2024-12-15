export const dishValidationSchema = {
  dish_Name: {
    required: { message: "Dish name is required" },
    maxLength: { value: 255, message: "Dish name must not exceed 255 characters" },
  },
  description: {
    required: { message: "Description is required" },
    maxLength: { value: 500, message: "Description must not exceed 500 characters" },
  },
  price: {
    required: { message: "Price is required" },
    numeric: { message: "Price must be a number" },
    min: { value: 0, message: "Price must be a non-negative number" },
  },
  category: {
    required: { message: "Category is required" },
    maxLength: { value: 100, message: "Category must not exceed 100 characters" },
  },
  restaurant_Id: {
    required: { message: "Restaurant is required" },
    numeric: { message: "Restaurant ID must be a number" },
  },
};