import ItemInterface from "./Interfaces/ItemInterface";

interface AppContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
  cart: Array<string>;
  setCart: (value: Array<string>) => void;
  cartMode: boolean;
  setCartMode: (value: boolean) => void;
  data: Array<ItemInterface>;
  setData: (value: Array<ItemInterface>) => void;
  activeCategoryArray: Array<boolean>;
  setActiveCategoryArray: (value: Array<boolean>) => void;
}

export default AppContextType;
