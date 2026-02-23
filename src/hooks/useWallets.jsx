import { useQuery } from "@tanstack/react-query";
import { fetchWallets } from "../api/fetchWallets";

export const useWallets = () => {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: () => fetchWallets(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  return {
    wallets: data?.wallets || [],
    lastUpdate: data?._lastUpdate || null,
  };
};