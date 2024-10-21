// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades, network } = require("hardhat");
const { attachContract, sleep } = require("./address_utils.js");
const { writeFile } = require('fs');

async function deployContract(name, params=[]) {
  const Factory = await ethers.getContractFactory(name);
  const contract = await Factory.deploy(...params);
  const address = await contract.getAddress();
  console.log(`${name} address: ${address}`);

  return address;
}

async function deploy() {
  const vk20_1 = await deployContract("VerifierKey_20_1", []);
  const vk20_2 = await deployContract("VerifierKey_20_2", []);
  const vk52_1 = await deployContract("VerifierKey_52_1", []);
  const vk52_2 = await deployContract("VerifierKey_52_2", []);

  const shuffle20 = await deployContract("Shuffle20", [vk20_1, vk20_2]);
  const shuffle52 = await deployContract("Shuffle52", [vk52_1, vk52_2]);
}

async function main() {
  await deploy();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
