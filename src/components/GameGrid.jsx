import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { getRandomSymbol, checkForWins, isSpecial, isMegaWild,  playSpecialSound, playJackpotSound, playWinSound, playGameOverSound, playMultiplierSound, TopRandomSymbol } from "../Utiils/utilities";
import { winAnimation,glowingAnimation, multiplierImageAnimation} from "../Utiils/Animations";
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
  const [topReel, setTopReel] = useState(Array(4).fill(null).map(TopRandomSymbol));
  const [showMultiplierImage, setShowMultiplierImage] = useState(false);
  const [showJackpotImage, setShowJackpotImage] = useState(false);
  const [showWinImage,setShowWinImage] = useState(false);
  const [showMegaImage,setShowMegaImage] = useState(false);
  const [ways, setWays] = useState(generateWays());
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
    if (megaWilds.length > 6) {
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

		// Try to place a 3-row symbol first (20% chance)
		if (Math.random() < 0.2 && rowPosition <= rows - 3) {
			const symbol = getRandomSymbol(3);
			column.push({ symbol, rowSpan: 3, rowStart: rowPosition });
			rowPosition += 3;
			hasThreeRowSymbol = true; // Prevents adding a 2-row symbol later
		}

		// If no 3-row symbol was placed, try to place a 2-row symbol (15% chance)
		if (!hasThreeRowSymbol && Math.random() < 0.15 && rowPosition <= rows - 2) {
			const symbol = getRandomSymbol(2);
			column.push({ symbol, rowSpan: 2, rowStart: rowPosition });
			rowPosition += 2;
		}

		// Fill remaining space with 1-row symbols
		while (rowPosition < rows) {
			const normalSymbol = getRandomSymbol();
			column.push({ symbol: normalSymbol, rowSpan: 1, rowStart: rowPosition });
			rowPosition += 1;
		}

		layout.push(column);
	}

	return layout;
};

  const generateNewGrid = () => {
    setMegaWilds([]);
    const newLayout = createSymbolLayout();
    setSlots(newLayout);
    setTopReel(Array(4).fill(null).map(TopRandomSymbol));
  };

	// Function to generate a random number (4 to 5 digits)
	function generateWays() {
		return Math.floor(Math.random() * (99999 - 1000 + 1)) + 1000;
	}

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

	setWays(generateWays());

    setIsSpinning(true);

    setTimeout(() => {
      generateNewGrid();
      setTimeout(() => {
        setIsSpinning(false);
        const {hasWin, winAmount, totalWin} = checkForWins(slots, setCoins, setGlobalMultiplier, setJackpotTriggered, setMegaWilds, setStickyWilds, setFreeSpins, setFreeSpins);
        if (hasWin) {
          toast.success(`You won ${winAmount} coins!`);
          toast.info(`Total Win: ${totalWin} coins.`);
          playWinSound();
          setShowWinImage(true);
          setTimeout(() => {
            setShowWinImage(false);
          }, 2000);
        }
      }, 100);
    }, 800);
  };

  return (
		<>
			<div className="flex flex-col">
				<div className="relative flex items-center justify-center mx-2">
					<ToastContainer />
					<div
						className="absolute inset-0 w-full min-h-screen bg-no-repeat bg-center  "
						style={{ backgroundImage: "url('/images/background.png')", 
							backgroundAttachment: "fixed",
							transform: "scale(1)",  // Prevents zoom changes
						}}>
						<AnimatePresence>
							{jackpotTriggered && <JackpotBanner />}
						</AnimatePresence>

						<div className="relative grid grid-cols-3 px-80 lg:mt-40">
							<div className="text-yellow-400 font-bold text-lg ml-40 py-1 rounded-md shadow-md text-center ">
								{ways} WAYS
							</div>
							<div className="col-span-2 flex justify-center overflow-hidden h-10 pb-2 mr-10 ">
								<img
									src="/images/logo.png"
									alt="Golden Empire"
									className="w-[250px] h-auto object-contain"
								/>
							</div>
						</div>

						{/* Game Container */}
						<div className="relative z-10 flex flex-col items-center justify-center lg:mt-0 md:mt-28  "
							 style={{
								width: "auto",  // Fixed width
								height: "450px", // Fixed height
								transform: "scale(1)",  // Prevents zoom changes
							  }}
						>
							{/* Top Horizontal Reel */}
							<div className="grid grid-cols-4 lg:w-[320px] mb-8">
								{topReel.map((symbol, index) => (
									<motion.div
										key={index}
										className="lg:w-[80px] lg:h-[80px] w-12 flex items-start justify-start"
										initial={{ opacity: 0, y: -50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: isSpinning ? 0.8 : 0.5 }}
									>
										<img
											src={`/images/${symbol}.png`}
											alt={symbol}
											className="w-20 h-16 object-contain"
										/>
									</motion.div>
								))}
							</div>

							{/* Main Slot Grid */}
							<div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 sm:gap-4 max-w-[90%] lg:max-w-[600px] h-auto">
							{slots.map((column, colIndex) =>
									column.map((item, itemIndex) => {
										const { symbol, rowSpan, rowStart } = item;
										const uniqueKey = `${colIndex}-${itemIndex}-${symbol}-${rowStart}`;
										const animation = isSpecial(symbol) ? glowingAnimation : {};

										// Define proper height based on rowSpan
										const heightStyle = 
										rowSpan === 3 ? "h-[80px] sm:h-[30px] md:h-[40px] lg:h-[40px]" : 
										rowSpan === 2 ? "h-[60px] sm:h-[25px] md:h-[45px] lg:h-[60px]" : 
										"h-12 sm:h-12 md:h-[30px] lg:h-[46px]";

										return (
											<motion.div
												key={uniqueKey}
												className={`w-full ${heightStyle} flex items-start justify-start`}												
												style={{
													gridColumn: colIndex + 1,
													gridRow: `${rowStart + 1} / span ${rowSpan}`,
													height: heightStyle,
													width: "80px",
												}}
												{...animation}
												initial={{ opacity: 0, y: -50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: isSpinning ? 0.8 : 0.5,
													delay: colIndex * 0.05,
												}}
											>
												<div className={`symbol lg:w-full md:w-3/4 w-1/2 lg:h-full md:h-3/4 h-1/2  flex items-start justify-start ${
														isSpecial(symbol) ? "special-symbol" : ""
													}`}
												>
													<img src={`/images/${symbol}.png`} alt={symbol} />
												</div>
											</motion.div>
										);
									})
								)}
							</div>
						</div>
						{/* Animated Overlays */}
						<AnimatePresence>
							{showMultiplierImage && (
								<AnimatedOverlay
									imgSrc="/images/super.png"
									animation={multiplierImageAnimation}
								/>
							)}
							{showJackpotImage && (
								<AnimatedOverlay
									imgSrc="/images/jackpot.png"
									animation={jackpotAnimation}
								/>
							)}
							{showMegaImage && (
								<AnimatedOverlay
									imgSrc="/images/mega.png"
									animation={multiplierImageAnimation}
								/>
							)}
							{showWinImage && (
								<AnimatedOverlay
									imgSrc="/images/win.png"
									animation={winAnimation}
								/>
							)}
						</AnimatePresence>
						<div className="relative w-full flex flex-col sm:flex-row items-center justify-center lg:mt-56  mt-2 space-y-4 sm:space-y-0 sm:space-x-4">
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
			</div>
		</>
	);
};

// Animated Overlay Component
const AnimatedOverlay = ({ imgSrc, animation }) => (
  <>
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
    <motion.img src={imgSrc} alt="Overlay Image" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-4/5 sm:w-1/2 md:w-1/3" initial="initial" animate="animate" exit={{ opacity: 0 }} transition="transition" {...animation} />
  </>
);

export default GameGrid;