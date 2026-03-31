import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { icon: "📄", label: "Reading your script..." },
  { icon: "🧠", label: "Analyzing narrative structure..." },
  { icon: "🎯", label: "Evaluating audience retention..." },
  { icon: "📊", label: "Generating insights..." },
  { icon: "✨", label: "Polishing results..." },
];

interface AnimatedLoaderProps {
  onComplete: () => void;
}

const AnimatedLoader = ({ onComplete }: AnimatedLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => setCurrentStep((s) => s + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  const progress = (currentStep / steps.length) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "var(--gradient-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-strong rounded-2xl p-10 max-w-md w-full mx-4 text-center">
        <motion.div
          className="text-6xl mb-6"
          key={currentStep}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {currentStep < steps.length ? steps[currentStep].icon : "🚀"}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            className="font-display text-lg font-semibold text-foreground mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep < steps.length
              ? steps[currentStep].label
              : "Almost there!"}
          </motion.p>
        </AnimatePresence>

        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor:
                  i <= currentStep
                    ? "hsl(252, 60%, 55%)"
                    : "hsl(230, 20%, 85%)",
                scale: i === currentStep ? 1.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedLoader;
