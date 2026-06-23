import { Star } from "lucide-react";

export default function RatingStars({ value = 0, count }) {
  const rounded = Math.round(Number(value || 0));
  return (
    <span className="stars" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={14} fill={index < rounded ? "currentColor" : "none"} />
      ))}
      <strong>{Number(value || 0).toFixed(1)}</strong>
      {count ? <small>({count})</small> : null}
    </span>
  );
}
