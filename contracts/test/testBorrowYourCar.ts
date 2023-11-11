import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {BorrowYourCar} from "../typechain-types";

describe("Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
    const borrowYourCar = await BorrowYourCar.deploy("6","6");

    return { borrowYourCar, owner, otherAccount };
  }

  describe ("ez", function () {
    it('1', async function () {
      const { borrowYourCar,owner,otherAccount } = await loadFixture(deployFixture);
      console.log('地址')
      console.log(owner.address);
      console.log(otherAccount.address);
      await borrowYourCar.mint(0,owner.address);
      await borrowYourCar.mint(1,owner.address);
      await borrowYourCar.mint(2,otherAccount.address);
      console.log(await borrowYourCar.getOwner(0));
      await borrowYourCar.borrowCar(0,'0x70997970C51812dc3A010C7d01b50e0d17dc79C8',11111111);
      const availableCarsPromise = borrowYourCar.getAvailableCars();
      console.log(await borrowYourCar.getUser(0));
      console.log((await borrowYourCar.getBorrowUtil(0)).toString());
      const availableCars = await availableCarsPromise;
      console.log(availableCars[0]);
    });
  })
});