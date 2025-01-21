import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import ItemInterface from "../Interfaces/ItemInterface";
import styled from "styled-components";
import { useAppContext } from "../AppContext";
import DatabaseItemInterface from "../Interfaces/DatabaseItemIterface";
import OpinionInterface from "../Interfaces/OpinionInterface";
import Opinion from "./Opinion";

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
    currentOpinionItemTitle,
  } = useAppContext();

  const wrapperRef = useRef<HTMLDivElement>(null); // Proper typing for ref

  const [displayData, setDisplayData] = useState<Array<ItemInterface>>([]);
  const [uniqueCategories, setUniqueCategories] = useState<Array<string>>([]);
  const [databaseItemData, setDatabaseItemData] = useState<
    Array<DatabaseItemInterface>
  >([]);

  useEffect(() => {
    (async () => {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setDisplayData(json);
        });
      await getDatabaseItems();
    })();
  }, [inputValue]);

  const getDatabaseItems = async () => {
    const response = await fetch("http://localhost:5000/api/items", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: DatabaseItemInterface[] = await response.json();
    if (!response.ok) {
      console.log(data);
      return;
    }
    setDatabaseItemData(data);
  };

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
  }, [
    inputValue,
    cart,
    cartMode,
    bought,
    boughtMode,
    activeCategoryArray,
    data,
    uniqueCategories,
  ]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [displayData, databaseItemData]);

  return (
    <ItemMapperWrapper ref={wrapperRef}>
      {currentOpinionItemTitle.length > 0
        ? databaseItemData
            .filter((item) => item.title === currentOpinionItemTitle)
            .flatMap((item) =>
              item.opinions.map((opinion, index) => (
                <Opinion
                  key={`opinion-${index}`}
                  author={opinion.author}
                  content={opinion.content}
                />
              ))
            )
        : displayData.map((el, index) => {
            let quantity = 0;
            let opinions: Array<OpinionInterface> = [];

            const { title, description, image, price, category, rating } = el;
            const matchedItem = databaseItemData.find(
              (item) => item.title === title
            );
            if (matchedItem) {
              quantity = matchedItem.quantity;
              opinions = matchedItem.opinions;
            }
            if (quantity > 0)
              return (
                <Item
                  key={`item-${index}`}
                  title={title}
                  description={description}
                  image={image}
                  price={price}
                  category={category}
                  rating={rating}
                  quantity={quantity}
                  opinions={opinions}
                />
              );
          })}
    </ItemMapperWrapper>
  );
};

export default ItemMapper;
