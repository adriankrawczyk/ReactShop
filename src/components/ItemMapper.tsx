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
  const { cart, inputValue, cartMode, data, setData } = useAppContext();
  const [displayData, setDisplayData] = useState<Array<ItemInterface>>([]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setDisplayData(json);
      });
  }, []);

  useEffect(() => {
    setDisplayData(
      data
        .filter((e) => e.title.toLowerCase().includes(inputValue.toLowerCase()))
        .filter((e) => cart.includes(e.title) === cartMode)
    );
  }, [inputValue, cart, cartMode]);
  return (
    <ItemMapperWrapper>
      {displayData.map((el) => {
        const { title, description, image, price, category } = el;
        return (
          <Item
            title={title}
            description={description}
            image={image}
            price={price}
            category={category}
          ></Item>
        );
      })}
    </ItemMapperWrapper>
  );
};
export default ItemMapper;
