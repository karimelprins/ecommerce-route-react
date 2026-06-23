import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refreshCart() {
    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data.data);
      return data.data;
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId) {
    const data = await api.addToCart(productId);
    await refreshCart();
    return data;
  }

  async function updateQuantity(productId, count) {
    const data = await api.updateCartQuantity(productId, count);
    setCart(data.data);
    return data;
  }

  async function removeItem(productId) {
    const data = await api.removeCartItem(productId);
    setCart(data.data);
    return data;
  }

  async function clearCart() {
    const data = await api.clearCart();
    setCart(null);
    return data;
  }

  const value = useMemo(() => ({ cart, loading, refreshCart, addToCart, updateQuantity, removeItem, clearCart }), [cart, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
