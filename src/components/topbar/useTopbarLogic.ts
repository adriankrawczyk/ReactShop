import { useEffect, useState } from "react";
import { useAppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";
import { useOpinionHandlers } from "./Topbar.utils";
import OpinionInterface from "../../Interfaces/OpinionInterface";

export const useTopbarLogic = () => {
  const {
    inputValue,
    setInputValue,
    cartMode,
    setCartMode,
    cart,
    bought,
    setBoughtMode,
    boughtMode,
    currentOpinionItemTitle,
    setCurrentOpinionItemTitle,
    opinionArray,
    isLoading,
    setOpinionArray,
    setIsLoading,
  } = useAppContext();

  const navigate = useNavigate();
  const isCartEmpty = cart.length === 0 && !cartMode;
  const isHistoryEmpty = bought.length === 0;
  const [hasUserSubmittedOpinion, setHasUserSubmittedOpinion] = useState(false);

  const { addNewOpinion, handleKeyPress, rating, setRating } =
    useOpinionHandlers();

  // Check if the user has submitted an opinion
  useEffect(() => {
    if (currentOpinionItemTitle) {
      const userHasSubmitted = opinionArray.some(
        (opinion) => opinion.author === localStorage.getItem("logged_user")
      );
      setHasUserSubmittedOpinion(userHasSubmitted);
    } else {
      setHasUserSubmittedOpinion(false);
      if (opinionArray.length) setOpinionArray([]);
    }
  }, [opinionArray, currentOpinionItemTitle, setOpinionArray]);

  // Fetch opinions when the current opinion item changes
  useEffect(() => {
    if (currentOpinionItemTitle) {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        setIsLoading(false);
        return;
      }

      fetch(
        `http://localhost:5000/api/items/${currentOpinionItemTitle}/opinion`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch opinions");
          }
          return response.json();
        })
        .then((data) => {
          setOpinionArray(data || []);
          const userHasSubmitted = data.some(
            (opinion: OpinionInterface) =>
              opinion.author === localStorage.getItem("logged_user")
          );
          setHasUserSubmittedOpinion(userHasSubmitted);
        })
        .catch((error) => {
          console.error("Error fetching opinions:", error);
        })
        .finally(() => {
          setTimeout(() => setIsLoading(false), 200);
        });
    }
  }, [currentOpinionItemTitle, setIsLoading, setOpinionArray]);

  // Handle user logout
  const signOut = () => {
    localStorage.setItem("logged_user", "");
    navigate("/");
    location.reload();
  };

  return {
    inputValue,
    setInputValue,
    cartMode,
    setCartMode,
    isCartEmpty,
    isHistoryEmpty,
    boughtMode,
    setBoughtMode,
    currentOpinionItemTitle,
    setCurrentOpinionItemTitle,
    isLoading,
    hasUserSubmittedOpinion,
    signOut,
    handleKeyPress,
    addNewOpinion,
    rating,
    setRating,
  };
};
