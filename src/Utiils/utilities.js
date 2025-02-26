export const symbols = [
   "purple_eye", "green_totem", "rocks", "ace", "king", 
  "queen", "jack", "ten", "v-purpleye",
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
}

export const scatter = [
  "hand", "head", "chest", "necklace", "elbow", "waist", "wrist"
];

export const specials = ["scatter", "wild", "mega_wild", "super", "kingScatter", "v-scatter", "red_mask", "v-purpleye", "win", "big", "mega", "frame", "jackpot", "v-scatter"];

export const wilds = ["wild", "mega_wild", "super", "kingScatter", "v-scatter","red_mask", "v-purpleye", "win", "big", "mega", "frame", "jackpot", "v-scatter"];

export const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

export const gridSize = { rows: 5, cols: 6 };

export const scatterAnimation = {
  initial: { opacity: 1, scale: 1 },
  animate: { opacity: 0, scale: 1.5, y: -200, transition: { duration: 0.8 } },
};

export const isScatter = (symbol) => scatter.includes(symbol);

export const wildAnimation = {
  animate: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] },
  transition: { duration: 0.5, repeat: Infinity },
};

export const isWild = (symbol) => wilds.includes(symbol);

export const specialAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] },
  transition: { duration: 1, repeat: 2 },
};

export const isSpecial = (symbol) => specials.includes(symbol);



export const checkForWins = (
  slots,
  setCoins,
  setGlobalMultiplier,
  setJackpotTriggered
) => {
  let newGrid = [...slots];
  let hasWin = false;
  let winAmount = 0;
  let bonusSymbols = 0;

  // Control Probability: 20% chance to win, 80% chance to lose
  const shouldWin = Math.random() < 0.2;

  if (shouldWin) {
    // Check for winning combinations in rows
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols - 2; col++) {
        if (
          newGrid[row][col] === newGrid[row][col + 1] &&
          newGrid[row][col] === newGrid[row][col + 2]
        ) {
          hasWin = true;
          newGrid[row][col] = null;
          newGrid[row][col + 1] = null;
          newGrid[row][col + 2] = null;
          winAmount += Math.floor(Math.random() * 20) + 5; // Randomized win amount
        }
      }
    }

    // Check for jackpot or bonus symbols
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (newGrid[row][col] === "jackpot") {
          bonusSymbols++;
        }
      }
    }

    // Jackpot Trigger Logic (Low Probability)
    if (bonusSymbols >= 3 && Math.random() < 0.05) {
      setTimeout(() => setJackpotTriggered(true), 500);
    }

    // Apply Win Effects
    if (hasWin) {
      setTimeout(() => {
        setGlobalMultiplier((prev) => prev + 1);
        setCoins((prev) => prev + winAmount);
      }, 500);
    }
  } else {
    // 80% loss rate - No changes to the grid (player loses)
    console.log("Loss - No winning conditions met.");
  }
};

export  const cascadeSymbols = () => {
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
    setTimeout(checkForWins, 500);
  };


  const checkForScatters = (grid) => {
    return grid.flat().filter((symbol) => symbol === "scatter").length;
  };

  const startFreeSpins = (scatterCount) => {
    let spins = Math.floor(Math.random() * 6) + 5;
    let newMultiplier = 1;
    setFreeSpins(spins);
    setGlobalMultiplier(newMultiplier);
  };

  const reTriggerFreeSpins = (scatterCount) => {
    let extraSpins = 8 + 2 * (scatterCount - 4);
    setFreeSpins((prev) => prev + extraSpins);
  };

  const checkWins = (grid) => {
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

  const applyCascadingReels = (grid) => {
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
