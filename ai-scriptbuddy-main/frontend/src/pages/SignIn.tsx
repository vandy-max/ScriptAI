import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

import { apiFetch } from "@/lib/api";

const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const identifier = form.email || form.username;
      if (!identifier || !form.password) {
        setError("Email/username and password are required.");
        return;
      }

      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password: form.password }),
      });

      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username || "");
        navigate("/app");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />

      <div className="flex items-center justify-center px-6 py-16">
        <motion.form
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-10 max-w-md w-full"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">Welcome Back</h1>
          <p className="text-muted-foreground text-sm text-center mb-8">Sign in to your account</p>

          {["email", "username", "password"].map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">{field}</label>
              <input
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow text-sm"
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}

          <motion.button
            type="submit"
            className="w-full mt-4 px-6 py-3 rounded-xl font-semibold text-primary-foreground cursor-pointer flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="w-4 h-4" /> Continue
          </motion.button>

          {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-primary font-medium cursor-pointer">
              Sign Up
            </button>
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default SignIn;
