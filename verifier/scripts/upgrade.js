// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades, network } = require("hardhat");
const { attachContract, sleep } = require("./address_utils.js");
const { writeFile } = require('fs');

const NAME = "Shuffle20";
const ADDR = "0xfb530825bC8edCA2b13597F3B2b91310d43099a1";
const VERIFIER = "Shuffle20Verifier";
const VK_1 = "0xb0A26223b9A5ef17e95C151D9786DF0f3c32c4Df";
const VK_2 = "0x07c9e9f8e15e83Cd6974904e8dE755c9768F3057";

// const NAME = "Shuffle52";
// const ADDR = "0x6558c36b5736466c472231A26A4B47512Bd936Da";
// const VERIFIER = "Shuffle52Verifier";
// const VK_1 = "0x080E72450d35733b3e736b19f10f47653752229C";
// const VK_2 = "0x6d2378f2889FcC73198AF9759D51AB99B51b5988";

async function deployContract(name, params=[]) {
  const Factory = await ethers.getContractFactory(name);
  const contract = await Factory.deploy(...params);
  const address = await contract.getAddress();
  console.log(`${name} address: ${address}`);

  return address;
}

async function upgrade() {
  const shuffleVerifier = await deployContract(VERIFIER, [VK_1, VK_2]);

  const C = await ethers.getContractFactory(NAME);
  const prover = await C.attach(ADDR);
  await prover.setVerifier(shuffleVerifier);
  console.log(`${NAME} upgraded`);
}

async function main() {
  await upgrade();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
