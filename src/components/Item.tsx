import styled from "styled-components";
import ItemInterface from "../Interfaces/ItemInterface";
import {
  ColorScheme,
  StyleScheme,
  WithTransition,
} from "../Schemes/StyleScheme";
import { useAppContext } from "../AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faX,
  faStar,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";

const ItemElement = styled.div`
  display: flex;
  width: 90%;
  margin-bottom: 3.5vh;
  height: 120px;
  background: linear-gradient(
    200deg,
    rgba(210, 232, 255, 1) 0%,
    rgba(225, 241, 255, 1) 100%
  );
  border: 2px solid #bbb;
  flex-shrink: 0;
`;

const ImageContainer = styled.div`
  width: 200px;
  height: 100%;
  border-right: 2px solid #bbb;
  display: flex;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  width: 15vw;
  padding: 1vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25vw;
  font-weight: 600;
  text-align: center;
  border-right: 2px solid #bbb;
`;

const TitleAndDescriptionContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  font-size: 0.7vmax;
  padding: 0.25vmax;
  top: 0%;
  left: 6vmax;
  width: 50%;
  height: 20vh;
  position: absolute;
  overflow: hidden;
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const Image = styled.img`
  width: 120px;
  border-left: 2px solid #bbb;
`;

const ItemInfo = styled.div`
  position: relative;
  width: 80px;
  display: flex;
  justify-content: center;
`;

const Price = styled.div`
  font-weight: 600;
  position: absolute;
  top: 20px;
  font-size: 1.2em;
`;

const AddButton = styled.div<{ $add: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 10px;
  border: 2px solid #bbb;
  background-color: ${({ $add }) =>
    $add ? ColorScheme.green : ColorScheme.red};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  cursor: pointer;

  ${WithTransition()}
`;

const OtherInfoContainer = styled.div`
  width: 35vw;
  height: 100%;
  position: relative;
`;

const StarsContainer = styled.div`
  position: absolute;
  right: 0;
  margin-top: 2vmin;
  margin-right: 2vmin;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5vw;
  gap: 0.1vw;
`;

const MessageButton = styled.div`
  width: 3.5vmax;
  height: 3.5vmax;
  background-color: white;
  border: 2px solid ${StyleScheme.borderColor};
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 1vmax;
  margin-right: 1vmax;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vmax;
  background-color: white;
  cursor: pointer;
  ${WithTransition()}
`;

const MessageQuantityDisplayer = styled.div`
  font-weight: 600;
  width: 2vmax;
  height: 2vmax;
  border: 2px solid ${StyleScheme.borderColor};
  background-color: white;
  position: absolute;
  font-size: 1.25vmax;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -1vmax;
  right: -1vmax;
  border-radius: 50%;
`;
const QuantityDisplayer = styled.div`
  position: absolute;
  width: 6vmax;
  height: 100%;
  border-right: 2px solid ${StyleScheme.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.5vmax;
`;
const QuantityText = styled.div`
  font-size: 1.25vmax;
  font-weight: 600;
`;
const Quantity = styled.div`
  cursor: default;
  font-weight: 600;
  width: 3vmax;
  height: 3vmax;
  background-color: white;
  border: 2px solid ${StyleScheme.borderColor};
  border-radius: 50%;
  font-size: 1.75vmax;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Item = ({
  title,
  image,
  price,
  rating,
  baseQuantity,
  opinions,
  description,
}: ItemInterface & { baseQuantity: number }) => {
  const {
    cart,
    setCart,
    cartMode,
    setCurrentOpinionItemTitle,
    setCartMode,
    bought,
    boughtMode,
    setIsLoading,
  } = useAppContext();

  const getQuantity = () => {
    if (boughtMode) {
      const boughtItem = bought.find((item) => item.title === title);
      return boughtItem?.quantity || 0;
    } else {
      const cartItem = cart.find((item) => item.title === title);
      return cartMode
        ? cartItem?.quantity || 0
        : baseQuantity - (cartItem?.quantity || 0);
    }
  };

  const handleAddToCart = () => {
    if (getQuantity() <= 0) return;
    if (!cartMode) {
      const existingItem = cart.find((item) => item.title === title);

      if (!existingItem) {
        setCart([...cart, { title, quantity: 1 }]);
      } else {
        const updatedCart = cart.map((item) =>
          item.title === title ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
      }
    } else {
      const updatedCart = cart.map((item) =>
        item.title === title ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCart(updatedCart);
      if (updatedCart.every((c) => c.quantity === 0)) {
        setCartMode(false);
      }
    }
  };

  if (getQuantity() === 0) return <></>;

  return (
    <ItemElement>
      <ImageContainer>
        <ItemInfo>
          <Price>{price}$</Price>
          {!boughtMode && (
            <AddButton $add={!cartMode} onClick={handleAddToCart}>
              <FontAwesomeIcon icon={cartMode ? faX : faPlus} />
            </AddButton>
          )}
        </ItemInfo>
        <Image src={image}></Image>
      </ImageContainer>
      <TitleAndDescriptionContainer>
        <TitleContainer>{title}</TitleContainer>
      </TitleAndDescriptionContainer>
      <OtherInfoContainer>
        <QuantityDisplayer>
          <QuantityText>Quantity</QuantityText>
          <Quantity>{getQuantity()}</Quantity>
        </QuantityDisplayer>
        <Description>{description}</Description>
        <StarsContainer>
          {[...Array(Math.round(rating ? rating.rate : 0))].map((_, index) => (
            <FontAwesomeIcon
              style={{ color: "gold" }}
              key={index}
              icon={faStar}
            />
          ))}
        </StarsContainer>
        <MessageButton
          onClick={() => {
            setIsLoading(true);
            setCurrentOpinionItemTitle(title);
          }}
        >
          <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
          <MessageQuantityDisplayer>
            {opinions ? opinions.length : 0}
          </MessageQuantityDisplayer>
        </MessageButton>
      </OtherInfoContainer>
    </ItemElement>
  );
};

export default Item;
