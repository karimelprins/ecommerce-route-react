export function getProductEnhancements(product) {
  const rating = Number(product?.ratingsAverage || 4.3);
  const price = Number(product?.price || 0);
  const discountPercent = rating >= 4.7 ? 18 : rating >= 4.4 ? 12 : 8;
  const oldPrice = Math.round(price * (1 + discountPercent / 100));
  const stock = Number(product?.quantity || 0);
  const sold = Number(product?.sold || 0);
  const isLowStock = stock > 0 && stock <= 8;
  const isOutOfStock = stock === 0;
  const badge = sold > 1000 ? "Best Seller" : rating >= 4.6 ? "Top Rated" : discountPercent >= 12 ? "Sale" : "Fresh Deal";

  return {
    oldPrice,
    discountPercent,
    stock,
    sold,
    isLowStock,
    isOutOfStock,
    badge,
    delivery: price > 500 ? "Free delivery" : "Delivery from EGP 35",
    eta: "Arrives in 2–4 business days",
    returnPolicy: "14-day easy returns",
  };
}
