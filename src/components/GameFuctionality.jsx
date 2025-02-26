import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRedo, FaCoins } from "react-icons/fa";
import TopBanner from "./TopBanner";

const symbols = [
  "red_mask",
  "purple_eye",
  "green_totem",
  "rocks",
  "ace",
  "king",
  "queen",
  "jack",
  "ten",
  "scatter",
  "wild",
  "super",
  "mega_wild",
  "jackpot",
];

const scatter = [
  "hand",
  "head",
  "chest",
  "necklace",
  "elbow",
  "waist",
  "wrist",
]

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const gridSize = { rows: 5, cols: 6 };

const GameGrid = () => {
  const [slots, setSlots] = useState([]);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);
  const [coins, setCoins] = useState(1000);
  const [megaWilds, setMegaWilds] = useState([]);
  const [jackpotTriggered, setJackpotTriggered] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    generateNewGrid();
  }, []);

  const generateNewGrid = () => {
    let newSlots = Array(gridSize.rows)
      .fill(null)
      .map(() => Array(gridSize.cols).fill(null).map(getRandomSymbol));
    setSlots(newSlots);
    setMegaWilds([]);
    setJackpotTriggered(false);
  };

  const spin = () => {
    if (coins < betAmount) {
      alert("Not enough coins to place the bet.");
      return;
    }

    setCoins(coins - betAmount);
    setIsSpinning(true);

    setTimeout(() => {
      generateNewGrid();
      setIsSpinning(false);
      checkForWins();
    }, 800);
  };

  const checkForWins = () => {
    let newGrid = [...slots];
    let hasWin = false;
    let winAmount = 0;
    let bonusSymbols = 0;

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols - 2; col++) {
        if (
          newGrid[row][col] === newGrid[row][col + 1] &&
          newGrid[row][col] === newGrid[row][col + 2]
        ) {
          hasWin = true;
          newGrid[row][col] = null;
          newGrid[row][col + 1] = null;
          newGrid[row][col + 2] = null;
          winAmount += 100 * globalMultiplier;
        }
      }
    }

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (newGrid[row][col] === "jackpot") {
          bonusSymbols++;
        }
      }
    }

    if (bonusSymbols >= 3) {
      setTimeout(triggerJackpot, 500);
    }

    if (hasWin) {
      setTimeout(() => {
        cascadeSymbols();
        setGlobalMultiplier(globalMultiplier + 1);
        setCoins(coins + winAmount);
      }, 500);
    }
  };

  const cascadeSymbols = () => {
    let newGrid = [...slots];

    for (let col = 0; col < gridSize.cols; col++) {
      let newColumn = newGrid.map((row) => row[col]).filter((symbol) => symbol !== null);
      while (newColumn.length < gridSize.rows) {
        newColumn.unshift(getRandomSymbol());
      }
      newColumn.forEach((symbol, rowIndex) => {
        newGrid[rowIndex][col] = symbol;
      });
    }

    setSlots(newGrid);
    setTimeout(checkForWins, 500);
  };

  const triggerJackpot = () => {
    setJackpotTriggered(true);
    let rewards = ["Mini Jackpot (x5)", "Major Jackpot (x20)", "Grand Jackpot (x100)"];
    let reward = rewards[Math.floor(Math.random() * rewards.length)];
    alert(`🎉 Jackpot Bonus! You won: ${reward}`);
    let coinBonus = reward.includes("Mini") ? 5000 : reward.includes("Major") ? 2000 : 100000;
    setCoins(coins + coinBonus);
  };

  return (
      <div className="bg-gray-900 p-10 my-4 rounded-b-lg flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="text-lg font-bold text-yellow-400 mb-2">
            Global Multiplier: x{globalMultiplier}
          </div>

          <div className="text-lg font-bold text-green-400 flex items-center gap-2">
            <FaCoins /> Coins: {coins}
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
            <FaRedo /> Spin
          </motion.button>
        </div>
      </div>
  );
};

export default GameGrid;
