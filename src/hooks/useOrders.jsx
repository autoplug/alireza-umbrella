import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/fetchOrders";

export const useOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  // Safe access to data
  const orders = query.data?.orders || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, orders, lastUpdate };
  
};