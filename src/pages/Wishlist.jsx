import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import ProductCard from "../components/ProductCard";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.wishlist();
      setItems(data.data || []);
    } catch (err) {
      setError(err.message || "Could not load wishlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    try {
      await api.removeWishlist(id);
      showToast("Removed from wishlist");
      await load();
    } catch (err) {
      showToast(err.message || "Could not remove item", "error");
    }
  }

  if (loading) return <Loading label="Loading wishlist" />;
  return <main className="page-shell"><div className="page-head"><span className="eyebrow">Wishlist</span><h1>Saved products</h1></div>{error ? <ErrorState message={error} onRetry={load} /> : items.length === 0 ? <div className="empty-state"><h2>Your wishlist is empty</h2><Link className="primary-button" to="/products">Browse products</Link></div> : <section className="products-grid">{items.map((product) => <div className="wishlist-wrap" key={product.id}><ProductCard product={product} /><button className="danger-button wide" onClick={() => remove(product.id)}>Remove from wishlist</button></div>)}</section>}</main>;
}
