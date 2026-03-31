import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarRatingProps {
  onRate?: (rating: number) => void;
}

const StarRating = ({ onRate }: StarRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
    onRate?.(value);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <motion.button
          key={value}
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer outline-none"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              value <= (hover || rating)
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default StarRating;
