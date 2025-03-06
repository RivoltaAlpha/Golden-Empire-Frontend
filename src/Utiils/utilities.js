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
  "purple_eye","green_totem","rocks", "ace", "king", "queen", "jack", "ten","redmask","flower","scatter"
];

export const verticalSymbols = [
  "v-purpleye","v-greengolemn", "v-A", "v-K", "v-Q", "v-J", "v-10", "v-rock","v-redmask", "v-flower"
];

export const scatterSymbols = [
  "scatter", "v-scatter","wild3","wild4"
];

export const specialSymbols = [
  "scatter", "wild0", "wild1","wild2","wild3","wild4", "v-scatter","wild"
];

export const wildSymbols = [
  "wild0", "wild1","wild2","wild3","wild4",  
];

export const winSymbols = ["win", "big", "mega"];

export const gridSize = { rows: 5, cols: 6 };

// export const getRandomSymbol = () => {
//   const symbolPool = Math.random() < 0.9 ? regularSymbols : [...verticalSymbols, ...wildSymbols];
//   const randomSymbol = symbolPool[Math.floor(Math.random() * symbolPool.length)];
//   return randomSymbol;
// };

export const getRandomSymbol = (rowSpan = 1) => {
	if (rowSpan === 3) {
		// Ensure we pick a proper 3-row spanning symbol
		const threeRowSymbols = [
			...verticalSymbols, // Vertical symbols should only be used for 3-row spans
			...wildSymbols, // Allow some wilds to be vertical
		];
		return threeRowSymbols[Math.floor(Math.random() * threeRowSymbols.length)];
	} else {
		// Pick a 1-row symbol from regular or special pool
		const symbolPool =
			Math.random() < 0.8
				? regularSymbols
				: [...wildSymbols, ...scatterSymbols];
		return symbolPool[Math.floor(Math.random() * symbolPool.length)];
	}
};

export const isMegaWild = (symbol) => [...wildSymbols].includes(symbol);
export const isWild = (symbol) => wildSymbols.includes(symbol);
export const isSpecial = (symbol) => specialSymbols.includes(symbol);

export const checkForWins = (
  slots,
  setCoins,
  setGlobalMultiplier,
  setJackpotTriggered,
  setFreeSpins,
  betAmount // Fixed missing parameter
) => {
  let newGrid = [...slots];
  let hasWin = false;
  let winAmount = 0;
  let totalWin = 0;
  let scatterCount = 0;
  let bonusSymbols = 0;
  let megaWilds = [];

  const shouldWin = Math.random() < 0.2; // 20% chance of a win

  if (shouldWin) {
    // Check for matching symbols in rows
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols - 2; col++) {
        const symbol1 = newGrid[row][col];
        const symbol2 = newGrid[row][col + 1];
        const symbol3 = newGrid[row][col + 2];

        if (!symbol1 || !symbol2 || !symbol3) continue;

        // Wild substitution handling
        const isMatch =
          symbol1 === symbol2 &&
          symbol1 === symbol3 &&
          !wildSymbols.includes(symbol1);

        if (isMatch || [symbol1, symbol2, symbol3].some((s) => isWild(s))) {
          hasWin = true;
          winAmount += paytable[symbol1] ?? 0;
          newGrid[row][col] = null;
          newGrid[row][col + 1] = null;
          newGrid[row][col + 2] = null;
        }
      }
    }

    // Check for scatter symbols & jackpot
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const symbol = newGrid[row][col];

        if (symbol === "scatter") scatterCount++;
        if (symbol === "jackpot") bonusSymbols++;
      }
    }

    // Handle free spins from scatter symbols
    if (scatterCount >= 6) {
      const additionalSpins = (scatterCount - 4) * 2;
      setFreeSpins((prev) => prev + 8 + additionalSpins);
    }

    // Jackpot trigger with 5% probability
    if (bonusSymbols >= 3 && Math.random() < 0.05) {
      setTimeout(() => setJackpotTriggered(true), 500);
    }

    // Calculate total win with multipliers
    totalWin = winAmount * betAmount * (megaWilds.length > 1 ? 2 : 1);

    // Apply win payouts
    if (hasWin) {
      setTimeout(() => {
        setGlobalMultiplier((prev) => prev + 1);
        setCoins((prev) => prev + totalWin);
      }, 500);
    }
  }

  return { hasWin, winAmount, totalWin };
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