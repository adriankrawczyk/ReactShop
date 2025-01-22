/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Item from "./Item";
import ItemInterface from "../Interfaces/ItemInterface";
import styled from "styled-components";
import { useAppContext } from "../AppContext";
import DatabaseItemInterface from "../Interfaces/DatabaseItemInterface";
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

const NoOpinionsMessage = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
  text-align: center;
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
            return bought.some((item) => item.title === e.title);
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

  const renderOpinions = () => {
    const currentItem = databaseItemData.find(
      (item) => item.title === currentOpinionItemTitle
    );

    if (!currentItem || !currentItem.opinions.length) {
      return (
        <NoOpinionsMessage>
          No opinions yet. Be the first to share your thoughts!
        </NoOpinionsMessage>
      );
    }

    return currentItem.opinions.map((opinion, index) => (
      <Opinion
        key={`opinion-${index}`}
        author={opinion.author}
        content={opinion.content}
        rating={opinion.rating}
        itemTitle={currentItem.title}
        onDelete={refreshData}
      />
    ));
  };

  return (
    <ItemMapperWrapper ref={wrapperRef}>
      {currentOpinionItemTitle.length > 0
        ? renderOpinions()
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
            return null;
          })}
    </ItemMapperWrapper>
  );
};

export const refreshDatabaseItems = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/items", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DatabaseItemInterface[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching database items:", error);
    return [];
  }
};

export default ItemMapper;
