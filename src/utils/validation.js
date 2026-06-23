export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 6;
}

export function validatePhone(phone) {
  return /^01[0125][0-9]{8}$|^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ""));
}

export function getAuthValidationErrors(form, mode = "login") {
  const errors = {};
  if (mode === "register" && !form.name.trim()) errors.name = "Name is required";
  if (!validateEmail(form.email)) errors.email = "Enter a valid email address";
  if (!validatePassword(form.password)) errors.password = "Password must be at least 6 characters";
  if (mode === "register" && form.password !== form.rePassword) errors.rePassword = "Passwords do not match";
  if (mode === "register" && !validatePhone(form.phone)) errors.phone = "Enter a valid phone number";
  return errors;
}

export function getCheckoutValidationErrors(form) {
  const errors = {};
  if (!form.details.trim()) errors.details = "Address details are required";
  if (!validatePhone(form.phone)) errors.phone = "Enter a valid phone number";
  if (!form.city.trim()) errors.city = "City is required";
  return errors;
}
