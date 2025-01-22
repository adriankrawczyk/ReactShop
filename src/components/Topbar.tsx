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

const TopbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 90vw;
  height: 10vh;
  border-bottom: 1px solid #bbb;
`;

const InputContainer = styled.div`
  position: relative;
  width: 50vw;
  height: 10vh;
  margin-left: 10vw;
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  width: 100%;
  height: 100%;
  border-right: 1px solid #bbb;
  border-left: 1px solid #bbb;
  border-top: 0;
  border-bottom: 0;
  font-size: 2vmax;
  padding-left: 1vmax;
  outline: none;
`;
const InputIconContainer = styled.div`
  position: absolute;
  right: 1vmax;
  font-size: 2vmax;
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
  } = useAppContext();

  const navigate = useNavigate();
  const isCartEmpty = cart.length === 0 && !cartMode;
  const isHistoryEmpty = bought.length === 0;
  const [rating, setRating] = useState(0);
  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${currentOpinionItemTitle}/opinions`)
      .then((response) => response.json())
      .then((opinions) => setOpinionArray(opinions))
      .catch((error) => console.error("Error:", error));
  }, [inputValue, currentOpinionItemTitle, opinionArray]);

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
      const response = await fetch(
        `http://localhost:5000/api/items/${currentOpinionItemTitle}/opinion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: localStorage.getItem("logged_user"),
            content,
            rating,
          }),
        }
      );
      if (response.ok) {
        setInputValue("");
        setRating(0); // Reset rating after successful submission
      } else {
        console.error(
          "Failed to add opinion. Server responded with:",
          response.status
        );
      }
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
            : signOut
        }
      >
        <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>
      </LogoutButton>
      {opinionArray.find(
        (e) => e.author === localStorage.getItem("logged_user")
      ) ? (
        <></>
      ) : (
        <InputContainer>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyPress={handleKeyPress}
          />
          <InputIconContainer
            onClick={() => {
              if (currentOpinionItemTitle && inputValue && rating > 0) {
                addNewOpinion(inputValue);
              }
            }}
          >
            {currentOpinionItemTitle ? (
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
