import { useQuery } from "@tanstack/react-query";
import { fetchTrades } from "../api/fetchTrades";

export const useTrades = () => {
  const query = useQuery({
    queryKey: ["trades"],
    queryFn: () => fetchTrades(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  // Safe access to data
  const trades = query.data?.trades || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, trades, lastUpdate };
  
};