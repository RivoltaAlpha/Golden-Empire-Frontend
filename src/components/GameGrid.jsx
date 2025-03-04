import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { getRandomSymbol, gridSize, checkForWins, isLargeSpecial, isScatter, isWild, isSpecial, isMegaWild, glowingAnimation, playSpecialSound, playJackpotSound, playWinSound, playGameOverSound } from "../Utiils/utilities";
import {wildAnimation, scatterAnimation, winAnimation, cascadeAnimation, jackpotAnimation, specialAnimation} from "../Utiils/Animations";
import JackpotBanner from "./JackpotNotification";
import { backgroundMusic } from "../Utiils/soundManager";
import Controls from "./ControlPanel";
import { useNavigate } from "react-router-dom";

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
  const [topReel, setTopReel] = useState(Array(4).fill(null).map(getRandomSymbol));
  const navigate = useNavigate();


  useEffect(() => {
    generateNewGrid();
  }, []);

  useEffect(() => {
    const hasSpecial = slots.flat().some(item => isSpecial(item.symbol));
    if (hasSpecial) {
      playSpecialSound();
    }
  }, [slots]);

  useEffect(() => {
    if (jackpotTriggered) {
      playJackpotSound();
    }
  }, [jackpotTriggered]);

  useEffect(() => {
    if (globalMultiplier > 1) {
      playWinSound();
    }
  }, [globalMultiplier]);

  useEffect(() => {
    if (coins <= 0) { 
      playGameOverSound();
      navigate("/game-over");
    }
  }, [coins]);

  const getSymbolRowSpan = (symbol) => {
    if (isLargeSpecial(symbol)) return 3;
    if (isMegaWild(symbol)) return 2;
    return 1;
  };
  
  const createSymbolLayout = () => {
    const layout = [];
    const cols = gridSize.cols || 6;
    const rows = gridSize.rows || 5;
    
    for (let col = 0; col < cols; col++) {
      const column = [];
      let rowPosition = 0;
      
      while (rowPosition < rows) {
        let symbol;
        let rowSpan = 1;
        
        // 5% chance for large special (spans 3)
        if (rowPosition <= rows - 3 && Math.random() < 0.05) {
          symbol = `special${Math.floor(Math.random() * 3) + 1}`;
          rowSpan = 3;
        } 
        // 10% chance for mega wild (spans 2)
        else if (rowPosition <= rows - 2 && Math.random() < 0.1 && col <= cols - 2) {
          symbol = "wild";
          rowSpan = 2;
          setMegaWilds(prev => [...prev, { row: rowPosition, col }]);
        } 
        else {
          symbol = getRandomSymbol();
          rowSpan = 1;
        }
        
        column.push({ symbol, rowSpan, rowStart: rowPosition });
        rowPosition += rowSpan;
      }
      
      layout.push(column);
    }
    
    return layout;
  };

  const generateNewGrid = () => {
    setMegaWilds([]);
    
    const newLayout = createSymbolLayout();
    setSlots(newLayout);
    
    setTopReel(Array(4).fill(null).map(getRandomSymbol));
  };

  const spin = () => {
    if (isSpinning) return;
    
    if (coins < betAmount) {
      toast("Not enough coins to place the bet.");
      navigate("/game-over");
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

    setIsSpinning(true);

    setTimeout(() => {
      generateNewGrid();
      setTimeout(() => {
        setIsSpinning(false);
        checkForWins(slots, setCoins, setGlobalMultiplier, setJackpotTriggered, setMegaWilds, setStickyWilds, setFreeSpins, setFreeSpins);
      }, 100);
    }, 800);
  };

  return (
    <div className="h-screen relative flex items-center justify-center">
      <ToastContainer />     
      <div className="absolute inset-0 bg-no-repeat bg-center my-10 mx-auto" 
           style={{ backgroundImage: "url('/images/background.png')" }}>
      </div>
      <AnimatePresence>{jackpotTriggered && <JackpotBanner />}</AnimatePresence>

      {/* Main Slot Game Container */}
      <div className="relative z-10 flex mt-32 flex-col items-center">
        {/* Top Horizontal Reel */}
        <div className="grid grid-cols-4 gap-1 mb-5 w-[320px] h-[32px]">
          {topReel.map((symbol, index) => (
            <motion.div 
              key={index} 
              className="w-[80px] h-[80px] flex items-center justify-center"
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
          ))}
        </div>

        {/* Main Slot Grid using CSS Grid with explicit positioning */}
 {/* Main Slot Grid using CSS Grid with explicit positioning */}
 <div className="grid grid-cols-6 auto-rows-[80px] gap-4 my-4 w-full max-w-[480px] relative">
          {slots.map((column, colIndex) => (
            column.map((item, itemIndex) => {
              const { symbol, rowSpan, rowStart } = item;
              
              // Skip rendering for mega wild parts (only render the top-left one)
              if (isMegaWild(symbol) && itemIndex > 0 && colIndex > 0) {
                const isMainMegaWild = megaWilds.some(
                  mw => mw.row === rowStart && mw.col === colIndex
                );
                if (!isMainMegaWild) return null;
              }
              
              // Animation based on symbol type
              const animation = isScatter(symbol)
                ? scatterAnimation
                : isWild(symbol)
                ? wildAnimation
                : isSpecial(symbol)
                ? glowingAnimation 
                : isMegaWild(symbol)
                ? { scale: [1, 1.5, 1], transition: { duration: 0.6, repeat: Infinity } }
                : {};
              
              // Height based on row span
              const heightClass = rowSpan === 3 
                ? "h-[240px]" 
                : rowSpan === 2 
                ? "h-[160px]" 
                : "h-[80px]";
              
              return (
                <motion.div
                  key={`${colIndex}-${itemIndex}`}
                  className={`w-[80px] flex items-center justify-center bg-transparent`}
                  style={{
                    gridColumn: colIndex + 1,
                    gridRow: `${rowStart + 1} / span ${rowSpan}`,
                    zIndex: isSpecial(symbol) ? 10 : 1
                  }}
                  {...animation}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isSpinning ? 0.8 : 0.5, delay: colIndex * 0.05 }}
                >
                  <div className={`symbol ${isSpecial(symbol) ? "special-symbol" : ""} ${heightClass}`}>
                    <img src={`/images/${symbol}.png`} alt={symbol} />
                  </div>
                </motion.div>
              );
            })
          ))}
        </div>

        {/* Controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center mt-10 space-y-4 sm:space-y-0 sm:space-x-4">
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