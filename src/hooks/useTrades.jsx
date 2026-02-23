// src/hooks/useTrades.jsx
import { useQuery } from "@tanstack/react-query";
import { fetchTrades } from "../api/fetchTrades";

export const useTrades = (symbol) => {
  return useQuery({
    queryKey: ["trades"],  // unique cache per symbol
    queryFn: () => fetchTrades(),
    staleTime: 5 * 60 * 1000,      // 5 دقیقه cache
    refetchOnWindowFocus: true,    // background refresh
  });
};