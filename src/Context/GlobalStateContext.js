import React, { createContext, useState, useContext } from "react";

// Create Context
const GlobalStateContext = createContext();

// Create a provider component
export const GlobalStateProvider = ({ children }) => {
 
  const [timeUp,setTimeUp] = useState(false); //

  return (
    <GlobalStateContext.Provider value={{timeUp,setTimeUp}}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the context
export const useGlobalState = () => useContext(GlobalStateContext);
