import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import RatingStars from "../components/RatingStars";
import { api } from "../services/api";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { getProductEnhancements } from "../utils/productEnhance";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const meta = useMemo(() => getProductEnhancements(product || {}), [product]);
  const liked = product ? isWishlisted(product.id) : false;

  async function load() {
    setLoading(true); setError("");
    try { const payload = await api.product(id); setProduct(payload.data); setSelectedImage(payload.data.imageCover); }
    catch (err) { setError(err.message || "Product not found"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [id]);

  async function handleAddToCart() {
    try {
      for (let i = 0; i < quantity; i += 1) await addToCart(product.id);
      showToast(`${quantity} item${quantity > 1 ? "s" : ""} added to cart`);
    } catch (err) { showToast(err.message || "Please login first", "error"); }
  }
  async function handleWishlist() {
    try { const result = await toggleWishlist(product); showToast(result.message); }
    catch (err) { showToast(err.message || "Please login first", "error"); }
  }

  if (loading) return <Loading label="Loading product" />;
  if (error) return <main className="page-shell"><ErrorState message={error} onRetry={load} /></main>;
  if (!product) return <main className="page-shell"><ErrorState title="Product not found" /></main>;

  const galleryImages = [product.imageCover, ...(product.images || [])].filter((image, index, array) => image && array.indexOf(image) === index).slice(0, 5);

  return (
    <main className="details-layout-pro">
      <Breadcrumbs items={[{ label: "Products", to: "/products" }, { label: product.title }]} />
      <section className="details-grid-pro">
        <div className="details-gallery">
          <img className="main-product-image" src={selectedImage || product.imageCover} alt={product.title} />
          <div className="thumb-row">{galleryImages.map((image) => <button className={image === selectedImage ? "active" : ""} key={image} onClick={() => setSelectedImage(image)}><img src={image} alt="Product preview" /></button>)}</div>
        </div>
        <section className="details-info">
          <span className="eyebrow">{product.category?.name}</span>
          <h1>{product.title}</h1>
          <RatingStars value={product.ratingsAverage} count={product.ratingsQuantity} />
          <p>{product.description}</p>
          <div className="price-block"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(meta.oldPrice)}</del><span>-{meta.discountPercent}%</span></div>
          <p className={meta.isLowStock ? "stock low" : "stock"}>{meta.isLowStock ? `Only ${meta.stock} left — order soon` : "In stock and ready to ship"}</p>
          <div className="quantity-row"><span>Quantity</span><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><strong>{quantity}</strong><button onClick={() => setQuantity(quantity + 1)}>+</button></div>
          <div className="details-actions"><button className="primary-button" onClick={handleAddToCart}><ShoppingCart size={18} /> Add to cart</button><button className={`secondary-button wishlist-detail-button ${liked ? "active" : ""}`} onClick={handleWishlist}><Heart size={18} fill={liked ? "currentColor" : "none"} /> {liked ? "Wishlisted" : "Wishlist"}</button></div>
          <div className="benefit-list"><div><Truck size={18} /><span>{meta.delivery}<small>{meta.eta}</small></span></div><div><RotateCcw size={18} /><span>{meta.returnPolicy}<small>Return unopened items easily</small></span></div><div><ShieldCheck size={18} /><span>Secure checkout<small>Protected checkout session</small></span></div></div>
        </section>
      </section>
      <section className="product-extra-grid"><article><h3>Product details</h3><ul><li>Brand: {product.brand?.name || "FreshCart"}</li><li>Category: {product.category?.name}</li><li>Sold: {product.sold || 0}+ items</li><li>Stock: {meta.stock || "Available"}</li></ul></article><article><h3>Customer reviews</h3><p>Customers like the quality, fast delivery, and value of this product.</p><RatingStars value={product.ratingsAverage} count={product.ratingsQuantity} /></article><article><h3>Need help?</h3><p>Contact support before checkout if you need help with product details or delivery.</p><Link className="secondary-button" to="/products">Continue shopping</Link></article></section>
    </main>
  );
}
