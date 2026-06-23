import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductCard from "../components/ProductCard";
import ErrorState from "../components/ErrorState";
import SkeletonGrid from "../components/SkeletonGrid";
import { api } from "../services/api";
import { normalizeProducts } from "../utils/format";

function getHashParams() {
  const query = window.location.hash.split("?")[1] || "";
  return new URLSearchParams(query);
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState("all");
  const [minRating, setMinRating] = useState("all");

  function syncFiltersFromUrl() {
    const params = getHashParams();
    setCategory(params.get("category") || "all");
    setBrand(params.get("brand") || "all");
  }

  async function load() {
    setLoading(true); setError("");
    try {
      const [productsPayload, categoriesPayload, brandsPayload] = await Promise.all([api.products(), api.categories(), api.brands()]);
      setProducts(normalizeProducts(productsPayload));
      setCategories(categoriesPayload?.data || []);
      setBrands(brandsPayload?.data || []);
      syncFiltersFromUrl();
    } catch (err) { setError(err.message || "Could not load products"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { window.addEventListener("hashchange", syncFiltersFromUrl); return () => window.removeEventListener("hashchange", syncFiltersFromUrl); }, []);

  const activeCategoryName = categories.find((item) => item._id === category)?.name;
  const activeBrandName = brands.find((item) => item._id === brand)?.name;

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category?._id === category;
      const matchesBrand = brand === "all" || product.brand?._id === brand;
      const matchesPrice = maxPrice === "all" || product.price <= Number(maxPrice);
      const matchesRating = minRating === "all" || product.ratingsAverage >= Number(minRating);
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
    });
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.ratingsAverage - a.ratingsAverage);
    if (sort === "sold") result = [...result].sort((a, b) => b.sold - a.sold);
    return result;
  }, [products, search, category, brand, sort, maxPrice, minRating]);

  function resetFilters() { setSearch(""); setCategory("all"); setBrand("all"); setSort("default"); setMaxPrice("all"); setMinRating("all"); window.location.hash = "/products"; }

  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: "Products" }]} />
      <div className="page-head split-head">
        <div><span className="eyebrow">Shop</span><h1>{activeCategoryName || activeBrandName || "All products"}</h1></div>
        <button className="ghost-button" onClick={resetFilters}>Reset filters</button>
      </div>

      <section className="shop-layout-pro">
        <aside className="filter-panel">
          <h3>Filters</h3>
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
          <label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}><option value="all">All brands</option>{brands.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label>
          <label>Max price<select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}><option value="all">Any price</option><option value="500">Under EGP 500</option><option value="1000">Under EGP 1,000</option><option value="3000">Under EGP 3,000</option><option value="10000">Under EGP 10,000</option></select></label>
          <label>Minimum rating<select value={minRating} onChange={(e) => setMinRating(e.target.value)}><option value="all">Any rating</option><option value="4">4+ stars</option><option value="4.5">4.5+ stars</option></select></label>
        </aside>
        <section>
          <div className="toolbar pro-toolbar"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" /><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="default">Default sort</option><option value="sold">Best selling</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></div>
          {loading && <SkeletonGrid count={8} />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && <><p className="result-count">Showing {visibleProducts.length} products</p>{visibleProducts.length === 0 ? <div className="empty-state"><h2>No products found</h2><p>Try changing search or filters.</p></div> : <section className="products-grid compact-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</section>}</>}
        </section>
      </section>
    </main>
  );
}
