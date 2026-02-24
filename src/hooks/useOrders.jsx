import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/fetchOrders";
import { useUpdate } from "../context/UpdateContext";

export const useOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(),
  });
  
  if (query.data?._lastUpdate) {
    setLastUpdate(query.data._lastUpdate);
  }
  
  // Safe access to data
  const orders = query.data?.orders || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, orders, lastUpdate };
  
};