/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Item from "./Item";
import ItemInterface from "../Interfaces/ItemInterface";
import styled from "styled-components";
import { useAppContext } from "../AppContext";

const ItemMapperWrapper = styled.div`
  padding-top: 3.5vh;
  padding-bottom: 3.5vh;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const ItemMapper = () => {
  const {
    cart,
    inputValue,
    cartMode,
    data,
    setData,
    activeCategoryArray,
    bought,
    boughtMode,
  } = useAppContext();
  const [displayData, setDisplayData] = useState<Array<ItemInterface>>([]);
  const [uniqueCategories, setUniqueCategories] = useState<Array<string>>([]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setDisplayData(json);
        console.log(json);
      });
  }, []);

  useEffect(() => {
    const areAllCategoriesInactive = activeCategoryArray.every(
      (active) => !active
    );
    setUniqueCategories([...new Set(data.map(({ category }) => category))]);
    setDisplayData(
      data
        .filter((e) => {
          return (
            e.title.toLowerCase().includes(inputValue.toLowerCase()) ||
            inputValue.length === 0
          );
        })
        .filter((e) => {
          if (boughtMode) {
            return bought.includes(e.title);
          }
          return cart.includes(e.title) === cartMode;
        })
        .filter((e) => {
          return areAllCategoriesInactive
            ? true
            : activeCategoryArray[uniqueCategories.indexOf(e.category)];
        })
    );
  }, [inputValue, cart, cartMode, bought, boughtMode, activeCategoryArray]);

  return (
    <ItemMapperWrapper>
      {displayData.map((el) => {
        const { title, description, image, price, category, rating } = el;
        return (
          <Item
            title={title}
            description={description}
            image={image}
            price={price}
            category={category}
            rating={rating}
          ></Item>
        );
      })}
    </ItemMapperWrapper>
  );
};
export default ItemMapper;
