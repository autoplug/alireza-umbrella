// ---------------- Logos ----------------
import BTCLogo from "../assets/logos/btc.PNG";
import ETHLogo from "../assets/logos/eth.PNG";
import USDTLogo from "../assets/logos/usdt.PNG";
import RLSLogo from "../assets/logos/rls.jpg";

const logoMap = {
  BTC: BTCLogo,
  ETH: ETHLogo,
  USDT: USDTLogo,
  RLS: RLSLogo,
};

// ---------------- Market Icon Component ----------------
export default function MarketIcon({ market }){
  const [base, quote] = (market || "Unknown-Unknown").split("-");
  const baseImg = logoMap[base] || "";
  const quoteImg = logoMap[quote] || "";

  return (
    <div style={{ position: "relative", width: "28px", height: "20px", marginRight: "6px" }}>
      {quoteImg && (
        <img
          src={quoteImg}
          alt={quote}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            left: 12,
            top: 0,
            zIndex: 0,
          }}
        />
      )}
      {baseImg && (
        <img
          src={baseImg}
          alt={base}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};