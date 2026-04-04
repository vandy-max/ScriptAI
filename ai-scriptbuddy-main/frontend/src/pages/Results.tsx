import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, TrendingUp, Clock, Users, Lightbulb, Save, Wand2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import EmojiFeedback from "@/components/EmojiFeedback";
import Navbar from "@/components/Navbar";
const retentionData = [
  { time: "0:00", value: 100 }, { time: "0:30", value: 92 }, { time: "1:00", value: 85 },
  { time: "1:30", value: 78 }, { time: "2:00", value: 72 }, { time: "2:30", value: 68 },
  { time: "3:00", value: 65 }, { time: "3:30", value: 60 }, { time: "4:00", value: 55 },
  { time: "4:30", value: 52 }, { time: "5:00", value: 50 },
];

// barData is now dynamic inside the component

const pieData = [
  { name: "Story", value: 40 }, { name: "Info", value: 30 },
  { name: "CTA", value: 15 }, { name: "Filler", value: 15 },
];
const PIE_COLORS = ["hsl(252,60%,55%)", "hsl(280,50%,60%)", "hsl(230,25%,70%)", "hsl(230,20%,85%)"];

const suggestions = [
  { icon: "🎣", text: "Strengthen your hook in the first 10 seconds." },
  { icon: "📖", text: "Add a personal story to boost mid-roll retention." },
  { icon: "⚡", text: "Shorten the outro — viewers drop off after the CTA." },
  { icon: "🎯", text: "Use more direct questions to engage viewers." },
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysisId = location.state?.analysisId || null;

  const [rewriting, setRewriting] = useState(false);
  const [rewriteText, setRewriteText] = useState("");
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no analysisId, we could use a fallback, 
    // but the backend mock handles any ID
    const idToFetch = analysisId || "default";
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/results/${idToFetch}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [analysisId]);

  const mockScore = result?.score || 0;

  const statCards = [
    { icon: TrendingUp, label: "Overall Score", value: `${mockScore}/100`, color: "text-primary" },
    { icon: Clock, label: "Avg. Retention", value: `${result?.metrics?.retention || 0}%`, color: "text-accent" },
    { icon: Users, label: "Predicted Reach", value: "12.4K", color: "text-primary" },
  ];

  const barData = [
    { name: "Hook", value: result?.metrics?.hook || 0 },
    { name: "Engagement", value: result?.metrics?.engagement || 0 },
    { name: "Filler", value: result?.metrics?.filler || 0 },
    { name: "Retention", value: result?.metrics?.retention || 0 },
  ];

  const handleRewrite = () => {
    setRewriting(true);
    const textToType = result?.rewrite || "Error fetching rewrite text.";
    let i = 0;
    const interval = setInterval(() => {
      setRewriteText(textToType.slice(0, i));
      i += 2;
      if (i > textToType.length) {
        clearInterval(interval);
        setRewriting(false);
      }
    }, 20);
  };

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

      <div className="max-w-5xl mx-auto px-6 py-10 pb-20 space-y-8">
        {/* Header */}
        <motion.div className="flex items-center gap-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.button
            className="w-10 h-10 rounded-xl glass flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/app")}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-display text-3xl font-bold gradient-text">Analysis Results</h1>
            <p className="text-muted-foreground text-sm">Here's how your script performed</p>
          </div>
        </motion.div>

        {/* Score + Progress */}
        <motion.div className="glass-strong rounded-2xl p-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <motion.p
            className="text-6xl font-display font-bold gradient-text mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          >
            {mockScore}%
          </motion.p>
          <p className="text-muted-foreground mb-4">Retention Score</p>
          <div className="w-full max-w-md mx-auto h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${mockScore}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} className="glass rounded-2xl p-6 glow-hover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <stat.icon className={`w-7 h-7 ${stat.color} mb-2`} />
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Line Chart */}
          <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="font-display font-bold text-foreground mb-4">📈 Retention Curve</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={retentionData}>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(230,15%,50%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(230,15%,50%)" }} />
                <Tooltip contentStyle={{ background: "hsl(230,30%,96%)", border: "1px solid hsl(230,20%,85%)", borderRadius: "12px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="value" stroke="hsl(252,60%,55%)" strokeWidth={3} dot={{ fill: "hsl(252,60%,55%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3 className="font-display font-bold text-foreground mb-4">📊 Script Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(230,15%,50%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(230,15%,50%)" }} />
                <Tooltip contentStyle={{ background: "hsl(230,30%,96%)", border: "1px solid hsl(230,20%,85%)", borderRadius: "12px", fontSize: "12px" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="hsl(252,60%,55%)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Pie Chart */}
        <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <h3 className="font-display font-bold text-foreground mb-4">🎯 Content Composition</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(230,30%,96%)", border: "1px solid hsl(230,20%,85%)", borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-foreground">{entry.name}</span>
                  <span className="text-muted-foreground">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Improvement */}
        <motion.div className="glass rounded-2xl p-6 flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-lg">Potential Growth: +18%</p>
            <p className="text-sm text-muted-foreground">Applying AI suggestions could improve retention significantly</p>
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" /> AI Suggestions
          </h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
              >
                <span className="text-xl">{s.icon}</span>
                <p className="text-sm text-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Rewrite */}
        <motion.div className="glass rounded-2xl p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" /> AI Script Rewrite
          </h3>
          {!rewriteText && (
            <motion.button
              onClick={handleRewrite}
              disabled={rewriting}
              className="px-6 py-3 rounded-xl font-semibold text-primary-foreground cursor-pointer flex items-center gap-2 disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Wand2 className="w-4 h-4" /> Generate Better Script
            </motion.button>
          )}
          {rewriteText && (
            <motion.div
              className="bg-secondary/40 rounded-xl p-5 font-body text-sm text-foreground whitespace-pre-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {rewriteText}
              {rewriting && <span className="animate-pulse">|</span>}
            </motion.div>
          )}
        </motion.div>

          <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <motion.button
              onClick={() => { setSaved(true); setTimeout(() => navigate("/post-analysis", { state: { result } }), 500); }}
              className={`px-8 py-4 rounded-xl font-semibold cursor-pointer flex items-center gap-2 text-lg ${
                saved ? "bg-primary/20 text-primary" : "text-primary-foreground"
              }`}
              style={saved ? {} : { background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Save className="w-5 h-5" /> {saved ? "Saved! ✓" : "Save & Continue"}
            </motion.button>
          </motion.div>
  
          {/* Emoji Feedback */}
          <EmojiFeedback score={mockScore} onReact={(emoji) => console.log("Reacted:", emoji)} />
        </div>
      </motion.div>
    );
  };

export default Results;
