import React, { useState, useEffect } from "react";

import { useTrades } from "../../hooks/useTrades";
import TableOrder from "../../components/TableOrder";
import Title from "../../components/Title";


const rowStyle = {
  padding: "20px 0",
  margin: "0 0",
  marginTop: "10px",
  maxHeight: "80vh", 
  overflowY: "auto" ,
  backgroundColor: "#fff",
  borderTop: "1px solid #CCC",
  borderBottom: "1px solid #CCC",
};

// Helper function to check if a timestamp is from today in Tehran timezone
const isTodayTehran = (timestamp) => {
  if (!timestamp) return false;

  const dateUtc = new Date(timestamp); // timestamp from API
  // Convert to Tehran time (UTC+3:30)
  const dateTehran = new Date(dateUtc.getTime() + 3.5 * 60 * 60 * 1000);

  const nowTehran = new Date();
  const nowTehranOffset = new Date(nowTehran.getTime() + 3.5 * 60 * 60 * 1000);

  // Get today's date in Tehran
  const year = nowTehranOffset.getUTCFullYear();
  const month = nowTehranOffset.getUTCMonth();
  const day = nowTehranOffset.getUTCDate();

  // Start of today in Tehran (00:00)
  const todayStart = new Date(Date.UTC(year, month, day, 0, 0, 0));

  return dateTehran >= todayStart;
};

export default function Today() {
  const { trades } = useTrades();
  const [todayTrades, setTrades] = useState([]);

  // Load trades from localStorage and filter by Tehran today
  useEffect(() => {
    // Filter trades with timestamp >= 00:00 Tehran today
    const todayTrades = trades
      .filter((t) => isTodayTehran(t.timestamp));
    setTrades(todayTrades);    
  }, [trades]);

  return (
    <div style={{...rowStyle}}>
      <Title title={"Today Trades : " + todayTrades.length } />
      <TableOrder orders={todayTrades} />
    </div>
  );
}




