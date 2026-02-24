import { useQuery } from "@tanstack/react-query";
import { fetchTrades } from "../api/fetchTrades";
import { useUpdate } from "../context/UpdateContext";

export const useTrades = () => {
  const { setLastUpdate } = useUpdate();
  const query = useQuery({
    queryKey: ["trades"],
    queryFn: () => fetchTrades(),
  });
  
  if (query.data?._lastUpdate) {
    setLastUpdate(query.data._lastUpdate);
  }

  
  // Safe access to data
  const trades = query.data?.trades || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, trades, lastUpdate };
  
};