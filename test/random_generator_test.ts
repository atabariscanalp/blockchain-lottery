import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { getRandomGeneratorAt, wait } from "../scripts/utils";
import { RandomNumberGenerator } from "../typechain-types";

let randomGenerator: RandomNumberGenerator;
let owner: SignerWithAddress;

const randomGeneratorAddress = "0x1dc47384EF480a0E3513B090Debd6CbC001cF3B7";

/**
 * deploy random generator contract before tests
 */
before(async function () {
  [owner] = await ethers.getSigners();
  randomGenerator = await getRandomGeneratorAt(randomGeneratorAddress);
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
    const tx1 = await randomGenerator.getRandom(bytes32value, {
      gasLimit: ethers.BigNumber.from(100000),
    });
    expect(tx1).to.emit(randomGenerator, "RequestedRandomness");

    // wait for random generator contract to fulfill randomness
    await wait(90);

    const randomness = await randomGenerator.mostRecentRandomness();
    expect(tx1).to.emit(randomGenerator, "FulfilledRandomness");
    expect(randomness, "randomness should be bigger than 0").to.be.greaterThan(
      ethers.BigNumber.from("0")
    );
  });
  /* it("Should revert get random as not the owner", async () => {
    const bytes32value = ethers.utils.formatBytes32String("1");
    const tx1 = await randomGenerator.connect(alice).getRandom(bytes32value);

    await expect(tx1).to.be.revertedWith("only owner can call it");
  }); */
});
