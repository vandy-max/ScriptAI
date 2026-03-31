import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Clock, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

const History = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/history")
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar isAuthenticated />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">Analysis History</h1>
          <p className="text-muted-foreground mb-8">Review all your past analyses and track improvement over time.</p>
        </motion.div>

        <div className="space-y-4">
          {history.map((item, i) => {
            const isPositive = !item.improvement.startsWith("-");
            const isExpanded = expanded === item.id;

            return (
              <motion.div
                key={item.id}
                className="glass rounded-2xl overflow-hidden cursor-pointer glow-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setExpanded(isExpanded ? null : item.id)}
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPositive ? "bg-primary/10" : "bg-destructive/10"}`}>
                      {isPositive ? <TrendingUp className="w-6 h-6 text-primary" /> : <TrendingDown className="w-6 h-6 text-destructive" />}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-display font-bold text-lg ${isPositive ? "text-primary" : "text-destructive"}`}>
                      {item.improvement}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 grid grid-cols-3 gap-4">
                        <div className="bg-secondary/40 rounded-xl p-4 text-center">
                          <p className="text-sm text-muted-foreground">Predicted</p>
                          <p className="text-2xl font-display font-bold text-foreground">{item.predicted}%</p>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-4 text-center">
                          <p className="text-sm text-muted-foreground">Actual</p>
                          <p className="text-2xl font-display font-bold text-foreground">{item.actual}%</p>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-4 text-center">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-2xl font-display font-bold text-foreground">{item.score}/100</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default History;
