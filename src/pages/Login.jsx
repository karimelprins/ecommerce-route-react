import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAuthValidationErrors } from "../utils/validation";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const validationErrors = getAuthValidationErrors(form, "login");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setLoading(true);
    try {
      await login(form);
      showToast("Logged in successfully");
      navigate("/products");
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit} noValidate><span className="eyebrow">Welcome back</span><h1>Login</h1><label>Email<input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />{errors.email && <small>{errors.email}</small>}</label><label>Password<input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{errors.password && <small>{errors.password}</small>}</label><button className="primary-button wide" disabled={loading}>{loading ? "Signing in..." : "Login"}</button><p>New here? <Link to="/register">Create account</Link></p></form></main>;
}
