import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function refreshWishlist() {
    if (!isAuthenticated) {
      setItems([]);
      return [];
    }
    setLoading(true);
    try {
      const data = await api.wishlist();
      const nextItems = data.data || [];
      setItems(nextItems);
      return nextItems;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshWishlist().catch(() => setItems([]));
  }, [isAuthenticated]);

  function isWishlisted(productId) {
    return items.some((item) => item.id === productId || item._id === productId);
  }

  async function toggleWishlist(product) {
    if (!isAuthenticated) throw new Error("Please login first");
    const productId = product.id || product._id;
    if (isWishlisted(productId)) {
      await api.removeWishlist(productId);
      setItems((current) => current.filter((item) => item.id !== productId && item._id !== productId));
      return { active: false, message: "Removed from wishlist" };
    }
    await api.addWishlist(productId);
    setItems((current) => current.some((item) => item.id === productId || item._id === productId) ? current : [product, ...current]);
    return { active: true, message: "Added to wishlist" };
  }

  const value = useMemo(() => ({ items, loading, refreshWishlist, isWishlisted, toggleWishlist }), [items, loading, isAuthenticated]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
