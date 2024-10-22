// components/ui/Loader.tsx
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
    >
      <div className="rounded-full h-3 w-3 bg-indigo-500 animate-bounce"></div>
      <div className="rounded-full h-3 w-3 bg-indigo-500 animate-bounce delay-75"></div>
      <div className="rounded-full h-3 w-3 bg-indigo-500 animate-bounce delay-150"></div>
      <span className="text-gray-500 text-sm">Thinking...</span>
    </motion.div>
  );
};

export default Loader;
