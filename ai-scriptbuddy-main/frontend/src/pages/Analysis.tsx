import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import AnimatedLoader from "@/components/AnimatedLoader";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

const niches = ["Tech", "Gaming", "Education", "Lifestyle", "Finance", "Health", "Entertainment", "Travel", "Food", "Other"];
const durations = ["< 1 min (Short)", "1-5 min", "5-10 min", "10-20 min", "20+ min"];

const Analysis = () => {
  const navigate = useNavigate();
  const [script, setScript] = useState("");
  const [niche, setNiche] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!script.trim()) return;
    setLoading(true);
    try {
      const data = await apiFetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ script, niche, duration }),
      });
      setAnalysisId(data.id);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLoaderComplete = useCallback(() => {
    navigate("/results", { state: { script, niche, duration, analysisId } });
  }, [navigate, script, niche, duration, analysisId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Mock: just show file name
    const file = e.dataTransfer.files[0];
    if (file) setScript(`[Uploaded: ${file.name}]\n\nVideo file detected. AI will extract and analyze the script automatically.`);
  };

  return (
    <>
      <AnimatePresence>
        {loading && <AnimatedLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Navbar isAuthenticated />

        <div className="max-w-3xl mx-auto px-6 py-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
            <motion.button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 cursor-pointer"
              onClick={() => navigate(-1)}
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </motion.button>
            <h1 className="font-display text-3xl font-bold gradient-text mb-2">Analyze Your Script</h1>
            <p className="text-muted-foreground">Paste your script or upload a video to get AI-powered insights.</p>
          </motion.div>

          <motion.div className="glass-strong rounded-2xl p-8 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Script input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Script Text</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Paste your script here... (e.g., a YouTube video script, podcast outline, or presentation narrative)"
                className="w-full h-44 bg-secondary/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none outline-none focus:ring-2 focus:ring-primary/30 transition-shadow font-body text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">{script.length} characters</p>
            </div>

            {/* Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop a video file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                >
                  <option value="">Select duration</option>
                  {durations.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Niche</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                >
                  <option value="">Select niche</option>
                  {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              className="w-full px-8 py-4 rounded-xl font-semibold text-primary-foreground disabled:opacity-40 cursor-pointer text-lg"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: script.trim() ? 1.02 : 1 }}
              whileTap={{ scale: script.trim() ? 0.98 : 1 }}
              onClick={handleAnalyze}
              disabled={!script.trim()}
            >
              Analyze Script ✨
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Analysis;
