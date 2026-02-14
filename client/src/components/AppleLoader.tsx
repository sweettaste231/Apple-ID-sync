import { motion } from "framer-motion";

export function AppleLoader() {
  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-[2px] h-[6px] bg-gray-500 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${i * 30}deg) translate(0, -10px)`,
            transformOrigin: "0 10px",
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.066,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
