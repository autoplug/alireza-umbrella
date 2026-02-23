import { useQuery } from "@tanstack/react-query";
import { fetchTrades } from "../api/fetchTrades";

export const useTrades = () => {
  return useQuery({
    queryKey: ["trades"],
    queryFn: () => fetchTrades(symbol),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
};