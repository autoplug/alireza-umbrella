import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "../api/fetchHistory";
import { useUpdate } from "../context/UpdateContext";

export const useHistory = () => {
  const query = useQuery({
    queryKey: ["candles"],
    queryFn: () => fetchHistory(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  // Safe access to data
  const candles = query.data?.candles || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, candles, lastUpdate };
  
};