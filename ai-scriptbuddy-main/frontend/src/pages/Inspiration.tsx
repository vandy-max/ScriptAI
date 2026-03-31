import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Filter, ChevronRight, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

const NICHES = ["All", "US Trending", "India Trending", "Educational"];

const Inspiration = () => {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [selectedScript, setSelectedScript] = useState<any>(null);

  useEffect(() => {
    fetchLibrary();
  }, [selectedNiche]);

  const fetchLibrary = () => {
    setLoading(true);
    const url = `/api/library/search?niche=${selectedNiche}&q=${search}`;
    apiFetch(url)
      .then((data) => {
        setScripts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLibrary();
  };

  return (
    <motion.div className="min-h-screen pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar isAuthenticated />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="font-display text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" /> Script Inspiration
          </h1>
          <p className="text-muted-foreground">Browse the top 1,000 high-performing scripts from real viral videos.</p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by keyword (e.g. 'secret', 'how to')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/30 rounded-2xl pl-12 pr-4 py-4 text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-white/5"
            />
          </form>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {NICHES.map((niche) => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`px-6 py-4 rounded-2xl font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  selectedNiche === niche
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-secondary/30 text-muted-foreground border-white/5 hover:bg-secondary/50"
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-3xl p-6 h-64 animate-pulse bg-secondary/20" />
              ))
            ) : scripts.length > 0 ? (
              scripts.map((item, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-3xl p-6 space-y-4 flex flex-col justify-between border border-white/5 glow-hover cursor-pointer"
                  onClick={() => setSelectedScript(item)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {item.niche}
                      </span>
                      <span className="text-primary font-display font-bold text-lg">{item.retention}%</span>
                    </div>
                    <h3 className="font-display font-bold text-foreground line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.script}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-primary pt-2 border-t border-white/5">
                    <span>View Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">No scripts found for this search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedScript(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-strong rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    {selectedScript.niche}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-foreground">{selectedScript.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-primary">{selectedScript.retention}%</p>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">RETENTION</p>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-2xl p-6 font-body text-foreground leading-relaxed italic whitespace-pre-wrap">
                "{selectedScript.script}"
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // Logic to use as template would go here
                    setSelectedScript(null);
                  }}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl hover:scale-[1.02] transition-transform cursor-pointer"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Use as Template
                </button>
                <button
                  onClick={() => setSelectedScript(null)}
                  className="px-6 py-4 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Inspiration;
