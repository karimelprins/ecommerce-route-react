import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAuthValidationErrors } from "../utils/validation";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", rePassword: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const validationErrors = getAuthValidationErrors(form, "register");
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    setLoading(true);
    try {
      await register(form);
      showToast("Account created. You can login now.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      showToast(err.message || "Register failed", "error");
    } finally {
      setLoading(false);
    }
  }

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); }

  return <main className="auth-page"><form className="auth-card" onSubmit={submit} noValidate><span className="eyebrow">Create account</span><h1>Register</h1><label>Name<input placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />{errors.name && <small>{errors.name}</small>}</label><label>Email<input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />{errors.email && <small>{errors.email}</small>}</label><label>Password<input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} />{errors.password && <small>{errors.password}</small>}</label><label>Confirm password<input type="password" placeholder="Confirm password" value={form.rePassword} onChange={(e) => update("rePassword", e.target.value)} />{errors.rePassword && <small>{errors.rePassword}</small>}</label><label>Phone<input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />{errors.phone && <small>{errors.phone}</small>}</label><button className="primary-button wide" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button><p>Already have an account? <Link to="/login">Login</Link></p></form></main>;
}
