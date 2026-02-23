import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/fetchOrders";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  return {
    orders: data?.orders || [],
    lastUpdate: data?._lastUpdate || null,
  };
};