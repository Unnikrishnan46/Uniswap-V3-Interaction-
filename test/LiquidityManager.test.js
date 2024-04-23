const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityManager", function () {
  let liquidityManager;

  let daiWhale;
  let usdcWhale;
  let daiContract;
  let usdcContract;
  let user;
  let usdcAmount;
  let daiAmount;
  let tokenId;

  // Replace this with the address of a DAI whale on the Ethereum mainnet
  const daiWhaleAddress = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";
  const usdcWhaleAddress = "0x7713974908Be4BEd47172370115e8b1219F4A5f0";

  beforeEach(async function () {
    user = await ethers.getSigners(1);
    console.log("Pass 1 ",user[0].address);
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [daiWhaleAddress],
    });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [usdcWhaleAddress],
    });
    console.log("Pass 2");
    const LiquidityManager = await ethers.getContractFactory(
      "LiquidityManager"
    );
    liquidityManager = await LiquidityManager.deploy();
    await liquidityManager.deployed();
    const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    console.log("Pass 3");
    // Approve the contract to spend DAI on behalf of the whale
    daiContract = await ethers.getContractAt("IERC20", dai);
    daiWhale = await ethers.getSigner(daiWhaleAddress);
    usdcWhale = await ethers.getSigner(usdcWhaleAddress);
    usdcContract = await ethers.getContractAt("IERC20", usdc);
    console.log("Pass 4");
    daiAmount = ethers.utils.parseEther("1");
    usdcAmount = ethers.utils.parseUnits("100", 6);
    console.log("Pass 5");
    await daiContract.connect(daiWhale).transfer(user[0].address, daiAmount);
    console.log("Pass GG");
    await usdcContract.connect(usdcWhale).transfer(user[0].address, usdcAmount);
    console.log("Pass 6");
    await daiContract
      .connect(user[0])
      .approve(liquidityManager.address, ethers.constants.MaxUint256);
    await usdcContract
      .connect(user[0])
      .approve(liquidityManager.address, ethers.constants.MaxUint256);
      console.log("Pass 7");
    // transfer DAI and USDC to the contract
    daiAmount = ethers.utils.parseEther("1");
    usdcAmount = ethers.utils.parseUnits("100", 6);
    await daiContract
      .connect(user[0])
      .transfer(liquidityManager.address, daiAmount);
    await usdcContract
      .connect(user[0])
      .transfer(liquidityManager.address, usdcAmount);
      console.log("Pass 8");
  });
  
  it("should create a deposit for an ERC721 token", async function () {
    // Mint a new position
    const tx = await liquidityManager.mintNewPosition();

    let receipt = await tx.wait();
    console.log(receipt);
    const events = receipt.events?.filter((x) => x.event == "PositionMinted");

    if (events !== undefined && events.length > 0) {
      // At least one PositionMinted was emitted
      console.log("success");
      tokenId = events[0].args["tokenId"].toString();
      console.log(tokenId);
      // let collesctFee = await liquidityManager.collectAllFees(tokenId);
      // console.log(collesctFee);
    }

    // Get the deposit for the newly minted token
    const deposit = await liquidityManager.deposits(tokenId);
    // Check that the deposit was created correctly
    console.log(deposit);

    expect(deposit.owner).to.equal(await user[0].getAddress());
    expect(deposit.liquidity).to.gt(0);
    expect(deposit.token0).to.equal(
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    );
    expect(deposit.token1).to.equal(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );
  });

//   it("should increase liquidity by the current range", async function () {
//     // Mint a new position
//     console.log("Pass 1");
//     let tx = await liquidityManager.mintNewPosition();

//     let receipt = await tx.wait();

//     let events = receipt.events?.filter((x) => x.event == "PositionMinted");

//     if (events !== undefined && events.length > 0) {
//       // At least one PositionMinted was emitted
//       tokenId = events[0].args["tokenId"].toString();
//     }

//     daiAmount = ethers.utils.parseEther("150");
//     usdcAmount = ethers.utils.parseUnits("150", 6);
//     await liquidityManager.deposits(tokenId);

//     // increase liquidity by the current range
//     tx = await liquidityManager.increaseLiquidityCurrentRange(
//       tokenId,
//       daiAmount,
//       usdcAmount
//     );

//     receipt = await tx.wait();
//     let increasedLiquidity;
//     events = receipt.events?.filter((x) => x.event == "LiquidityIncreased");

//     if (events !== undefined && events.length > 0) {
//       // At least one LiquidityIncreased was emitted
//       increasedLiquidity = events[0].args["liquidity"].toString();
//     }

//     // check that liquidity was increased by the current range
//     expect(increasedLiquidity).to.not.equal(0);
//   });

//   it("should decrease liquidity by half", async function () {
//     // Mint a new position
//     let tx = await liquidityManager.mintNewPosition();

//     let receipt = await tx.wait();

//     let events = receipt.events?.filter((x) => x.event == "PositionMinted");

//     if (events !== undefined && events.length > 0) {
//       // At least one PositionMinted was emitted
//       tokenId = events[0].args["tokenId"].toString();
//     }

//     // decrease liquidity by half
//     tx = await liquidityManager.decreaseLiquidityInHalf(tokenId);

//     receipt = await tx.wait();
//     events = receipt.events?.filter(
//       (x) => x.event == "LiquidityDecreasedByHalf"
//     );

//     if (events !== undefined && events.length > 0) {
//       // At least one LiquidityDecreasedByHalf was emitted
//       token0Redeemed = events[0].args["amount0"].toString();
//       token1Redeemed = events[0].args["amount1"].toString();
//     }

//     expect(token1Redeemed).to.not.equal(0);
//     expect(token0Redeemed).to.not.equal(0);
//   });
});
