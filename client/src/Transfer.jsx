import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {

  toHex,
  utf8ToBytes,
} from "ethereum-cryptography/utils";

import { keccak256 } from "ethereum-cryptography/keccak";
function Transfer({ privateKey, publicKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);


  async function transfer(evt) {
    evt.preventDefault();
    
    function hashMessage() {
      return keccak256(
        utf8ToBytes(
          JSON.stringify({
            sender: publicKey,
            recipient,
            amount: sendAmount,
          })
        )
      );
    }
 

    const signature = await secp.sign(hashMessage(), privateKey, {
      recovered: true,
    });

    const PublicKeyRecover = toHex(
      secp.recoverPublicKey(
        toHex(hashMessage()),
        toHex(signature[0]),
        signature[1]
      )
    );
    console.log(PublicKeyRecover);
    console.log(sendAmount);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: toHex(signature[0]),
        recoveryKey: signature[1],
        sender: publicKey,
        amount: sendAmount,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
