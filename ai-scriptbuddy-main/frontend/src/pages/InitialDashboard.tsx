import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, Brain, Zap, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";

const stats = [
  { icon: FileText, label: "Scripts Analyzed", value: "1,248" },
  { icon: TrendingUp, label: "Avg. Improvement", value: "+34%" },
  { icon: Brain, label: "AI Insights Generated", value: "5.2K" },
];

const blogs = [
  { title: "How AI is Changing Content Creation", desc: "Discover the latest trends in AI-assisted scripting and how creators leverage data." },
  { title: "5 Tips to Boost Viewer Retention", desc: "Learn proven techniques that top YouTubers use to keep audiences engaged." },
  { title: "The Science Behind Viral Scripts", desc: "What makes a script go viral? We break down the psychology and structure." },
];

const flashcards = [
  { emoji: "🎣", title: "Improve Hook", desc: "Grab attention in the first 5 seconds" },
  { emoji: "📉", title: "Reduce Drop-off", desc: "Keep viewers watching till the end" },
  { emoji: "🚀", title: "Boost Engagement", desc: "Drive likes, comments, and shares" },
  { emoji: "🎯", title: "Target Audience", desc: "Speak directly to your ideal viewer" },
];

const InitialDashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Stats */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-5">Platform Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-6 glow-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-primary mb-3" />
                <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Blog */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Latest Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogs.map((blog, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-6 glow-hover cursor-pointer"
                whileHover={{ y: -4 }}
              >
                <h3 className="font-display font-bold text-foreground mb-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground">{blog.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="glass-strong rounded-2xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Start New Analysis</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Paste your script and let our AI evaluate engagement, retention, and narrative quality.
          </p>
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-foreground cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/analysis")}
          >
            Start Analysis
          </motion.button>
        </motion.section>

        {/* Flashcards */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-5">Quick Tips</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashcards.map((card, i) => (
              <motion.div
                key={i}
                className="glass rounded-2xl p-5 text-center cursor-pointer glow-hover"
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl mb-2 block">{card.emoji}</span>
                <h3 className="font-display font-bold text-foreground text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Feedback */}
        <motion.section
          className="glass rounded-2xl p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Rate This App</h2>
          <StarRating onRate={(r) => console.log("Rated:", r)} />
          <textarea
            placeholder="Share your thoughts..."
            className="w-full mt-4 h-24 bg-secondary/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none outline-none focus:ring-2 focus:ring-primary/30 transition-shadow font-body text-sm"
          />
          <motion.button
            className="mt-3 px-6 py-2 rounded-xl font-semibold text-primary-foreground text-sm cursor-pointer"
            style={{ background: "var(--gradient-primary)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Feedback
          </motion.button>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default InitialDashboard;
