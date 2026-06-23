import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";

export default function Cart() {
  const { cart, loading, refreshCart, updateQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  async function load() { setError(""); try { await refreshCart(); } catch (err) { setError(err.message || "Could not load cart"); } }
  useEffect(() => { load(); }, []);
  async function safeAction(action, successMessage) { try { await action(); showToast(successMessage); } catch (err) { showToast(err.message || "Action failed", "error"); } }
  const products = cart?.products || [];
  const subtotal = cart?.totalCartPrice || 0;
  const discount = appliedCoupon.toLowerCase() === "karim10" ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 35;
  const total = Math.max(0, subtotal - discount + shipping);
  const progress = Math.min(100, Math.round((subtotal / 500) * 100));

  function applyCoupon(e) { e.preventDefault(); if (coupon.toLowerCase() === "karim10") { setAppliedCoupon(coupon); showToast("Coupon applied: 10% off"); } else { showToast("Try coupon KARIM10", "error"); } }

  if (loading) return <Loading label="Loading cart" />;
  return <main className="page-shell"><Breadcrumbs items={[{ label: "Cart" }]} /><div className="page-head"><span className="eyebrow">Cart</span><h1>Your shopping cart</h1><p>Review items, apply coupon, and continue to checkout.</p></div>{error ? <ErrorState message={error} onRetry={load} /> : products.length === 0 ? <div className="empty-state"><h2>Your cart is empty</h2><p>Add products to start checkout.</p><Link className="primary-button" to="/products">Shop now</Link></div> : <section className="cart-layout"><div className="cart-list"><div className="free-shipping-card"><strong>{shipping === 0 ? "Free delivery unlocked" : `${formatPrice(500 - subtotal)} away from free delivery`}</strong><div><span style={{ width: `${progress}%` }} /></div></div>{products.map((item) => <article className="cart-item" key={item.product.id}><img src={item.product.imageCover} alt={item.product.title} /><div><h3>{item.product.title}</h3><p>{formatPrice(item.price)}</p><div className="quantity-control"><button onClick={() => safeAction(() => updateQuantity(item.product.id, Math.max(1, item.count - 1)), "Quantity updated")}>−</button><span>{item.count}</span><button onClick={() => safeAction(() => updateQuantity(item.product.id, item.count + 1), "Quantity updated")}>+</button></div></div><button className="danger-button" onClick={() => safeAction(() => removeItem(item.product.id), "Item removed")}>Remove</button></article>)}</div><aside className="order-summary"><h2>Order summary</h2><form className="coupon-form" onSubmit={applyCoupon}><input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code: KARIM10" /><button>Apply</button></form><div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="summary-row"><span>Discount</span><strong>-{formatPrice(discount)}</strong></div><div className="summary-row"><span>Shipping</span><strong>{shipping ? formatPrice(shipping) : "Free"}</strong></div><div className="summary-row total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div><Link className="primary-button wide" to="/checkout">Checkout</Link><button className="ghost-button wide" onClick={() => safeAction(clearCart, "Cart cleared")}>Clear cart</button><Link className="secondary-button wide" to="/products">Continue shopping</Link></aside></section>}</main>;
}
