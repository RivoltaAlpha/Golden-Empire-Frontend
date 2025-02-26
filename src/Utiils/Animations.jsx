import { motion } from "framer-motion";

// Winning Symbol Animation
export const winAnimation = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] },
  transition: { duration: 0.6, repeat: 2 },
};

// Scatter Symbol Animation
export const scatterAnimation = {
  initial: { opacity: 0.5, scale: 0.8 },
  animate: { opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] },
  transition: { duration: 0.6, repeat: 2 },
};

// Cascading Reel Animation
export const cascadeAnimation = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4 },
};

// Jackpot Animation
export const jackpotAnimation = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.5, 1], rotate: [0, 10, -10, 0], opacity: [1, 0.7, 1] },
  transition: { duration: 1, repeat: 3 },
};

// Wild Symbol Animation
export const wildAnimation = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] },
  transition: { duration: 0.5, repeat: Infinity },
};
