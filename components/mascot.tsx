import { motion } from "framer-motion";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Mascot({ size = "md", className = "" }: MascotProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Body */}
        <motion.circle
          cx="50"
          cy="60"
          r="25"
          fill="#8B5CF6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        />
        
        {/* Head */}
        <motion.circle
          cx="50"
          cy="30"
          r="20"
          fill="#A78BFA"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        />
        
        {/* Eyes */}
        <motion.circle
          cx="44"
          cy="26"
          r="3"
          fill="#1F2937"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        />
        <motion.circle
          cx="56"
          cy="26"
          r="3"
          fill="#1F2937"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        />
        
        {/* Smile */}
        <motion.path
          d="M 42 32 Q 50 38 58 32"
          stroke="#1F2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />
        
        {/* Code symbols floating around */}
        <motion.text
          x="25"
          y="25"
          fontSize="8"
          fill="#60A5FA"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          {"</>"}
        </motion.text>
        
        <motion.text
          x="70"
          y="40"
          fontSize="6"
          fill="#34D399"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          {"{}"}
        </motion.text>
        
        <motion.text
          x="20"
          y="70"
          fontSize="7"
          fill="#F59E0B"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        >
          {"()"}
        </motion.text>
        
        {/* Arms */}
        <motion.line
          x1="30"
          y1="55"
          x2="20"
          y2="65"
          stroke="#8B5CF6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        <motion.line
          x1="70"
          y1="55"
          x2="80"
          y2="65"
          stroke="#8B5CF6"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
      </svg>
    </motion.div>
  );
}