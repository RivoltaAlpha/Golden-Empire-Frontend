export const winAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: [0.8, 1.2, 0.8], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 1, repeat: 2 },
};

export const scatterAnimation = {
  initial: { opacity: 0.5, scale: 0.8 },
  animate: { opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] },
  transition: { duration: 0.6, repeat: 2 },
};

export const cascadeAnimation = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1},
  transition: { duration: 0.4 },
};

export const wildAnimation = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.2, 1], opacity: [1, 0.7, 1], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 0.5, repeat: Infinity },
};

export const specialAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 1, repeat: 2 },
};

export const multiplierImageAnimation = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: [1, 1.5, 1], opacity: [1, 0.8, 1], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 0.5, repeat: 2 },
};
export const showJackpotImage = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: [1, 1.5, 1], opacity: [1, 0.8, 1], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 0.5, repeat: 2 },
};

export const glowingAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: [1, 1.2, 1], boxShadow: ["0px 0px 0px white", "0px 0px 20px yellow", "0px 0px 0px white"] },
  transition: { duration: 1, repeat: 2 },
};
