export const walletAddressParser = (walletAddress: string) => {
  return walletAddress.substring(0, 4) + "..." + walletAddress.substring(38);
};
