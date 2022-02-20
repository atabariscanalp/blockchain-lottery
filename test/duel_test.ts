import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Duel } from "../typechain";

let duel: Duel;
let owner: SignerWithAddress;
let bob: SignerWithAddress;
let alice: SignerWithAddress;
let addrs: SignerWithAddress[];

before(async () => {
  const Duello = await ethers.getContractFactory("Duel");
  duel = await Duello.deploy();
  await duel.deployed();

  [owner, bob, alice, ...addrs] = await ethers.getSigners();
});

describe("Deployment", function () {
  it("Should deploy successfully", async () => {
    expect(await duel.signer.getAddress()).to.equal(owner.address);
  });
});

describe("Duel", () => {
  it("Should start a duel", async () => {
    const roomId = ethers.utils.formatBytes32String("2");
    const tx1 = await duel.connect(bob).enterDuel(roomId, {
      from: bob.address,
      value: ethers.utils.parseEther("10"),
    });
    await tx1.wait();

    const tx2 = await duel.connect(alice).enterDuel(roomId, {
      from: alice.address,
      value: ethers.utils.parseEther("10"),
    });
    await tx2.wait();

    let balanceOfContract = await duel.getBalance();
    expect(ethers.utils.formatEther(balanceOfContract)).to.equal("20.0");

    const playerCount = (await duel.getRoomCount(roomId)).toNumber();
    expect(playerCount, "player count should be 2").to.equal(2);

    const player1 = await duel.getRoomPlayer(roomId, 0);
    expect(player1, "player1 address should equal to bob").to.equal(
      bob.address
    );

    const player2 = await duel.getRoomPlayer(roomId, 1);
    expect(player2, "player2 address should equal to alice").to.equal(
      alice.address
    );

    const tx3 = await duel.startDuel(roomId);
    await tx3.wait();

    const tx4 = await duel.endDuel(roomId, 3);
    await tx4.wait();

    balanceOfContract = await duel.getBalance();
    expect(ethers.utils.formatEther(balanceOfContract)).to.equal("2.0");

    const player1Won = await duel.checkPlayerWon(roomId, 0);
    expect(player1Won, "player1 should be false").to.be.false;

    const player2Won = await duel.checkPlayerWon(roomId, 1);
    expect(player2Won, "player2 should be true").to.be.true;
  });
});
