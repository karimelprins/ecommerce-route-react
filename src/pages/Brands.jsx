import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { api } from "../services/api";

export default function Brands() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { const data = await api.brands(); setItems(data.data || []); }
    catch (err) { setError(err.message || "Could not load brands"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  if (loading) return <Loading label="Loading brands" />;
  return <main className="page-shell"><div className="page-head"><span className="eyebrow">Brands</span><h1>Shop by brand</h1></div>{error ? <ErrorState message={error} onRetry={load} /> : <section className="image-grid brands-grid">{items.map((item) => <Link to={`/products?brand=${item._id}`} key={item._id} className="image-card clickable-card"><img src={item.image} alt={item.name} /><h3>{item.name}</h3><span>View products</span></Link>)}</section>}</main>;
}
