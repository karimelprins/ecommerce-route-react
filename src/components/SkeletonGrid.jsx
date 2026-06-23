export default function SkeletonGrid({ count = 8 }) {
  return (
    <section className="products-grid skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <article className="product-card skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
          <div className="skeleton skeleton-button" />
        </article>
      ))}
    </section>
  );
}
