// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Whitelist {
    bytes32 public merkleRoot; 
    
    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function checkInWhitelist(bytes[] calldata proof, uint64 maxAllowanceToMint) view public returns(bool){
       bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowanceToMint)); 
       bytes32[] memory convertedProof = convertBytesArrayToBytes32Array(proof);
       bool verified = MerkleProof.verify(convertedProof, merkleRoot, leaf);
       bool verified = MerkleProof.verify(proof, merkleRoot, leaf); 
       return verified; 
    }
    
    function convertBytesArrayToBytes32Array(bytes[] calldata data) internal pure returns (bytes32[] memory) {
        bytes32[] memory result = new bytes32[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
        require(data[i].length == 32, "Invalid element length");
        bytes32 convertedData;
        assembly {
            convertedData := mload(add(data[i], 0x20))
        }
        result[i] = convertedData;
}
        return result;
    }


}