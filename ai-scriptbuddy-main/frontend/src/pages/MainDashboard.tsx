import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, FileText, TrendingUp, Brain, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const stats = [
  { icon: FileText, label: "Your Scripts", value: "12" },
  { icon: TrendingUp, label: "Avg. Score", value: "74%" },
  { icon: Brain, label: "Insights Used", value: "38" },
];

const flashcards = [
  { emoji: "🎣", title: "Improve Hook", desc: "Grab attention in the first 5 seconds" },
  { emoji: "📉", title: "Reduce Drop-off", desc: "Keep viewers watching till the end" },
  { emoji: "🚀", title: "Boost Engagement", desc: "Drive likes, comments, and shares" },
  { emoji: "🎯", title: "Target Audience", desc: "Speak directly to your ideal viewer" },
];

const MainDashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar isAuthenticated />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section
            className="glass-strong rounded-3xl p-10 text-center border border-white/5 glow-hover"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Zap className="w-14 h-14 text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Analyze Script</h2>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-sm">
              Paste your script to get AI-powered scores and viral recommendations.
            </p>
            <motion.button
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-primary-foreground cursor-pointer text-lg"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/analysis")}
            >
              Start Analysis ✨
            </motion.button>
          </motion.section>

          <motion.section
            className="glass rounded-3xl p-10 text-center border border-white/5 glow-hover flex flex-col justify-between"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <Wand2 className="w-14 h-14 text-primary mx-auto mb-4" />
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">Magic Generator</h2>
              <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-sm">
                No script yet? Generate a viral structure from just a video title.
              </p>
            </div>
            <motion.button
              className="w-full px-8 py-4 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/generator")}
            >
              Create Now 🪄
            </motion.button>
          </motion.section>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl p-6 glow-hover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <stat.icon className="w-8 h-8 text-primary mb-3" />
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Flashcards */}
        <motion.section initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-5">Quick Tips</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashcards.map((card, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-5 text-center cursor-pointer glow-hover"
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <span className="text-3xl mb-2 block">{card.emoji}</span>
                <h3 className="font-display font-bold text-foreground text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default MainDashboard;
