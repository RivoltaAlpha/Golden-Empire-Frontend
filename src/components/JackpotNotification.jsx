import { motion } from "framer-motion";

const JackpotBanner = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-yellow-500 text-white text-4xl font-bold p-10 rounded-lg shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎉 Jackpot Bonus Activated!!
      </motion.div>
    </motion.div>
  );
};

export default JackpotBanner;

