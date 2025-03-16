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
  "purple_eye","green_totem","rocks", "ace", "king", "queen", "jack", "ten","redmask","scatter"
];

export const topSymbols = [
   "ace", "king", "queen", "jack", "ten","redmask","scatter", "wild", "scatter"
];

export const verticalSymbols = [
  "v-purpleye","v-greengolemn", "v-A", "v-K", "v-Q", "v-J", "v-10", "v-rock","v-redmask", "v-flower","flower",
];

export const span1Symbols = [
  "green_totem","ace", "king", "queen", "jack", "ten","wild","scatter"
];

export const span3Symbols = [
  "wild0","wild3","wild4", "v-scatter","v-rock","v-redmask", "v-flower", "v-purpleye","v-greengolemn", "v-A", "v-K", "v-Q", "v-J", "v-10"
];

export const span2Symbols = [
  "purple_eye","redmask","rocks","wild1","wild2", "flower"
];

export const scatterSymbols = [
  "scatter", "v-scatter","wild3","wild4"
];

export const specialSymbols = [
  "scatter", "wild0", "wild1","wild2","wild3","wild4", "v-scatter","wild"
];

export const largeSpecialSymbols = ["wild0","wild3","wild4", "v-scatter"];
export const smallSpecialSymbols = ["wild1","wild2"];

export const wildSymbols = [ "wild", "wild0", "wild1","wild2","wild3","wild4"];

export const winSymbols = ["win", "big", "mega"];

export const gridSize = { rows: 5, cols: 6 };

export const TopRandomSymbol = () => {
  const randomSymbol = topSymbols[Math.floor(Math.random() * topSymbols.length)];
  return randomSymbol;
};

export const getRandomSymbol = (rowSpan = 1) => {
	if (rowSpan === 3) {
		return span3Symbols[Math.floor(Math.random() * span3Symbols.length)];
	}
  else if (rowSpan === 2) {
    return span2Symbols[Math.floor(Math.random() * span2Symbols.length)];
  }
  else {
		return regularSymbols[Math.floor(Math.random() * regularSymbols.length)];
	}
};

export const isMegaWild = (symbol) => [...wildSymbols].includes(symbol);
export const isWild = (symbol) => wildSymbols.includes(symbol);
export const isSpecial = (symbol) => specialSymbols.includes(symbol);

// Add this helper function before checkForWins
const getSymbolAt = (slots, row, col) => {
  // Check if the column exists
  if (!slots[col]) return null;
  
  // Find the symbol object that covers this row position
  for (let i = 0; i < slots[col].length; i++) {
    const symbolObj = slots[col][i];
    if (symbolObj && 
        symbolObj.row <= row && 
        row < symbolObj.row + symbolObj.rowSpan) {
      return symbolObj.symbol;
    }
  }
  
  return null;
};

export const checkForWins = (
  slots,
  setCoins,
  setGlobalMultiplier,
  setJackpotTriggered,
  setFreeSpins,
  betAmount 
) => {
  let hasWin = false;
  let winAmount = 0;
  let totalWin = 0;
  let scatterCount = 0;
  let bonusSymbols = 0;
  let megaWildsCount = 0;
  
  // First pass: Count special symbols across the entire grid
  for (let col = 0; col < slots.length; col++) {
    for (let itemIndex = 0; itemIndex < slots[col].length; itemIndex++) {
      const symbolObj = slots[col][itemIndex];
      if (symbolObj) {
        const symbol = symbolObj.symbol;
        
        // Count scatter symbols
        if (scatterSymbols.includes(symbol)) {
          scatterCount++;
        }
        
        // Count wild symbols
        if (wildSymbols.includes(symbol)) {
          bonusSymbols++;
          
          // IMPROVEMENT 4: Properly count mega wilds
          if (symbolObj.rowSpan >= 2) {
            megaWildsCount++;
          }
        }
      }
    }
  }
  
  // Handle free spins from scatter symbols - ALWAYS check regardless of win chance
  if (scatterCount >= 4) {
    const additionalSpins = (scatterCount - 4) * 2;
    setFreeSpins((prev) => prev + 8 + additionalSpins);
  }

  // Jackpot trigger with 5% probability - ALWAYS check regardless of win chance
  if (bonusSymbols >= 3 && Math.random() < 0.05) {
    setTimeout(() => setJackpotTriggered(true), 500);
  }
  
  const shouldWin = Math.random() < 0.2; 
  
  if (shouldWin) {
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols - 2; col++) {
        const symbol1 = getSymbolAt(slots, row, col);
        const symbol2 = getSymbolAt(slots, row, col + 1);
        const symbol3 = getSymbolAt(slots, row, col + 2);
        
        if (!symbol1 || !symbol2 || !symbol3) continue;
        
        // Check if the symbols match (considering wilds as substitutes)
        const symbols = [symbol1, symbol2, symbol3];
        const wildCount = symbols.filter(s => wildSymbols.includes(s)).length;
        
        // Natural match (same symbols) or match with wilds
        if ((symbol1 === symbol2 && symbol1 === symbol3) || wildCount > 0) {
          hasWin = true;
          
          // IMPROVEMENT 2: Calculate best possible win with wilds
          if (wildCount > 0) {
            const nonWildSymbols = symbols.filter(s => !wildSymbols.includes(s));
            
            if (nonWildSymbols.length > 0) {
              let bestSymbol = nonWildSymbols[0];
              for (const s of nonWildSymbols) {
                if ((paytable[s] || 0) > (paytable[bestSymbol] || 0)) {
                  bestSymbol = s;
                }
              }
              winAmount += paytable[bestSymbol] || 0;
            } else {
              winAmount += paytable["wild"] || 0;
            }
          } else {
            winAmount += paytable[symbol1] || 0;
          }
        }
      }
    }
    
    // Calculate total win with multipliers
    totalWin = winAmount * betAmount * (megaWildsCount > 1 ? 2 : 1);

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