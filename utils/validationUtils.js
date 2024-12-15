export const validateFields = (formData, validationSchema) => {
  const errors = {};

  for (const [key, rules] of Object.entries(validationSchema)) {
    const value = formData[key];

    const numericValue = value !== undefined && value !== null && !isNaN(value) ? parseFloat(value) : value;

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[key] = rules.required.message || `${key} is required`;
      continue;
    }

    if (rules.numeric && isNaN(value)) {
      errors[key] = rules.numeric.message || `${key} must be a number`;
      continue;
    }

    if (rules.maxLength && value?.length > rules.maxLength) {
      errors[key] = rules.maxLength.message || `${key} exceeds maximum length`;
    }

    if (rules.min !== undefined && numericValue < rules.min.value) {
      errors[key] = rules.min.message || `${key} is below minimum value`;
    }

    if (rules.max !== undefined && numericValue > rules.max.value) {
      errors[key] = rules.max.message || `${key} exceeds maximum value`;
    }
  }

  return errors;
};

export const isValid = (errors) => Object.keys(errors).length === 0;
