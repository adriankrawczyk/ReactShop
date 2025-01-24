import { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext";

export const useSideBarLogic = () => {
  const {
    cart,
    data,
    bought,
    setBought,
    setCart,
    activeCategoryArray,
    setActiveCategoryArray,
    setCartMode,
    setBoughtMode,
  } = useAppContext();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setTotalPrice(0);
    data.forEach((e) => {
      const cartItem = cart.find((item) => item.title === e.title);
      if (cartItem) {
        setTotalPrice(
          (p) => p + parseFloat(e.price ? e.price : "0") * cartItem.quantity
        );
      }
    });
    setTotalPrice((p) => Math.round(p * 100) / 100);
  }, [cart, data]);

  const handleBuy = async () => {
    try {
      for (const item of cart) {
        const { title, quantity } = item;
        if (quantity <= 0) continue;

        const response = await fetch("http://localhost:5000/api/items/buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            quantity,
            username: localStorage.getItem("logged_user"),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to complete purchase.");
        }
      }

      const updatedBought = [...bought];
      for (const item of cart) {
        const { title, quantity } = item;

        const existingItemIndex = updatedBought.findIndex(
          (boughtItem) => boughtItem.title === title
        );

        if (existingItemIndex !== -1) {
          updatedBought[existingItemIndex].quantity += quantity;
        } else {
          updatedBought.push({ title, quantity });
        }
      }

      setBought(updatedBought);
      setCart([]);
      setCartMode(false);
      setBoughtMode(true);
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  const handleCategoryClick = (index: number) => {
    const updatedActiveArray = [...activeCategoryArray];
    updatedActiveArray[index] = !updatedActiveArray[index];
    setActiveCategoryArray(updatedActiveArray);
  };

  const uniqueCategories = [
    ...new Set(
      data.map(({ category }) =>
        category ? category.charAt(0).toUpperCase() + category.slice(1) : 0
      )
    ),
  ];

  useEffect(() => {
    setActiveCategoryArray(new Array(uniqueCategories.length).fill(false));
  }, [setActiveCategoryArray, uniqueCategories.length]);

  return {
    totalPrice,
    handleBuy,
    handleCategoryClick,
    uniqueCategories,
    activeCategoryArray,
  };
};
