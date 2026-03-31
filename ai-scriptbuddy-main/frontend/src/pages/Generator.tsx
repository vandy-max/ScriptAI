import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wand2, Sparkles, Copy, Trash2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

const NICHES = ["Tech", "Educational", "Entertainment", "Vlog"];
const STYLES = ["Educational", "Storytelling", "Dramatic", "Minimalist"];

const Generator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("Tech");
  const [selectedStyle, setSelectedStyle] = useState("Educational");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");

  const handleGenerate = async () => {
    if (!title) {
      toast({ title: "Title Required", description: "Please enter a topic or title.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setGeneratedScript("");

    try {
      const data = await apiFetch("/api/generate/title", {
        method: "POST",
        body: JSON.stringify({ title, niche: selectedNiche, style: selectedStyle }),
      });
      
      setGeneratedScript(data.script);
    } catch (err: any) {
      toast({ title: "Generation Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div className="min-h-screen pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar isAuthenticated />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="font-display text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" /> Magic Script Generator
          </h1>
          <p className="text-muted-foreground">Turn any title into a viral-ready script structure in seconds.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div className="glass-strong rounded-3xl p-8 space-y-6" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Video Title / Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Why Apple is winning the headset war..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary/30 rounded-2xl px-5 py-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-white/5"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Niche</label>
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full bg-secondary/30 rounded-xl px-4 py-3 text-foreground outline-none border border-white/5 text-sm"
                  >
                    {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-secondary/30 rounded-xl px-4 py-3 text-foreground outline-none border border-white/5 text-sm"
                  >
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-8 py-5 rounded-2xl font-bold text-primary-foreground shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Brewing Magic...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate Viral Script</>
              )}
            </motion.button>
          </motion.div>

          {/* Output Panel */}
          <motion.div className="relative" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="glass h-full rounded-3xl flex flex-col border border-white/5 min-h-[400px]">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Generated Script</span>
                {generatedScript && (
                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(generatedScript); toast({ title: "Copied!" }); }} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                    <button onClick={() => setGeneratedScript("")} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto font-body text-foreground leading-relaxed">
                <AnimatePresence>
                  {isGenerating ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="h-4 bg-secondary/30 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-secondary/30 rounded-full w-1/2 animate-pulse" />
                      <div className="h-4 bg-secondary/30 rounded-full w-5/6 animate-pulse" />
                    </motion.div>
                  ) : generatedScript ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-pre-wrap">
                      {generatedScript}
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 grayscale opacity-30">
                      <Wand2 className="w-12 h-12" />
                      <p className="text-sm">Your masterpiece will appear here...</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {generatedScript && (
                <div className="p-6 border-t border-white/5">
                  <motion.button
                    onClick={() => navigate("/analysis", { state: { script: generatedScript } })}
                    className="w-full px-6 py-4 rounded-xl font-bold glass-strong text-primary flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Analyze This Script <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Generator;
