import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { getRandomSymbol, checkForWins, isSpecial, isMegaWild, glowingAnimation, playSpecialSound, playJackpotSound, playWinSound, playGameOverSound, playMultiplierSound } from "../Utiils/utilities";
import { winAnimation, multiplierImageAnimation} from "../Utiils/Animations";
import JackpotBanner from "./JackpotNotification";
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
  const [showMultiplierImage, setShowMultiplierImage] = useState(false);
  const [showJackpotImage, setShowJackpotImage] = useState(false);
  const [showWinImage,setShowWinImage] = useState(false);
  const [showMegaImage,setShowMegaImage] = useState(false);
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
      setGlobalMultiplier(5);
      setShowJackpotImage(true);
      setTimeout(() => {
        setGlobalMultiplier(1);
        setJackpotTriggered(false);
        setShowJackpotImage(false);
      }, 4000);
      console.log("Jackpot triggered!");
    }
  }, [jackpotTriggered]);

  useEffect(() => {
    if (globalMultiplier > 1) {
      playMultiplierSound();
      setShowMultiplierImage(true);
      setTimeout(() => {
        setShowMultiplierImage(false);
      }, 2000);
    }
  }, [globalMultiplier]);

  useEffect(() => {
    if (freeSpins > 0) {
      toast.info(`Free Spin! ${freeSpins} left.`);
    }
  }, [freeSpins]);

  useEffect(() => {
    if (megaWilds.length > 10) {
      setShowMegaImage(true);
      setTimeout(() => {
        setShowMegaImage(false);
      }, 2000);
    }
  }, [megaWilds]);

  useEffect(() => {
    if (coins <= 0) { 
      playGameOverSound();
      navigate("/game-over");
    }
  }, [coins]);
  
  const createSymbolLayout = () => {
    const layout = [];
    const cols = 6; 
    const rows = 5; 

    for (let col = 0; col < cols; col++) {
      const column = [];
      let rowPosition = 0;
      let hasThreeRowSymbol = false; 
  
      while (rowPosition < rows) {
        let symbol;
        let rowSpan = 1;
  
        // Ensure only one 3-row symbol per column
        if (!hasThreeRowSymbol && rowPosition <= rows - 4 && Math.random() < 0.05) {
          const threeRowSymbols = [
            "wild0", "wild3", "wild4",
            "v-purpleye", "v-greengolemn", "v-scatter", "v-A", "v-K", "v-Q", "v-J", "v-10", "v-rock",  "v-redmask", "v-flower"
          ];
          symbol = threeRowSymbols[Math.floor(Math.random() * threeRowSymbols.length)];
          rowSpan = 3;
          hasThreeRowSymbol = true; // Ensure no other 3-row symbols in this column
        } 
        else {
          if (Math.random() < 0.1) {
            const wildNormal = ["wild1", "wild2", "wild", "scatter"];
            symbol = wildNormal[Math.floor(Math.random() * wildNormal.length)];
            setMegaWilds((prev) => [...prev, { row: rowPosition, col }]);
          } else {
            symbol = getRandomSymbol();
          }
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
        const {hasWin, winAmount} = checkForWins(slots, setCoins, setGlobalMultiplier, setJackpotTriggered, setMegaWilds, setStickyWilds, setFreeSpins, setFreeSpins);
        if (hasWin) {
          playWinSound();
          toast.success(`You won ${winAmount} coins!`);
          setShowWinImage(true);
          setTimeout(() => {
            setShowWinImage(false);
          }, 2000);
        }
      }, 100);
    }, 800);
  };

  return (
    <div className="flex flex-col">
    <div className="relative flex items-center justify-center">
      <ToastContainer />     

      <div className="h-screen absolute inset-0 bg-no-repeat bg-center" 
           style={{ backgroundImage: "url('/images/background.png')" }}>
      </div>

        <AnimatePresence>{jackpotTriggered && <JackpotBanner />}</AnimatePresence>

      {/* Game Container */}
      <div className="relative z-10 flex mt-72 flex-col items-center ">
        {/* Top Horizontal Reel */}
        <div className="grid grid-cols-4 gap-2 w-[320px]">
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

          {/* Main Slot Grid */}
          <div className="grid grid-cols-6 auto-rows-[80px] w-full relative">
              {slots.map((column, colIndex) => (
                column.map((item, itemIndex) => {
                  const { symbol, rowSpan, rowStart } = item;
                  
                  if (isMegaWild(symbol) && itemIndex > 0 && colIndex > 0) {
                    const isMainMegaWild = megaWilds.some(
                      mw => mw.row === rowStart && mw.col === colIndex
                    );
                    if (!isMainMegaWild) return null; // Avoid duplicate rendering
                 }
                 
                  const animation =  isSpecial(symbol)
                    ? glowingAnimation
                    : {};
                  
                  // Height based on row span
                  const heightClass = rowSpan === 3 ? "h-[240px]" : "h-[60px]";
                  // ensure each item is placed in the correct grid position and no image overlaps the other or is hidden
                  
                  return (
                    <motion.div
                      key={`${colIndex}-${itemIndex}`}
                      className={`w-[80px] h-[80px] flex flex-col items-center justify-center bg-transparent`}
                      style={{
                        gridColumn: colIndex + 1,
                        gridRow: `${rowStart + 1} / span ${rowSpan}`,
                        zIndex: isSpecial(symbol) ? 2 : 1
                      }}
                      {...animation}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: isSpinning ? 0.8 : 0.5, delay: colIndex * 0.1 }}
                    >
                      <div className={`symbol ${isSpecial(symbol) ? "special-symbol" : ""} ${heightClass}`}>
                        <img src={`/images/${symbol}.png`} alt={symbol} className="w-16 h-16"/>
                      </div>
                    </motion.div>
                  );
                })
              ))}
          </div>

          {/* Animated Overlays */}
          <AnimatePresence>
            {showMultiplierImage && <AnimatedOverlay imgSrc="/images/super.png" animation={multiplierImageAnimation} />}
            {showJackpotImage && <AnimatedOverlay imgSrc="/images/jackpot.png" animation={jackpotAnimation} />}
            {showMegaImage && <AnimatedOverlay imgSrc="/images/mega.png" animation={multiplierImageAnimation} />}
            {showWinImage && <AnimatedOverlay imgSrc="/images/win.png" animation={winAnimation} />}
          </AnimatePresence>               
         </div>
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

      
  );
};

// Animated Overlay Component
const AnimatedOverlay = ({ imgSrc, animation }) => (
  <>
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
    <motion.img src={imgSrc} alt="Overlay Image" className="fixed top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" initial="initial" animate="animate" exit={{ opacity: 0 }} transition="transition" {...animation} />
  </>
);

export default GameGrid;