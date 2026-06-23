import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
  return <main className="auth-page"><section className="empty-state success-state"><CheckCircle2 size={54} /><span className="eyebrow">Order confirmed</span><h1>Thank you for your order</h1><p>Your demo order was placed successfully. A confirmation email would be sent in a real production app.</p><div className="hero-actions"><Link className="primary-button" to="/products">Continue shopping</Link><Link className="secondary-button" to="/">Back home</Link></div></section></main>;
}
