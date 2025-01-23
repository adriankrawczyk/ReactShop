import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faDollarSign,
  faSignOut,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { ColorScheme } from "../Schemes/StyleScheme";
import { WithTransition } from "../Schemes/StyleScheme";
import { useNavigate } from "react-router-dom";

const TopbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 90vw;
  height: 10vh;
  border-bottom: 1px solid #bbb;
`;

const CartButton = styled.div<{ $active?: boolean; $empty?: boolean }>`
  cursor: pointer;
  width: 50px;
  height: 50px;
  border: 2px solid #bbb;
  position: absolute;
  right: 7vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $active }) =>
    $empty ? "white" : $active ? ColorScheme.green : ColorScheme.orange};
  ${WithTransition()}
`;

const HistoryButton = styled.div<{ $active?: boolean; $empty?: boolean }>`
  cursor: pointer;
  width: 50px;
  height: 50px;
  border: 2px solid #bbb;
  position: absolute;
  right: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $active }) =>
    $empty ? "white" : $active ? ColorScheme.green : ColorScheme.orange};
  ${WithTransition()}
`;

const LogoutButton = styled.div`
  cursor: pointer;
  width: 50px;
  height: 50px;
  border: 2px solid #bbb;
  position: absolute;
  left: 2vw;
  display: flex;
  align-items: center;
  font-size: 2vw;
  justify-content: center;
  background-color: ${ColorScheme.red};
  ${WithTransition()};
`;

const InputContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 10vh;
  margin-left: 10vw;
  display: flex;
  align-items: center;
`;

const SpinnerContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${ColorScheme.green};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Input = styled.input<{ isLoading?: boolean }>`
  width: 100%;
  height: 100%;
  border-right: 1px solid #bbb;
  border-left: 1px solid #bbb;
  border-top: 0;
  border-bottom: 0;
  font-size: 2vmax;
  padding-left: 1vmax;
  outline: none;
  display: ${({ isLoading }) => (isLoading ? "none" : "block")};
`;

const InputIconContainer = styled.div`
  position: absolute;
  right: 1vmax;
  font-size: 2vmax;
`;

const Topbar = () => {
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
    setOpinionArray,
    opinionArray,
    isLoading,
    setIsLoading,
  } = useAppContext();

  const navigate = useNavigate();
  const isCartEmpty = cart.length === 0 && !cartMode;
  const isHistoryEmpty = bought.length === 0;
  const [rating, setRating] = useState(0);
  const [hasUserSubmittedOpinion, setHasUserSubmittedOpinion] = useState(false);

  useEffect(() => {
    if (currentOpinionItemTitle) {
      const userHasSubmitted = opinionArray.some(
        (opinion) => opinion.author === localStorage.getItem("logged_user")
      );
      setHasUserSubmittedOpinion(userHasSubmitted);
      console.log(userHasSubmitted);
    } else {
      setHasUserSubmittedOpinion(false);
    }
  }, [opinionArray, currentOpinionItemTitle]);

  useEffect(() => {
    if (currentOpinionItemTitle) {
      fetch(
        `http://localhost:5000/api/items/${currentOpinionItemTitle}/opinions`
      )
        .then((response) => response.json())
        .then((opinions) => {
          setOpinionArray(opinions);
        })
        .catch((error) => console.error("Error fetching opinions:", error))
        .finally(() => {
          setTimeout(() => setIsLoading(false), 100);
        });
    }
  }, [currentOpinionItemTitle, setOpinionArray]);

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

  const signOut = () => {
    localStorage.setItem("logged_user", "");
    navigate("/");
    location.reload();
  };

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

      // Update opinionArray locally immediately
      setOpinionArray([...opinionArray, newOpinion]);

      // Update hasUserSubmittedOpinion to true
      setHasUserSubmittedOpinion(true);

      // Clear input and rating after successful submission
      setInputValue("");
      setRating(0);
    } catch (error) {
      console.error("Error adding opinion:", error);
    }
  };
  return (
    <TopbarContainer>
      Hello, {localStorage.getItem("logged_user")}
      <LogoutButton
        onClick={
          currentOpinionItemTitle.length
            ? () => setCurrentOpinionItemTitle("")
            : cartMode || boughtMode
            ? () => {
                setCartMode(false);
                setBoughtMode(false);
              }
            : signOut
        }
      >
        <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>
      </LogoutButton>
      {!hasUserSubmittedOpinion && !isLoading && currentOpinionItemTitle && (
        <InputContainer>
          {isLoading ? (
            <SpinnerContainer>
              <Spinner />
            </SpinnerContainer>
          ) : (
            <Input
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onKeyPress={handleKeyPress}
            />
          )}
          <InputIconContainer
            onClick={() => {
              if (currentOpinionItemTitle && inputValue && rating > 0) {
                addNewOpinion(inputValue);
              }
            }}
          >
            {isLoading ? (
              <></>
            ) : currentOpinionItemTitle ? (
              [...Array(5)].map((el, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  style={{
                    color: index < rating ? "gold" : "gray",
                    cursor: "pointer",
                    marginLeft: "5px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRating(index + 1);
                  }}
                />
              ))
            ) : (
              <FontAwesomeIcon icon={faSearch} />
            )}
          </InputIconContainer>
        </InputContainer>
      )}
      <CartButton
        $empty={isCartEmpty}
        $active={!isCartEmpty && !cartMode}
        onClick={() => {
          if (!isCartEmpty) {
            setCartMode(!cartMode);
            if (boughtMode) setBoughtMode(false);
          }
        }}
      >
        <FontAwesomeIcon style={{ fontSize: "2em" }} icon={faCartShopping} />
      </CartButton>
      <HistoryButton
        $empty={isHistoryEmpty}
        $active={!isHistoryEmpty && !boughtMode}
        onClick={() => {
          if (!isHistoryEmpty) {
            setBoughtMode(!boughtMode);
            if (cartMode) setCartMode(false);
          }
        }}
      >
        <FontAwesomeIcon style={{ fontSize: "2em" }} icon={faDollarSign} />
      </HistoryButton>
    </TopbarContainer>
  );
};

export default Topbar;
