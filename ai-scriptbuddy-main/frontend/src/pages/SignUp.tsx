import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

const niches = ["Tech", "Gaming", "Education", "Lifestyle", "Finance", "Health", "Entertainment", "Travel", "Food", "Other"];
const contentTypes = ["Shorts", "Long Videos", "Both"];
const frequencies = ["Daily", "2-3 times/week", "Weekly", "Bi-weekly", "Monthly"];
const goals = ["Growth", "Monetization", "Branding", "All of the above"];

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    fullName: "", channelName: "", niche: "", subscribers: "",
    contentType: "", frequency: "", goal: "", vision: "",
  });

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!form.username || !form.email || !form.password) {
        setError("Please fill in username, email, and password.");
        return;
      }
      setStep(2);
      return;
    }

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        channelName: form.channelName,
        niche: form.niche,
        subscribers: form.subscribers,
        contentType: form.contentType,
        frequency: form.frequency,
        goal: form.goal,
        vision: form.vision,
      };
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", form.username);
        navigate("/app");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar />

      <div className="flex items-center justify-center px-6 py-10">
        <motion.form
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-10 max-w-lg w-full"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">
            {step === 1 ? "Create Account" : "Tell Us About You"}
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Step {step} of 2 — {step === 1 ? "Account details" : "Profile setup"}
          </p>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                {["username", "email", "password"].map((field) => (
                  <div key={field} className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">{field}</label>
                    <input
                      type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => update(field, e.target.value)}
                      className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow text-sm"
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Channel Name</label>
                    <input value={form.channelName} onChange={(e) => update("channelName", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="Your channel" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Niche</label>
                    <select value={form.niche} onChange={(e) => update("niche", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                      <option value="">Select niche</option>
                      {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Subscribers</label>
                    <input type="number" value={form.subscribers} onChange={(e) => update("subscribers", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="e.g. 10000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Content Type</label>
                    <select value={form.contentType} onChange={(e) => update("contentType", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                      <option value="">Select type</option>
                      {contentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Posting Frequency</label>
                    <select value={form.frequency} onChange={(e) => update("frequency", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                      <option value="">Select frequency</option>
                      {frequencies.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Goal</label>
                  <select value={form.goal} onChange={(e) => update("goal", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                    <option value="">Select goal</option>
                    {goals.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Your Vision</label>
                  <textarea value={form.vision} onChange={(e) => update("vision", e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm h-20 resize-none" placeholder="Where do you see your channel in 1 year?" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            {step === 2 && (
              <motion.button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-secondary text-secondary-foreground cursor-pointer flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>
            )}
            <motion.button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-primary-foreground cursor-pointer flex items-center justify-center gap-2"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {step === 1 ? (<>Next <ArrowRight className="w-4 h-4" /></>) : (<><UserPlus className="w-4 h-4" /> Create Account</>)}
            </motion.button>
          </div>

          {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}

          {step === 1 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button type="button" onClick={() => navigate("/signin")} className="text-primary font-medium cursor-pointer">Sign In</button>
            </p>
          )}
        </motion.form>
      </div>
    </motion.div>
  );
};

export default SignUp;
