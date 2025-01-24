import styled from "styled-components";
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
import OpinionInterface from "../Interfaces/OpinionInterface";

const TopbarContainer = styled.div`
  position: relative;
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
  width: 8vmin;
  height: 8vmin;
  border: 2px solid #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $active }) =>
    $empty ? "white" : $active ? ColorScheme.green : ColorScheme.orange};
  ${WithTransition()}
`;

const HistoryButton = styled.div<{ $active?: boolean; $empty?: boolean }>`
  cursor: pointer;
  width: 8vmin;
  height: 8vmin;
  border: 2px solid #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $empty, $active }) =>
    $empty ? "white" : $active ? ColorScheme.green : ColorScheme.orange};
  ${WithTransition()}
`;

const LogoutButton = styled.div`
  cursor: pointer;
  width: 8vmin;
  height: 8vmin;
  border: 2px solid #bbb;
  position: absolute;
  left: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${ColorScheme.red};
  ${WithTransition()};
`;
const RightButtonsContainer = styled.div`
  position: absolute;
  right: 1.5vw;
  display: flex;
  gap: 2vw;
  align-items: center;
  height: 100%;
`;
const InputContainer = styled.div`
  position: absolute;
  transform: translateX(5vw);
  width: 40vw;
  height: 10vh;
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
  width: 3vmax;
  height: 3vmax;
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
  border: 1px solid #bbb;
  font-size: 2vmax;
  padding-left: 1vmax;
  outline: none;
  display: ${({ isLoading }) => (isLoading ? "none" : "block")};
`;

const InputIconContainer = styled.div`
  position: absolute;
  right: 1vmax;
  font-size: 2vmax;
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: 480px) {
    font-size: 12px;
    align-items: flex-start;
    height: 28px;
    overflow: visible;
    width: auto;
  }
`;
const StarsContainer = styled.div`
  display: flex;
  gap: 2px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    width: 50px;
  }
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
    } else {
      setHasUserSubmittedOpinion(false);
      if (opinionArray.length) setOpinionArray([]);
    }
  }, [opinionArray, currentOpinionItemTitle, setOpinionArray]);

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
      setHasUserSubmittedOpinion(true);
      setInputValue("");
      setRating(0);
    } catch (error) {
      console.error("Error adding opinion:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  return (
    <TopbarContainer>
      <div style={{ position: "absolute", left: "13vw" }}>
        {`Hi, ${localStorage.getItem("logged_user")}`}
      </div>
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
        <FontAwesomeIcon
          style={{ fontSize: "4vmin" }}
          icon={faSignOut}
        ></FontAwesomeIcon>
      </LogoutButton>

      {(currentOpinionItemTitle.length === 0 ||
        (!hasUserSubmittedOpinion && currentOpinionItemTitle)) && (
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
              <StarsContainer>
                {[...Array(5)].map((el, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    style={{
                      color: index < rating ? "gold" : "gray",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRating(index + 1);
                    }}
                  />
                ))}
              </StarsContainer>
            ) : (
              <FontAwesomeIcon icon={faSearch} />
            )}
          </InputIconContainer>
        </InputContainer>
      )}
      <RightButtonsContainer>
        <CartButton
          $empty={isCartEmpty}
          $active={!isCartEmpty && !cartMode}
          onClick={() => {
            if (!isCartEmpty) {
              setCartMode(!cartMode);
              if (boughtMode) setBoughtMode(false);
              setCurrentOpinionItemTitle("");
            }
          }}
        >
          <FontAwesomeIcon
            style={{ fontSize: "4vmin" }}
            icon={faCartShopping}
          />
        </CartButton>
        <HistoryButton
          $empty={isHistoryEmpty}
          $active={!isHistoryEmpty && !boughtMode}
          onClick={() => {
            if (!isHistoryEmpty) {
              setBoughtMode(!boughtMode);
              if (cartMode) setCartMode(false);
              setCurrentOpinionItemTitle("");
            }
          }}
        >
          <FontAwesomeIcon style={{ fontSize: "4vmin" }} icon={faDollarSign} />
        </HistoryButton>
      </RightButtonsContainer>
    </TopbarContainer>
  );
};

export default Topbar;
