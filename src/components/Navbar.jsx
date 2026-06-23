import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, userName, logout } = useAuth();
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart?.numOfCartItems || cart?.products?.reduce((sum, item) => sum + item.count, 0) || 0;

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    function closeOnResize() {
      if (window.innerWidth > 980) setMenuOpen(false);
    }
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-lock", menuOpen);
    return () => document.body.classList.remove("menu-lock");
  }, [menuOpen]);

  return (
    <>
      <header className="navbar">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">F</span> FreshCart Pro
        </Link>

        <nav className="nav-links desktop-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/brands">Brands</NavLink>
        </nav>

        <Link className="nav-search" to="/products"><Search size={17} /> Search products</Link>

        <div className="nav-actions">
          <Link className="icon-link" to="/wishlist" aria-label="Wishlist"><Heart size={19} /></Link>
          <Link className="icon-link count-link" to="/cart" aria-label="Cart"><ShoppingCart size={19} />{cartCount > 0 && <span>{cartCount}</span>}</Link>
          {isAuthenticated ? (
            <button className="ghost-button account-button" onClick={logout} title={userName || "Logout"}><LogOut size={18} /> Logout</button>
          ) : (
            <Link className="login-link account-button" to="/login"><User size={17} /> Login</Link>
          )}
          <button className={`menu-button ${menuOpen ? "active" : ""}`} aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu-backdrop ${menuOpen ? "active" : ""}`} onClick={closeMenu} />
      <aside className={`mobile-menu ${menuOpen ? "active" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head">
          <Link className="brand" to="/" onClick={closeMenu}><span className="brand-mark">F</span> FreshCart Pro</Link>
          <button className="menu-close" onClick={closeMenu} aria-label="Close menu"><X size={22} /></button>
        </div>

        <Link className="mobile-search" to="/products" onClick={closeMenu}><Search size={18} /> Search products</Link>

        <nav className="mobile-nav-links">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
          <NavLink to="/categories" onClick={closeMenu}>Categories</NavLink>
          <NavLink to="/brands" onClick={closeMenu}>Brands</NavLink>
          <NavLink to="/wishlist" onClick={closeMenu}>Wishlist</NavLink>
          <NavLink to="/cart" onClick={closeMenu}>Cart {cartCount > 0 ? `(${cartCount})` : ""}</NavLink>
        </nav>

        <div className="mobile-auth-actions">
          {isAuthenticated ? (
            <button className="ghost-button wide" onClick={() => { logout(); closeMenu(); }}><LogOut size={18} /> Logout</button>
          ) : (
            <Link className="primary-button wide" to="/login" onClick={closeMenu}><User size={17} /> Login</Link>
          )}
        </div>
      </aside>
    </>
  );
}
