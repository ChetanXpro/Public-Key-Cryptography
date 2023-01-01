import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
 
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        setPublicKey={setPublicKey}
        publicKey={publicKey}

        setPrivateKey={setPrivateKey}
        privateKey={privateKey}
      />
      <Transfer setBalance={setBalance} publicKey={publicKey} privateKey={privateKey} />
    </div>
  );
}

export default App;
