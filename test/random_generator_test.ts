import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  KOVAN_KEY_HASH,
  KOVAN_LINK,
  KOVAN_VRF_COORDINATOR,
  MUMBAI_KEY_HASH,
  MUMBAI_LINK,
  MUMBAI_VRFCOORDINATOR,
  RINKEBY_FEE,
  RINKEBY_KEY_HASH,
  RINKEBY_LINK,
  RINKEBY_VRFCOORDINATOR,
} from "../scripts/constants";
import { Governance, RandomNumberGenerator } from "../typechain";

let governance: Governance;
let randomGenerator: RandomNumberGenerator;
let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async function () {
  const Governance = await ethers.getContractFactory("Governance");
  governance = await Governance.deploy();
  await governance.deployed();

  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  randomGenerator = await RandomNumberGenerator.deploy(
    KOVAN_VRF_COORDINATOR,
    KOVAN_LINK,
    KOVAN_KEY_HASH,
    governance.address
  );
  await randomGenerator.deployed();
});

/* describe("Deployment", function () {
  it("Should set the right owner", async function () {
    const public_addr = "0x288252F8F1929C3f7DEbf88fd1b3BE2095E733d6";
    const private_addr =
      "0xe23c62dd2aa5c03eaca8c148b81b1bf917d5b6a5ccb9339e74b1e102ada09027";
    expect(await randomGenerator.signer.getAddress()).to.equal(private_addr);
  });
}); */

describe("Random Number Generation", () => {
  it("should init mostRecentRandomness as 0", async () => {
    const rand = await randomGenerator.mostRecentRandomness();
    expect(rand).to.equal(ethers.BigNumber.from(0));
  });
  it("Should get a random number", async () => {
    // const tx1 = await randomGenerator.callStatic["getRandom()"]();
    const tx1 = await randomGenerator["getRandom()"]();
    expect(tx1).to.emit(randomGenerator, "RequestedRandomness");
  });
});
