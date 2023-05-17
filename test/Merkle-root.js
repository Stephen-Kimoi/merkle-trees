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
    it ("SHould be able to verify if address is in whitelist or not", async function () {

       const testAddresses = await ethers.getSigners(); 

       const list = [
          encodeLeaf(testAddresses[0], 2),
          encodeLeaf(testAddresses[1], 2),
          encodeLeaf(testAddresses[2], 2),
          encodeLeaf(testAddresses[3], 2),
          encodeLeaf(testAddresses[4], 2),
          encodeLeaf(testAddresses[5], 2)
       ]

       const merkleTree = new MerkleTree(list, keccak256, { hashLeaves: true, sortPairs: true, sortLeaves: true })

       const root = merkleTree.getHexRoot(); 

       const whitelist = await ethers.getContractFactory("Whitelist"); 
       const Whitelist = await whitelist.deploy(root);  

       // Checking for valid addresses 
       for (let i = 0; i < 6; i++){
          const leaf = keccak256(list[i]); 
          const proof = merkleTree.getHexProof(leaf); 

          const connectedWhiteList = await Whitelist.connect(testAddresses[i])

          const verified = await connectedWhiteList.checkInWhitelist(proof, 2); 
          expect(verified).to.equal(true); 
       }

       // Checking for invalid addresses 
       const verifiedInvalid = await Whitelist.checkInWhitelist([], 2); 
       expect(verifiedInvalid).to.equal(false); 
           
    })
})