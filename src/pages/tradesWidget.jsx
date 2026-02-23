import { useTrades } from "../hooks/useTrades";

const TradesWidget = () => {
  const { data: trades = [], isLoading, error, refetch } = useTrades();

  if (isLoading) return <div>Loading trades...</div>;
  if (error) return <div>Error loading trades</div>;

  return (
    <div>
      <h3>Total trades: {trades.length}</h3>
      {trades.map((trade, index) => (
        <div key={index}>
          {trade.price} - {trade.amount}
        </div>
      ))}
      <button onClick={() => refetch()}>Refresh Now</button>
    </div>
  );
};