export default function Footer() {
  return (
    <footer className="footer-pro clean-footer">
      <div className="footer-grid compact-footer">
        <div>
          <a className="brand" href="#/">
            <span className="brand-mark">F</span> FreshCart Pro
          </a>
        </div>
        <div>
          <h3>Shop</h3>
          <a href="#/products">Products</a>
          <a href="#/categories">Categories</a>
          <a href="#/brands">Brands</a>
        </div>
        <div>
          <h3>Account</h3>
          <a href="#/login">Login</a>
          <a href="#/cart">Cart</a>
          <a href="#/wishlist">Wishlist</a>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="https://github.com/karimelprins" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/karim-ehab-4a10902a6" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:karimehabmohamedmohamed@gmail.com">Email</a>
        </div>
      </div>
      <p className="site-footer">Built by Karim Ehab — Frontend React Portfolio</p>
    </footer>
  );
}
