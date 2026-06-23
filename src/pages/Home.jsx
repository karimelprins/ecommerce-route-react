import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, BadgeCheck } from "lucide-react";
import { api } from "../services/api";
import { formatPrice, normalizeProducts } from "../utils/format";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catPayload, productPayload] = await Promise.all([api.categories(), api.products()]);
        setCategories(catPayload.data || []);
        setProducts(normalizeProducts(productPayload).slice(0, 8));
      } catch {
        setCategories([]);
        setProducts([]);
      }
    }
    loadHomeData();
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    const timer = setInterval(() => setActiveSlide((current) => (current + 1) % categories.length), 3200);
    return () => clearInterval(timer);
  }, [categories.length]);

  useEffect(() => {
    if (!products.length) return;
    const timer = setInterval(() => setActiveProduct((current) => (current + 1) % products.length), 2600);
    return () => clearInterval(timer);
  }, [products.length]);

  const activeCategory = categories[activeSlide] || categories[0];
  const heroProduct = products[activeProduct] || products[0];
  const topDeals = useMemo(() => products.slice(0, 3), [products]);

  function nextSlide() { if (categories.length) setActiveSlide((current) => (current + 1) % categories.length); }
  function prevSlide() { if (categories.length) setActiveSlide((current) => (current - 1 + categories.length) % categories.length); }

  return (
    <main className="lux-home">
      <section className="lux-hero">
        <div className="animated-orb orb-one" />
        <div className="animated-orb orb-two" />
        <div className="lux-hero-copy">
          <h1>Shop smarter. Move faster. Feel the product.</h1>
          <div className="hero-actions">
            <Link className="primary-button luxe-cta" to="/products">Start shopping <ArrowRight size={18} /></Link>
            <Link className="secondary-button glass-cta" to="/categories">Explore categories</Link>
          </div>
          <div className="hero-trust-row lux-trust"><span><Truck size={16}/> Fast delivery</span><span><ShieldCheck size={16}/> Secure checkout</span><span><BadgeCheck size={16}/> Trusted products</span></div>
        </div>

        <div className="lux-showcase">
          <Link to={heroProduct ? `/products/${heroProduct.id}` : "/products"} className="floating-card main-floating-card rotating-product-card" key={heroProduct?.id || activeProduct}>
            {heroProduct ? <img src={heroProduct.imageCover} alt={heroProduct.title} /> : <div className="product-placeholder" />}
            <div>
              <span>Featured drop</span>
              <strong>{heroProduct?.title || "Loading product"}</strong>
              <p>{heroProduct ? formatPrice(heroProduct.price) : ""}</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="category-slider-section">
        <div className="section-topline">
          <div>
            <span className="lux-eyebrow">Category slider</span>
            <h2>Pick a category. Start shopping.</h2>
          </div>
          <div className="slider-controls">
            <button onClick={prevSlide} aria-label="Previous category"><ChevronLeft size={20} /></button>
            <button onClick={nextSlide} aria-label="Next category"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="category-stage">
          {activeCategory ? (
            <Link to={`/products?category=${activeCategory._id}`} className="category-hero-slide">
              <div className="category-slide-image"><img src={activeCategory.image} alt={activeCategory.name} /></div>
              <div className="category-slide-copy">
                <span>Featured category</span>
                <h3>{activeCategory.name}</h3>
                <strong>Shop now <ArrowRight size={17} /></strong>
              </div>
            </Link>
          ) : (
            <div className="category-hero-slide skeleton-category" />
          )}
          <div className="category-strip">
            {categories.map((category, index) => (
              <button className={index === activeSlide ? "active" : ""} key={category._id} onClick={() => setActiveSlide(index)}>
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="hot-deals-section">
        <div className="section-topline"><div><span className="lux-eyebrow">Hot picks</span><h2>Products worth opening.</h2></div><Link className="secondary-button" to="/products">View all</Link></div>
        <div className="deal-row">
          {topDeals.map((product, index) => (
            <Link to={`/products/${product.id}`} className="deal-card" key={product.id}>
              <span>0{index + 1}</span>
              <img src={product.imageCover} alt={product.title} />
              <div><strong>{product.title}</strong><p>{formatPrice(product.price)}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
