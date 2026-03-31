import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden cursor-pointer"
      onClick={() => navigate("/dashboard")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" />

      <motion.div
        className="text-center relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <motion.h1
          className="font-display text-5xl md:text-6xl font-bold mb-4 gradient-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Welcome to ScriptAI
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg md:text-xl font-body"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          AI-Powered Script Intelligence
        </motion.p>

        <motion.div
          className="mt-12 w-12 h-1 rounded-full mx-auto"
          style={{ background: "var(--gradient-primary)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Welcome;
