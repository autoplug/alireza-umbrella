import React, { useState, useEffect } from "react";

import {processAllSells} from "../../api/utils";
import { useTrades } from "../../hooks/useTrades";

import TableOrder from "../../components/TableOrder";
import Title from "../../components/Title";


export default function ProcessSell() {
  const { trades } = useTrades();
  const [sellTable, setSellTable] = useState([]);
  const [buyTable, setBuyTable] = useState([]);

  useEffect(() => {
    // ===== Group orders by market =====
    const ordersByMarket = trades.reduce((acc, order) => {
      const key = order.market;
      if (!acc[key]) acc[key] = { buys: [], sells: [] };
      if (order.type?.toLowerCase() === "buy") acc[key].buys.push(order);
      if (order.type?.toLowerCase() === "sell") acc[key].sells.push(order);
      return acc;
    }, {});

    let finalSells = [];
    let finalBuys = [];

    // ===== Process each market separately =====
    Object.entries(ordersByMarket).forEach(([market, { buys, sells }]) => {
      const { processedSells, updatedBuys } = processAllSells(sells, buys);

      finalSells.push(...processedSells);
      finalBuys.push(...updatedBuys);
    });

    setSellTable(finalSells);
    
    finalBuys = finalBuys.filter((order) => Number(order.amount) !== 0);
    setBuyTable(finalBuys);
    
    
    
  }, [trades]);
  
  
  return (
    <div className="RowStyle">
      {/* ===== Sell Orders Table ===== */}
      <Title title={"Process Sell : " + sellTable.length} />
      {sellTable.length === 0 ? (
        <p>No sell orders to display.</p>
      ) : (
        <TableOrder orders={sellTable} summary={true}/>
      )}

      {/* ===== Remaining Buy Orders Table ===== */}
      <div style={{ marginTop: "30px" }}>
        <TitleBar title="Remain Buy" count={buyTable.length} />
        {buyTable.length === 0 ? (
          <p>No remaining buy orders.</p>
        ) : (
          <TableOrder orders={buyTable} summary={true}/>
        )}
      </div>
    </div>
  );
}