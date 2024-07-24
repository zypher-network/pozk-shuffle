// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./IProver.sol";
import "./IVerifier.sol";

contract Shuffle is Initializable, OwnableUpgradeable, ERC165, IProver, IVerifier {
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IProver).interfaceId || interfaceId == type(IVerifier).interfaceId || super.supportsInterface(interfaceId);
    }

    function name() external view returns (string memory) {
        return "shuffle";
    }

    /// show how to serialize/deseriaze the inputs params
    /// e.g. "uint256,bytes32,string,bytes32[],address[],ipfs"
    function inputs() external pure returns (string memory) {
        return "uint256[]";
    }

    /// show how to serialize/deserialize the publics params
    /// e.g. "uint256,bytes32,string,bytes32[],address[],ipfs"
    function publics() external pure returns (string memory) {
        return "uint256[]";
    }

    function verify(bytes calldata publics, bytes calldata proof) external view returns (bool) {
        // TODO
        return true;
    }
}
