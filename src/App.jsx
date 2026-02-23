import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  persistQueryClient,
} from "@tanstack/react-query-persist-client";

import {
  createSyncStoragePersister,
} from "@tanstack/query-sync-storage-persister";

import { UpdateTimeProvider } from "./context/UpdateTimeContext";

import BottomNavigation from "./layout/BottomNavigation";
import Header from "./layout/Header";

import Home from "./pages/Home";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";
import Chart from "./pages/Chart";

// 1️⃣ Create QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,     // data is always fresh
      gcTime: Infinity,        // never garbage collected
      refetchOnMount: false,   // don't refetch on mount
      refetchOnWindowFocus: false, // don't refetch on window focus
      refetchOnReconnect: false,   // don't refetch on reconnect
    },
  },
});

// 2️⃣ Create persister with localStorage
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// 3️⃣ Enable persistent cache
persistQueryClient({
  queryClient,
  persister,
  maxAge: Infinity, // never expires
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UpdateTimeProvider>
        <Router>
          <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
            {/* Header above all pages */}
            <Header />
            
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
      </UpdateTimeProvider>
    </QueryClientProvider>
  );
}