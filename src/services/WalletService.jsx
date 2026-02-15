// Function to fetch wallets from API
export const fetchWallets = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    throw new Error("Failed to fetch wallets");
  }

  const data = await response.json();

  // Transform API data to wallet format
  return data.slice(0, 5).map((user) => ({
    id: user.id,
    name: user.name + " Wallet",
    balance: Math.floor(Math.random() * 1000) + " USD",
  }));
};
