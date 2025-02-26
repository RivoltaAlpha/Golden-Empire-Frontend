import { motion } from "framer-motion";
import { FaRedo, FaCoins } from "react-icons/fa";
import { GiSpinningBlades } from "react-icons/gi";

const Controls = ({ coins, betAmount, setBetAmount, spin, globalMultiplier }) => {
  return (
    <div className="bg-gray-900 p-4 my-2 rounded-b-lg flex items-center justify-between bottom-36 relative">
      <div className="flex items-center gap-10">
        <div className="text-lg font-bold text-yellow-400">
          Global Multiplier: x{globalMultiplier}
        </div>

        <div className="text-lg font-bold text-green-400 flex items-center gap-2">
          <FaCoins /> Balance: {coins}
        </div>

        <div className="mt-4">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(0, e.target.value))}
            className="border p-2 rounded-md w-24"
            placeholder="Bet Amount"
          />
        </div>

        <motion.button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mt-4"
          whileTap={{ scale: 0.9 }}
          onClick={spin}
        >
          <GiSpinningBlades /> Spin
        </motion.button>
      </div>
    </div>
  );
};

export default Controls;
