export const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(price || 0);

export const normalizeProducts = (payload) => payload?.data || [];
