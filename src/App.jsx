import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import BottomNavigation from "./layout/BottomNavigation";
//import Header from "./layout/Header";

import Home from "./pages/Home";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";
import Chart from "./pages/Chart";

// 1️⃣ Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // data considered fresh for 5 minutes
      gcTime: Infinity,          // never garbage collected
      refetchOnMount: false,     // don't refetch when component mounts
      refetchOnWindowFocus: true,// background refresh if window focused
      refetchOnReconnect: true,  // background refresh on network reconnect
      placeholderData: (prev) => prev, // keep previous data visible
    },
  },
});

// 2️⃣ Create persister using localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// 3️⃣ Enable persistent cache
persistQueryClient({
  queryClient,
  persister,
  maxAge: Infinity, // never expire
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
          {/* Header   <Header />   above all pages */}
          

          {/* Spacer for content */}
          <div style={{ height: "36px" }}></div>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chart" element={<Chart />} />
          </Routes>

          {/* Bottom navigation */}
          <BottomNavigation />
        </div>
      </Router>
    </QueryClientProvider>
  );
}