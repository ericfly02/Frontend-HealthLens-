import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const circleCount = 4;
  const duration = 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative w-32 h-32 mb-8">
        {[...Array(circleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-gray-200"
            style={{
              rotate: (i / circleCount) * 360,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1],
              opacity: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: duration,
              delay: (i / circleCount) * duration,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        className="text-gray-800 font-light text-2xl mb-4 tracking-widest"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        LOADING
      </motion.div>
      <motion.div
        className="flex space-x-2 mb-6"
        initial="hidden"
        animate="visible"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-gray-400 rounded-full"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
      <motion.p
        className="text-gray-600 text-sm max-w-md text-center font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Please wait while we prepare your experience.
      </motion.p>
    </div>
  );
};

export default Loader;