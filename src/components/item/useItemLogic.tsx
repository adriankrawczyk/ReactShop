import { useAppContext } from "../../AppContext";
import ItemInterface from "../../Interfaces/ItemInterface";

export const useItemLogic = ({
  title,
  baseQuantity,
}: ItemInterface & { baseQuantity: number }) => {
  const {
    cart,
    setCart,
    bought,
    setCartMode,
    setIsLoading,
    setCurrentOpinionItemTitle,
    cartMode,
    boughtMode,
  } = useAppContext();

  const getQuantity = () => {
    if (boughtMode) {
      const boughtItem = bought.find((item) => item.title === title);
      return boughtItem?.quantity || 0;
    } else {
      const cartItem = cart.find((item) => item.title === title);
      return cartMode
        ? cartItem?.quantity || 0
        : baseQuantity - (cartItem?.quantity || 0);
    }
  };

  const handleAddToCart = () => {
    if (getQuantity() <= 0) return;
    if (!cartMode) {
      const existingItem = cart.find((item) => item.title === title);

      if (!existingItem) {
        setCart([...cart, { title, quantity: 1 }]);
      } else {
        const updatedCart = cart.map((item) =>
          item.title === title ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
      }
    } else {
      const updatedCart = cart.map((item) =>
        item.title === title ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCart(updatedCart);
      if (updatedCart.every((c) => c.quantity === 0)) {
        setCartMode(false);
      }
    }
  };

  const handleMessageClick = () => {
    setIsLoading(true);
    setCurrentOpinionItemTitle(title);
  };

  return {
    getQuantity,
    handleAddToCart,
    handleMessageClick,
    boughtMode,
    cartMode,
  };
};
