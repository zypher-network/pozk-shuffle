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

async function deployContractWithProxy(name, params=[]) {
  const Factory = await ethers.getContractFactory(name);
  const contract = await upgrades.deployProxy(Factory, params);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log(`${name} address: ${address}`);

  return address;
}


async function deploy() {
  // const vk20_1 = await deployContract("VerifierKey_20_1", []);
  // const vk20_2 = await deployContract("VerifierKey_20_2", []);
  // const vk52_1 = await deployContract("VerifierKey_52_1", []);
  // const vk52_2 = await deployContract("VerifierKey_52_2", []);

  const vk20_1 = "0xb0A26223b9A5ef17e95C151D9786DF0f3c32c4Df";
  const vk20_2 = "0x07c9e9f8e15e83Cd6974904e8dE755c9768F3057";
  const vk52_1 = "0x080E72450d35733b3e736b19f10f47653752229C";
  const vk52_2 = "0x6d2378f2889FcC73198AF9759D51AB99B51b5988";

  // const shuffle20Verifier = await deployContract("Shuffle20Verifier", [vk20_1, vk20_2]);
  // const shuffle52Verifier = await deployContract("Shuffle52Verifier", [vk52_1, vk52_2]);

  const shuffle20Verifier = "0x407441d85e8F54772f84Ac1f47570C7Cf6Dac080";
  const shuffle52Verifier = "0xc90459cB8a9Ab5EFCd5aEe271f3F343DA4a3eDBE";

  const shuffle20 = await deployContractWithProxy("Shuffle20", [shuffle20Verifier]);
  const shuffle52 = await deployContractWithProxy("Shuffle52", [shuffle52Verifier]);

  // 0xfb530825bC8edCA2b13597F3B2b91310d43099a1
  // 0x6558c36b5736466c472231A26A4B47512Bd936Da
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
