export const bytesToMB = (bytes: number, decimalPlaces = 2) => {
  const MB = 1024 * 1024; // 1 MB = 1024 * 1024 bytes
  const sizeInMB = bytes / MB;
  return `${sizeInMB.toFixed(decimalPlaces)} MB`;
};

export const bytesToKB = (bytes: number, decimalPlaces = 2) => {
  const KB = 1024; // 1 KB = 1024 bytes
  const sizeInKB = bytes / KB;
  return `${sizeInKB.toFixed(decimalPlaces)} KB`;
};
