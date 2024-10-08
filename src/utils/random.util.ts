export const randomCharacters = (number: number): string => {
  return Array(number || 8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
};
