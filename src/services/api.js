const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ecommerce.routemisr.com/api/v1";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem("freshcart_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { token } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.message || "Something went wrong", response.status, payload);
  }

  return payload;
}

export const api = {
  baseUrl: API_BASE_URL,
  products: () => request("/products"),
  product: (id) => request(`/products/${id}`),
  categories: () => request("/categories"),
  brands: () => request("/brands"),
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  signin: (body) => request("/auth/signin", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => request("/auth/forgotPasswords", { method: "POST", body: JSON.stringify(body) }),
  getCart: () => request("/cart"),
  addToCart: (productId) => request("/cart", { method: "POST", body: JSON.stringify({ productId }) }),
  updateCartQuantity: (productId, count) => request(`/cart/${productId}`, { method: "PUT", body: JSON.stringify({ count }) }),
  removeCartItem: (productId) => request(`/cart/${productId}`, { method: "DELETE" }),
  clearCart: () => request("/cart", { method: "DELETE" }),
  wishlist: () => request("/wishlist"),
  addWishlist: (productId) => request("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
  removeWishlist: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),
  checkout: (cartId, shippingAddress, redirectUrl) =>
    request(`/orders/checkout-session/${cartId}?url=${encodeURIComponent(redirectUrl)}`, {
      method: "POST",
      body: JSON.stringify({ shippingAddress }),
    }),
};
