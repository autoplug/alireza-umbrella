
import { useWallets } from "../../hooks/useWallets";
import { useMarkets } from "../../hooks/useMarkets";

import Title from "../../components/Title";
import MarketIcon from "../../components/MarketIcon";
import {formatPrice} from "../../api/utils";

//////////////////////////////////////////////
const calcTotalRial = (wallets, markets) => {
  const values = wallets.map((wallet) => {
    const balance = Number(wallet.balance);
    if (!balance) return 0;
    if( wallet.currency.toLowerCase() === "rls") 
      return balance
    
    const marketKey = `${wallet.currency.toLowerCase()}-rls`;
    const rate = markets[marketKey];

    if (!rate) return 0;
    return balance * Number(rate);
  });
  
  const result = values.reduce((sum, value) => sum + value, 0);
  return formatPrice(result, "RLS");
};

//////////////////////////////////////////////
// Calculate Rial value using MARKETS_CACHE
const calcRialValue = (amount, currency, markets) => {
  if( currency.toLowerCase() === "rls") return formatPrice(amount,"RLS");
  if (!amount || Number(amount) === 0) return "-";

  // Case-insensitive search for market key
  const searchKey = Object.keys(markets).find(
    (k) => k.toLowerCase() === `${currency}-rls`.toLowerCase()
  );

  if (!searchKey) return "-";

  const rate = Number(markets[searchKey]);
  if (!rate) return "-";

  return formatPrice(Number(amount) * rate, "RLS");
};

//////////////////////////////////////////////
export default function Wallets() {
  const { wallets } = useWallets();
  const { markets } = useMarkets();

  if (!wallets.length) return <div>No wallets available</div>;

  return (
    <div style={{ 
      padding: "10px 0",
      margin: "10px 0",
      maxHeight: "80vh", 
      overflowY: "auto" ,
      backgroundColor: "#fff",
      borderTop: "1px solid #CCC",
      borderBottom: "1px solid #CCC",
    }}>
      <Title title="Wallets" />
      
      <div
        style={{
          textAlign: "center",
          marginBottom: 0,
          padding: "10px 0",
        }}
      >
        <div style={{ fontSize: 14, color: "#777" }}>
          Total Balance
        </div>
      
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
          }}
        >
          {calcTotalRial(wallets, markets)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 0 }}>
        {wallets.map((wallet) => (
          <div
            key={wallet.currency}
            style={{
              backgroundColor: "#F8F8F8",
              borderRadius: "4px",
              padding: "5px 20px",
              margin: "5px 10px",
              marginBottom: 0,
              border: "1px solid #EDEDED", 
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", 
              transition: "transform 0.15s",
              gap : 0,
            }}
          >
            {/* Left: Market Icon */}
            <MarketIcon market={wallet.currency.toUpperCase()} size="large" />

            {/* Right: Amounts */}
            <div style={{ display: "flex", flexDirection: "column"}}>
              <div style={{ fontWeight: 700, fontSize: 16  }}>
                {formatPrice(wallet.balance, wallet.currency.toUpperCase())}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#555" }}>
                {calcRialValue(wallet.balance, wallet.currency, markets)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}