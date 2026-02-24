import { useQuery } from "@tanstack/react-query";
import { fetchWallets } from "../api/fetchWallets";
import { useUpdate } from "../context/UpdateContext";

export const useWallets = () => {
  const { setLastUpdate } = useUpdate();
  const query = useQuery({
    queryKey: ["wallets"],
    queryFn: () => fetchWallets(),
  });
  
  if (query.data?._lastUpdate) {
    setLastUpdate(query.data._lastUpdate);
  }
  
  // Safe access to data
  const wallets = query.data?.wallets || [];
  const lastUpdate = query.data?._lastUpdate || null;

  return { ...query, wallets, lastUpdate };
};