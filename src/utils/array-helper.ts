// Splits an array into x equally sized chunks (last chunk may be smaller)
export const splitArrayIntoChunks = <T>(array: T[], chunks: number): T[][] => {
  if (chunks <= 0) {
    return [];
  }

  const result: T[][] = [];
  const chunkSize = Math.ceil(array.length / chunks);

  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }

  return result;
};
