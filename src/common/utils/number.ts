// eslint-disable-next-line import/prefer-default-export
export const generateRandomNumber = (start: number, end: number) => {
  return Math.floor(Math.random() * (end - start + 1) + start);
};
