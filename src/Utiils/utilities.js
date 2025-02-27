import { toast } from "react-toastify";
import { cascadeAnimation, jackpotAnimation, winAnimation } from "./Animations";

export const regularSymbols = [
  "purple_eye", "green_totem", "rocks", "ace", "king", "queen", "jack", "ten", "scatter", "mega_wild", "super", "kingScatter", "red_mask", "v-purpleye","jackpot", "v-scatter"
];

export const paytable = {
  "mask": 2.0,
  "eye": 1.6,
  "totem": 1.2,
  "rocks": 1.0,
  "plant": 0.8,
  "A": 0.6,
  "K": 0.4,
  "Q": 0.4,
  "J": 0.2,
  "10": 0.2
};

export const scatterSymbols = [
  "hand", "head", "chest", "necklace", "elbow", "waist", "wrist"
];

export const specialSymbols = [
  "scatter", "wild", "mega_wild", "super", "kingScatter", "v-scatter", "red_mask", "v-purpleye","jackpot", "v-scatter"
];

export const wildSymbols = [
  "wild", "mega_wild", "super", "kingScatter", "v-scatter", "red_mask", "v-purpleye", "jackpot", "v-scatter"
];

export const winSymbols = ["win", "big", "mega"];

export const gridSize = { rows: 5, cols: 6 };

export const getRandomSymbol = () => {
  const symbolPool = Math.random() < 0.9 ? regularSymbols : [...specialSymbols, ...wildSymbols];
  const randomSymbol = symbolPool[Math.floor(Math.random() * symbolPool.length)];
  return randomSymbol;
};

export const scatterAnimation = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 0, scale: 1.5, y: -200, transition: { duration: 0.8 } },
};

export const isScatter = (symbol) => scatterSymbols.includes(symbol);

export const wildAnimation = {
  animate: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] },
  transition: { duration: 0.5, repeat: Infinity },
};

export const isWild = (symbol) => wildSymbols.includes(symbol);
export const isMegaWild = (symbol) => symbol === "mega";

export const specialAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] },
  transition: { duration: 1, repeat: 2 },
};

export const isSpecial = (symbol) => specialSymbols.includes(symbol);

export const checkForWins = (
  slots,
  setCoins,
  setGlobalMultiplier,
  setJackpotTriggered,
  setFreeSpins
) => {
  let newGrid = [...slots];
  let hasWin = false;
  let winAmount = 0;
  let bonusSymbols = 0;

  const shouldWin = Math.random() < 0.2;

  if (shouldWin) {
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols - 2; col++) {
        const symbol1 = newGrid[row][col];
        const symbol2 = newGrid[row][col + 1];
        const symbol3 = newGrid[row][col + 2];

        if (symbol1 === symbol2 && symbol1 === symbol3) {
          hasWin = true;
          winAmount += paytable[symbol1] || 0;
          newGrid[row][col] = null;
          newGrid[row][col + 1] = null;
          newGrid[row][col + 2] = null;
        }
      }
    }

    let scatterCount = 0;
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (scatterSymbols.includes(newGrid[row][col])) {
          scatterCount++;
        }
      }
    }

    if (scatterCount >= 4) {
      const additionalSpins = (scatterCount - 4) * 2;
      setFreeSpins((prev) => prev + 8 + additionalSpins);
    }

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (newGrid[row][col] === "jackpot") {
          bonusSymbols++;
        }
      }
    }

    if (bonusSymbols >= 3 && Math.random() < 0.05) {
      setTimeout(() => setJackpotTriggered(true), 500);
    }

    if (hasWin) {
      setTimeout(() => {
        setGlobalMultiplier((prev) => prev + 1);
        setCoins((prev) => prev + winAmount);
      }, 500);
    }
  } else {
    toast("Loss - No winning conditions met.");
  }
};

export const cascadeSymbols = (slots, setSlots, checkForWins) => {
  let newGrid = [...slots];

  for (let col = 0; col < gridSize.cols; col++) {
    let newColumn = newGrid.map((row) => row[col]).filter((symbol) => symbol !== null);
    while (newColumn.length < gridSize.rows) {
      newColumn.unshift(getRandomSymbol());
    }
    newColumn.forEach((symbol, rowIndex) => {
      newGrid[rowIndex][col] = symbol;
    });
  }

  setSlots(newGrid);
  setTimeout(() => checkForWins(newGrid), 500);
};

export const checkForScatters = (grid) => {
  return grid.flat().filter((symbol) => symbol === "scatter").length;
};

export const startFreeSpins = (scatterCount, setFreeSpins, setGlobalMultiplier) => {
  let spins = Math.floor(Math.random() * 6) + 5;
  let newMultiplier = 1;
  setFreeSpins(spins);
  setGlobalMultiplier(newMultiplier);
};

export const reTriggerFreeSpins = (scatterCount, setFreeSpins) => {
  let extraSpins = 8 + 2 * (scatterCount - 4);
  setFreeSpins((prev) => prev + extraSpins);
};

export const checkWins = (grid) => {
  let totalWin = 0;

  for (let row = 0; row < gridSize.rows; row++) {
    let currentSymbol = grid[row][0];
    let count = 1;

    for (let col = 1; col < gridSize.cols; col++) {
      const nextSymbol = grid[row][col];

      if (nextSymbol === currentSymbol || nextSymbol === "wild") {
        count++;
      } else {
        if (count >= 3) {
          totalWin += count * 10;
        }
        currentSymbol = nextSymbol;
        count = 1;
      }
    }
    if (count >= 3) {
      totalWin += count * 10;
    }
  }
  return totalWin;
};

export const applyCascadingReels = (grid) => {
  for (let col = 0; col < gridSize.cols; col++) {
    let newCol = [];

    for (let row = 0; row < gridSize.rows; row++) {
      if (grid[row][col] !== "win") {
        newCol.push(grid[row][col]);
      }
    }

    while (newCol.length < gridSize.rows) {
      newCol.unshift(getRandomSymbol());
    }

    for (let row = 0; row < gridSize.rows; row++) {
      grid[row][col] = newCol[row];
    }
  }
};

