import styled from "styled-components";
import ItemInterface from "../Interfaces/ItemInterface";
import { WithTransition } from "../Schemes/StyleScheme";
import { useAppContext } from "../AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";

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
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  font-size: 1.5vw;
  font-weight: 600;
  text-align: center;
`;

const TitleAndDescriptionContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
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
    $add ? "rgb(187, 255, 187)" : "rgb(255, 194, 181)"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  cursor: pointer;

  ${WithTransition()}
`;

const Item = ({ title, image, price }: ItemInterface) => {
  const { cart, setCart, cartMode } = useAppContext();

  return (
    <>
      <ItemElement>
        <ImageContainer>
          <ItemInfo>
            <Price>{price}$</Price>

            <AddButton
              $add={!cartMode}
              onClick={() => {
                if (!cartMode) setCart([...cart, title]);
                else setCart(cart.filter((item) => item !== title));
              }}
            >
              <FontAwesomeIcon icon={cartMode ? faX : faPlus} />
            </AddButton>
          </ItemInfo>
          <Image src={image}></Image>
        </ImageContainer>
        <TitleAndDescriptionContainer>
          <TitleContainer>{title}</TitleContainer>
        </TitleAndDescriptionContainer>
      </ItemElement>
    </>
  );
};

export default Item;
