import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/fetchOrders";

/**
 * Custom hook to fetch active orders with optional filter
 * @param {function} filterFn - optional function to filter orders
 * @returns {Object} { orders, lastUpdate }
 */
export const useOrders = (filterFn) => {
  const { data } = useQuery(
    ["orders", filterFn?.toString() || "all"], // key includes filterFn for refetch if it changes
    () => fetchOrders({ filterFn }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: Infinity,      // keep cache indefinitely
      refetchInterval: 10000,   // refresh every 10s in background
      refetchOnMount: false,    // do not refetch immediately on mount
    }
  );

  return {
    orders: data?.orders || [],
    lastUpdate: data?._lastUpdate || null,
  };
};