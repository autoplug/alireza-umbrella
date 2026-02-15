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
          {wallets && wallets.length > 0 ? (
            wallets.map((wallet) => (
              <tr key={wallet.id}>
                {/* Display currency code in uppercase */}
                <td>{wallet.currency.toUpperCase()}</td>
                {/* Display balance */}
                <td>{wallet.balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No wallets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WalletList;