import { motion } from "framer-motion";
import { FaRedo, FaCoins } from "react-icons/fa";
import { GiSpinningBlades } from "react-icons/gi";
import { TiMinusOutline } from "react-icons/ti";
import { MdAdd } from "react-icons/md";
import { Howl } from "howler";
import { useState } from "react";
import spin from "../../public/images/spin.webp"
import {
	spinSound,
	winSound,
	gameOverSound,
	pauseBackgroundMusic,
} from "../Utiils/soundManager";

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
		<div className="bg-black/50 backdrop-blur-sm rounded-xl flex flex-col items-center  absolute lg:w-full h-28 lg:bottom-0 lg:mb-2">
			<div className="flex items-center justify-between gap-10">
				<div className="text-lg font-bold text-yellow-400">
					Global Multiplier: x{globalMultiplier}
				</div>

				<div className=" flex flex-col text-lg font-semibold text-white  items-center">
					<div className="flex flex-row items-center text-xl gap-2">
						<FaCoins className="text-yellow-400" />
						<p className="text-white font-ibold">Balance</p>
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

				<motion.button
					className="px-6 py-2 0 text-white rounded-lg  flex items-center gap-2 mt-4"
					whileTap={{ scale: 0.9 }}
					onClick={handleSpin} // Use handleSpin to play sound + trigger spin
				>
					<div className="relative mb-4 w-[70px] h-[70px] group">
						{/* Background Image */}
						<img
							src="/images/spin.webp"
							alt="spin"
							className="w-full h-full transition-transform duration-300 ease-in-out transform group-hover:scale-150"
						/>

						{/* Spinning Icon Positioned on Top */}
						<GiSpinningBlades className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl " />
					</div>
				</motion.button>
			</div>
		</div>
	);
};

export default Controls;
