import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faX,
  faStar,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { useItemLogic } from "./useItemLogic";
import {
  ItemElement,
  ImageContainer,
  Image,
  ItemInfo,
  Price,
  AddButton,
  TitleContainer,
  TitleAndDescriptionContainer,
  Description,
  OtherInfoContainer,
  StarsContainer,
  MessageButton,
  MessageQuantityDisplayer,
  QuantityDisplayer,
  QuantityText,
  Quantity,
} from "./Item.styles";
import ItemInterface from "../../Interfaces/ItemInterface";

const Item = ({
  title,
  image,
  price,
  rating,
  baseQuantity,
  opinions,
  description,
  quantity, // Add this property
}: ItemInterface & { baseQuantity: number }) => {
  const {
    getQuantity,
    handleAddToCart,
    handleMessageClick,
    boughtMode,
    cartMode,
  } = useItemLogic({
    title,
    image,
    price,
    rating,
    baseQuantity,
    opinions,
    description,
    quantity, // Pass this property
  });

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
        <MessageButton onClick={handleMessageClick}>
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
