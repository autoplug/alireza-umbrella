import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/fetchOrders";

export const useOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });
  
  // Safe access to data
  const orders = query.data?.orders || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, orders, lastUpdate };
  
};