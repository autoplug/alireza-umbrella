import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "../api/fetchMarkets";
import { useUpdate } from "../context/UpdateContext";

export const useMarkets = () => {
  const query = useQuery({
    queryKey: ["markets"],
    queryFn: () => fetchMarkets(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  // Safe access to data
  const markets = query.data?.markets || {};
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, markets, lastUpdate };
  
};