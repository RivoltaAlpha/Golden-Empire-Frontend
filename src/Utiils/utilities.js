import { backgroundMusic, gameOverSound, multiplierSound, SpecialSound, winSound } from "./soundManager";

export const paytable = {
  "redmask": 2.0,      // Most valuable
  "purple_eye": 1.6,   
  "green_totem": 1.2,  
  "rocks": 1.0,        
  "flower": 0.8,       
  "ace": 0.6,         
  "king": 0.4,        
  "queen": 0.4,       
  "jack": 0.2,        
  "ten": 0.2,         
  "wild": 2.0,         
  "scatter": 0.0,     
  "v-purpleye": 0.2,
  "v-greengolemn": 0.2,
  "v-scatter": 0.2,
  "v-A": 0.2,
  "v-K": 0.2,
  "v-Q": 0.2,
  "v-J": 0.2,
  "v-10": 0.2,
  "v-rock": 0.2,
  "v-redmask": 0.2,
  "v-flower": 0.2,
  "wild0": 2,
  "wild1": 2,
  "wild2": 2,
  "wild3": 2,
  "wild4": 2,
};

export const regularSymbols = [
  "purple_eye","green_totem","rocks", "ace", "king", "queen", "jack", "ten","redmask"
];

export const verticalSymbols = [
  "v-purpleye","v-greengolemn", "v-scatter", "v-A", "v-K", "v-Q", "v-J", "v-10", "v-rock","v-redmask", "v-flower"
];

export const scatterSymbols = [
  "scatter", "v-scatter","wild3","wild4"
];

export const specialSymbols = [
  "scatter", "wild0", "wild1","wild2","wild3","wild4"
];

export const wildSymbols = [
  "wild0", "wild1","wild2","wild3","wild4",  
];

export const winSymbols = ["win", "big", "mega"];

export const gridSize = { rows: 5, cols: 6 };

export const getRandomSymbol = () => {
  const symbolPool = Math.random() < 0.9 ? regularSymbols : [...verticalSymbols, ...wildSymbols];
  const randomSymbol = symbolPool[Math.floor(Math.random() * symbolPool.length)];
  return randomSymbol;
};

export const isMegaWild = (symbol) => [...wildSymbols].includes(symbol);
export const isWild = (symbol) => wildSymbols.includes(symbol);
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

    if (scatterCount >= 6) {
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
  }
  return { hasWin, winAmount };
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

export const checkForMegaWild = (grid) => {
  let megaWildCount = 0;

  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      if (grid[row][col] === "mega") {
        megaWildCount++;
      }
    }
  }

  return megaWildCount >= 3;
};

export const spinningEffect = (slots, setSlots, setCoins, setGlobalMultiplier, setJackpotTriggered, setFreeSpins) => {
  let newGrid = [...slots];

  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      newGrid[row][col] = getRandomSymbol();
    }
  }

  setSlots(newGrid);
  setTimeout(() => checkForWins(newGrid, setCoins, setGlobalMultiplier, setJackpotTriggered, setFreeSpins), 500);
}

export const glowingAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: [1, 1.2, 1], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 1, repeat: 2 },
};


  export const playSpecialSound = () => {
    SpecialSound.play();
    setTimeout(() => {
      SpecialSound.stop();
    }, 3000);
  };

  export const playJackpotSound = () => {
    SpecialSound.play();
    setTimeout(() => {
      SpecialSound.stop();
    }, 3000);
  };

  export const playWinSound = () => {
    winSound.play();
      setTimeout(() => {
        winSound.stop();
      }, 3000);
    };

  export const playGameOverSound = () => {
    // stop background music when playing this
    backgroundMusic.stop();
    gameOverSound.play();
    setTimeout(() => {
      gameOverSound.stop();
    }, 5000);

  }

  export const playMultiplierSound = () => {
    multiplierSound.play();
    setTimeout(() => {
      multiplierSound.stop();
    }, 3000);
  }