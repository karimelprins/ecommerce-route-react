import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductEnhancements } from "../utils/productEnhance";
import RatingStars from "./RatingStars";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const meta = getProductEnhancements(product);
  const liked = isWishlisted(product.id);

  async function handleWishlist() {
    try {
      const result = await toggleWishlist(product);
      showToast(result.message);
    } catch (error) {
      showToast(error.message || "Please login first", "error");
    }
  }

  async function handleCart() {
    try {
      await addToCart(product.id);
      showToast("Added to cart");
    } catch (error) {
      showToast(error.message || "Please login first", "error");
    }
  }

  return (
    <article className="product-card premium-product-card">
      <div className="product-badges">
        <span>{meta.badge}</span>
        <strong>-{meta.discountPercent}%</strong>
      </div>
      <button className={`wishlist-button ${liked ? "active" : ""}`} onClick={handleWishlist} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}>
        <Heart size={19} fill={liked ? "currentColor" : "none"} />
      </button>
      <Link to={`/products/${product.id}`} className="product-image-wrap premium-image-wrap">
        <img src={product.imageCover} alt={product.title} loading="lazy" />
      </Link>
      <div className="product-content">
        <p className="category-text">{product.category?.name || "Premium product"}</p>
        <Link to={`/products/${product.id}`} className="product-title">{product.title}</Link>
        <RatingStars value={product.ratingsAverage} count={product.ratingsQuantity} />
        <div className="product-meta">
          <div className="price-stack"><span className="price">{formatPrice(product.price)}</span><del>{formatPrice(meta.oldPrice)}</del></div>
          <span className={meta.isLowStock ? "stock low" : "stock"}>{meta.isOutOfStock ? "Out" : meta.isLowStock ? `${meta.stock} left` : "Stock"}</span>
        </div>
        <button className="add-button premium-add" onClick={handleCart} disabled={meta.isOutOfStock}><ShoppingBag size={17} /> {meta.isOutOfStock ? "Out of stock" : "Add to cart"}</button>
      </div>
    </article>
  );
}
