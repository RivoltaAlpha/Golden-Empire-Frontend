import { motion } from "framer-motion";
import { FaCoins } from "react-icons/fa";
import { GiSpinningBlades } from "react-icons/gi";
import { TiMinusOutline } from "react-icons/ti";
import { MdAdd } from "react-icons/md";
import {spinSound,pauseBackgroundMusic} from "../Utiils/soundManager";

const Controls = ({
	coins,
	betAmount,
	setBetAmount,
	spin,
	globalMultiplier,
}) => {
	const handleSpin = () => {
    pauseBackgroundMusic;
		spinSound.play(); // Play sound when spin is clicked
		spin();

		setTimeout(() => {
			spinSound.stop();
		}, 2500);
	};

	return (
			<div className="bg-black/50 backdrop-blur-sm rounded-xl flex flex-col items-center absolute w-full mt-44 lg:bottom-0 lg:mb-2 p-2 sm:h-auto sm:py-4 sm:px-2">
				<div className="flex flex-wrap items-center lg:justify-between lg:gap-10 ">
				{/* Global Multiplier */}
				<div className="lg:text-lg font-bold text-yellow-400 text-center sm:text-base">
				Global Multiplier: x{globalMultiplier}
				</div>

				{/* Balance Section */}
				<div className="flex flex-col text-lg font-semibold text-white items-center sm:text-base ml-20">
					<div className="flex flex-row items-center lg:text-xl gap-2 sm:text-lg">
						<FaCoins className="text-yellow-400" />
						<p className="text-white font-bold">Balance</p>
					</div>
					{coins}
				</div>

				<div className=" flex flex-col gap-2 mb-0 ">
					<div className="flex items-center justify-center  p-2 rounded-lg shadow-lg w-[200px] opacity-90 gap-4">
						{/* Minus Button */}
						<button
							onClick={() => setBetAmount((prev) => Math.max(0, prev - 10))}
							className="bg-[#d4a000] text-white p-2 rounded-full hover:bg-[#c78d00] transition duration-300"
						>
							<TiMinusOutline className="text-xl" />
						</button>
						<p className="text-white font-semibold text-lg">Bet</p>
						{/* Plus Button */}
						<button
							onClick={() => setBetAmount((prev) => prev + 10)}
							className="bg-[#d4a000] text-white p-2 rounded-full hover:bg-[#c78d00] transition duration-300 "
						>
							<MdAdd className="text-xl" />
						</button>
					</div>
					{/* Bet Text & Amount */}
					<div className="mx-4">
						<input
							type="number"
							value={betAmount}
							onChange={(e) =>
								setBetAmount(Math.max(0, Number(e.target.value)))
							}
							className="bg-transparent text-center text-yellow-500 font-bold w-auto rounded-md outline-none"
							placeholder="Bet Amount"
						/>
					</div>
				</div>

				{/* Spin Button */}
				<motion.button
				className="px-6 py-2 text-white rounded-lg flex items-center gap-2 mt-4 sm:mt-2"
				whileTap={{ scale: 0.9 }}
				onClick={handleSpin}
				>
				<div className="relative mb-4 w-[70px] h-[70px]  ">
					{/* Background Image */}
					<img
					src="/images/spin.webp"
					alt="spin"
					className="w-full h-full transition-transform duration-300 ease-in-out transform group-hover:scale-150"
					/>
					{/* Spinning Icon Positioned on Top */}
					<GiSpinningBlades className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl sm:text-2xl" />
				</div>
				</motion.button>
			</div>
		</div>
	);
};

export default Controls;
