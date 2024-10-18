// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "uzkge-contracts/contracts/shuffle/ShuffleVerifier.sol";
import "uzkge-contracts/contracts/shuffle/VerifierKey_52.sol";

import "./IVerifier.sol";

contract Shuffle52 is OwnableUpgradeable, ERC165, IVerifier, ShuffleVerifier {
    uint constant DECK_NUM = 52;

    constructor(address _vk1, address _vk2) ShuffleVerifier(_vk1, _vk2) {
        _verifyKey = VerifierKey_52.load;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IVerifier).interfaceId || super.supportsInterface(interfaceId);
    }

    function name() external pure returns (string memory) {
        return "zk-shuffle";
    }

    /// show how to serialize/deseriaze the inputs params
    /// e.g. "uint256,bytes32,string,bytes32[],address[],ipfs"
    function inputs() external pure returns (string memory) {
        return "(uint256, uint256[])";
    }

    /// show how to serialize/deserialize the publics params
    /// e.g. "uint256,bytes32,string,bytes32[],address[],ipfs"
    function publics() external pure returns (string memory) {
        return "uint256[], (uint256[], uint256[])";
    }

    function verify(bytes calldata _publics, bytes calldata _proof) external view returns (bool) {
        uint[] memory deck1 = abi.decode(_publics, (uint[]));
        (uint[] memory pkc, uint[] memory deck2, bytes memory proof) = abi.decode(_proof, (uint[], uint[], bytes));

        uint256 deckLength = DECK_NUM * 4;
        require(deck1.length == deckLength, "SS01");
        require(deck2.length == deckLength, "SS01");

        uint256[] memory pi = new uint256[](deckLength * 2);
        for (uint256 i = 0; i < deckLength; i++) {
            pi[i] = deck1[i];
            pi[i + deckLength] = deck2[i];
        }

        return this.verifyShuffle(proof, pi, pkc);
    }
}
