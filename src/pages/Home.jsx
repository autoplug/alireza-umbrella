import React from "react";
import WalletList from "../components/WalletList";

export default function Home({ wallets }) {
  return (
    <div>
      
      
      
      <div>
  <h3>Wallet Debug:</h3>
  <pre>
    {JSON.stringify(wallets, null, 2)}
  </pre>
</div>
      
      
      <h2>Wallets</h2>
      <WalletList wallets={wallets} />
    </div>
  );
}