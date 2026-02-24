
import CandleChart from "../components/CandleChart";

export default function Chart() {

  return (
    <div style={{ padding: 16 }}>
        <h2>Chart</h2>
        {/* Additional  settings can be added here */}
        <CandleChart symbol={"BTCRLS"} resolution={"60"} />
        
    </div>
  );
}

