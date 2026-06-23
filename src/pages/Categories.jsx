import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { api } from "../services/api";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { const data = await api.categories(); setItems(data.data || []); }
    catch (err) { setError(err.message || "Could not load categories"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  if (loading) return <Loading label="Loading categories" />;
  return <main className="page-shell"><div className="page-head"><span className="eyebrow">Categories</span><h1>Shop by category</h1></div>{error ? <ErrorState message={error} onRetry={load} /> : <section className="image-grid">{items.map((item) => <Link to={`/products?category=${item._id}`} key={item._id} className="image-card clickable-card"><img src={item.image} alt={item.name} /><h3>{item.name}</h3><span>View products</span></Link>)}</section>}</main>;
}
