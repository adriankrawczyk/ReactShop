/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import ItemInterface from "../Interfaces/ItemInterface";
import styled from "styled-components";
import { useAppContext } from "../AppContext";
import DatabaseItemInterface from "../Interfaces/DatabaseItemInterface.ts";
import OpinionInterface from "../Interfaces/OpinionInterface.ts";
import Opinion from "./Opinion.tsx";

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
  const [displayData, setDisplayData] = useState<Array<ItemInterface>>([]);
  const [uniqueCategories, setUniqueCategories] = useState<Array<string>>([]);
  const [databaseItemData, setDatabaseItemData] = useState<
    Array<DatabaseItemInterface>
  >([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const scrollToDown = () => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    (async () => {
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setDisplayData(json);
        });
    })();
  }, []);

  const refreshData = async () => {
    const newDatabaseItemData = await refreshDatabaseItems();
    if (newDatabaseItemData) {
      setDatabaseItemData(newDatabaseItemData);
    }
  };

  useEffect(() => {
    refreshData();

    if (currentOpinionItemTitle.length > 0) {
      scrollToDown();
    }
  }, [inputValue, currentOpinionItemTitle]);

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
          return !cartMode || cart.some((c) => c.title === e.title);
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
  ]);

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
                  itemTitle={item.title}
                  onDelete={refreshData}
                />
              ))
            )
        : displayData.map((el, index) => {
            const { title, description, image, price, category, rating } = el;
            const matchedItem = databaseItemData.find(
              (item) => item.title === title
            );
            const baseQuantity = matchedItem?.quantity || 0;
            const opinions = matchedItem?.opinions || [];

            if (baseQuantity > 0) {
              return (
                <Item
                  key={`item-${index}`}
                  title={title}
                  description={description}
                  image={image}
                  price={price}
                  category={category}
                  rating={rating}
                  baseQuantity={baseQuantity}
                  opinions={opinions}
                />
              );
            }
          })}
    </ItemMapperWrapper>
  );
};

export const refreshDatabaseItems = async () => {
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
  return data;
};

export default ItemMapper;
