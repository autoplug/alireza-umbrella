
import CandleChart from "../components/CandleChart";
import { useTrades } from "../hooks/useTrades";

export default function Chart() {

  return (
    <div style={{ padding: 16 }}>
        <h2>Chart</h2>
        {/* Additional  settings can be added here */}
        <CandleChart symbol={"BTCRLS"} />
        
    </div>
  );
}

