import { NETWORKS } from "./types";

export const MUMBAI_FEE = 0.0001;
export const RINKEBY_FEE = 0.1;

export const vrfCoordinators: Record<keyof typeof NETWORKS, string> = {
  KOVAN: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
  MUMBAI: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
  RINKEBY: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
};

export const linkTokenAddresses: Record<keyof typeof NETWORKS, string> = {
  KOVAN: "0xa36085F69e2889c224210F603D836748e7dC0088",
  MUMBAI: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  RINKEBY: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
};

export const keyHashes: Record<keyof typeof NETWORKS, string> = {
  KOVAN: "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
  RINKEBY: "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
  MUMBAI: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
};
