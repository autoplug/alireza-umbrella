// src/context/UpdateContext.jsx
import React, { createContext, useContext, useState } from "react";

const UpdateContext = createContext();

export const useUpdate = () => useContext(UpdateContext);

export const UpdateProvider = ({ children }) => {
  const [lastUpdate, setLastUpdate] = useState(null);

  return (
    <UpdateContext.Provider value={{ lastUpdate, setLastUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
};