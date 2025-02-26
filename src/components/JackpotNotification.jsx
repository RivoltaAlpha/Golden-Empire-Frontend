import { motion } from "framer-motion";

const JackpotBanner = () => (
  <motion.div
    className="my-4 p-4 bg-yellow-300 text-black rounded-lg text-center"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1.2, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    🎉 Jackpot Bonus Activated!
  </motion.div>
);

export default JackpotBanner;
