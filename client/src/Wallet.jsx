import server from "./server";
// const secp = require("ethereum-cryptography/secp256k1");
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

import {keccak256} from 'ethereum-cryptography/keccak'

function Wallet({
  setPrivateKey,
  setPublicKey,
  privateKey,
  balance,
  setBalance,
}) {
  async function onChange(evt) {
    const privateKeyw = evt.target.value;
  
  
  const  pubicKeyFromPrivateKey = toHex(secp.getPublicKey(privateKeyw));
  

    setPublicKey(pubicKeyFromPrivateKey);
    

    setPrivateKey(privateKeyw);
    if (privateKeyw) {
      const {
        data: { balance },
      } = await server.get(`balance/${pubicKeyFromPrivateKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type an Private key, for example: 0x1"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
