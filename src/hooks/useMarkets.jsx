import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../api/fetchMarkets";
import { useUpdate } from "../context/UpdateContext";

export const useMarkets = () => {
  const { setLastUpdate } = useUpdate();
  const query = useQuery({
    queryKey: ["markets"],
    queryFn: () => fetchMarkets(),
  });
  
  if (query.data?._lastUpdate) {
    setLastUpdate(query.data._lastUpdate);
  }
  
  // Safe access to data
  const markets = query.data?.markets || {};
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, markets, lastUpdate };
  
};