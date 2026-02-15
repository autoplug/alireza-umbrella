import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

// Fetch wallets from API
export const fetchWallets = async () => {
  const response = await api.get("/users");

  // Transform API data
  return response.data.slice(0, 5).map((user) => ({
    id: user.id,
    name: user.name + " Wallet",
    balance: Math.floor(Math.random() * 1000) + " USD",
  }));
};