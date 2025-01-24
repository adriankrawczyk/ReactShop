import styled from "styled-components";
import { useAppContext } from "../AppContext";
import { useEffect, useState } from "react";
import { ColorScheme, WithTransition } from "../Schemes/StyleScheme";

const SideBarContainer = styled.div`
  position: absolute;
  top: 15vh;
  width: 12vw;
  height: 80vh;
  border-right: 1px solid #bbb;
`;

const CategoryBar = styled.div<{ $active: boolean }>`
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  flex-wrap: wrap;
  text-wrap: nowrap;
  background-color: ${({ $active }) =>
    $active ? ColorScheme.green : "transparent"};
  cursor: pointer;
  transition: font-size 0.25s ease-in-out;
  font-size: 1.2vw;
  &:hover {
    font-size: 1.33vw;
  }
`;

const BuyText = styled.div`
  ${WithTransition()}
`;

const BuyButton = styled.div`
  width: 12vw;
  height: 75px;
  border: 1px solid #bbb;
  position: absolute;
  background-color: ${ColorScheme.red};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 2em;
  cursor: pointer;
  border-bottom-left-radius: 15%;
  bottom: 0;
`;

const PriceDisplayer = styled.div`
  width: 12vw;
  height: 75px;
  border: 1px solid #bbb;
  bottom: 75px;

  left: 0;
  border-bottom: 0;
  border-left: 0;
  position: absolute;
  background-color: ${ColorScheme.orange};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.5em;
`;
const SideBar = () => {
  const { cart, data, bought, setBought, setCart } = useAppContext();
  const { activeCategoryArray, setActiveCategoryArray } = useAppContext();
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

  return (
    <SideBarContainer>
      {uniqueCategories.map((category, index) => {
        return (
          <CategoryBar
            $active={activeCategoryArray[index]}
            key={index}
            onClick={() => handleCategoryClick(index)}
          >
            {category}
          </CategoryBar>
        );
      })}
      <PriceDisplayer>{totalPrice}$</PriceDisplayer>
      <BuyButton onClick={handleBuy}>
        <BuyText>Buy</BuyText>
      </BuyButton>
    </SideBarContainer>
  );
};

export default SideBar;
