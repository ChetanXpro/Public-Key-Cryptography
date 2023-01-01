const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
app.use(cors());
app.use(express.json());



const balances = {
  "041fff830de413365087c3ff34b911d9f6ae97839540fa85eb208e5fd71ed83cbe143d0bdd90c819e8511f505462971ca5c212b62c874b8f8ff8c35df6e54660f6": 100,
  "04262dd0dd68915728712355c84db116c829d274fec8e90141dae1d3d32189f2aa4a771e013a133049b750324f66205b48108bafe679a918bb80e6cbd04763a756": 50,
  "0412d4fb2c64b014ec3bb13d962421710043319408155bd6e69ab2f47f4b07fb5a856d604095ea0432d7c497c35dee16ca10b1d05768063235ab8866ad1a30137a": 75,
};
const trx = {
  "041fff830de413365087c3ff34b911d9f6ae97839540fa85eb208e5fd71ed83cbe143d0bdd90c819e8511f505462971ca5c212b62c874b8f8ff8c35df6e54660f6": 0,
  "04262dd0dd68915728712355c84db116c829d274fec8e90141dae1d3d32189f2aa4a771e013a133049b750324f66205b48108bafe679a918bb80e6cbd04763a756": 0,
  "0412d4fb2c64b014ec3bb13d962421710043319408155bd6e69ab2f47f4b07fb5a856d604095ea0432d7c497c35dee16ca10b1d05768063235ab8866ad1a30137a": 0,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, signature, recipient, amount, recoveryKey } = req.body;
  console.log(amount)

 
  let stringAmount = amount.toString();
  console.log(stringAmount);
  function hashMessage() {
    return keccak256(
      utf8ToBytes(
        JSON.stringify({
          sender,
          recipient,
          amount: stringAmount,
          id: trx[sender],
        })
      )
    );
  }

  const hashdata = hashMessage();

  const PublicKeyRecover = toHex(
    secp.recoverPublicKey(toHex(hashdata), signature, recoveryKey)
  );

  const isValidData = secp.verify(signature, hashdata, PublicKeyRecover);
  console.log(isValidData);

  if (isValidData) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    let amountt = parseInt(amount);
    console.log(balances[sender])
    console.log(amount)
    if (balances[sender] < amountt) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amountt;
      balances[recipient] += amountt;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send("Cant verify signature");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
