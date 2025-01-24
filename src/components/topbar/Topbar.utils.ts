import { useState } from "react";
import { useAppContext } from "../../AppContext";
import OpinionInterface from "../../Interfaces/OpinionInterface";

export const useOpinionHandlers = () => {
  const {
    inputValue,
    setInputValue,
    setIsLoading,
    setOpinionArray,
    opinionArray,
    currentOpinionItemTitle,
  } = useAppContext();
  const [rating, setRating] = useState(0);

  const addNewOpinion = async (content: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const newOpinion = {
        author: localStorage.getItem("logged_user"),
        content,
        rating,
      };

      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/items/${encodeURIComponent(
          currentOpinionItemTitle
        )}/opinion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newOpinion),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add opinion");
      }
      setOpinionArray([...opinionArray, newOpinion as OpinionInterface]);
      setInputValue("");
      setRating(0);
    } catch (error) {
      console.error("Error adding opinion:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      currentOpinionItemTitle &&
      inputValue &&
      rating > 0
    ) {
      addNewOpinion(inputValue);
    }
  };

  return { addNewOpinion, handleKeyPress, rating, setRating };
};
