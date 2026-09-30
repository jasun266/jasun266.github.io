// JS mirror of the motion tokens in app/globals.css (@theme). Keep in sync.
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutQuart: [0.76, 0, 0.24, 1] as const,
  gsapOut: "expo.out",
  gsapInOut: "power4.inOut",
};

export const duration = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  reveal: 0.9,
};
