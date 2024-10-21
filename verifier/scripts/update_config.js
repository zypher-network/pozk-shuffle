// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades, network } = require("hardhat");
const { attachContract, sleep } = require("./address_utils.js");

async function test() {
  const C = await ethers.getContractFactory("Shuffle20");
  const c = await C.attach("0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6");

  const res = await c.verify(
    "",
    ""
  );

  console.log(`Verify: ${res}`);
}

async function main() {
  await test();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
