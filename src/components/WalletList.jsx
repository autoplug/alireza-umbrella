import React from "react";

function WalletList({ wallets }) {
  return (
    <div>
      <h2>Wallets</h2>

      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id}>
              {/* Display currency code in uppercase */}
              <td>{wallet.currency.toUpperCase()}</td>

              {/* Display total balance */}
              <td>{wallet.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WalletList;