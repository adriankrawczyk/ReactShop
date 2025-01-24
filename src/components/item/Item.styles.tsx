import styled from "styled-components";
import {
  ColorScheme,
  StyleScheme,
  WithTransition,
} from "../../Schemes/StyleScheme";

export const ItemElement = styled.div`
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

  @media (max-width: 480px) {
    flex-direction: column;
    height: auto;
    width: 100%;
    margin-bottom: 2vh;
    padding: 10px;
    align-items: center;
  }
`;

export const ImageContainer = styled.div`
  width: 200px;
  height: 100%;
  border-right: 2px solid ${StyleScheme.borderColor};
  display: flex;
  justify-content: flex-end;
  @media (max-width: 480px) {
    width: 70%;
    justify-content: center;
    margin-right: 2%;
  }
`;

export const Image = styled.img`
  width: 120px;
  border-left: 2px solid #bbb;
  @media (max-width: 480px) {
    width: 100%;
    height: auto;
    border: 2px solid ${StyleScheme.borderColor};
  }
`;

export const ItemInfo = styled.div`
  position: relative;
  width: 80px;
  display: flex;
  justify-content: center;

  @media (max-width: 480px) {
    width: 100%;
    position: static;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    margin-right: 5%;
  }
`;

export const Price = styled.div`
  font-weight: 600;
  position: absolute;
  top: 20px;
  font-size: 1.2em;

  @media (max-width: 480px) {
    position: static;
    font-size: 3vmax;
    text-align: center;
  }
`;

export const AddButton = styled.div<{ $add: boolean }>`
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

  @media (max-width: 480px) {
    position: static;
    width: 50px;
    height: 50px;
    margin-top: 10px;
  }
`;

export const TitleContainer = styled.div`
  width: 15vw;
  padding: 1vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25vmax;
  font-weight: 600;
  text-align: center;
  border-right: 2px solid #bbb;
  word-wrap: break-word;

  @media (max-width: 480px) {
    width: 120%;
    font-size: 1.5em;
    padding: 10px;
    border-right: none;
    border-bottom: 2px solid #bbb;
  }
`;

export const TitleAndDescriptionContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const Description = styled.div`
  font-size: 0.75em;
  padding: 0.25vmax;
  top: 0%;
  left: 6vmax;
  word-wrap: break-word;
  width: 45%;
  scrollbar-width: thin;
  padding-right: 0.5vmax;
  height: 100%;
  position: absolute;
  overflow-y: scroll;
  display: none;

  @media (min-width: 764px) {
    display: block;
  }

  @media (max-width: 480px) {
    position: static;
    width: 100%;
    height: auto;
    padding: 10px;
    overflow-y: visible;
    display: block;
    font-size: 1em;
  }
`;

export const OtherInfoContainer = styled.div`
  width: 35vw;
  height: 100%;
  position: relative;

  @media (max-width: 480px) {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const StarsContainer = styled.div`
  position: absolute;
  right: 0.5vmax;
  top: 0.5vmax;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2vmin;
  gap: 0.1vw;
  flex-direction: row;

  @media (max-width: 1080px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    justify-items: center;
    margin-top: 0.5vmin;
    margin-right: 0.5vmin;
  }

  @media (max-width: 480px) {
    position: static;
    margin-top: 10px;
    font-size: 1.5em;
    gap: 5px;
  }
`;

export const MessageButton = styled.div`
  width: 3vmax;
  height: 3vmax;
  background-color: white;
  border: 2px solid ${StyleScheme.borderColor};
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 0.75vmax;
  margin-right: 1vmax;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vmax;
  background-color: white;
  cursor: pointer;
  ${WithTransition()}

  @media (max-width: 480px) {
    position: relative;
    width: 50px;
    height: 50px;
    font-size: 2.5vmax;

    margin: 10px 0;
  }
`;

export const MessageQuantityDisplayer = styled.div`
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

  @media (max-width: 480px) {
    top: -10px;
    right: -10px;
    width: 25px;
    height: 25px;
    font-size: 0.8em;
  }
`;

export const QuantityDisplayer = styled.div`
  position: absolute;
  width: 5vmax;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.5vmax;
  border-right: 2px solid ${StyleScheme.borderColor};

  @media (max-width: 555px) {
    border-right: none;
  }

  @media (max-width: 480px) {
    position: static;
    width: 100%;
    height: auto;
    margin-top: 10px;
    flex-direction: row;
    gap: 10px;
  }
`;

export const QuantityText = styled.div`
  font-size: 1.1vmax;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.2em;
  }
`;

export const Quantity = styled.div`
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

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2em;
  }
`;
