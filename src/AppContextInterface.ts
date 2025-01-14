interface AppContextType {
  inputValue: string;
  setInputValue: (value: string) => void;
  cart: Array<string>;
  setCart: (value: Array<string>) => void;
  cartMode: boolean;
  setCartMode: (value: boolean) => void;
}

export default AppContextType;
