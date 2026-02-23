import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import BottomNavigation from "./layout/BottomNavigation";
import Header from "./layout/Header";
import { fetchAllData } from "./api/api";

// Pages
import Home from "./pages/Home";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";
import Chart from "./pages/Chart";

// Create a React Query client
const queryClient = new QueryClient();

export default function App() {

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
          
          {/* Header above all pages */}
          <Header />
          
          {/* Spacer برای محتوای صفحه */}
          <div style={{ height: "36px" }}></div> 
          
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chart" element={<Chart />} />
          </Routes>
  
          {/* Bottom Navigation */}
          <BottomNavigation />
  
        </div>
      </Router>
    </QueryClientProvider>
  );
}


