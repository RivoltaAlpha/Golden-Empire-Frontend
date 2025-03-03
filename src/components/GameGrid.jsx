import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { getRandomSymbol, gridSize, checkForWins, specialAnimation, wildAnimation, scatterAnimation, isScatter, isWild, isSpecial, isMegaWild } from "../Utiils/utilities";
import JackpotBanner from "./JackpotNotification";
import { backgroundMusic } from "../Utiils/soundManager";
import Controls from "./ControlPanel";

const GameGrid = () => {
  const [slots, setSlots] = useState([]);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);
  const [coins, setCoins] = useState(1000);
  const [jackpotTriggered, setJackpotTriggered] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stickyWilds, setStickyWilds] = useState({});
  const [megaWilds, setMegaWilds] = useState([]);
  const [freeSpins, setFreeSpins] = useState(0);


    // generate random symbols for the grid
    useEffect(() => {
      generateNewGrid();
    }, []);

    const generateNewGrid = () => {
      let newSlots = Array(gridSize.rows)
        .fill(null)
        .map(() => Array(gridSize.cols).fill(null).map(getRandomSymbol));

        // Place a Mega Wild randomly
        if (Math.random() < 0.1) {  // 10% chance to spawn a Mega Wild
          const row = Math.floor(Math.random() * (gridSize.rows - 1));
          const col = Math.floor(Math.random() * (gridSize.cols - 1));
          newSlots[row][col] = "mega_wild";
          newSlots[row + 1][col] = "mega_wild";
          newSlots[row][col + 1] = "mega_wild";
          newSlots[row + 1][col + 1] = "mega_wild";
          setMegaWilds([...megaWilds, { row, col }]);
        }

      setSlots(newSlots);
    };
    const [topReel, setTopReel] = useState(Array(4).fill(null).map(getRandomSymbol));

    const spin = () => {
      if (coins < betAmount) {
        toast("Not enough coins to place the bet.");
        return;
      }
  
      if (freeSpins === 0 && coins < betAmount) {
        toast.error("Not enough coins to place the bet.");
        return;
      }
  
      if (freeSpins === 0) {
        setCoins(prevCoins => prevCoins - betAmount);
      } else {
        setFreeSpins(prev => prev - 1);
        toast.info(`Free Spin! ${freeSpins - 1} left.`);
      }
  
      setCoins(coins - betAmount);
      setIsSpinning(true);
  
      setTimeout(() => {
        generateNewGrid();
        setTimeout(() => {
          setIsSpinning(false);
          checkForWins(slots, setCoins, setGlobalMultiplier, setJackpotTriggered, setMegaWilds, setStickyWilds, setFreeSpins, setFreeSpins);
        }, 100);
      }, 800);
    };

    useEffect(() => {
      const handleUserInteraction = () => {
        if (!backgroundMusic.playing()) {
          backgroundMusic.play();
        }
        // Remove event listener after first interaction
        window.removeEventListener("click", handleUserInteraction);
      };

      // Add a click event listener to start music on user interaction
      window.addEventListener("click", handleUserInteraction);

      return () => {
        backgroundMusic.stop(); // Stop music when component unmounts (optional)
        window.removeEventListener("click", handleUserInteraction);
      };
    }, []);



    return (
<div className="h-screen relative flex items-center justify-center">
  <ToastContainer />
  
  {/* Background Image */}
  <div className="absolute inset-0 bg-no-repeat bg-center my-10 mx-auto" 
       style={{ backgroundImage: "url('/images/background.png')" }}>
  </div>

  {/* Main Slot Game Container */}
  <div className="relative z-10 flex mt-36 flex-col items-center">
    <AnimatePresence>{jackpotTriggered && <JackpotBanner />}</AnimatePresence>

    {/* Top Horizontal Reel (Special Cascading Row) */}
    <div className="grid grid-cols-6 gap-1 ml-28 mb-5 w-[480px] h-[80px]">
      {topReel.map((symbol, index) => (
        <motion.div key={index} className="w-[80px] h-[80px] flex items-center justify-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isSpinning ? 0.8 : 0.5 }}>
          <img src={`/images/${symbol}.png`} alt={symbol} className="w-full h-full object-contain" />
        </motion.div>
      ))}
    </div>

    {/* Main Vertical Cascading Reels */}
    <div className="grid grid-cols-6 grid-rows-5 gap-4 my-4 w-full h-[300px]">
      {slots.flat().map((symbol, index) => {
        const animation = isScatter(symbol)
          ? scatterAnimation
          : isWild(symbol)
          ? wildAnimation
          : isSpecial(symbol)
          ? specialAnimation
          : isMegaWild(symbol)
          ? { scale: [1, 1.5, 1], transition: { duration: 0.6, repeat: Infinity } }
          : {};

        return (
          <motion.div
            key={index}
            className="w-[80px] h-[80px] flex items-center gap-2 justify-center bg-transparent"
            {...animation}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isSpinning ? 0.8 : 0.5 }}
          >
            <img src={`/images/${symbol}.png`} alt={symbol} className="w-full h-full object-contain" />
          </motion.div>
        );
      })}
    </div>
                  {/* Controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center mt-40 space-y-4 sm:space-y-0 sm:space-x-4">
            <Controls
                coins={coins}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                spin={spin}
                globalMultiplier={globalMultiplier}
            />
        </div>
  </div>
</div>

    );
};

export default GameGrid;



