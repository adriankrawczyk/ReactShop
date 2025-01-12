import { useEffect, useState } from "react";
import Item from "./Item";
import ItemInterface from "../Interfaces/ItemInterface";
import styled from "styled-components";

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
  const [data, setData] = useState<Array<ItemInterface>>([]);
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        console.log(json);
      });
  }, []);
  return (
    <ItemMapperWrapper>
      {data.map((el) => {
        const { title, description, image } = el;
        return (
          <Item title={title} description={description} image={image}></Item>
        );
      })}
    </ItemMapperWrapper>
  );
};
export default ItemMapper;
