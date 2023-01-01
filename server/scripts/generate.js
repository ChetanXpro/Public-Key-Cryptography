const  secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

// To generate private key
const privateKey = toHex(secp.utils.randomPrivateKey())

// Generate public key from private key
const publicKey = toHex(secp.getPublicKey(privateKey))

const getAddress = (publicKey)=>{
  return toHex(keccak256(publicKey.slice(1)).slice(-20))
}



console.log('PrivateKey: ',privateKey)
console.log('PublicKey: ',publicKey);


