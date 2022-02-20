import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  KOVAN_KEY_HASH,
  KOVAN_LINK,
  KOVAN_VRF_COORDINATOR,
} from "../scripts/constants";
import { transferKovanLinkTokenTo, wait } from "../scripts/utils";
import { RandomNumberGenerator } from "../typechain";

let randomGenerator: RandomNumberGenerator;
let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async function () {
  const RandomNumberGenerator = await ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  randomGenerator = await RandomNumberGenerator.deploy(
    KOVAN_VRF_COORDINATOR,
    KOVAN_LINK,
    KOVAN_KEY_HASH,
    "0xB27448B3e712CF0167b117b02068C09517de0b44"
  );
  await randomGenerator.deployed();

  await transferKovanLinkTokenTo(randomGenerator.address);
});

describe("Deployment", function () {
  it("Should set the right owner", async function () {
    expect(await randomGenerator.signer.getAddress()).to.equal(owner.address);
  });
});

describe("Random Number Generation", () => {
  it("Should init mostRecentRandomness as 0", async () => {
    const rand = await randomGenerator.mostRecentRandomness();
    expect(rand).to.equal(ethers.BigNumber.from(0));
  });
  it("Should get a random number", async () => {
    const bytes32value = ethers.utils.formatBytes32String("1");
    const tx1 = await randomGenerator.getRandom(bytes32value);
    expect(tx1).to.emit(randomGenerator, "RequestedRandomness");

    wait(90);

    const randomness = await randomGenerator.mostRecentRandomness();
    expect(randomness, "randomness should be bigger than 0").to.be.greaterThan(
      ethers.BigNumber.from(0)
    );
  });
});
