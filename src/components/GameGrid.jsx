import { useState } from "react";
import { FaRedo } from "react-icons/fa";

// Define possible symbols, including wild
const symbols = [
  "red_mask",
  "purple_eye",
  "green_totem",
  "rocks",
  "plant",
  "ace",
  "king",
  "queen",
  "jack",
  "ten",
  "scatter",
  "wild",
];

const gridSize = { rows: 5, cols: 6 };

// Paytable (symbol payouts)
const payTable = {
  red_mask: 10,
  purple_eye: 8,
  green_totem: 6,
  rocks: 4,
  plant: 3,
  ace: 2,
  king: 2,
  queen: 1,
  jack: 1,
  ten: 1,
  scatter: 0,
  wild: 0, // Wild itself doesn’t pay, but substitutes other symbols
};

const GridCell = ({ symbol, isWinning }) => {
  return (
    <div
      className={`aspect-square flex items-center justify-center transition-transform duration-500 
        ${isWinning ? "bg-yellow-300 border-2 border-yellow-500 rounded-lg" : ""}`}
    >
      <img src={`/images/${symbol}.png`} alt={symbol} className="w-full h-full object-contain p-2" />
    </div>
  );
};

const GameGrid = () => {
  const [slots, setSlots] = useState(Array(gridSize.rows * gridSize.cols).fill("rocks"));
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnings, setWinnings] = useState([]);
  const [totalWin, setTotalWin] = useState(0);

  // Spin function
  const spin = () => {
    if (isSpinning) return; // Prevent re-spinning before animation ends
    setIsSpinning(true);
    setWinnings([]);
    setTotalWin(0);

    const newSlots = Array.from({ length: gridSize.rows * gridSize.cols }, () =>
      symbols[Math.floor(Math.random() * symbols.length)]
    );

    // Simulate spin delay
    setTimeout(() => {
      setSlots(newSlots);
      checkWinningCombinations(newSlots);
      setIsSpinning(false);
    }, 1000);
  };

  // Function to check for winning combinations
  const checkWinningCombinations = (grid) => {
    let winningCells = new Set();
    let totalWinAmount = 0;

    // Helper function to check matches, considering wilds
    const isMatch = (a, b) => a === b || a === "wild" || b === "wild";

    // Check horizontal wins
    for (let r = 0; r < gridSize.rows; r++) {
      for (let c = 0; c < gridSize.cols - 2; c++) {
        let idx = r * gridSize.cols + c;
        if (isMatch(grid[idx], grid[idx + 1]) && isMatch(grid[idx], grid[idx + 2])) {
          winningCells.add(idx);
          winningCells.add(idx + 1);
          winningCells.add(idx + 2);
          totalWinAmount += payTable[grid[idx]] * 2;
        }
      }
    }

    // Check vertical wins
    for (let c = 0; c < gridSize.cols; c++) {
      for (let r = 0; r < gridSize.rows - 2; r++) {
        let idx = r * gridSize.cols + c;
        if (isMatch(grid[idx], grid[idx + gridSize.cols]) && isMatch(grid[idx], grid[idx + 2 * gridSize.cols])) {
          winningCells.add(idx);
          winningCells.add(idx + gridSize.cols);
          winningCells.add(idx + 2 * gridSize.cols);
          totalWinAmount += payTable[grid[idx]] * 2;
        }
      }
    }

    setWinnings(Array.from(winningCells));
    setTotalWin(totalWinAmount);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Grid */}
      <div className="grid grid-cols-6 gap-1 p-4 bg-opacity-90 border border-yellow-400 rounded-lg shadow-lg">
        {slots.map((symbol, index) => (
          <GridCell key={index} symbol={symbol} isWinning={winnings.includes(index)} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={spin}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600"
          disabled={isSpinning}
        >
          <FaRedo /> Spin
        </button>
      </div>

      {/* Display total winnings */}
      <p className="text-lg font-bold text-yellow-500">Total Win: {totalWin}</p>
    </div>
  );
};

export default GameGrid;
