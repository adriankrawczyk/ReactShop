import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faDollarSign,
  faSignOut,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  TopbarContainer,
  CartButton,
  HistoryButton,
  LogoutButton,
  RightButtonsContainer,
  InputContainer,
  SpinnerContainer,
  Spinner,
  Input,
  InputIconContainer,
  StarsContainer,
} from "./Topbar.styles";
import { useTopbarLogic } from "./useTopbarLogic";

const Topbar = () => {
  const {
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
  } = useTopbarLogic();

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
                {[...Array(5)].map((_, index) => (
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
