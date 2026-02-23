import { useQuery } from "@tanstack/react-query";
import { fetchWallets } from "../api/fetchWallets";

export const useWallets = () => {
  const query = useQuery({
    queryKey: ["wallets"],
    queryFn: () => fetchWallets(),

    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: Infinity,           // keep cache forever
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (prev) => prev, // show previous data while fetching
  });
  
  // Safe access to data
  const wallets = query.data?.wallets || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, wallets, lastUpdate };
  
};