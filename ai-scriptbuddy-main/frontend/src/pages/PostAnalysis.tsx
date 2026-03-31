import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";

const getComparisonEmoji = (diff: number) => {
  if (diff >= 10) return { emojis: "👍 😊", message: "Amazing! You outperformed the prediction!", level: "high" };
  if (diff >= 0) return { emojis: "👏 🙂", message: "Nice! You matched or slightly beat the prediction.", level: "medium" };
  return { emojis: "😞 👎", message: "Don't worry — let's refine your next script together.", level: "low" };
};

const Particle = ({ index }: { index: number }) => {
  const angle = (index / 12) * Math.PI * 2;
  const distance = 50 + Math.random() * 40;
  return (
    <motion.span
      className="absolute text-xs pointer-events-none"
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, scale: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      ✦
    </motion.span>
  );
};

const PostAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  
  const predictedRetention = result?.predictedRetention || 65;
  const predictedWatchTime = result?.predictedWatchTime || 3.0;

  const [actualRetention, setActualRetention] = useState("");
  const [actualWatchTime, setActualWatchTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState<number[]>([]);
  const [clicked, setClicked] = useState(false);

  const retentionDiff = useMemo(() => {
    const actual = parseFloat(actualRetention);
    return isNaN(actual) ? 0 : actual - predictedRetention;
  }, [actualRetention]);

  const comparison = useMemo(() => getComparisonEmoji(retentionDiff), [retentionDiff]);

  const handleSubmit = () => {
    if (!actualRetention || !actualWatchTime) return;
    setSubmitted(true);
  };

  const handleEmojiClick = () => {
    setClicked(true);
    setParticles(Array.from({ length: 12 }, (_, i) => i));
    setTimeout(() => { setParticles([]); setClicked(false); }, 800);
  };

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar isAuthenticated />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <motion.div className="flex items-center gap-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.button className="w-10 h-10 rounded-xl glass flex items-center justify-center cursor-pointer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate("/results")}>
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-display text-3xl font-bold gradient-text">Post Analysis</h1>
            <p className="text-muted-foreground text-sm">Compare predicted vs actual performance</p>
          </div>
        </motion.div>

        {/* Predicted */}
        <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Predicted Results
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">{predictedRetention}%</p>
              <p className="text-xs text-muted-foreground">Predicted Retention</p>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">{predictedWatchTime} min</p>
              <p className="text-xs text-muted-foreground">Predicted Watch Time</p>
            </div>
          </div>
        </motion.div>

        {/* Actual Inputs */}
        {!submitted && (
          <motion.div className="glass-strong rounded-2xl p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="font-display font-bold text-foreground mb-4">Enter Actual Results</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Actual Retention (%)</label>
                <input type="number" value={actualRetention} onChange={(e) => setActualRetention(e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="e.g. 68" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Actual Watch Time (min)</label>
                <input type="number" step="0.1" value={actualWatchTime} onChange={(e) => setActualWatchTime(e.target.value)} className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" placeholder="e.g. 3.5" />
              </div>
            </div>
            <motion.button
              onClick={handleSubmit}
              disabled={!actualRetention || !actualWatchTime}
              className="w-full px-6 py-3 rounded-xl font-semibold text-primary-foreground cursor-pointer disabled:opacity-40"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Compare Results
            </motion.button>
          </motion.div>
        )}

        {/* Comparison Result */}
        <AnimatePresence>
          {submitted && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              {/* Comparison cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Retention</p>
                  <p className="text-3xl font-display font-bold text-foreground">{predictedRetention}%</p>
                </div>
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Actual Retention</p>
                  <p className="text-3xl font-display font-bold text-foreground">{actualRetention}%</p>
                </div>
              </div>

              <div className={`glass rounded-2xl p-6 text-center ${retentionDiff >= 0 ? "border-primary/20" : "border-destructive/20"} border`}>
                <p className="text-sm text-muted-foreground mb-1">Difference</p>
                <p className={`text-2xl font-display font-bold ${retentionDiff >= 0 ? "text-primary" : "text-destructive"}`}>
                  {retentionDiff >= 0 ? "+" : ""}{retentionDiff.toFixed(1)}%
                </p>
              </div>

              {/* Emoji Response */}
              <motion.div
                className="glass-strong rounded-2xl p-10 text-center relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute inset-0 rounded-2xl" style={{
                  background: comparison.level === "high" ? "radial-gradient(circle, hsl(252 60% 55% / 0.08), transparent)"
                    : comparison.level === "low" ? "radial-gradient(circle, hsl(0 70% 55% / 0.05), transparent)"
                    : "radial-gradient(circle, hsl(230 25% 55% / 0.05), transparent)"
                }} />

                <motion.button
                  className="relative text-7xl cursor-pointer select-none outline-none mb-4 inline-block"
                  onClick={handleEmojiClick}
                  whileHover={{ scale: 1.15 }}
                  animate={clicked ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0], y: [0, -10, 0] } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {comparison.emojis}
                  {particles.map((i) => <Particle key={i} index={i} />)}
                </motion.button>

                <motion.p
                  className="text-foreground font-display font-bold text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {comparison.message}
                </motion.p>
              </motion.div>

              {/* Save */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={() => navigate("/history")}
                  className="px-8 py-3 rounded-xl font-semibold text-primary-foreground cursor-pointer flex items-center gap-2"
                  style={{ background: "var(--gradient-primary)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Save className="w-4 h-4" /> Save Result
                </motion.button>
                <motion.button
                  onClick={() => navigate("/analysis")}
                  className="px-8 py-3 rounded-xl font-semibold bg-secondary text-secondary-foreground cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  New Analysis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostAnalysis;
