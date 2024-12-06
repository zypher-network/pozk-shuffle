// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades, network } = require("hardhat");
const { writeFile } = require('fs');

// Testnet (opbnbtestnet)
const VK20_1 = "0x84f5c475C007B7C5DdE950859dFb02D89846bBa3";
const VK20_2 = "0x38324d3C3246cb10f2703E3f5f3EB464F7410FEd";
const VK52_1 = "0x94bDb200D517b910C143D04C8c755DF1E8ef3765";
const VK52_2 = "0x768FC3aeb339f160D7a298c1716b25B4289058aD";
// Shuffle20Verifier address: 0xf629F33047943c2321B6444b74Eb0d30857AEb8b
// Shuffle52Verifier address: 0x25C4e8A3b33A503Ed31C3b698717D183FefA919B
const SHUFFLE_20 = "0x6708d16d1197b4a68df93a27C785208dE7819e1E";
const SHUFFLE_50 = "0x3e7E24fEC0F9c6cE2cA63a1A4D829FF5FDfa3423";

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

async function upgrade() {
  console.log(`Shuffle20 upgrading`);
  const shuffle20Verifier = await deployContract("Shuffle20Verifier", [VK20_1, VK20_2]);
  const C1 = await ethers.getContractFactory("Shuffle20");
  const prover1 = await C1.attach(SHUFFLE_20);
  await prover1.setVerifier(shuffle20Verifier);
  console.log(`Shuffle20 upgraded`);

  console.log(`Shuffle52 upgrading`);
  const shuffle52Verifier = await deployContract("Shuffle52Verifier", [VK52_1, VK52_2]);
  const C2 = await ethers.getContractFactory("Shuffle52");
  const prover2 = await C2.attach(SHUFFLE_50);
  await prover2.setVerifier(shuffle52Verifier);
  console.log(`Shuffle52 upgraded`);
}

async function main() {
  await deploy();
  // await upgrade();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
