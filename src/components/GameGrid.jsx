import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { getRandomSymbol, gridSize, checkForWins, specialAnimation, wildAnimation, scatterAnimation, isScatter, isWild, isSpecial } from "../Utiils/utilities";
import Controls from "./ControlPanel";
import JackpotBanner from "./JackpotNotification";
import { backgroundMusic } from "../Utiils/soundManager";

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
		setSlots(newSlots);
	};



	// useEffect(() => {
	// 	backgroundMusic.play(); // Start playing background music when the game loads

	// 	return () => {
	// 		backgroundMusic.stop(); // Stop music when the component unmounts (optional)
	// 	};
	// }, []);
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
      checkForWins(slots, setCoins, setGlobalMultiplier, setJackpotTriggered, setMegaWilds, setStickyWilds, setFreeSpins);
    }, 800);
  };
    return (
      <div className="flex justify-center items-center h-screen w-full relative">
        <ToastContainer />
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: "url('/images/background.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <AnimatePresence> {jackpotTriggered && <JackpotBanner />} </AnimatePresence>
          <div className="grid grid-cols-6 p-30 lg:my-60 items-center justify-center w-[650px] mx-auto h-[400px]">
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
        <div className="w-full flex flex-col sm:flex-row items-center justify-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
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



