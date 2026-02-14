import React, { useState } from "react";

function App() {
  const [currencies, setCurrencies] = useState([
    { symbol: "BTC", buy: 27000, sell: 27100 },
    { symbol: "ETH", buy: 1800, sell: 1820 },
    { symbol: "USDT", buy: 1, sell: 1.01 }
  ]);
  
  // just to avoid ESLint warning2
  setCurrencies(currencies);

  return (
    <div>
      <h1>Currency Prices</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Buy</th>
            <th>Sell</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((item) => (
            <tr key={item.symbol}>
              <td>{item.symbol}</td>
              <td>{item.buy}</td>
              <td>{item.sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;