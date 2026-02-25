import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "../api/fetchHistory";
import { useUpdate } from "../context/UpdateContext";

export const useHistory = (symbol, resolution) => {
  const { setLastUpdate } = useUpdate();
  const query = useQuery({
    queryKey: ["candles", symbol, resolution],
    queryFn: () => fetchHistory({ symbol, resolution }),
    enabled: !!symbol && !!resolution, // only run if both exist
    staleTime: 30 * 1000,
  });
  
  if (query.data?._lastUpdate) {
    setLastUpdate(query.data._lastUpdate);
  }
  
  // Safe access to data
  const candles = query.data?.candles || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, candles, lastUpdate };
};