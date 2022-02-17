import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Governance, Lottery } from "../typechain";

let governance: Governance;
let lottery: Lottery;
let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addrs: SignerWithAddress[];

beforeEach(async function () {
  const Governance = await ethers.getContractFactory("Governance");
  governance = await Governance.deploy();

  const Lottery = await ethers.getContractFactory("Lottery");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  lottery = await Lottery.deploy(10, governance.address);
  await lottery.deployed();
});

describe("Deployment", function () {
  it("Should set the right owner", async function () {
    expect(await lottery.signer.getAddress()).to.equal(owner.address);
  });
});

describe("Lottery", function () {
  it("Should return count of players which is 0 at beggining", async function () {
    expect(lottery.players).length(0);
  });
  it("Should fail for entering the lottery as ether value not enough", async function () {
    expect(
      lottery.connect(addr1).buyTicket({
        from: addr1.address,
        value: ethers.utils.parseEther("0.03"),
      })
    ).to.be.revertedWith("Not enough ETH!");
  });
  it("Should fail for entering the lottery as lottery is not open yet", async function () {
    expect(
      lottery.connect(addr2).buyTicket({
        from: addr2.address,
        value: ethers.utils.parseEther("0.1"),
      })
    ).to.be.revertedWith("Lottery is not open yet!");
  });
  it("Should return lotteryState as CLOSED(1)", async function () {
    expect(await lottery.lotteryState()).to.equal(1);
  });
  it("Should start the lottery and return lotteryState as OPEN(0)", async function () {
    await lottery.startLottery();

    expect(await lottery.lotteryState()).to.equal(0);
  });
  it("Should start the lottery and increase players count by 1", async function () {
    await lottery.startLottery();
    const ticketPrice = ethers.utils.parseEther("0.1");

    expect(await lottery.lotteryState()).to.equal(0);

    const tx = await lottery.connect(addr2).buyTicket({
      from: addr2.address,
      value: ticketPrice,
    });

    await expect(tx).to.emit(lottery, "BuyTicket").withArgs(addr2.address);
    await expect(tx).to.changeEtherBalance(
      addr2,
      ethers.utils.parseEther("0.1").mul(ethers.BigNumber.from(-1))
    );

    const playerCount = await lottery.getPlayerCount();
    expect(playerCount).to.be.equal(1);
  });
});
