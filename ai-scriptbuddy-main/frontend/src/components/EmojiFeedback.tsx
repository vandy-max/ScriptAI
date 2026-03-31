import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmojiOption {
  emoji: string;
  label: string;
  message: string;
}

interface EmojiFeedbackProps {
  score: number;
  onReact?: (emoji: string) => void;
}

const getEmojisForScore = (score: number): EmojiOption[] => {
  if (score >= 75) {
    return [
      { emoji: "👍", label: "Thumbs Up", message: "Great! Your script is engaging!" },
      { emoji: "😊", label: "Happy", message: "Awesome work — keep it up!" },
    ];
  }
  if (score >= 50) {
    return [
      { emoji: "👏", label: "Clap", message: "Nice! A few improvements can boost it." },
      { emoji: "🙂", label: "Smile", message: "Solid foundation — let's refine it." },
    ];
  }
  return [
    { emoji: "😞", label: "Sad", message: "Let's improve this script together." },
    { emoji: "👎", label: "Thumbs Down", message: "Don't worry — we'll help you fix it." },
  ];
};

const Particle = ({ index }: { index: number }) => {
  const angle = (index / 8) * Math.PI * 2;
  const distance = 40 + Math.random() * 30;
  return (
    <motion.span
      className="absolute text-xs pointer-events-none"
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{
        opacity: 0,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      ✦
    </motion.span>
  );
};

const EmojiFeedback = ({ score, onReact }: EmojiFeedbackProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [particles, setParticles] = useState<number[]>([]);

  const emojis = getEmojisForScore(score);

  const handleClick = (option: EmojiOption) => {
    setSelectedEmoji(option.emoji);
    setFeedbackMessage(option.message);
    setParticles(Array.from({ length: 8 }, (_, i) => i));
    onReact?.(option.emoji);

    setTimeout(() => setParticles([]), 700);
  };

  return (
    <motion.div
      className="glass rounded-2xl p-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h3 className="font-display text-xl font-bold mb-2 text-foreground">
        🎯 How did your script perform?
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Tap an emoji to share your reaction
      </p>

      <div className="flex justify-center gap-8 mb-6">
        {emojis.map((option) => (
          <motion.button
            key={option.emoji}
            onClick={() => handleClick(option)}
            className="relative text-5xl cursor-pointer select-none outline-none rounded-2xl p-4 glow-hover transition-colors"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            animate={
              selectedEmoji === option.emoji
                ? {
                    scale: [1, 1.4, 1],
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0],
                  }
                : {}
            }
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            aria-label={option.label}
          >
            <span className="relative z-10">{option.emoji}</span>

            {selectedEmoji === option.emoji && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={{ boxShadow: "0 0 0px hsl(252 60% 55% / 0)" }}
                animate={{
                  boxShadow: [
                    "0 0 0px hsl(252 60% 55% / 0)",
                    "0 0 30px hsl(252 60% 55% / 0.4)",
                    "0 0 10px hsl(252 60% 55% / 0.1)",
                  ],
                }}
                transition={{ duration: 0.8 }}
              />
            )}

            {selectedEmoji === option.emoji &&
              particles.map((i) => <Particle key={i} index={i} />)}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {feedbackMessage && (
          <motion.p
            key={feedbackMessage}
            className="text-foreground font-medium text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {feedbackMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmojiFeedback;
