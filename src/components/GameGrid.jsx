import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { getRandomSymbol, checkForWins, isSpecial, isMegaWild,  playSpecialSound, playJackpotSound, playWinSound, playGameOverSound, playMultiplierSound } from "../Utiils/utilities";
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
	const [topReel, setTopReel] = useState(
		Array(4).fill(null).map(getRandomSymbol)
	);
	const [showMultiplierImage, setShowMultiplierImage] = useState(false);
	const [showJackpotImage, setShowJackpotImage] = useState(false);
	const [showWinImage, setShowWinImage] = useState(false);
	const [showMegaImage, setShowMegaImage] = useState(false);
	// State to hold random number
	const [ways, setWays] = useState(generateWays());
    const navigate = useNavigate();

	useEffect(() => {
		generateNewGrid();
	}, []);

	useEffect(() => {
		const hasSpecial = slots.flat().some((item) => isSpecial(item.symbol));
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

			// Decide if this column should include a 3-row symbol (50% chance)
			const includeThreeRowSymbol = Math.random() < 0.5;

			if (includeThreeRowSymbol) {
				// Pick a valid position for a 3-row symbol
				const threeRowStart = Math.floor(Math.random() * (rows - 2));

				// Get a proper 3-row symbol
				const symbol = getRandomSymbol(3);

				// Add the 3-row symbol
				column.push({ symbol, rowSpan: 3, rowStart: threeRowStart });
				hasThreeRowSymbol = true;

				// Fill the remaining rows with 1-row symbols
				for (let i = 0; i < rows; i++) {
					if (i < threeRowStart || i >= threeRowStart + 3) {
						const normalSymbol = getRandomSymbol();
						column.push({ symbol: normalSymbol, rowSpan: 1, rowStart: i });
					}
				}
			} else {
				// No 3-row symbol, fill column with 5 single-row symbols
				for (let i = 0; i < rows; i++) {
					const normalSymbol = getRandomSymbol();
					column.push({ symbol: normalSymbol, rowSpan: 1, rowStart: i });
				}
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
			setCoins((prevCoins) => prevCoins - betAmount);
		} else {
			setFreeSpins((prev) => prev - 1);
			toast.info(`Free Spin! ${freeSpins - 1} left.`);
		}

		setWays(generateWays());

		setIsSpinning(true);

		setTimeout(() => {
			generateNewGrid();
			setTimeout(() => {
				setIsSpinning(false);
				const { hasWin, winAmount, totalWin } = checkForWins(
					slots,
					setCoins,
					setGlobalMultiplier,
					setJackpotTriggered,
					setMegaWilds,
					setStickyWilds,
					setFreeSpins,
					setFreeSpins
				);
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
				<div className="relative flex items-center justify-center ">
					<ToastContainer />

					<div
						className="h-screen absolute inset-0 bg-no-repeat bg-center"
						style={{ backgroundImage: "url('/images/background.png')" }}
					>
						<AnimatePresence>
							{jackpotTriggered && <JackpotBanner />}
						</AnimatePresence>

						<div className="relative grid grid-cols-3 px-80 mt-20">
							<div className="text-yellow-400 font-bold text-lg ml-44 py-1 rounded-md shadow-md text-center">
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
						<div className="relative z-10 flex mt-18 flex-col items-center  gap-[8px] h-[450px]">
							{/* Top Horizontal Reel */}
							{/* These symbols should be normal and not vertical symbols */}
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
											className="w-20 h-16 object-contain"
										/>
									</motion.div>
								))}
							</div>

							{/* Main Slot Grid */}
							<div className="grid grid-cols-6 w-[500px]  ">
								{slots.map((column, colIndex) =>
									column.map((item, itemIndex) => {
										const { symbol, rowSpan, rowStart } = item;

										// Create a truly unique key based on multiple properties
										const uniqueKey = `${colIndex}-${itemIndex}-${symbol}-${rowStart}`;

										const animation = isSpecial(symbol) ? glowingAnimation : {};

										// ensure each item is placed in the correct grid position and no image overlaps the other or is hidden
										// Height based on row span
										const heightClass = rowSpan === 3 ? "h-[]" : "h-[50px]";

										return (
											<motion.div
												key={uniqueKey}
												className={``}
												style={{
													gridColumn: colIndex + 1,
													gridRow: `${rowStart + 1} / span ${rowSpan}`,
												}}
												{...animation}
												initial={{ opacity: 0, y: -50 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: isSpinning ? 0.8 : 0.5,
													delay: colIndex * 0.05,
												}}
											>
												<div
													className={`symbol ${
														isSpecial(symbol) ? "special-symbol" : ""
													} ${heightClass}`}
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
						<div className="relative w-full flex flex-col sm:flex-row items-center justify-center mt-24 space-y-4 sm:space-y-0 sm:space-x-4">
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
			{/* Controls */}
		</>
	);
};

// Animated Overlay Component
const AnimatedOverlay = ({ imgSrc, animation }) => (
  <>
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
    <motion.img src={imgSrc} alt="Overlay Image" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" initial="initial" animate="animate" exit={{ opacity: 0 }} transition="transition" {...animation} />
  </>
);

export default GameGrid;