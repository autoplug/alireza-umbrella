// src/context/UpdateContext.jsx
import { createContext, useContext, useState } from "react";

const UpdateContext = createContext(null);

export const useUpdate = () => {
  const context = useContext(UpdateContext);
  if (!context) throw new Error("useUpdate must be used inside UpdateProvider");
  return context;
};

export const UpdateProvider = ({ children }) => {
  const [lastUpdate, setLastUpdate] = useState(null);

  return (
    <UpdateContext.Provider value={{ lastUpdate, setLastUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};