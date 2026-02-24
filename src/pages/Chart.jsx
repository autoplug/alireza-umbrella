
import CandleChart from "../components/CandleChart";
import { useTrades } from "../hooks/useTrades";
import { useOrders } from "../hooks/useOrders";

export default function Chart() {
    const { orders } = useOrders();
    const { trades } = useTrades();
  return (
    <div style={{ padding: 16 }}>
        <h2>Chart</h2>
        {/* Additional  settings can be added here */}
        <CandleChart symbol={"BTCRLS"} orders={orders} trades={trades}/>
        
    </div>
  );
}

