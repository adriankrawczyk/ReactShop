import ItemInterface from "./Interfaces/ItemInterface";
import OpinionInterface from "./Interfaces/OpinionInterface";

interface AppContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
  cart: Array<ItemInterface>;
  setCart: (value: Array<ItemInterface>) => void;
  bought: Array<ItemInterface>;
  setBought: (value: Array<ItemInterface>) => void;
  cartMode: boolean;
  setCartMode: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  boughtMode: boolean;
  setBoughtMode: (value: boolean) => void;
  currentOpinionItemTitle: string;
  setCurrentOpinionItemTitle: (value: string) => void;
  data: Array<ItemInterface>;
  setData: (value: Array<ItemInterface>) => void;
  activeCategoryArray: Array<boolean>;
  setActiveCategoryArray: (value: Array<boolean>) => void;
  opinionArray: Array<OpinionInterface>;
  setOpinionArray: (value: Array<OpinionInterface>) => void;
}

export default AppContextType;
