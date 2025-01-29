export const getRandomColor = (): string => {
  const randomColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
  console.log(randomColor);
  return randomColor;
};
