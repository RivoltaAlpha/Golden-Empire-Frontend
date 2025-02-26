import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getRandomSymbol, gridSize, checkForWins, cascadeSymbols, specialAnimation, wildAnimation, scatterAnimation, isScatter, isWild, isSpecial } from "../Utiils/utilities";
import Controls from "./ControlPanel";
import JackpotBanner from "./JackpotNotification";

const GameGrid = () => {
  const [slots, setSlots] = useState([]);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);
  const [coins, setCoins] = useState(1000);
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
      checkForWins(slots, setCoins, setGlobalMultiplier, setJackpotTriggered);
    }, 800);
  };

  return (
    <div className="flex justify-center items-center h-screen w-full relative">
      <div className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AnimatePresence>
          {jackpotTriggered && <JackpotBanner />}
        </AnimatePresence>


        {/* <div className="grid grid-cols-6 gap-2 p-20 items-center justify-center w-[650px] mx-auto h-[400px]">
          {slots.flat().map((symbol, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center bg-transparent"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isSpinning ? 0.8 : 0.5 }}
            >
              <img src={`/images/${symbol}.png`} alt={symbol} className="w-full h-full object-contain" />
            </motion.div>
          ))}
        </div> */}
        <div className="grid grid-cols-6 gap-2 p-30 my-56 items-center justify-center w-[650px] mx-auto h-[400px]">
        {slots.flat().map((symbol, index) => {
          const animation = isScatter(symbol)
            ? scatterAnimation
            : isWild(symbol)
            ? wildAnimation
            : isSpecial(symbol)
            ? specialAnimation
            : {};

          return (
            <motion.div
              key={index}
              className="w-[80px] h-[80px] flex items-center justify-center bg-transparent"
              {...animation}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isSpinning ? 0.8 : 0.5 }}
            >
              <img
                src={`/images/${symbol}.png`}
                alt={symbol}
                className="w-full h-full object-contain"
              />
            </motion.div>
          );
        })}
      </div>

        <Controls
          coins={coins}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          spin={spin}
          globalMultiplier={globalMultiplier}
        />
        </div>
    </div>
  );
};

export default GameGrid;

