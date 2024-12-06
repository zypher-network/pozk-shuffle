// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades, network } = require("hardhat");
const { writeFile } = require('fs');

// testnet
const VK20_1 = "0xDd3c0D61E7A654Ff5Dc4Ade5AD5c47cB4b5e69C2";
const VK20_2 = "0xCF53b1D6EF8D2e70b66c90369724c71Ee444d43c";
const VK52_1 = "0xD342fF2844C4E2bB365FC91BD9dD61C15a26f0fD";
const VK52_2 = "0xDeb08b8247b866ff05856ce4883Dcd23F5E35adA";
const VERIFIER20 = "0x33682F75895E986546A09D60F7ef5Ee6a53383d8";
const VERIFIER52 = "0xCFB2AC0013d3bDD186A21BABf8c170b5b560e58d";
const SHUFFLE20 = "0x0eACA2011742C5156f217F1B1d0784Fe5fBf2428";
const SHUFFLE52 = "0xa6B720EE1f8975551A94F2d6bea74978AFf60343";

// l2testnet
// const VK20_1 = "0xCF53b1D6EF8D2e70b66c90369724c71Ee444d43c";
// const VK20_2 = "0xD342fF2844C4E2bB365FC91BD9dD61C15a26f0fD";
// const VK52_1 = "0xDeb08b8247b866ff05856ce4883Dcd23F5E35adA";
// const VK52_2 = "0x33682F75895E986546A09D60F7ef5Ee6a53383d8";
// const VERIFIER20 = "0xCFB2AC0013d3bDD186A21BABf8c170b5b560e58d";
// const VERIFIER52 = "0x17c3Aef40495c2fcC9bc1880AeAAAf455fDfA5bE";
// const SHUFFLE20 = "0xa6B720EE1f8975551A94F2d6bea74978AFf60343";
// const SHUFFLE50 = "0xbC9b4e9d43830f747e65873A5e122DDd9C9d769b";

// mainnet

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
  const prover1 = await C1.attach(SHUFFLE20);
  await prover1.setVerifier(shuffle20Verifier);
  console.log(`Shuffle20 upgraded`);

  console.log(`Shuffle52 upgrading`);
  const shuffle52Verifier = await deployContract("Shuffle52Verifier", [VK52_1, VK52_2]);
  const C2 = await ethers.getContractFactory("Shuffle52");
  const prover2 = await C2.attach(SHUFFLE50);
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
