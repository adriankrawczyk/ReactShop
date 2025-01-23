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

const ErrorMessage = styled.div`
  color: #ff4444;
  margin: 20px;
  text-align: center;
  font-size: 1.1rem;
`;

const ItemMapper = () => {
  const {
    cart,
    setCart,
    bought,
    setBought,
    inputValue,
    cartMode,
    data,
    setData,
    activeCategoryArray,
    boughtMode,
    currentOpinionItemTitle,
  } = useAppContext();

  const [displayData, setDisplayData] = useState<Array<ItemInterface>>([]);
  const [uniqueCategories, setUniqueCategories] = useState<Array<string>>([]);
  const [databaseItemData, setDatabaseItemData] = useState<
    Array<DatabaseItemInterface>
  >([]);
  const [error, setError] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const username = localStorage.getItem("logged_user");
  const scrollToDown = () => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${username}/cart`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch cart data (${response.status})`);
      }

      const cartData = await response.json();
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Failed to load cart data. Please try refreshing the page.");
    }
  };
  useEffect(() => {
    const syncCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${username}/cart`,

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ cart }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          console.error("Failed to sync cart:", data.message);
        }
      } catch (error) {
        console.error("Error syncing cart with database:", error);
      }
    };
    const timeoutId = setTimeout(syncCart, 500);
    return () => clearTimeout(timeoutId);
  }, [username, cart]);

  const fetchPurchaseHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${username}/purchases`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch purchase history (${response.status})`
        );
      }

      const purchaseData = await response.json();
      setBought(purchaseData);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
      setError(
        "Failed to load purchase history. Please try refreshing the page."
      );
    }
  };

  const refreshData = async () => {
    const newDatabaseItemData = await refreshDatabaseItems();
    if (newDatabaseItemData) {
      setDatabaseItemData(newDatabaseItemData);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setError("");
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const json = await response.json();
        setData(json);
        setDisplayData(json);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load products. Please try refreshing the page.");
        return;
      }

      if (username) {
        await Promise.all([fetchCartData(), fetchPurchaseHistory()]);
      }
      await refreshData();
    };

    initializeData();
  }, []);

  useEffect(() => {
    refreshData();

    if (currentOpinionItemTitle.length > 0) {
      scrollToDown();
    }
  }, [inputValue, currentOpinionItemTitle]);

  // Filter and update display data
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
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
