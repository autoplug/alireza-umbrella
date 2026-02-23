import React, { createContext, useContext, useState } from "react";

const UpdateTimeContext = createContext();

export const UpdateTimeProvider = ({ children }) => {
  const [lastUpdate, setLastUpdate] = useState(null);

  return (
    <UpdateTimeContext.Provider value={{ lastUpdate, setLastUpdate }}>
      {children}
    </UpdateTimeContext.Provider>
  );
};

export const useUpdateTime = () => useContext(UpdateTimeContext);