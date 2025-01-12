import styled from "styled-components";
import ItemInterface from "../Interfaces/ItemInterface";

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
`;

const TitleContainer = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  font-size: 4vh;
  font-weight: 600;
`;

const TitleAndDescriptionContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
`;
const Image = styled.img`
  height: 120px;
`;

const Item = ({ title, image }: ItemInterface) => {
  return (
    <>
      <ItemElement>
        <ImageContainer>
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
