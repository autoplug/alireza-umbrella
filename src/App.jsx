import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { UpdateTimeProvider, useUpdateTime } from "./context/UpdateTimeContext";

import BottomNavigation from "./layout/BottomNavigation";
import Header from "./layout/Header";

// Pages
import Home from "./pages/Home";
import Trades from "./pages/Trades";
import Settings from "./pages/Settings";
import Chart from "./pages/Chart";

// Create QueryClient
const queryClient = new QueryClient();

function QueryListener({ children }) {
  const { setLastUpdate } = useUpdateTime();

  React.useEffect(() => {
    const unsubscribe = queryClient
      .getQueryCache()
      .subscribe((event) => {
        if (event?.type === "updated") {
          const query = event.query;
          if (query.state.status === "success") {
            setLastUpdate(Date.now());
          }
        }
      });

    return unsubscribe;
  }, [setLastUpdate]);

  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UpdateTimeProvider>
        <QueryListener>
          <Router>
            <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
              
              <Header />
              <div style={{ height: "36px" }}></div>

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chart" element={<Chart />} />
              </Routes>

              <BottomNavigation />
            </div>
          </Router>
        </QueryListener>
      </UpdateTimeProvider>
    </QueryClientProvider>
  );
}