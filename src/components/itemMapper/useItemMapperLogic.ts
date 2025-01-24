import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../AppContext";
import ItemInterface from "../../Interfaces/ItemInterface";
import {
  refreshDatabaseItems,
  fetchCartData,
  fetchPurchaseHistory,
} from "./ItemMapper.utils";
import { DatabaseItemInterface } from "../../Interfaces/DatabaseItemIterface";

export const useItemMapperLogic = () => {
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
  const username = localStorage.getItem("logged_user") || "";

  const scrollToDown = () => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  };

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
        try {
          const [cartData, purchaseData] = await Promise.all([
            fetchCartData(username),
            fetchPurchaseHistory(username),
          ]);
          setCart(cartData);
          setBought(purchaseData);
        } catch (error) {
          if (error instanceof Error) setError(error.message);
        }
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

  useEffect(() => {
    const areAllCategoriesInactive = activeCategoryArray.every(
      (active) => !active
    );
    setUniqueCategories([
      ...new Set(
        data
          .map(({ category }) => category)
          .filter((category): category is string => !!category)
      ),
    ]);
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
            : activeCategoryArray[
                uniqueCategories.indexOf(e.category ? e.category : "")
              ];
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

  return {
    displayData,
    databaseItemData,
    error,
    wrapperRef,
    currentOpinionItemTitle,
    syncCart,
  };
};
