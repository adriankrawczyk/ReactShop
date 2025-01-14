import React, { createContext, useState, ReactNode } from "react";
import AppContextType from "./AppContextInterface";
import { useContext } from "react";

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [cart, setCart] = useState<Array<string>>([]);
  const [cartMode, setCartMode] = useState(false);
  return (
    <AppContext.Provider
      value={{
        inputValue,
        setInputValue,
        cart,
        setCart,
        cartMode,
        setCartMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
