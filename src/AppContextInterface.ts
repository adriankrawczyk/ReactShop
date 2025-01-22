import ItemInterface from "./Interfaces/ItemInterface";

interface AppContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
  cart: Array<ItemInterface>;
  setCart: (value: Array<ItemInterface>) => void;
  bought: Array<string>;
  setBought: (value: Array<string>) => void;
  cartMode: boolean;
  setCartMode: (value: boolean) => void;
  boughtMode: boolean;
  setBoughtMode: (value: boolean) => void;
  currentOpinionItemTitle: string;
  setCurrentOpinionItemTitle: (value: string) => void;
  data: Array<ItemInterface>;
  setData: (value: Array<ItemInterface>) => void;
  activeCategoryArray: Array<boolean>;
  setActiveCategoryArray: (value: Array<boolean>) => void;
}

export default AppContextType;
