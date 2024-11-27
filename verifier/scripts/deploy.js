// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades, network } = require("hardhat");
const { attachContract, sleep } = require("./address_utils.js");
const { writeFile } = require('fs');

// Testnet (opbnbtestnet)
// VerifierKey_20_1 address: 0x84f5c475C007B7C5DdE950859dFb02D89846bBa3
// VerifierKey_20_2 address: 0x38324d3C3246cb10f2703E3f5f3EB464F7410FEd
// VerifierKey_52_1 address: 0x94bDb200D517b910C143D04C8c755DF1E8ef3765
// VerifierKey_52_2 address: 0x768FC3aeb339f160D7a298c1716b25B4289058aD
// Shuffle20Verifier address: 0xE2FC3851169c692a1B8B5654D1d58919C7198015
// Shuffle52Verifier address: 0x4F447D512776FC467D4B16DDABcEC76A2707d122
// Shuffle20 address: 0x6708d16d1197b4a68df93a27C785208dE7819e1E
// Shuffle52 address: 0x3e7E24fEC0F9c6cE2cA63a1A4D829FF5FDfa3423

async function deployContract(name, params=[]) {
  const Factory = await ethers.getContractFactory(name);
  const contract = await Factory.deploy(...params);
  const address = await contract.getAddress();
  console.log(`${name} address: ${address}`);

  return address;
}

async function deployContractWithProxy(name, params=[]) {
  const Factory = await ethers.getContractFactory(name);
  const contract = await upgrades.deployProxy(Factory, params);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`${name} address: ${address}`);

  return address;
}


async function deploy() {
  const vk20_1 = await deployContract("VerifierKey_20_1", []);
  const vk20_2 = await deployContract("VerifierKey_20_2", []);
  const vk52_1 = await deployContract("VerifierKey_52_1", []);
  const vk52_2 = await deployContract("VerifierKey_52_2", []);

  const shuffle20Verifier = await deployContract("Shuffle20Verifier", [vk20_1, vk20_2]);
  const shuffle52Verifier = await deployContract("Shuffle52Verifier", [vk52_1, vk52_2]);

  const shuffle20 = await deployContractWithProxy("Shuffle20", [shuffle20Verifier]);
  const shuffle52 = await deployContractWithProxy("Shuffle52", [shuffle52Verifier]);
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
