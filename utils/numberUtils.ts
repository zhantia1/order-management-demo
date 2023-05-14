export const getConvertedBENumber = (n: number | undefined) => {
  if (n === undefined || n === null) {
    return undefined;
  }
  // we store up to two decimals in the DB as int
  return n / 100;
};
