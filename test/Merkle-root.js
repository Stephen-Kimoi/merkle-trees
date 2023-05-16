const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs")

function encodeLeaf(address, spots){
    return ethers.utils.defaultAbiCoder.encode(
        ["address","uint64"], 
        [address, spots]
    )
}

describe("Merkle Trees", function() {
    
})