import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getCheckoutValidationErrors } from "../utils/validation";
import { formatPrice } from "../utils/format";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { showToast } = useToast();
  const [form, setForm] = useState({ details: "", phone: "", city: "Cairo" });
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => { refreshCart().catch(() => {}); }, []);
  const subtotal = cart?.totalCartPrice || 0; const shipping = subtotal > 500 || subtotal === 0 ? 0 : 35; const total = subtotal + shipping;

  async function submit(e) {
    e.preventDefault();
    const validationErrors = getCheckoutValidationErrors(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setLoading(true);
    try {
      if (!cart?._id) throw new Error("Cart is empty");
      if (paymentMethod === "cash") { showToast("Demo cash order placed successfully"); navigate("/order-success"); return; }
      const data = await api.checkout(cart._id, form, window.location.origin);
      if (data.session?.url) { showToast("Redirecting to payment page", "info"); window.location.href = data.session.url; }
      else { showToast("Checkout session created", "info"); navigate("/order-success"); }
    } catch (err) { showToast(err.message || "Checkout failed", "error"); }
    finally { setLoading(false); }
  }

  return <main className="page-shell"><Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} /><div className="page-head"><span className="eyebrow">Checkout</span><h1>Complete your order</h1><p>Enter delivery information and choose a payment method.</p></div><section className="checkout-layout"><form className="checkout-form" onSubmit={submit} noValidate><section><h2>Delivery address</h2><label>Address details<input placeholder="Building, street, apartment" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />{errors.details && <small>{errors.details}</small>}</label><label>Phone<input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />{errors.phone && <small>{errors.phone}</small>}</label><label>City<input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />{errors.city && <small>{errors.city}</small>}</label></section><section><h2>Payment method</h2><label className="radio-card"><input type="radio" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} /> Online card payment</label><label className="radio-card"><input type="radio" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} /> Cash on delivery demo</label></section><button className="primary-button wide" disabled={loading}>{loading ? "Processing..." : paymentMethod === "online" ? "Start online checkout" : "Place demo order"}</button></form><aside className="order-summary"><h2>Order summary</h2><div className="summary-row"><span>Items</span><strong>{cart?.numOfCartItems || cart?.products?.length || 0}</strong></div><div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="summary-row"><span>Shipping</span><strong>{shipping ? formatPrice(shipping) : "Free"}</strong></div><div className="summary-row total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div><p className="secure-note">Secure checkout • 14-day returns • Delivery in 2–4 days</p><Link className="secondary-button wide" to="/cart">Back to cart</Link></aside></section></main>;
}
