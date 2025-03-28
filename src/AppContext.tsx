import React, { createContext, useState, ReactNode } from "react";
import AppContextType from "./AppContextInterface";
import { useContext } from "react";
import ItemInterface from "./Interfaces/ItemInterface";
import OpinionInterface from "./Interfaces/OpinionInterface";

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [cart, setCart] = useState<Array<ItemInterface>>([]);
  const [bought, setBought] = useState<Array<ItemInterface>>([]);
  const [cartMode, setCartMode] = useState(false);
  const [opinionArray, setOpinionArray] = useState<Array<OpinionInterface>>([]);
  const [boughtMode, setBoughtMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentOpinionItemTitle, setCurrentOpinionItemTitle] = useState("");
  const [data, setData] = useState<Array<ItemInterface>>([]);
  const [activeCategoryArray, setActiveCategoryArray] = useState<
    Array<boolean>
  >([]);

  return (
    <AppContext.Provider
      value={{
        inputValue,
        setInputValue,
        cart,
        setCart,
        bought,
        setBought,
        cartMode,
        setCartMode,
        boughtMode,
        setBoughtMode,
        currentOpinionItemTitle,
        setCurrentOpinionItemTitle,
        data,
        setData,
        activeCategoryArray,
        setActiveCategoryArray,
        opinionArray,
        setOpinionArray,
        isLoading,
        setIsLoading,
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
